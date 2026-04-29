import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { midtransAuthHeader, midtransConfig } from "@/lib/midtrans";
import { hasActiveSubscription } from "@/lib/entitlement";
import { xenditAuthHeader, xenditConfig, xenditIdempotencyKey } from "@/lib/xendit";
import { formatDiscountLineIdr, isCouponEligibleForPlan, validateCouponCode } from "@/lib/promotions";

const schema = z.object({
  plan: z.enum(["single", "journey"]),
  next: z.string().min(1),
  coupon: z.string().optional(),
});

function safeNext(maybePath: string) {
  if (!maybePath.startsWith("/")) return "/results";
  return maybePath;
}

function planToDb(plan: "single" | "journey") {
  return plan === "single" ? "SINGLE" : "JOURNEY_30D";
}

function planPriceIdr(plan: "single" | "journey") {
  return plan === "single" ? 49000 : 99000;
}

function planDurationDays(plan: "single" | "journey") {
  return plan === "single" ? 7 : 30;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.userId as string | undefined;
  if (!session?.user?.email || !userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const next = safeNext(parsed.data.next);
  const plan = parsed.data.plan;
  const couponInput = (parsed.data.coupon ?? "").trim();

  const baseAmountIdr = planPriceIdr(plan);
  let amountIdr = baseAmountIdr;
  let couponMeta: any = null;
  if (couponInput) {
    const couponRes = await validateCouponCode(couponInput);
    if (couponRes.ok && isCouponEligibleForPlan(couponRes.coupon, plan)) {
      const { discountIdr, label } = formatDiscountLineIdr(couponRes.coupon, baseAmountIdr);
      amountIdr = Math.max(0, baseAmountIdr - discountIdr);
      couponMeta = { code: couponRes.normalizedCode, label, discountIdr, baseAmountIdr };
    }
  }

  const active = await hasActiveSubscription(userId);
  if (active) {
    return NextResponse.json({ ok: true, redirectUrl: next, alreadyEntitled: true });
  }

  const orderId = `SRN-PAY-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  await prisma.payment.create({
    data: {
      userId,
      provider: "MIDTRANS",
      orderId,
      amountIdr,
      status: "PENDING",
      rawPayload: { plan, next, coupon: couponMeta } as any,
    },
  });

  // Coupon made this order free (e.g. SERENFRIENDS 100% off). Activate without payment.
  if (amountIdr <= 0) {
    const startsAt = new Date();
    const expiresAt = new Date(Date.now() + planDurationDays(plan) * 24 * 60 * 60 * 1000);
    await prisma.subscription.create({
      data: {
        userId,
        plan: planToDb(plan) as any,
        status: "ACTIVE",
        startsAt,
        expiresAt,
        renewAt: expiresAt,
        provider: "MIDTRANS",
        providerRef: orderId,
      },
    });
    await prisma.payment.update({
      where: { orderId },
      data: { status: "SUCCEEDED", rawPayload: { plan, next, coupon: couponMeta, free: true } as any },
    });
    return NextResponse.json({ ok: true, redirectUrl: next, free: true });
  }

  // Provider switch: keep existing frontend flow but route to Xendit when configured.
  // NOTE: Payment.provider enum currently only has MIDTRANS; we track actual provider in rawPayload until schema migration.
  const paymentProvider = String(process.env.PAYMENT_PROVIDER || "MIDTRANS").toUpperCase();
  if (paymentProvider === "XENDIT") {
    const { secretKey } = xenditConfig();
    if (!secretKey) {
      return NextResponse.json({ ok: false, error: "Xendit is not configured." }, { status: 500 });
    }

    const origin = new URL(req.url).origin;
    const body = {
      external_id: orderId,
      amount: amountIdr,
      payer_email: session.user.email,
      description: `Seren plan (${plan})`,
      success_redirect_url: new URL(next, origin).toString(),
      failure_redirect_url: new URL("/paywall/checkout?failed=1", origin).toString(),
      currency: "IDR",
    };

    const res = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        Authorization: xenditAuthHeader(secretKey),
        "Content-Type": "application/json",
        "Idempotency-Key": xenditIdempotencyKey(orderId),
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: "FAILED", rawPayload: { provider: "XENDIT", error: json } as any },
      });
      return NextResponse.json({ ok: false, error: "Xendit request failed." }, { status: 502 });
    }

    await prisma.payment.update({
      where: { orderId },
      data: { rawPayload: { provider: "XENDIT", invoice: json, plan, next } as any },
    });

    // Xendit Invoice returns `invoice_url` for hosted checkout.
    return NextResponse.json({ ok: true, redirectUrl: json.invoice_url, orderId });
  }

  const { serverKey, baseUrl } = midtransConfig();
  if (!serverKey) {
    // Dev fallback: activate subscription immediately (still time-bound) when Midtrans keys are not configured.
    const startsAt = new Date();
    const expiresAt = new Date(Date.now() + planDurationDays(plan) * 24 * 60 * 60 * 1000);
    await prisma.subscription.create({
      data: {
        userId,
        plan: planToDb(plan) as any,
        status: "ACTIVE",
        startsAt,
        expiresAt,
        renewAt: expiresAt,
        provider: "MIDTRANS",
        providerRef: orderId,
      },
    });
    await prisma.payment.update({
      where: { orderId },
      data: { status: "SUCCEEDED", rawPayload: { plan, next, devFallback: true } as any },
    });
    return NextResponse.json({ ok: true, redirectUrl: next, devFallback: true });
  }

  // Midtrans Snap create transaction (redirect flow)
  const origin = new URL(req.url).origin;
  const payload = {
    transaction_details: { order_id: orderId, gross_amount: amountIdr },
    customer_details: { email: session.user.email },
    callbacks: { finish: new URL(next, origin).toString() },
  };

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: midtransAuthHeader(serverKey),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    await prisma.payment.update({
      where: { orderId },
      data: { status: "FAILED", rawPayload: json as any },
    });
    return NextResponse.json({ ok: false, error: "Midtrans request failed." }, { status: 502 });
  }

  await prisma.payment.update({
    where: { orderId },
    data: { rawPayload: json as any },
  });

  // Midtrans returns token + redirect_url
  return NextResponse.json({ ok: true, redirectUrl: json.redirect_url, orderId });
}


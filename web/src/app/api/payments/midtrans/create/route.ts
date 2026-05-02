import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { midtransAuthHeader, midtransConfig } from "@/lib/midtrans";
import { hasActiveSubscription } from "@/lib/entitlement";
import { xenditAuthHeader, xenditConfig, xenditIdempotencyKey } from "@/lib/xendit";
import { dokuConfig, dokuRequestTimestamp, dokuSignedHeaders } from "@/lib/doku";
import { formatDiscountLineIdr, isCouponEligibleForPlan, validateCouponCode } from "@/lib/promotions";

const schema = z.object({
  plan: z.enum(["single", "journey"]),
  next: z.string().min(1),
  coupon: z.string().optional(),
  provider: z.string().optional(),
});

function safeNext(maybePath: string) {
  if (!maybePath.startsWith("/")) return "/results";
  // Never send customers to API routes — Midtrans/DOKU "finish" is a browser GET.
  if (maybePath.startsWith("/api")) return "/results";
  return maybePath;
}

/** Browsers bookmark or prefetch payment init; only POST creates a transaction. */
export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/paywall", req.url));
}

function planToDb(plan: "single" | "journey") {
  return plan === "single" ? "SINGLE" : "JOURNEY_30D";
}

function planPriceIdr(plan: "single" | "journey") {
  return plan === "single" ? 49000 : 99000;
}

function amountOverrideIdr() {
  const raw = (process.env.PAYMENT_FORCE_AMOUNT_IDR || "").trim();
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
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

  const forcedAmountIdr = amountOverrideIdr();
  const baseAmountIdr = forcedAmountIdr ?? planPriceIdr(plan);
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
  const paymentProvider = (parsed.data.provider || process.env.PAYMENT_PROVIDER || "MIDTRANS").toUpperCase();

  if (paymentProvider === "DUITKU") {
    const { merchantCode, apiKey, baseUrl } = require("@/lib/duitku").duitkuConfig();
    const { generateDuitkuSignature } = require("@/lib/duitku");
    if (!merchantCode || !apiKey) {
      return NextResponse.json({ ok: false, error: "Duitku is not configured." }, { status: 500 });
    }

    const origin = new URL(req.url).origin;
    const signature = generateDuitkuSignature(orderId, amountIdr, apiKey, merchantCode);
    const body = {
      merchantCode,
      paymentAmount: amountIdr,
      merchantOrderId: orderId,
      productDetails: `Seren plan (${plan})`,
      email: session.user.email,
      phoneNumber: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
      paymentMethod: "VC",
      customerVaName: session.user.name || session.user.email.split("@")[0],
      callbackUrl: new URL("/api/payments/duitku/webhook", origin).toString(),
      returnUrl: new URL(next, origin).toString(),
      signature,
    };

    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.statusCode !== "00") {
      await prisma.payment.update({
        where: { orderId },
        data: { status: "FAILED", rawPayload: { provider: "DUITKU", error: json } as any },
      });
      const errMsg = json?.statusMessage || json?.Message || "Duitku request failed.";
      const errDetail = JSON.stringify(json);
      return NextResponse.json({ ok: false, error: `${errMsg} (${errDetail})` }, { status: 502 });
    }

    await prisma.payment.update({
      where: { orderId },
      data: { rawPayload: { provider: "DUITKU", invoice: json, plan, next } as any },
    });

    return NextResponse.json({ ok: true, redirectUrl: json.paymentUrl, orderId });
  }

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

  if (paymentProvider === "DOKU") {
    const { clientId, secretKey, baseUrl } = dokuConfig();
    if (!clientId || !secretKey) {
      return NextResponse.json({ ok: false, error: "DOKU is not configured." }, { status: 500 });
    }

    const requestTarget = "/checkout/v1/payment";
    const requestId =
      (globalThis.crypto as any)?.randomUUID?.() || `srn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const requestTimestamp = dokuRequestTimestamp();

    // Keep request as close as possible to DOKU docs "Basic Request".
    const body = {
      order: { amount: amountIdr, invoice_number: orderId },
      payment: { payment_due_date: 60 },
    };

    const bodyText = JSON.stringify(body);
    const url = `${baseUrl}${requestTarget}`;

    async function attempt(includeDigest: boolean) {
      return await fetch(url, {
        method: "POST",
        headers: dokuSignedHeaders({
          clientId,
          secretKey,
          requestId,
          requestTimestamp,
          requestTarget,
          bodyText,
          includeDigest,
        }),
        body: bodyText,
      });
    }

    // Checkout docs show headers without Digest; try without Digest first, then fallback.
    let res = await attempt(false);
    if (!res.ok) {
      const res2 = await attempt(true);
      if (res2.ok) res = res2;
    }

    const text = await res.text();
    const json = (() => {
      try {
        return JSON.parse(text || "{}");
      } catch {
        return { raw: text };
      }
    })();
    if (!res.ok) {
      console.error("[payments][doku] create failed", {
        status: res.status,
        requestId,
        orderId,
        body,
        response: json,
      });
      await prisma.payment.update({
        where: { orderId },
        data: { status: "FAILED", rawPayload: { provider: "DOKU", error: json } as any },
      });
      const detail = typeof json === "object" ? JSON.stringify(json).slice(0, 900) : String(json).slice(0, 900);
      const clientIdTag = clientId ? String(clientId).split("-")[0] : "missing";
      const envTag = (process.env.DOKU_ENV || "").toLowerCase() === "production" ? "production" : "sandbox";
      return NextResponse.json(
        { ok: false, error: `DOKU request failed (${res.status}). env=${envTag} clientIdTag=${clientIdTag}. ${detail}` },
        { status: 502 },
      );
    }

    await prisma.payment.update({
      where: { orderId },
      data: { rawPayload: { provider: "DOKU", checkout: json, plan, next } as any },
    });

    const redirectUrl =
      (json as any)?.payment?.url ||
      (json as any)?.response?.payment?.url ||
      (json as any)?.data?.payment?.url ||
      (json as any)?.payment_url ||
      (json as any)?.url;
    if (!redirectUrl) {
      console.error("[payments][doku] missing payment url", {
        requestId,
        orderId,
        response: json,
      });
      const detail = typeof json === "object" ? JSON.stringify(json).slice(0, 900) : String(json).slice(0, 900);
      return NextResponse.json({ ok: false, error: `DOKU response missing payment URL. ${detail}` }, { status: 502 });
    }

    return NextResponse.json({ ok: true, redirectUrl, orderId });
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
    const j = json as Record<string, unknown> & { error_messages?: unknown };
    console.error("[payments][midtrans] create failed", {
      httpStatus: res.status,
      orderId,
      body: json,
    });
    await prisma.payment.update({
      where: { orderId },
      data: { status: "FAILED", rawPayload: json as any },
    });
    const msgs = Array.isArray(j?.error_messages) ? (j.error_messages as unknown[]).filter(Boolean).join("; ") : "";
    const statusMsg = typeof j?.status_message === "string" ? j.status_message : "";
    const detail =
      msgs ||
      statusMsg ||
      (typeof json === "object" && json !== null ? JSON.stringify(json).slice(0, 900) : String(json ?? "").slice(0, 900));
    return NextResponse.json(
      {
        ok: false,
        error:
          detail && String(detail).trim()
            ? `Midtrans error (${res.status}): ${String(detail).trim()}`
            : `Midtrans request failed (${res.status}).`,
      },
      { status: 502 },
    );
  }

  await prisma.payment.update({
    where: { orderId },
    data: { rawPayload: json as any },
  });

  // Midtrans returns token + redirect_url
  return NextResponse.json({ ok: true, redirectUrl: json.redirect_url, orderId });
}


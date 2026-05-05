import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { hasActiveSubscription } from "@/lib/entitlement";
import { dokuConfig, dokuRequestTimestamp, dokuSignedHeaders } from "@/lib/doku";
import { formatDiscountLineIdr, isCouponEligibleForPlan, validateCouponCode } from "@/lib/promotions";

const schema = z.object({
  plan: z.enum(["single", "journey"]),
  next: z.string().min(1),
  coupon: z.string().optional(),
});

function safeNext(maybePath: string) {
  if (!maybePath.startsWith("/")) return "/results";
  // Never send customers to API routes — DOKU "finish" is a browser GET.
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
  return plan === "single" ? 49_000 : 99_000;
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

async function devFallbackActivate(userId: string, orderId: string, plan: "single" | "journey", next: string) {
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
      // Keep enum stable until provider migration (historically "MIDTRANS").
      provider: "MIDTRANS",
      providerRef: orderId,
    },
  });
  await prisma.payment.update({
    where: { orderId },
    data: { status: "SUCCEEDED", rawPayload: { plan, next, devFallback: true, provider: "DOKU" } as any },
  });
  return NextResponse.json({ ok: true, redirectUrl: next, devFallback: true });
}

function isLocalLikeRequest(req: Request) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  const urlHost = (() => {
    try {
      return new URL(req.url).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();
  const h = host || urlHost;
  if (!h) return false;
  // localhost, local LAN IPs, and `.local` mDNS are treated as "local" for safe fallback.
  return (
    h.includes("localhost") ||
    h.startsWith("127.") ||
    h.startsWith("192.168.") ||
    h.startsWith("10.") ||
    h.endsWith(".local") ||
    h.includes(":3000") ||
    h.includes(":3001")
  );
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
      // Keep enum stable until provider migration (historically "MIDTRANS").
      provider: "MIDTRANS",
      orderId,
      amountIdr,
      status: "PENDING",
      rawPayload: { plan, next, coupon: couponMeta, provider: "DOKU" } as any,
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
      data: { status: "SUCCEEDED", rawPayload: { plan, next, coupon: couponMeta, free: true, provider: "DOKU" } as any },
    });
    return NextResponse.json({ ok: true, redirectUrl: next, free: true });
  }

  const { clientId, secretKey, baseUrl } = dokuConfig();
  if (!clientId || !secretKey) {
    // Local dev / local "next start" can still proceed without PSP credentials.
    // We only disable fallback on real deployments (Vercel/prod hosts).
    const allowFallback = !process.env.VERCEL && isLocalLikeRequest(req);
    if (process.env.NODE_ENV !== "production" || allowFallback) {
      return await devFallbackActivate(userId, orderId, plan, next);
    }
    return NextResponse.json({ ok: false, error: "DOKU is not configured." }, { status: 500 });
  }

  const requestTarget = "/checkout/v1/payment";
  const requestId =
    (globalThis.crypto as any)?.randomUUID?.() || `srn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const requestTimestamp = dokuRequestTimestamp();

  // Keep request as close as possible to DOKU docs "Basic Request".
  const dokuBody = {
    order: { amount: amountIdr, invoice_number: orderId },
    payment: { payment_due_date: 60 },
  };

  const bodyText = JSON.stringify(dokuBody);
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
      body: dokuBody,
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


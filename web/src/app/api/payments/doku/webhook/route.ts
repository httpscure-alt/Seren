import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dokuConfig, verifyDokuWebhookSignature } from "@/lib/doku";

function planFromPaymentRaw(raw: any): "SINGLE" | "JOURNEY_30D" {
  return raw?.plan === "single" ? "SINGLE" : "JOURNEY_30D";
}

function planDurationDays(plan: "SINGLE" | "JOURNEY_30D") {
  return plan === "SINGLE" ? 7 : 30;
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const { clientId, secretKey } = dokuConfig();
  if (!clientId || !secretKey) {
    return NextResponse.json({ ok: false, error: "DOKU is not configured." }, { status: 500 });
  }

  const bodyText = await req.text();
  const requestTarget = new URL(req.url).pathname;

  const sig = verifyDokuWebhookSignature({
    clientId,
    secretKey,
    requestTarget,
    headers: req.headers,
    bodyText,
  });
  if (!sig.ok) {
    return NextResponse.json({ ok: false, error: sig.error }, { status: 401 });
  }

  const payload = JSON.parse(bodyText || "{}");
  const invoiceNumber = String(payload?.order?.invoice_number || payload?.order?.invoiceNumber || "");
  const txnStatus = String(payload?.transaction?.status || "");

  if (!invoiceNumber) return NextResponse.json({ ok: true });

  const payment = await prisma.payment.findUnique({
    where: { orderId: invoiceNumber },
    select: { userId: true, rawPayload: true, status: true },
  });
  if (!payment) return NextResponse.json({ ok: true });

  // Always persist latest payload for debugging/auditing.
  if (txnStatus !== "SUCCESS") {
    await prisma.payment.update({
      where: { orderId: invoiceNumber },
      data: { rawPayload: payload as any },
    });
    // Checkout UX allows customers to retry/choose another method; ignore FAILED for checkout.
    return NextResponse.json({ ok: true });
  }

  if (payment.status === "SUCCEEDED") {
    await prisma.payment.update({
      where: { orderId: invoiceNumber },
      data: { rawPayload: payload as any },
    });
    return NextResponse.json({ ok: true });
  }

  const plan = planFromPaymentRaw(payment.rawPayload as any);
  const startsAt = new Date();
  const expiresAt = new Date(Date.now() + planDurationDays(plan) * 24 * 60 * 60 * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { orderId: invoiceNumber },
      data: { status: "SUCCEEDED", rawPayload: payload as any },
    });
    await tx.subscription.create({
      data: {
        userId: payment.userId,
        plan: plan as any,
        status: "ACTIVE",
        startsAt,
        expiresAt,
        renewAt: expiresAt,
        provider: "MIDTRANS", // keep enum stable until provider migration
        providerRef: invoiceNumber,
      },
    });
  });

  return NextResponse.json({ ok: true });
}


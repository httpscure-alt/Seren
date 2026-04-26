import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { midtransConfig } from "@/lib/midtrans";

// Midtrans webhook signature key: sha512(order_id+status_code+gross_amount+serverKey)
function verifySignature(payload: any, serverKey: string) {
  const orderId = String(payload?.order_id ?? "");
  const statusCode = String(payload?.status_code ?? "");
  const grossAmount = String(payload?.gross_amount ?? "");
  const signature = String(payload?.signature_key ?? "");
  const raw = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const expected = crypto.createHash("sha512").update(raw).digest("hex");
  return signature && expected === signature;
}

function planFromPaymentRaw(raw: any): "SINGLE" | "JOURNEY_30D" {
  return raw?.plan === "single" ? "SINGLE" : "JOURNEY_30D";
}

function planDurationDays(plan: "SINGLE" | "JOURNEY_30D") {
  return plan === "SINGLE" ? 7 : 30;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const { serverKey } = midtransConfig();
  if (!serverKey) {
    // In dev fallback mode, we still store payload for inspection.
    const orderId = String(body?.order_id ?? "");
    if (orderId) {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { rawPayload: body as any },
      });
    }
    return NextResponse.json({ ok: true, devFallback: true });
  }

  if (!verifySignature(body, serverKey)) {
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }

  const orderId = String(body.order_id ?? "");
  const transactionStatus = String(body.transaction_status ?? "");

  const payment = await prisma.payment.findUnique({
    where: { orderId },
    select: { id: true, userId: true, rawPayload: true, amountIdr: true },
  });
  if (!payment) return NextResponse.json({ ok: true });

  if (transactionStatus === "settlement" || transactionStatus === "capture") {
    const plan = planFromPaymentRaw(payment.rawPayload as any);
    const startsAt = new Date();
    const expiresAt = new Date(Date.now() + planDurationDays(plan) * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: { status: "SUCCEEDED", rawPayload: body as any },
      });
      await tx.subscription.create({
        data: {
          userId: payment.userId,
          plan: plan as any,
          status: "ACTIVE",
          startsAt,
          expiresAt,
          renewAt: expiresAt,
          provider: "MIDTRANS",
          providerRef: orderId,
        },
      });
    });
  } else if (["deny", "cancel", "expire", "failure"].includes(transactionStatus)) {
    await prisma.payment.update({
      where: { orderId },
      data: { status: "FAILED", rawPayload: body as any },
    });
  } else {
    await prisma.payment.update({
      where: { orderId },
      data: { rawPayload: body as any },
    });
  }

  return NextResponse.json({ ok: true });
}


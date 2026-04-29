import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { xenditConfig } from "@/lib/xendit";

function planFromPaymentRaw(raw: any): "SINGLE" | "JOURNEY_30D" {
  return raw?.plan === "single" ? "SINGLE" : "JOURNEY_30D";
}

function planDurationDays(plan: "SINGLE" | "JOURNEY_30D") {
  return plan === "SINGLE" ? 7 : 30;
}

export async function POST(req: Request) {
  const { webhookToken } = xenditConfig();
  const token = req.headers.get("x-callback-token") || "";
  if (!webhookToken || token !== webhookToken) {
    return NextResponse.json({ ok: false, error: "Invalid webhook token." }, { status: 401 });
  }

  const bodyText = await req.text();
  const payload = JSON.parse(bodyText || "{}");

  const externalId = String(payload?.external_id || "");
  const status = String(payload?.status || "");

  if (!externalId) return NextResponse.json({ ok: true });

  const payment = await prisma.payment.findUnique({
    where: { orderId: externalId },
    select: { userId: true, rawPayload: true },
  });
  if (!payment) return NextResponse.json({ ok: true });

  if (status === "PAID" || status === "SETTLED") {
    const plan = planFromPaymentRaw(payment.rawPayload as any);
    const startsAt = new Date();
    const expiresAt = new Date(Date.now() + planDurationDays(plan) * 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId: externalId },
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
          provider: "MIDTRANS", // keep existing enum until we migrate provider types
          providerRef: externalId,
        },
      });
    });
  } else if (["EXPIRED", "VOIDED", "FAILED"].includes(status)) {
    await prisma.payment.update({
      where: { orderId: externalId },
      data: { status: "FAILED", rawPayload: payload as any },
    });
  } else {
    await prisma.payment.update({
      where: { orderId: externalId },
      data: { rawPayload: payload as any },
    });
  }

  return NextResponse.json({ ok: true });
}


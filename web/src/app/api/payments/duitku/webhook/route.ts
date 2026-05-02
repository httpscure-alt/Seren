import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { duitkuConfig, verifyDuitkuWebhookSignature } from "@/lib/duitku";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    
    // Duitku typically sends form-urlencoded data for webhooks, but sometimes JSON depending on config.
    // Let's try parsing JSON if it looks like JSON, otherwise form-urlencoded.
    let body: any = {};
    if (text.startsWith("{")) {
      body = JSON.parse(text);
    } else {
      for (const [k, v] of params.entries()) {
        body[k] = v;
      }
    }

    const {
      merchantCode,
      amount,
      merchantOrderId,
      signature,
      reference,
      resultCode,
    } = body;

    const config = duitkuConfig();

    if (!merchantCode || merchantCode !== config.merchantCode) {
      return NextResponse.json({ ok: false, error: "Invalid merchant" }, { status: 400 });
    }

    if (!verifyDuitkuWebhookSignature(merchantOrderId, amount, signature, config.apiKey, config.merchantCode)) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
    }

    if (resultCode === "00") {
      const payment = await prisma.payment.findUnique({ where: { orderId: merchantOrderId } });
      if (!payment) {
        return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
      }

      if (payment.status !== "SUCCEEDED") {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { orderId: merchantOrderId },
            data: { status: "SUCCEEDED" },
          });

          const raw = payment.rawPayload as any;
          const plan = raw?.plan ?? "single";

          const planToDb = plan === "single" ? "SINGLE" : "JOURNEY_30D";
          const planDurationDays = plan === "single" ? 7 : 30;
          const startsAt = new Date();
          const expiresAt = new Date(Date.now() + planDurationDays * 24 * 60 * 60 * 1000);

          await tx.subscription.create({
            data: {
              userId: payment.userId,
              plan: planToDb,
              status: "ACTIVE",
              startsAt,
              expiresAt,
              renewAt: expiresAt,
              provider: "MIDTRANS", // Still reusing MIDTRANS enum to avoid schema changes
              providerRef: reference || merchantOrderId,
            },
          });
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Duitku webhook error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

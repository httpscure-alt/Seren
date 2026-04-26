import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function cronAuthorized(req: Request, secret: string): boolean {
  if (!secret) return true;
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  if (token === secret) return true;
  const auth = req.headers.get("authorization") ?? "";
  if (auth === `Bearer ${secret}`) return true;
  return false;
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET || "";
  if (secret && !cronAuthorized(req, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const now = new Date();
  const soon = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const expiring = await prisma.subscription.findMany({
    where: { status: "ACTIVE", expiresAt: { gt: now, lte: soon } },
    select: { id: true, userId: true, expiresAt: true, plan: true },
    take: 200,
  });

  // MVP: we only log reminders (email/SMS integration later).
  // A future step: store reminder_sent_at to avoid repeats.
  console.log(
    JSON.stringify({
      event: "subscription.reminder.scan",
      count: expiring.length,
      at: now.toISOString(),
    }),
  );

  return NextResponse.json({ ok: true, count: expiring.length });
}


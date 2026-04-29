import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret") || "";
  const expected = process.env.CRON_SECRET || "";
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Provide a valid email." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ ok: true, revoked: 0 }, { status: 200 });

  const now = new Date();
  const res = await prisma.subscription.updateMany({
    where: { userId: user.id, status: "ACTIVE" },
    data: { status: "CANCELED", expiresAt: now, renewAt: now },
  });

  return NextResponse.json({ ok: true, revoked: res.count }, { status: 200 });
}


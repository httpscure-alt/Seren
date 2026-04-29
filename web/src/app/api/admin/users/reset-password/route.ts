import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8).max(128),
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
    return NextResponse.json(
      { ok: false, error: "Provide a valid email and a password (min 8 chars)." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ ok: true }, { status: 200 });

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({ ok: true }, { status: 200 });
}


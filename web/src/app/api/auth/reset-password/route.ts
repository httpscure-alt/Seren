import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendPasswordChangedEmail } from "@/lib/email/transactionalSend";

const bodySchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Use a valid token and a password of at least 8 characters." },
      { status: 400 },
    );
  }

  const { token, password } = parsed.data;

  try {
    const row = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    if (!row || row.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: "This reset link is invalid or has expired. Request a new one." },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
    ]);

    void sendPasswordChangedEmail({
      to: row.user.email,
      name: row.user.name,
    }).catch((e) => console.error("[email] password-changed", e));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[auth] reset-password:", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 503 });
  }
}

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email/transactionalSend";
import { rateLimit } from "@/lib/rateLimit";

const bodySchema = z.object({
  email: z.string().email(),
});

function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rlIp = rateLimit({ key: `forgot:ip:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rlIp.ok) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();

  const rlEmail = rateLimit({ key: `forgot:email:${email}`, limit: 4, windowMs: 60 * 60 * 1000 });
  if (!rlEmail.ok) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (user?.password) {
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      await prisma.passwordResetToken.create({
        data: { userId: user.id, token, expiresAt },
      });

      void sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetToken: token,
      }).catch((e) => console.error("[email] forgot-password", e));
    }
  } catch (e) {
    console.error("[auth] forgot-password:", e);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

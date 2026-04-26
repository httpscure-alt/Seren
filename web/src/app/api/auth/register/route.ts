import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Role } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendSignupWelcomeEmail } from "@/lib/email/transactionalSend";
import { normalizeCouponCode } from "@/lib/promotions";

const fieldsSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long."),
  name: z.string().min(1).max(120).optional(),
  inviteCode: z.string().min(1).max(64).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const email =
    typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const password = typeof raw.password === "string" ? raw.password : "";
  const nameIn = typeof raw.name === "string" ? raw.name.trim() : undefined;
  const name = nameIn && nameIn.length > 0 ? nameIn : undefined;
  const inviteCodeIn =
    typeof raw.inviteCode === "string" ? raw.inviteCode.trim() : undefined;
  const inviteCode =
    inviteCodeIn && inviteCodeIn.length > 0 ? inviteCodeIn : undefined;

  const parsed = fieldsSchema.safeParse({ email, password, name, inviteCode });
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      first.email?.[0] ||
      first.password?.[0] ||
      first.name?.[0] ||
      first.inviteCode?.[0] ||
      "Check your email and password (8+ characters) and try again.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const emailNorm = parsed.data.email;

  try {
    const existing = await prisma.user.findUnique({ where: { email: emailNorm } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Email already in use." }, { status: 409 });
    }

    // Validate invite code first (so we don't create a "dangling" account on bad codes).
    const inviteNormalized = parsed.data.inviteCode
      ? normalizeCouponCode(parsed.data.inviteCode)
      : null;
    const inviteCoupon = inviteNormalized
      ? await prisma.coupon.findUnique({
          where: { code: inviteNormalized },
          select: {
            id: true,
            code: true,
            expiresAt: true,
            maxRedemptions: true,
            _count: { select: { redemptions: true } },
          },
        })
      : null;

    if (inviteNormalized) {
      if (!inviteCoupon) {
        return NextResponse.json({ ok: false, error: "Invite code not recognized." }, { status: 400 });
      }
      if (inviteCoupon.expiresAt && Date.now() > inviteCoupon.expiresAt.getTime()) {
        return NextResponse.json({ ok: false, error: "Invite code expired." }, { status: 400 });
      }
      if (
        inviteCoupon.maxRedemptions != null &&
        inviteCoupon._count.redemptions >= inviteCoupon.maxRedemptions
      ) {
        return NextResponse.json({ ok: false, error: "Invite code maxed out." }, { status: 400 });
      }
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);
    // Public signup is always USER (customer). PHYSICIAN / ADMIN are created via scripts/create-staff-user.ts.
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: emailNorm,
          name: parsed.data.name,
          password: hashed,
          role: Role.USER,
        },
        select: { id: true, email: true, name: true, role: true },
      });

      if (inviteCoupon) {
        const startsAt = new Date();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await tx.subscription.create({
          data: {
            userId: created.id,
            plan: "JOURNEY_30D",
            status: "ACTIVE",
            startsAt,
            expiresAt,
            renewAt: expiresAt,
            provider: "MIDTRANS",
            providerRef: `INVITE-${inviteCoupon.code}-${Date.now()}`,
          },
        });
        await tx.couponRedemption.create({
          data: { couponId: inviteCoupon.id, userId: created.id },
        });
      }

      return created;
    });

    const verifyToken = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    try {
      await prisma.verificationToken.deleteMany({ where: { identifier: emailNorm } });
      await prisma.verificationToken.create({
        data: { identifier: emailNorm, token: verifyToken, expires },
      });
      void sendSignupWelcomeEmail({
        to: user.email,
        name: user.name,
        verifyToken,
      }).catch((e) => console.error("[email] signup welcome", e));
    } catch (e) {
      console.error("[auth] verification token / welcome email:", e);
    }

    return NextResponse.json({ ok: true, user });
  } catch (e) {
    console.error("[auth] register:", e);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not reach the database. Start Postgres (see web/docker-compose.yml and DATABASE_URL), then try again.",
      },
      { status: 503 },
    );
  }
}

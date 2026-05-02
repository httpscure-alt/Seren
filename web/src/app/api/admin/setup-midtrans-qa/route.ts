import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

function bearerCronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

async function staffAuthorized(): Promise<boolean> {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = (session as { role?: string })?.role;
  return !!session?.user?.email && (role === "ADMIN" || role === "PHYSICIAN");
}

/**
 * Ensures one Midtrans / PSP QA account exists: verified email login, USER role,
 * no active subscriptions, no pending legacy payments → paywall Snap flow always reachable.
 *
 * Protect with Bearer CRON_SECRET or an ADMIN session (repeatable for resetting after QA tests).
 */
export async function POST(req: Request) {
  const authedBearer = bearerCronAuthorized(req);
  let authedStaff = false;
  if (!authedBearer) {
    authedStaff = await staffAuthorized();
  }
  if (!authedBearer && !authedStaff) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const origin = new URL(req.url).origin;
  let bodyEmail = "";
  let bodyPassword = "";
  let bodyName = "";
  try {
    const j = await req.json().catch(() => null as Record<string, unknown> | null);
    if (j && typeof j === "object") {
      if (typeof j.email === "string") bodyEmail = j.email.trim().toLowerCase();
      if (typeof j.password === "string") bodyPassword = j.password;
      if (typeof j.name === "string") bodyName = j.name.trim();
    }
  } catch {
    /* ignore */
  }

  if ((bodyEmail || bodyPassword || bodyName) && !authedBearer) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "JSON overrides for email/password/name require Authorization: Bearer CRON_SECRET (not staff session alone).",
      },
      { status: 403 },
    );
  }

  const email = (
    bodyEmail ||
    process.env.MIDTRANS_QA_EMAIL?.trim().toLowerCase() ||
    ""
  ).trim();
  const password = bodyPassword || process.env.MIDTRANS_QA_PASSWORD || "";
  const name =
    bodyName ||
    process.env.MIDTRANS_QA_NAME?.trim() ||
    "Midtrans PSP Review";

  if (!email.includes("@")) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Provide MIDTRANS_QA_EMAIL or JSON { email }. Optional password via MIDTRANS_QA_PASSWORD or { password }; required to create/update credentials.",
      },
      { status: 400 },
    );
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      {
        ok: false,
        error: "Password must be at least 8 characters (env MIDTRANS_QA_PASSWORD or JSON body).",
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      password: hashed,
      role: Role.USER,
      emailVerified: now,
    },
    update: {
      name,
      password: hashed,
      role: Role.USER,
      emailVerified: now,
    },
    select: { id: true, email: true, name: true, role: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.subscription.deleteMany({ where: { userId: user.id } });
    await tx.payment.deleteMany({ where: { userId: user.id } });
  });

  const checkout = `/paywall/checkout?plan=journey&next=${encodeURIComponent("/results")}&provider=MIDTRANS`;
  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    login: {
      url: `${origin}/auth`,
      email: user.email,
      note: "Use Email + password sign-in.",
    },
    midtransTestLinks: {
      paywall: `${origin}/paywall?provider=MIDTRANS`,
      checkout: `${origin}${checkout}`,
      recommendedFlow: `${origin}/paywall?provider=MIDTRANS`,
    },
    resetNotice:
      "Subscriptions and prior payments cleared for this user so checkout always reaches Midtrans Snap. Run this POST again anytime to reset QA state.",
  });
}

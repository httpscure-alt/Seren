import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";

const schema = z.object({
  email: z.string().email(),
  plan: z.enum(["SINGLE", "JOURNEY_30D"]),
});

function durationDays(plan: "SINGLE" | "JOURNEY_30D") {
  return plan === "SINGLE" ? 7 : 30;
}

export async function POST(req: Request) {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, name: true } });
  if (!user) return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });

  const startsAt = new Date();
  const expiresAt = new Date(Date.now() + durationDays(parsed.data.plan) * 24 * 60 * 60 * 1000);

  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: parsed.data.plan as any,
      status: "ACTIVE",
      startsAt,
      expiresAt,
      renewAt: expiresAt,
      provider: "MIDTRANS",
      providerRef: `ADMIN-GRANT-${Date.now()}`,
    },
    select: {
      id: true,
      userId: true,
      plan: true,
      status: true,
      startsAt: true,
      expiresAt: true,
      provider: true,
      providerRef: true,
      user: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, subscription });
}


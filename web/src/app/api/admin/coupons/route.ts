import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/authz";
import { normalizeCouponCode } from "@/lib/promotions";

const createSchema = z.object({
  code: z.string().min(1),
  kind: z.enum(["PERCENT", "AMOUNT"]),
  percentOff: z.number().int().min(0).max(100).optional(),
  amountOffIdr: z.number().int().min(1).optional(),
  eligiblePlans: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional(),
  maxRedemptions: z.number().int().min(1).optional(),
});

export async function GET() {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { _count: { select: { redemptions: true } } },
  });
  return NextResponse.json({ ok: true, coupons });
}

export async function POST(req: Request) {
  const session = await requireRole(["ADMIN"]);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });

  const code = normalizeCouponCode(parsed.data.code);
  if (!code) return NextResponse.json({ ok: false, error: "Code required." }, { status: 400 });

  if (parsed.data.kind === "PERCENT" && parsed.data.percentOff == null) {
    return NextResponse.json({ ok: false, error: "percentOff required for PERCENT." }, { status: 400 });
  }
  if (parsed.data.kind === "AMOUNT" && parsed.data.amountOffIdr == null) {
    return NextResponse.json({ ok: false, error: "amountOffIdr required for AMOUNT." }, { status: 400 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      kind: parsed.data.kind,
      percentOff: parsed.data.kind === "PERCENT" ? parsed.data.percentOff : null,
      amountOffIdr: parsed.data.kind === "AMOUNT" ? parsed.data.amountOffIdr : null,
      eligiblePlans: parsed.data.eligiblePlans,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      maxRedemptions: parsed.data.maxRedemptions ?? null,
    },
    include: { _count: { select: { redemptions: true } } },
  });

  return NextResponse.json({ ok: true, coupon }, { status: 201 });
}


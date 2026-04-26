export type CouponPlan = "single" | "journey";

export type Coupon = {
  code: string; // stored uppercase
  label: string;
  percentOff?: number; // 0..100
  amountOffIdr?: number; // nominal discount
  eligiblePlans: CouponPlan[];
  expiresAt?: string; // ISO
};

export type CouponValidationResult =
  | {
      ok: true;
      coupon: Coupon;
      normalizedCode: string;
      message: string;
    }
  | {
      ok: false;
      normalizedCode: string;
      message: string;
    };

const COUPONS: Coupon[] = [
  {
    code: "SERENFRIENDS",
    label: "Friends & family (30 days)",
    percentOff: 100,
    eligiblePlans: ["journey"],
  },
  {
    code: "SEREN10",
    label: "10% off",
    percentOff: 10,
    eligiblePlans: ["single", "journey"],
  },
];

export function normalizeCouponCode(input: string | undefined | null) {
  return (input ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

function validateCouponCodeStatic(input: string | undefined | null): CouponValidationResult {
  const normalizedCode = normalizeCouponCode(input);
  if (!normalizedCode) {
    return { ok: false, normalizedCode, message: "Enter a code." };
  }

  const coupon = COUPONS.find((c) => c.code === normalizedCode);
  if (!coupon) {
    return { ok: false, normalizedCode, message: "Code not recognized." };
  }

  if (coupon.expiresAt) {
    const exp = Date.parse(coupon.expiresAt);
    if (Number.isFinite(exp) && Date.now() > exp) {
      return { ok: false, normalizedCode, message: "Code expired." };
    }
  }

  return {
    ok: true,
    coupon,
    normalizedCode,
    message: `${coupon.label} applied.`,
  };
}

export async function validateCouponCode(input: string | undefined | null): Promise<CouponValidationResult> {
  const normalizedCode = normalizeCouponCode(input);
  if (!normalizedCode) {
    return { ok: false, normalizedCode, message: "Enter a code." };
  }

  // DB-first for admin-managed coupons; fallback to static demo coupons.
  try {
    const { prisma } = await import("@/lib/db");
    const row = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
      select: {
        code: true,
        kind: true,
        percentOff: true,
        amountOffIdr: true,
        eligiblePlans: true,
        expiresAt: true,
        maxRedemptions: true,
        _count: { select: { redemptions: true } },
      },
    });

    if (row) {
      if (row.expiresAt && Date.now() > row.expiresAt.getTime()) {
        return { ok: false, normalizedCode, message: "Code expired." };
      }
      if (row.maxRedemptions != null && row._count.redemptions >= row.maxRedemptions) {
        return { ok: false, normalizedCode, message: "Code maxed out." };
      }
      return {
        ok: true,
        normalizedCode,
        message: "Code applied.",
        coupon: {
          code: row.code,
          label: row.code,
          percentOff: row.kind === "PERCENT" ? row.percentOff ?? undefined : undefined,
          amountOffIdr: row.kind === "AMOUNT" ? row.amountOffIdr ?? undefined : undefined,
          eligiblePlans: (row.eligiblePlans as any) ?? [],
          expiresAt: row.expiresAt?.toISOString(),
        },
      };
    }
  } catch {
    // ignore and fallback
  }

  return validateCouponCodeStatic(normalizedCode);
}

export function isCouponEligibleForPlan(coupon: Coupon, plan: CouponPlan) {
  return coupon.eligiblePlans.includes(plan);
}

export function formatDiscountLineIdr(coupon: Coupon, basePriceIdr: number) {
  if (coupon.percentOff != null) {
    const off = Math.round((basePriceIdr * coupon.percentOff) / 100);
    return { discountIdr: off, label: `${coupon.percentOff}% off` };
  }
  if (coupon.amountOffIdr != null) {
    return { discountIdr: Math.min(basePriceIdr, coupon.amountOffIdr), label: "Discount" };
  }
  return { discountIdr: 0, label: "Discount" };
}


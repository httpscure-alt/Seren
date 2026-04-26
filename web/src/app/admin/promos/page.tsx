import { prisma } from "@/lib/db";
import { AdminPromosClient } from "./promosClient";

export default async function AdminPromosPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      code: true,
      kind: true,
      percentOff: true,
      amountOffIdr: true,
      eligiblePlans: true,
      expiresAt: true,
      maxRedemptions: true,
      createdAt: true,
      _count: { select: { redemptions: true } },
    },
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Promos
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Coupons.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          Create coupons used by the paywall and validation endpoint.
        </p>
      </header>

      <AdminPromosClient initialCoupons={coupons as any} />
    </div>
  );
}


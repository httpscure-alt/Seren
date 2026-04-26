import { prisma } from "@/lib/db";
import { AdminSubscriptionsClient } from "./subsClient";

export default async function AdminSubscriptionsPage() {
  const subs = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
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

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      userId: true,
      provider: true,
      orderId: true,
      amountIdr: true,
      status: true,
      createdAt: true,
      user: { select: { email: true, name: true } },
    },
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Subscriptions
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Subscriptions & payments.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          View active/expired subscriptions and recent Midtrans orders. You can
          manually grant a subscription for support.
        </p>
      </header>

      <AdminSubscriptionsClient initialSubs={subs as any} initialPayments={payments as any} />
    </div>
  );
}


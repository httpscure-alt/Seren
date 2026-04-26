import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [userCount, caseCount, activeSubs, payments] = await Promise.all([
    prisma.user.count(),
    prisma.case.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", expiresAt: { gt: new Date() } } }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { orderId: true, amountIdr: true, status: true, createdAt: true },
    }),
  ]);

  const byStatus = await prisma.case.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin dashboard
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Operations overview.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          Live counts from your database (users, cases, subscriptions, and recent payments).
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Users", value: userCount },
          { label: "Cases", value: caseCount },
          { label: "Active subscriptions", value: activeSubs },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{k.label}</p>
            <p className="mt-4 text-4xl font-headline tracking-tighter">{k.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
          <p className="font-headline tracking-tight text-base">Cases by status</p>
          <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
            {byStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-on-surface">{s.status}</span>
                <span>{s._count._all}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
          <p className="font-headline tracking-tight text-base">Recent payments</p>
          <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
            {payments.length ? (
              payments.map((p) => (
                <div key={p.orderId} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-on-surface truncate">{p.orderId}</p>
                    <p className="text-xs text-on-surface/45">
                      {new Date(p.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-on-surface">Rp {p.amountIdr.toLocaleString("id-ID")}</p>
                    <p className="text-xs text-on-surface/45">{p.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No payments yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


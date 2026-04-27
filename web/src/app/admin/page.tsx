import Link from "next/link";
import { prisma } from "@/lib/db";

const quickLinks = [
  { href: "/admin/users", label: "Users & roles" },
  { href: "/admin/cases", label: "Cases & reports" },
  { href: "/admin/ai-jobs", label: "AI jobs" },
  { href: "/admin/messages", label: "Care threads" },
  { href: "/admin/subscriptions", label: "Subscriptions & payments" },
  { href: "/admin/promos", label: "Coupons" },
  { href: "/admin/audit", label: "Audit log" },
  { href: "/admin/analytics", label: "Analytics & KPIs" },
  { href: "/physician", label: "Physician portal (review queue)" },
] as const;

export default async function AdminDashboardPage() {
  const [
    userCount,
    caseCount,
    reportCount,
    activeSubs,
    threadCount,
    couponCount,
    redemptionCount,
    payments,
    byCaseStatus,
    aiByStatus,
    payAgg,
    journeyRows,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.case.count(),
    prisma.report.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", expiresAt: { gt: new Date() } } }),
    prisma.messageThread.count(),
    prisma.coupon.count(),
    prisma.couponRedemption.count(),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { orderId: true, amountIdr: true, status: true, createdAt: true },
    }),
    prisma.case.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.aiJob.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amountIdr: true },
      _count: { _all: true },
    }),
    prisma.journeyCheckIn.count(),
  ]);

  const aiFailed = aiByStatus.find((s) => s.status === "FAILED")?._count._all ?? 0;
  const aiQueued = aiByStatus.find((s) => s.status === "QUEUED")?._count._all ?? 0;

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
          Live counts across users, clinical cases, AI processing, messaging, billing, and promos.
        </p>
      </header>

      <section className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">All sections</p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-outline-variant/20 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Users", value: userCount },
          { label: "Cases", value: caseCount },
          { label: "Published reports", value: reportCount },
          { label: "Active subscriptions", value: activeSubs },
          { label: "Care threads", value: threadCount },
          { label: "Journey check-ins", value: journeyRows },
          { label: "Coupons", value: couponCount },
          { label: "Coupon redemptions", value: redemptionCount },
          { label: "Succeeded payments (count)", value: payAgg._count._all },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{k.label}</p>
            <p className="mt-4 text-4xl font-headline tracking-tighter">{k.value}</p>
          </div>
        ))}
        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7 md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
            Gross revenue (succeeded Midtrans, IDR)
          </p>
          <p className="mt-4 text-4xl font-headline tracking-tighter">
            Rp {(payAgg._sum.amountIdr ?? 0).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">AI jobs queued</p>
          <p className="mt-4 text-4xl font-headline tracking-tighter">{aiQueued}</p>
          <p className="mt-2 text-xs text-on-surface/45">
            Failed: {aiFailed} ·{" "}
            <Link href="/admin/ai-jobs" className="text-primary underline underline-offset-4">
              Open queue
            </Link>
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
          <p className="font-headline tracking-tight text-base">Cases by status</p>
          <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
            {byCaseStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-on-surface">{s.status}</span>
                <span>{s._count._all}</span>
              </div>
            ))}
            {!byCaseStatus.length ? <p className="text-on-surface/45">No cases yet.</p> : null}
          </div>
        </div>

        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
          <p className="font-headline tracking-tight text-base">AI jobs by status</p>
          <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
            {aiByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-on-surface">{s.status}</span>
                <span>{s._count._all}</span>
              </div>
            ))}
            {!aiByStatus.length ? <p className="text-on-surface/45">No AI jobs yet.</p> : null}
          </div>
        </div>

        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7 lg:col-span-2">
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
            <p className="pt-2 text-xs">
              <Link href="/admin/subscriptions" className="text-primary underline underline-offset-4">
                Full payment &amp; subscription list
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

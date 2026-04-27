import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminAnalyticsPage() {
  const [users, cases, reports, payments, subsActive] = await Promise.all([
    prisma.user.count(),
    prisma.case.count(),
    prisma.report.count(),
    prisma.payment.count({ where: { status: "SUCCEEDED" } }),
    prisma.subscription.count({ where: { status: "ACTIVE", expiresAt: { gt: new Date() } } }),
  ]);

  const recentAudit = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    select: { id: true, action: true, caseId: true, createdAt: true, actorId: true },
  });

  const env = {
    ga4: process.env.NEXT_PUBLIC_GA4_ID || "",
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
    posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  };

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Analytics
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Analytics overview.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          Internal KPIs from the database, plus quick links to GA4 and PostHog.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Users", value: users },
          { label: "Cases", value: cases },
          { label: "Reports", value: reports },
          { label: "Succeeded payments", value: payments },
          { label: "Active subscriptions", value: subsActive },
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
          <p className="font-headline tracking-tight text-base">External dashboards</p>
          <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
            <div className="flex items-center justify-between gap-4">
              <span className="text-on-surface">GA4 measurement ID</span>
              <span className="text-on-surface-variant">{env.ga4 || "Not set"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-on-surface">PostHog</span>
              <Link
                href={env.posthogHost}
                className="text-primary underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                Open dashboard
              </Link>
            </div>
            <p className="pt-3 text-xs text-on-surface/45">
              Tracking is consent-gated. Page views + key interactions are sent when users accept.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
          <p className="font-headline tracking-tight text-base">Recent audit logs</p>
          <p className="mt-2 text-xs text-on-surface/45">
            <Link href="/admin/audit" className="text-primary underline underline-offset-4">
              View full audit log (250 rows)
            </Link>
          </p>
          <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
            {recentAudit.length ? (
              recentAudit.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-on-surface truncate">{a.action}</p>
                    <p className="text-xs text-on-surface/45 truncate">{a.caseId ?? "—"}</p>
                  </div>
                  <p className="text-xs text-on-surface/45 shrink-0">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No audit logs yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


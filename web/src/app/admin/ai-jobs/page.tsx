import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminAiJobsPage() {
  const [byStatus, jobs] = await Promise.all([
    prisma.aiJob.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.aiJob.findMany({
      orderBy: { updatedAt: "desc" },
      take: 150,
      select: {
        id: true,
        status: true,
        attempts: true,
        error: true,
        createdAt: true,
        updatedAt: true,
        startedAt: true,
        finishedAt: true,
        case: { select: { id: true, publicId: true, status: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • AI jobs
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          AI worker queue.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          Drafting jobs processed by the AI worker. Failures usually mean model/API issues or bad
          input payloads—check error text and re-queue from your ops playbook if needed.
        </p>
      </header>

      <section className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
        <p className="font-headline tracking-tight text-base">Jobs by status</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {byStatus.map((s) => (
            <span
              key={s.status}
              className="rounded-full border border-outline-variant/20 px-4 py-2 text-on-surface-variant"
            >
              <span className="text-on-surface font-medium">{s.status}</span>
              <span className="text-on-surface/45"> · {s._count._all}</span>
            </span>
          ))}
          {!byStatus.length ? <p className="text-on-surface/45">No AI jobs yet.</p> : null}
        </div>
      </section>

      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-outline-variant/10">
          <p className="font-headline tracking-tight text-base">Recent jobs</p>
          <p className="text-xs text-on-surface/45 mt-1">Last 150 updates.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-5">Case</th>
                <th className="text-left py-3 px-5">Job status</th>
                <th className="text-left py-3 px-5">Case status</th>
                <th className="text-left py-3 px-5">Attempts</th>
                <th className="text-left py-3 px-5">Updated</th>
                <th className="text-left py-3 px-5">Error</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-outline-variant/10 align-top">
                  <td className="py-4 px-5">
                    <Link
                      href={`/admin/cases?q=${encodeURIComponent(j.case.publicId)}`}
                      className="text-primary underline underline-offset-4 font-medium text-on-surface"
                    >
                      {j.case.publicId}
                    </Link>
                  </td>
                  <td className="py-4 px-5 text-on-surface">{j.status}</td>
                  <td className="py-4 px-5">{j.case.status}</td>
                  <td className="py-4 px-5">{j.attempts}</td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    {new Date(j.updatedAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-5 max-w-[280px]">
                    {j.error ? (
                      <span className="text-error text-xs break-words">{j.error}</span>
                    ) : (
                      <span className="text-on-surface/35">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!jobs.length ? (
                <tr>
                  <td className="py-10 px-5 text-center text-on-surface/45" colSpan={6}>
                    No AI jobs yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

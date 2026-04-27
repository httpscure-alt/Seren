import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 250,
    select: {
      id: true,
      action: true,
      meta: true,
      createdAt: true,
      caseId: true,
      actorId: true,
      actor: { select: { email: true, name: true } },
      case: { select: { publicId: true } },
    },
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Audit log
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Clinical &amp; admin actions.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          Immutable-style log written from physician flows (publish, edits, etc.). Latest 250
          entries.
        </p>
      </header>

      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-5">Time</th>
                <th className="text-left py-3 px-5">Action</th>
                <th className="text-left py-3 px-5">Actor</th>
                <th className="text-left py-3 px-5">Case</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {logs.map((a) => (
                <tr key={a.id} className="border-b border-outline-variant/10 align-top">
                  <td className="py-4 px-5 whitespace-nowrap text-xs">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-on-surface font-medium">{a.action}</span>
                    {a.meta != null ? (
                      <pre className="mt-2 text-[10px] text-on-surface/45 whitespace-pre-wrap break-all max-w-md font-mono">
                        {(() => {
                          const s = JSON.stringify(a.meta);
                          return s.length > 220 ? `${s.slice(0, 220)}…` : s;
                        })()}
                      </pre>
                    ) : null}
                  </td>
                  <td className="py-4 px-5">
                    {a.actor ? (
                      <>
                        <div className="text-on-surface">{a.actor.name ?? a.actor.email}</div>
                        <div className="text-xs text-on-surface/45">{a.actor.email}</div>
                      </>
                    ) : (
                      <span className="text-on-surface/35">—</span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    {a.case?.publicId ? (
                      <Link
                        href={`/admin/cases?q=${encodeURIComponent(a.case.publicId)}`}
                        className="text-primary underline underline-offset-4"
                      >
                        {a.case.publicId}
                      </Link>
                    ) : (
                      <span className="text-on-surface/35">{a.caseId ?? "—"}</span>
                    )}
                  </td>
                </tr>
              ))}
              {!logs.length ? (
                <tr>
                  <td className="py-10 px-5 text-center text-on-surface/45" colSpan={4}>
                    No audit entries yet.
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

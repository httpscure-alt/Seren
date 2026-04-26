import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();

  const cases = await prisma.case.findMany({
    where: q
      ? {
          OR: [
            { publicId: { contains: q, mode: "insensitive" } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { user: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      publicId: true,
      status: true,
      createdAt: true,
      user: { select: { email: true, name: true } },
      report: { select: { id: true, publishedAt: true, updatedAt: true } },
    },
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Cases
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Cases & reports.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          Search by public ID, patient name, or email.
        </p>
      </header>

      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
        <form className="p-5 sm:p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search SRN-…, name, email…"
            className="w-full sm:w-[420px] rounded-xl bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="rounded-full border border-outline-variant/25 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors">
            Search
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-5">Case</th>
                <th className="text-left py-3 px-5">Patient</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Created</th>
                <th className="text-right py-3 px-5">Report</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-outline-variant/10">
                  <td className="py-4 px-5 text-on-surface font-medium">{c.publicId}</td>
                  <td className="py-4 px-5">
                    <div className="text-on-surface">{c.user.name ?? c.user.email}</div>
                    <div className="text-xs text-on-surface/45">{c.user.email}</div>
                  </td>
                  <td className="py-4 px-5 text-on-surface">{c.status}</td>
                  <td className="py-4 px-5">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-5 text-right">
                    {c.report?.id ? (
                      <Link
                        href={`/report/${c.report.id}`}
                        className="text-primary underline underline-offset-4"
                      >
                        Open
                      </Link>
                    ) : (
                      <span className="text-on-surface/35">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!cases.length ? (
                <tr>
                  <td className="py-10 px-5 text-center text-on-surface/45" colSpan={5}>
                    No cases found.
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


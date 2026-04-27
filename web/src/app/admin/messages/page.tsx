import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminMessagesPage() {
  const threads = await prisma.messageThread.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { email: true, name: true } },
      case: { select: { publicId: true, id: true } },
      _count: { select: { messages: true } },
    },
  });

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Admin • Care threads
        </p>
        <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.8rem]">
          Patient messaging.
        </h1>
        <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[70ch]">
          In-app threads between users and the clinic (read-only overview for support). Open the
          patient app inbox for full conversation UI.
        </p>
      </header>

      <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              <tr className="border-b border-outline-variant/10">
                <th className="text-left py-3 px-5">Patient</th>
                <th className="text-left py-3 px-5">Thread</th>
                <th className="text-left py-3 px-5">Case</th>
                <th className="text-left py-3 px-5">Messages</th>
                <th className="text-left py-3 px-5">Updated</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {threads.map((t) => (
                <tr key={t.id} className="border-b border-outline-variant/10">
                  <td className="py-4 px-5">
                    <div className="text-on-surface font-medium">{t.user.name ?? t.user.email}</div>
                    <div className="text-xs text-on-surface/45">{t.user.email}</div>
                  </td>
                  <td className="py-4 px-5 text-on-surface">{t.title}</td>
                  <td className="py-4 px-5">
                    {t.case ? (
                      <Link
                        href={`/admin/cases?q=${encodeURIComponent(t.case.publicId)}`}
                        className="text-primary underline underline-offset-4"
                      >
                        {t.case.publicId}
                      </Link>
                    ) : (
                      <span className="text-on-surface/35">—</span>
                    )}
                  </td>
                  <td className="py-4 px-5">{t._count.messages}</td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    {new Date(t.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!threads.length ? (
                <tr>
                  <td className="py-10 px-5 text-center text-on-surface/45" colSpan={5}>
                    No message threads yet.
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

import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/authz";

export default async function ResultsDashboardPage() {
  const session = await requireUser();
  const userId = (session as any)?.userId as string | undefined;

  const seen =
    session?.user?.email && userId
      ? await (prisma as any).userSeenState.findUnique({
          where: { userId },
          select: { lastSeenInboxAt: true, lastSeenReportAt: true },
        })
      : null;

  const thread =
    session?.user?.email && userId
      ? await (prisma as any).messageThread.findFirst({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          select: { updatedAt: true },
        })
      : null;

  const cases =
    session?.user?.email && userId
      ? await prisma.case.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            publicId: true,
            status: true,
            createdAt: true,
            report: { select: { publishedAt: true } },
          },
        })
      : [];

  const opened =
    session?.user?.email && userId
      ? await (prisma as any).userOpenedReport.findMany({
          where: { userId },
          select: { publicId: true },
        })
      : [];
  const openedSet = new Set<string>(opened.map((r: any) => String(r.publicId).toUpperCase()));

  const hasNewInbox = !!(
    thread?.updatedAt &&
    (!seen?.lastSeenInboxAt || thread.updatedAt.getTime() > seen.lastSeenInboxAt.getTime())
  );
  const hasNewReport = cases.some((c) => {
    const publishedAt = c.report?.publishedAt;
    if (!publishedAt) return false;
    if (!seen?.lastSeenReportAt) return true;
    return publishedAt.getTime() > seen.lastSeenReportAt.getTime();
  });

  function coverForCase(publicId: string) {
    // Lightweight v1 cover copy (until Report.contentJson is wired into cards)
    const n = publicId.toUpperCase();
    if (n.endsWith("21") || n.endsWith("10")) return "Sensitivity recovery";
    if (n.endsWith("11") || n.endsWith("01")) return "Barrier reset";
    if (n.endsWith("82") || n.endsWith("12")) return "Barrier + acne focus";
    return "Skin routine update";
  }

  const updateItems = cases as Array<{
    publicId: string;
    createdAt: Date;
    report?: { publishedAt?: Date | null } | null;
  }>;

  const latest = cases[0] ?? null;
  const latestIsReady = !!latest?.report?.publishedAt;
  const statusLabel = !latest
    ? "Start your first consultation"
    : latestIsReady
      ? "Your report is ready"
      : "Your case is under review";
  const statusDetail = !latest
    ? "Answer a few questions and upload photos (optional in the demo)."
    : latestIsReady
      ? "Open your dermatologist-reviewed report and routine."
      : "We’re preparing your report. You’ll see it here once it’s signed.";
  const statusCtaHref = !latest
    ? "/consult/welcome"
    : latestIsReady
      ? `/report/${latest.publicId.toLowerCase()}`
      : "/results";
  const statusCtaLabel = !latest ? "Start consultation" : latestIsReady ? "Open report" : "Refresh";

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="mb-10 sm:mb-14 max-w-3xl">
          <h1 className="text-4xl sm:text-[3rem] font-headline font-light tracking-tight text-on-surface leading-tight mb-6">
            Welcome back.
          </h1>
          <p className="text-lg text-on-surface-variant font-body leading-relaxed mb-4">
            {session?.user?.email ? "Your journey lives here — reports, notes, and daily routine." : "Sign in to view your journey."}
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-8 space-y-8">
            <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                Today
              </p>
              <p className="mt-3 font-headline tracking-tight text-xl">
                Do today’s routine
              </p>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                AM/PM checklist, then send a quick update to dr. Riris. That’s the whole loop.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/results/journey"
                  className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
                >
                  Do routine
                </Link>
                <Link
                  href="/results/inbox"
                  className="rounded-full border border-outline-variant/25 bg-surface px-6 py-3 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors text-center"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <span>Message dr. Riris</span>
                    {hasNewInbox ? <span className="h-1.5 w-1.5 rounded-full bg-primary" /> : null}
                  </span>
                </Link>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    Updates
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Your reports and changes over time.
                  </p>
                </div>
                <Link
                  href="/results/clinical-notes"
                  className="text-primary text-sm font-medium underline underline-offset-8"
                >
                  Clinical notes
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {updateItems.length ? (
                  updateItems.map((c) => {
                  const ready = !!c.report?.publishedAt;
                  const pubId = String(c.publicId).toUpperCase();
                  const isOpened = openedSet.has(pubId);
                  // Per-card state: a report is "New" until the user opens that specific report.
                  const isNew = ready && !isOpened;

                  const dateLabel = new Date(c.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "2-digit",
                  });

                  const status = ready ? "Ready" : "Waiting";
                  const href = ready ? `/report/${String(c.publicId).toLowerCase()}` : "/results/inbox";
                  const cover = coverForCase(String(c.publicId));
                  const title = ready ? "Your plan is ready" : "We’re reviewing your case";
                  const subtitle = ready
                    ? "Routine + what to focus on this week"
                    : "If anything changed, send a quick note to dr. Riris";

                  return (
                    <Link
                      key={pubId}
                      href={href}
                      className={[
                        "rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-8 border shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)] hover:bg-surface-container-low transition-colors",
                        isNew
                          ? "border-primary/25 bg-[radial-gradient(circle_at_20%_15%,rgba(61,99,116,0.12),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.86))]"
                          : isOpened
                            ? "border-outline-variant/8 opacity-[0.92]"
                            : "border-outline-variant/10",
                      ].join(" ")}
                    >
                      <div className="aspect-[16/10] rounded-[2rem] bg-[radial-gradient(circle_at_25%_20%,rgba(61,99,116,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(246,217,166,0.16),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.82))] border border-outline-variant/10 flex items-end p-5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase tracking-[0.22em] text-on-surface/50">
                              {dateLabel}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-surface/70 text-on-surface/60 border border-outline-variant/15">
                              {status}
                            </span>
                            {isNew ? (
                              <span className="text-[10px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                New
                              </span>
                            ) : isOpened ? (
                              <span className="text-[10px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-surface/70 text-on-surface/45 border border-outline-variant/12">
                                Seen
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 font-headline tracking-tight text-lg">{cover}</p>
                        </div>
                      </div>

                      <p className="mt-5 font-headline tracking-tight text-lg">{title}</p>
                      <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{subtitle}</p>
                      <div className="mt-5 inline-flex rounded-full border border-outline-variant/25 px-5 py-2.5 text-sm text-on-surface-variant">
                        Open
                      </div>
                    </Link>
                  );
                })
                ) : (
                  <div className="col-span-1 sm:col-span-2 rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">No reports yet</p>
                    <p className="mt-3 font-headline tracking-tight text-xl">Start your first consultation</p>
                    <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                      Once your report is signed, it will show up here.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/consult/welcome"
                        className="btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
                      >
                        Start consultation
                      </Link>
                      <Link
                        href="/demos/share-report"
                        className="rounded-full border border-outline-variant/25 bg-surface px-6 py-3 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors text-center"
                      >
                        See demo share card
                      </Link>
                    </div>
                  </div>
                )}

                {hasNewInbox ? (
                  <Link
                    href="/results/inbox"
                    className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-8 border border-primary/20 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)] hover:bg-surface-container-low transition-colors"
                  >
                    <div className="aspect-[16/10] rounded-[2rem] bg-primary/10 border border-primary/15 flex items-end p-5">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-primary">
                          New • Inbox
                        </p>
                        <p className="mt-2 font-headline tracking-tight text-lg">Message from dr. Riris</p>
                      </div>
                    </div>
                    <p className="mt-5 font-headline tracking-tight text-lg">You have a new update</p>
                    <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                      Tap to read and reply.
                    </p>
                    <div className="mt-5 inline-flex rounded-full border border-primary/20 px-5 py-2.5 text-sm text-primary">
                      Open inbox
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-surface-container-lowest p-8 sm:p-10 rounded-[2rem] border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/40 mb-4">Status</p>
              <h2 className="text-2xl font-headline font-light text-on-surface mb-2">{statusLabel}</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{statusDetail}</p>
              <div className="mt-8">
                <Link
                  className="btn-gradient inline-flex text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide"
                  href={statusCtaHref}
                >
                  {statusCtaLabel}
                </Link>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 sm:p-10 rounded-[2rem] border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/40 mb-4">Today</p>
              <h2 className="text-2xl font-headline font-light text-on-surface mb-2">Today’s check-in</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Do AM or PM, then send a quick update to dr. Riris from your inbox.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  className="btn-gradient text-on-primary px-7 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
                  href="/results/journey"
                >
                  Do today’s routine
                </Link>
                <Link
                  className="rounded-full border border-outline-variant/25 bg-surface px-7 py-3 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors text-center"
                  href="/results/inbox"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <span>Open inbox</span>
                    {hasNewInbox ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] uppercase tracking-[0.22em] text-primary">
                          New
                        </span>
                      </span>
                    ) : null}
                  </span>
                </Link>
                <Link
                  className="rounded-full border border-outline-variant/25 bg-surface px-7 py-3 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors text-center"
                  href="/consult/welcome"
                >
                  Start a new consultation
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

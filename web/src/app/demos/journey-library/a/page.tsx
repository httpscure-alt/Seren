import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const feed = [
  {
    type: "today",
    eyebrow: "Today",
    title: "Your plan for today",
    body: "Keep it simple. Barrier-first routine + sunscreen. If anything stings, stop the new product and message dr. Riris.",
    actions: [
      { label: "Do today’s routine", href: "/results/journey" },
      { label: "Message dr. Riris", href: "/results/inbox" },
    ],
  },
  {
    type: "report",
    eyebrow: "Week 1 • Report",
    title: "Your skin check is ready",
    body: "Clear explanation + a routine you can follow. Focus: calm inflammation and protect barrier.",
    meta: ["Routine: AM/PM", "Focus: barrier + acne", "Updated: 12 Sep"],
    actions: [{ label: "Open report", href: "/report/srn-8821" }],
  },
  {
    type: "checkpoint",
    eyebrow: "Weekly checkpoint",
    title: "Quick photo check-in",
    body: "Upload one photo + answer 3 quick questions. We’ll adjust early if you’re irritated or breaking out.",
    meta: ["Takes 1 minute", "Optional photo", "Helps personalize"],
    actions: [{ label: "Start check-in", href: "/results/journey" }],
  },
  {
    type: "note",
    eyebrow: "Small win",
    title: "Streak: 4 days",
    body: "Consistency beats intensity. If you can only do one thing: cleanse + moisturizer + SPF.",
    actions: [{ label: "Send update", href: "/results/inbox" }],
  },
] as const;

function pill(text: string) {
  return (
    <span className="text-[10px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-surface-container-low text-on-surface/60 border border-outline-variant/12">
      {text}
    </span>
  );
}

export default function JourneyTimelineMock() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="mb-10 sm:mb-14 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
            Option A
          </p>
          <h1 className="font-headline tracking-[-0.03em] leading-[1.0] text-3xl sm:text-4xl">
            Journey timeline
          </h1>
          <p className="mt-5 text-on-surface-variant leading-relaxed">
            Consumer-first feed: “what you do today” + “what changed” + “checkpoints”. No case IDs, no clinical jargon.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/demos/journey-library"
              className="rounded-full border border-outline-variant/25 bg-surface px-5 py-2.5 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Back to options
            </Link>
            <Link
              href="/results"
              className="btn-gradient text-on-primary px-5 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-sm"
            >
              Open current My Journey
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-8 space-y-6">
            {feed.map((c) => (
              <article
                key={c.title}
                className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]"
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                      {c.eyebrow}
                    </p>
                    <p className="mt-3 font-headline tracking-tight text-xl">
                      {c.title}
                    </p>
                    <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                      {c.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.type === "today"
                      ? pill("Today")
                      : c.type === "report"
                        ? pill("Report")
                        : c.type === "checkpoint"
                          ? pill("Checkpoint")
                          : pill("Progress")}
                  </div>
                </div>

                {"meta" in c && c.meta ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.meta.map((m) => (
                      <span
                        key={m}
                        className="rounded-full border border-outline-variant/20 bg-surface px-4 py-2 text-xs text-on-surface-variant"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  {c.actions.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      className={
                        a.label.includes("Message") || a.label.includes("Send")
                          ? "rounded-full border border-outline-variant/25 bg-surface px-6 py-3 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors text-center"
                          : "btn-gradient text-on-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
                      }
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                Why this works
              </p>
              <ul className="text-sm text-on-surface-variant leading-relaxed space-y-3 list-disc pl-5">
                <li>Starts with “Today”, not history.</li>
                <li>Turns reports into “milestones”, not medical records.</li>
                <li>Makes messaging feel like part of the journey.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}


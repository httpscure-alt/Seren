import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

const updates = [
  {
    title: "Week 1 report",
    subtitle: "Your routine + what to focus on",
    cover: "Barrier + acne focus",
    date: "Sep 12",
    href: "/report/srn-8821",
    status: "Ready",
  },
  {
    title: "Baseline check",
    subtitle: "Starting point + what to avoid",
    cover: "Sensitivity + texture",
    date: "Jul 02",
    href: "/report/srn-7710",
    status: "Ready",
  },
  {
    title: "Routine tweak",
    subtitle: "We simplified your PM steps",
    cover: "Less irritation",
    date: "Yesterday",
    href: "/results/inbox",
    status: "Waiting",
  },
] as const;

export default function ResultsGalleryMock() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        <header className="mb-10 sm:mb-14 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
            Option B
          </p>
          <h1 className="font-headline tracking-[-0.03em] leading-[1.0] text-3xl sm:text-4xl">
            Results gallery
          </h1>
          <p className="mt-5 text-on-surface-variant leading-relaxed">
            Keep it simple: one “Today” card, then a gallery of updates. No confusing card types.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/demos/journey-library"
              className="rounded-full border border-outline-variant/25 bg-surface px-5 py-2.5 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Back to options
            </Link>
            <Link
              href="/results/inbox"
              className="rounded-full border border-outline-variant/25 bg-surface px-5 py-2.5 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Open inbox
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-8">
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
                  Message dr. Riris
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                Updates
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {updates.map((c) => (
                <Link
                  key={c.title}
                  href={c.href}
                  className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-8 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)] hover:bg-surface-container-low transition-colors"
                >
                  <div className="aspect-[16/10] rounded-[2rem] bg-[radial-gradient(circle_at_25%_20%,rgba(61,99,116,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(246,217,166,0.16),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.82))] border border-outline-variant/10 flex items-end p-5">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/50">
                        {c.date} • {c.status}
                      </p>
                      <p className="mt-2 font-headline tracking-tight text-lg">
                        {c.cover}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 font-headline tracking-tight text-lg">{c.title}</p>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                    {c.subtitle}
                  </p>

                  <div className="mt-5 inline-flex rounded-full border border-outline-variant/25 px-5 py-2.5 text-sm text-on-surface-variant">
                    Open
                  </div>
                </Link>
                ))}
              </div>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
                Best for
              </p>
              <ul className="text-sm text-on-surface-variant leading-relaxed space-y-3 list-disc pl-5">
                <li>People who think visually (“show me the cards”).</li>
                <li>Clear separation between reports and day-to-day routine.</li>
                <li>Easy to expand with share cards later.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}


import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

function PreferenceChips() {
  return (
    <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
        Personalization (10 seconds)
      </p>
      <div className="space-y-5">
        <div>
          <p className="text-xs text-on-surface/70 mb-2">Budget comfort</p>
          <div className="flex flex-wrap gap-2">
            {["Everyday", "Balanced", "Derm brands"].map((t) => (
              <button
                key={t}
                type="button"
                className="rounded-full border border-outline-variant/25 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-on-surface/70 mb-2">Where you shop</p>
          <div className="flex flex-wrap gap-2">
            {["Watsons", "Guardian", "Sociolla", "Shopee official", "Any"].map((t) => (
              <button
                key={t}
                type="button"
                className="rounded-full border border-outline-variant/25 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-on-surface/70 mb-2">Routine style</p>
          <div className="flex flex-wrap gap-2">
            {["Minimal", "Standard", "Intensive"].map((t) => (
              <button
                key={t}
                type="button"
                className="rounded-full border border-outline-variant/25 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs text-on-surface/45 leading-relaxed">
        These only change product brands/availability. Your clinical interpretation stays the same.
      </p>
    </div>
  );
}

function ProductRow({
  step,
  name,
  why,
  badge,
}: {
  step: string;
  name: string;
  why: string;
  badge?: string;
}) {
  return (
    <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">{step}</p>
          <p className="mt-2 text-base font-headline tracking-tight text-on-surface">{name}</p>
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{why}</p>
        </div>
        {badge ? (
          <span className="shrink-0 rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full border border-outline-variant/25 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          See alternatives
        </button>
        <button
          type="button"
          className="rounded-full border border-outline-variant/25 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          Where to buy
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
          Alternatives (preview)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-on-surface-variant">
          {["Option A (same tier)", "Option B (sensitive-friendly)"].map((t) => (
            <div
              key={t}
              className="rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-4"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShareableReportCard() {
  return (
    <div className="rounded-[2.5rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-[0_22px_70px_-42px_rgba(47,51,48,0.22)]">
      <div className="p-7 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Share preview</p>
        <p className="mt-3 text-2xl font-headline tracking-tight">Seren skin report</p>
        <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
          A dermatologist-reviewed routine, built for consistency.
        </p>
      </div>

      <div className="px-7 sm:px-8 pb-7 sm:pb-8">
        <div className="rounded-[2rem] bg-surface border border-outline-variant/12 overflow-hidden">
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-5 relative min-h-[180px]">
              <Image
                src="/doctors/dr-riris.png"
                alt="Reviewing dermatologist"
                fill
                sizes="240px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />
              <div className="absolute left-4 bottom-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">
                  Reviewing dermatologist
                </p>
                <p className="text-sm text-white font-headline tracking-tight">
                  dr. Riris Asti Respati, SpDVE
                </p>
              </div>
            </div>
            <div className="col-span-7 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-on-surface/60">Patient</p>
                  <p className="text-lg font-headline tracking-tight">Emmy Noviawati</p>
                </div>
                <span className="rounded-full bg-primary/10 border border-primary/15 text-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] shrink-0">
                  Signed
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { k: "Clarity", v: "7.8" },
                  { k: "Barrier", v: "6.4" },
                  { k: "Inflamm.", v: "4.9" },
                ].map((m) => (
                  <div
                    key={m.k}
                    className="rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-4 text-center"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                      {m.k}
                    </p>
                    <p className="mt-2 text-xl font-headline tracking-tight text-on-surface">{m.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
                  Next 7 days
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Repair barrier first, then introduce one active slowly.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-xs text-on-surface/45">Report ID: SRN-8821</p>
                <button
                  type="button"
                  className="btn-gradient text-on-primary px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-headline shadow-sm"
                >
                  View report
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-on-surface/45 leading-relaxed">
          Intended for sharing as a preview card (social / chat). No clinical photos of the patient.
        </p>
      </div>
    </div>
  );
}

export default function RecommendationsDemoPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Demos</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Recommendations UX (scales to large catalogs)
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            A “recommended set” (3–5 products), plus alternatives per step. Users set constraints in
            seconds.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/budget-tier">
              Related: budget-tier demos
            </Link>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <aside className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <PreferenceChips />
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
              <p className="font-headline tracking-tight text-base">Why this feels personal</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                We personalize for availability (where you shop), comfort range (budget tier), and
                behavior (routine style)—without asking users to browse a huge product list.
              </p>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="seren-card p-8 sm:p-10">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                Recommended set
              </p>
              <h2 className="text-2xl font-headline tracking-tight">Morning routine</h2>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed max-w-[70ch]">
                Built for barrier recovery + humid climate. Keep it consistent for 7 days before
                adding new actives.
              </p>
              <div className="mt-8 space-y-5">
                <ProductRow
                  step="AM • Step 1"
                  name="Gentle cleanser"
                  why="To remove oil/sweat without stripping barrier lipids."
                />
                <ProductRow
                  step="AM • Step 2"
                  name="Lightweight moisturizer (ceramide-support)"
                  why="To reduce tightness and help tolerance for future actives."
                  badge="Key"
                />
                <ProductRow
                  step="AM • Step 3"
                  name="SPF50 PA++++ sunscreen"
                  why="To prevent post-inflammatory marks and protect barrier repair."
                />
              </div>
            </div>

            <ShareableReportCard />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}


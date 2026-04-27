import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

function TierCards() {
  const tiers = [
    {
      key: "value",
      title: "Value",
      desc: "Affordable essentials, still evidence-based.",
      examples: "Wardah • Emina • Skin Aqua",
      range: "Rp 30k–120k / step",
    },
    {
      key: "mid",
      title: "Mid",
      desc: "Balanced: comfort, consistency, and proven actives.",
      examples: "Hada Labo • COSRX • Azarine",
      range: "Rp 80k–250k / step",
    },
    {
      key: "premium",
      title: "Premium",
      desc: "Derm brands and higher-end formulations.",
      examples: "La Roche‑Posay • Avène • Bioderma",
      range: "Rp 200k–600k / step",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {tiers.map((t) => (
        <button
          key={t.key}
          type="button"
          className="text-left rounded-[2rem] bg-surface-container-lowest border border-outline-variant/12 p-6 hover:bg-surface-container transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Product preference</p>
          <p className="mt-3 text-xl font-headline tracking-tight">{t.title}</p>
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{t.desc}</p>
          <div className="mt-5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Examples</p>
            <p className="mt-1 text-sm text-on-surface">{t.examples}</p>
            <p className="mt-2 text-xs text-on-surface/45">{t.range}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function BudgetTierDemosPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">Demos</p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Budget tier UI options
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Three places to collect “budget tier” so product recommendations feel right for each
            person.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos">
              All demos
            </Link>
            <span className="text-on-surface/25" aria-hidden>
              ·
            </span>
            <Link className="text-primary underline underline-offset-4" href="/demos/intake-routine-mock">
              Intake · routine (mock)
            </Link>
            <span className="text-on-surface/25" aria-hidden>
              ·
            </span>
            <Link className="text-primary underline underline-offset-4" href="/demos/budget-tier/option-a">
              Option A (in intake)
            </Link>
            <Link className="text-primary underline underline-offset-4" href="/demos/budget-tier/option-b">
              Option B (toggle in report)
            </Link>
            <Link className="text-primary underline underline-offset-4" href="/demos/budget-tier/option-c">
              Option C (during signup)
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10">
          <section className="seren-card p-8 sm:p-10">
            <h2 className="text-lg font-headline tracking-tight">Option A (recommended)</h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              One question inside intake. It feels like personalization and keeps the paywall separate.
            </p>
            <div className="mt-8">
              <TierCards />
            </div>
          </section>

          <section className="seren-card p-8 sm:p-10">
            <h2 className="text-lg font-headline tracking-tight">Option B</h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              A “Regimen style” toggle on the report page. Lowest friction upfront, but you’ll need to
              re-rank products after they change it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Value", "Mid", "Premium"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className="rounded-full border border-outline-variant/25 px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="seren-card p-8 sm:p-10">
            <h2 className="text-lg font-headline tracking-tight">Option C</h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Collect during signup. Works, but can feel “price-first” unless the copy is very gentle.
            </p>
            <div className="mt-8 rounded-[2rem] bg-surface-container-lowest border border-outline-variant/12 p-6 max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Product preference</p>
              <p className="mt-2 text-xl font-headline tracking-tight">Choose what you’ll actually buy.</p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Value", "Mid", "Premium"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="rounded-2xl border border-outline-variant/20 bg-surface px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}


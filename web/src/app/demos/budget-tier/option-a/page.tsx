import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

function TierCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        {
          title: "Value",
          desc: "Affordable essentials, still evidence-based.",
          examples: "Wardah • Emina • Skin Aqua",
        },
        {
          title: "Mid",
          desc: "Balanced: comfort, consistency, and proven actives.",
          examples: "Hada Labo • COSRX • Azarine",
        },
        {
          title: "Premium",
          desc: "Derm brands and higher-end formulations.",
          examples: "La Roche‑Posay • Avène • Bioderma",
        },
      ].map((t) => (
        <button
          key={t.title}
          type="button"
          className="text-left rounded-[2rem] bg-surface-container-lowest border border-outline-variant/12 p-6 hover:bg-surface-container transition-colors"
        >
          <p className="text-xl font-headline tracking-tight">{t.title}</p>
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{t.desc}</p>
          <p className="mt-4 text-xs text-on-surface/45">{t.examples}</p>
        </button>
      ))}
    </div>
  );
}

export default function BudgetTierOptionA() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Budget tier • Option A
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Intake step: product preference.
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            This is the cleanest UX: a single decision inside the consultation context.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/budget-tier">
              Back to all options
            </Link>
          </p>
        </div>

        <section className="mt-12 seren-card p-8 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
              Step 2 of 2
            </p>
            <h2 className="text-2xl font-headline tracking-tight">Choose what you’ll actually buy.</h2>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              We’ll keep product recommendations within your comfort range.
            </p>
          </div>

          <div className="mt-8">
            <TierCards />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              type="button"
              className="rounded-full border border-outline-variant/25 px-8 py-3.5 text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              className="btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm"
            >
              Continue
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


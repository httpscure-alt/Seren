import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

export default function BudgetTierOptionB() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Budget tier • Option B
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Report toggle: regimen tier.
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Lowest friction upfront. Users can adjust tier and you re-rank products instantly.
          </p>
          <p className="mt-6 text-sm">
            <Link className="text-primary underline underline-offset-4" href="/demos/budget-tier">
              Back to all options
            </Link>
          </p>
        </div>

        <section className="mt-12 grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="col-span-12 lg:col-span-7 seren-card p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-5">
              Your routine
            </p>
            <h2 className="text-2xl font-headline tracking-tight">Morning</h2>
            <div className="mt-6 space-y-3">
              {["Gentle cleanser", "Lightweight moisturizer", "SPF50 sunscreen"].map((s) => (
                <div
                  key={s}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/12 p-5 text-sm text-on-surface-variant"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-5 space-y-6">
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
                Regimen tier
              </p>
              <div className="flex flex-wrap gap-2">
                {["Value", "Mid", "Premium"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="rounded-full border border-outline-variant/25 px-4 py-2 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-on-surface/45 leading-relaxed">
                Changing this would refresh the product set (same actives, different price tier).
              </p>
            </div>

            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
              <p className="font-headline tracking-tight text-base">Suggested products</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                Example list updates when tier changes.
              </p>
              <div className="mt-5 space-y-3">
                {["Sunscreen gel SPF50", "Ceramide moisturizer", "Gentle cleanser"].map((s) => (
                  <div
                    key={s}
                    className="rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-4 text-sm text-on-surface-variant"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


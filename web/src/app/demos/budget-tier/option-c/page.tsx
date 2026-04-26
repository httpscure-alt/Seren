import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

export default function BudgetTierOptionC() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Demos • Budget tier • Option C
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline tracking-[-0.02em]">
            Signup: product preference.
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.65]">
            Works, but can feel “price-first”. If you use this option, keep the copy gentle and
            optional.
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
              Create account
            </p>
            <h2 className="text-2xl font-headline tracking-tight">Save your assessment</h2>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed max-w-[60ch]">
              Create an account to save your photos and get a dermatologist-reviewed routine.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
                  Product preference (optional)
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Choose what you’ll actually buy. We’ll keep recommendations within your comfort
                  range.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/12 p-4 text-sm text-on-surface/70">
                  Name field…
                </div>
                <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/12 p-4 text-sm text-on-surface/70">
                  Email field…
                </div>
                <div className="sm:col-span-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/12 p-4 text-sm text-on-surface/70">
                  Password field…
                </div>
              </div>

              <button
                type="button"
                className="btn-gradient w-full text-center text-on-primary py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm block"
              >
                Create account
              </button>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="seren-card p-8 sm:p-10 lg:sticky lg:top-28">
              <h3 className="font-headline text-lg mb-2">Why we ask</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Same actives, different price tier. This helps recommendations feel realistic for
                daily life.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


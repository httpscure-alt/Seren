import Link from "next/link";
import { SerenHeroVisual } from "@/components/SerenHeroVisual";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container min-h-screen pt-28 sm:pt-32 pb-24">
        <div className="rounded-[1.75rem] p-px bg-gradient-to-br from-primary/35 via-surface-container to-amber-200/25 shadow-[0_28px_80px_-48px_rgba(61,99,116,0.35)]">
          <div className="rounded-[calc(1.75rem-1px)] bg-surface/95 backdrop-blur-md px-8 py-12 sm:px-10 sm:py-14 md:px-12 md:py-16 flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
            <div className="w-full md:w-5/12 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                  Welcome
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-light tracking-tighter leading-[1.1] text-on-surface">
                  Your skin deserves clarity
                </h1>
              </div>

              <p className="text-lg text-on-surface-variant leading-relaxed font-light max-w-md">
                We combine AI analysis with dermatologist review to give you a routine that actually
                works.
              </p>

              <div className="pt-2">
                <Link
                  href="/consult/welcome"
                  className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-medium tracking-wide btn-gradient text-on-primary shadow-[0_18px_50px_-35px_rgba(61,99,116,0.45)] transition hover:brightness-[1.03] hover:shadow-[0_22px_55px_-32px_rgba(61,99,116,0.5)]"
                >
                  Begin assessment
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>

            <div className="w-full md:w-7/12 relative aspect-[4/5] md:aspect-square min-h-[280px]">
              <div className="absolute inset-0 z-0 rounded-[1.5rem] p-px bg-gradient-to-br from-primary/25 via-transparent to-amber-100/20">
                <div className="relative h-full w-full overflow-hidden rounded-[calc(1.5rem-1px)]">
                  <SerenHeroVisual />
                </div>
              </div>
              <div className="absolute bottom-6 left-0 sm:-left-4 z-10 rounded-xl border border-outline-variant/12 bg-surface/90 p-5 sm:p-6 max-w-sm shadow-[0_20px_50px_-28px_rgba(47,51,48,0.25)] backdrop-blur-md">
                <p className="text-xs font-medium tracking-wide text-on-surface-variant">
                  Dermatologist-reviewed routines, not trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

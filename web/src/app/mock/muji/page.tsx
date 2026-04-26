import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { getDictionary } from "@/i18n/getDictionary";

export default async function MockMujiMinimalLanding() {
  const { dict } = await getDictionary();
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <header className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
            Mock • Japanese minimal
          </p>
          <h1 className="text-3xl sm:text-4xl font-headline font-light tracking-tight leading-tight">
            Simple, quiet care.
          </h1>
          <p className="mt-4 text-on-surface-variant leading-[1.75]">
            One column. Small labels. Neutral surfaces. Minimal decoration—maximum clarity.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              href="/consult/intake"
              className="rounded-full border border-outline-variant/25 px-7 py-3 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              {dict.landing.ctaStart}
            </Link>
            <Link
              href="/philosophy"
              className="text-xs uppercase tracking-[0.22em] text-on-surface/55 hover:text-primary underline underline-offset-8 decoration-on-surface/20"
            >
              {dict.landing.ctaPhilosophy}
            </Link>
          </div>
        </header>

        <section className="mt-14 max-w-2xl space-y-10">
          {[
            {
              k: "01",
              t: "Upload photos",
              b: "Natural light. One close-up, one context. No filters.",
            },
            {
              k: "02",
              t: "Answer intake",
              b: "Symptoms, timeline, and tolerance. We keep it brief.",
            },
            {
              k: "03",
              t: "Receive your routine",
              b: "A plan you can actually follow—reviewed and signed by a dermatologist.",
            },
          ].map((x) => (
            <div key={x.k} className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">{x.k}</p>
              <p className="font-headline tracking-tight text-base">{x.t}</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">{x.b}</p>
              <div className="h-px w-full bg-outline-variant/15" />
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { getDictionary } from "@/i18n/getDictionary";
import type { Metadata } from "next";
import { siteOgForPath } from "@/lib/marketingOg";

export const metadata: Metadata = {
  title: "Philosophy",
  description:
    "A calmer, clinical approach to skin clarity—AI-assisted assessment with dermatologist review and routines built to be followed.",
  alternates: { canonical: "/philosophy" },
  ...siteOgForPath("/philosophy"),
};

export default async function PhilosophyPage() {
  const { dict, lang } = await getDictionary();
  const chip = lang === "id"
    ? {
        core: "Intinya",
        principle: "Prinsip",
        why: "Kenapa Seren",
        clinicalBoard: "Clinical board",
      }
    : {
        core: "Core",
        principle: "Principle",
        why: "Why Seren",
        clinicalBoard: "Clinical board",
      };

  const principles =
    lang === "id"
      ? [
          {
            title: "Biar jelas, bukan rame",
            body: "Kita fokus ke yang penting: kondisi, pemicu, dan rutinitas yang bisa kamu jalanin.",
          },
          {
            title: "Simpel dulu, baru bertahap",
            body: "Mulai dari barrier + sunscreen, baru masukin active pelan‑pelan (kalau perlu).",
          },
          {
            title: "Privasi tetap nomor satu",
            body: "Kamu pegang kendali. Foto dan data kamu dipakai buat analisis—bukan buat pajangan.",
          },
        ]
      : [
          {
            title: "Clarity over noise",
            body: "We focus on what matters: the condition, triggers, and a routine you can keep.",
          },
          {
            title: "Simple first, then build",
            body: "Start with barrier + sunscreen, then introduce actives gradually (if needed).",
          },
          {
            title: "Privacy stays first",
            body: "You stay in control. Your photos and data are for analysis—not for show.",
          },
        ];
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden flex flex-col">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-20">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-outline-variant/12 bg-surface-container-lowest p-8 sm:p-10 lg:p-12">
          <div className="absolute -top-28 -left-24 size-[420px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 right-[-6rem] size-[520px] rounded-full bg-tertiary-container/55 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#2f3330_0.6px,transparent_0.6px)] [background-size:18px_18px]" />

          <div className="relative grid grid-cols-12 gap-10 lg:gap-12 items-start">
            <header className="col-span-12 lg:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-5">
                {dict.philosophy.heroEyebrow}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-headline tracking-[-0.02em] leading-[1.02]">
                {dict.philosophy.heroTitle1}
                <br />
                <span className="italic font-light text-on-surface/90">
                  {dict.philosophy.heroTitle2}
                </span>
              </h1>
              <p className="mt-6 text-on-surface-variant leading-[1.75] text-[0.98rem] max-w-[60ch]">
                {dict.philosophy.heroBody}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link
                  href="/consult/welcome"
                  className="btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm text-center whitespace-nowrap"
                >
                  {dict.philosophy.ctaStart}
                </Link>
                <Link
                  href="/"
                  className="px-8 py-3.5 rounded-full border border-outline-variant/25 text-on-surface/70 text-sm font-medium tracking-wide hover:bg-surface-container-low transition-colors text-center whitespace-nowrap"
                >
                  {dict.philosophy.ctaBack}
                </Link>
              </div>
            </header>

            <aside className="col-span-12 lg:col-span-5">
              <div className="rounded-[2rem] bg-surface/80 border border-outline-variant/12 p-7 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                  {chip.core}
                </p>
                <p className="mt-4 text-2xl font-headline tracking-tight text-on-surface">
                  {dict.philosophy.coreTitle}
                </p>
                <p className="mt-4 text-on-surface-variant leading-[1.75]">
                  {dict.philosophy.coreBody}
                </p>
                <div className="mt-7 h-px w-full bg-outline-variant/15" />
                <p className="mt-6 text-xs text-on-surface/55 leading-relaxed">
                  {chip.clinicalBoard}:{" "}
                  <span className="text-on-surface/70">Dr. Riris Asti Respati, SpDVE</span>
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {principles.map((c) => (
            <div key={c.title} className="seren-card p-8 sm:p-9">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">
                {chip.principle}
              </p>
              <p className="text-lg font-headline tracking-tight">{c.title}</p>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">{c.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <div className="rounded-[2.5rem] border border-outline-variant/12 bg-surface-container-low p-8 sm:p-10 lg:p-12">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-6">
              {dict.philosophy.coreEyebrow}
            </p>
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-8">
                <p className="text-2xl sm:text-[1.65rem] font-headline tracking-tight text-on-surface">
                  {dict.philosophy.closingTitle}
                </p>
                <p className="mt-5 text-on-surface-variant leading-[1.75] max-w-[70ch]">
                  {dict.philosophy.closingBody}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                    {chip.why}
                  </p>
                  <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
                    {lang === "id"
                      ? "Kamu nggak perlu jadi “skincare expert”. Cukup konsisten sama rutinitas yang pas."
                      : "You don’t need to be a skincare expert. Just stay consistent with the right routine."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

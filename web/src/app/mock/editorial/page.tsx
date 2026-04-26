import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { getDictionary } from "@/i18n/getDictionary";

function Rule() {
  return <div className="h-px w-full bg-outline-variant/20" />;
}

export default async function MockEditorialLanding() {
  const { dict } = await getDictionary();

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="pt-24 sm:pt-28">
        <section className="seren-container seren-section">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-5">
              Mock • Clinical editorial
            </p>
            <h1 className="font-headline tracking-[-0.04em] leading-[0.92] text-[2.75rem] sm:text-[3.6rem]">
              Clinical clarity,
              <br />
              <span className="italic font-light text-on-surface/85">in fewer words.</span>
            </h1>
            <p className="mt-7 text-on-surface-variant leading-[1.8] max-w-[70ch]">
              Upload photos and concerns. Seren drafts a report, then a dermatologist reviews,
              refines, and signs it—so the routine feels realistic, not aspirational.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
              <Link
                href="/consult/intake"
                className="rounded-full bg-primary text-on-primary px-8 py-3.5 text-sm font-medium tracking-wide shadow-sm text-center"
              >
                {dict.landing.ctaStart}
              </Link>
              <Link
                href="/philosophy"
                className="text-sm text-on-surface/55 hover:text-primary underline underline-offset-8 decoration-on-surface/20"
              >
                {dict.landing.ctaPhilosophy}
              </Link>
            </div>
          </div>

          <div className="mt-14 sm:mt-16">
            <Rule />
            <div className="grid grid-cols-12 gap-8 sm:gap-10 py-10 sm:py-12">
              <div className="col-span-12 md:col-span-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-3">
                  What you receive
                </p>
                <p className="font-headline tracking-tight text-lg">A report that reads clean.</p>
              </div>
              <div className="col-span-12 md:col-span-8 text-on-surface-variant leading-[1.85]">
                <p>
                  Not a wall of features—just the essentials: what’s happening, what to do next,
                  and how to keep it consistent.
                </p>
              </div>
            </div>
            <Rule />
          </div>
        </section>

        <section className="seren-container seren-section pt-0">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="col-span-12 lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
                Designed for clinical calm
              </p>
              <h2 className="font-headline tracking-[-0.03em] leading-[0.98] text-[2rem] sm:text-[2.35rem]">
                Less noise.
                <br />
                <span className="italic font-light text-on-surface/85">More signal.</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="space-y-4">
                {[
                  { k: "01", t: dict.landing.trustItems[0].title, b: dict.landing.trustItems[0].desc },
                  { k: "02", t: dict.landing.trustItems[1].title, b: dict.landing.trustItems[1].desc },
                  { k: "03", t: dict.landing.trustItems[2].title, b: dict.landing.trustItems[2].desc },
                  { k: "04", t: dict.landing.trustItems[3].title, b: dict.landing.trustItems[3].desc },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/12 p-7"
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                      {x.k}
                    </p>
                    <p className="mt-3 font-headline tracking-tight text-base">{x.t}</p>
                    <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{x.b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


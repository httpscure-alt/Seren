import Link from "next/link";
import { LandingHeroVisual } from "@/components/LandingHeroVisual";
import { getDictionary } from "@/i18n/getDictionary";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

/**
 * Pre-intake step: same hero layout as `/` and `/mock/ui-v2`, primary CTA continues to digital intake.
 */
export async function ConsultWelcomeScreen() {
  const { dict } = await getDictionary();
  const heroSlides = [...dict.landing.carouselSlides] as const;

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="pt-24 sm:pt-28">
        <section className="seren-container seren-section grid grid-cols-12 gap-10 lg:gap-14">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-6">
              {dict.landing.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-headline tracking-[-0.02em] leading-[1.05] mb-6">
              {dict.landing.heroTitle1}
              <br />
              <span className="italic font-light text-on-surface/90">
                {dict.landing.heroTitle2}
              </span>
            </h1>
            <p className="text-on-surface-variant leading-[1.65] max-w-lg text-[0.95rem]">
              {dict.landing.heroBody}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link
                href="/consult/intake"
                className="btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
              >
                {dict.landing.ctaStart}
              </Link>
              <Link
                href="/philosophy"
                className="text-sm text-on-surface/55 hover:text-primary underline underline-offset-[6px] decoration-on-surface/20"
              >
                {dict.landing.ctaPhilosophy}
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <LandingHeroVisual slides={[...heroSlides]} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

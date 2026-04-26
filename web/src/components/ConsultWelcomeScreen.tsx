import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

/**
 * Pre-intake welcome — hero layout aligned with `/mock/ui-v2` (7/5 grid, rounded-[3rem] visual, glass card).
 */
export async function ConsultWelcomeScreen() {
  const { dict } = await getDictionary();
  const heroSlides = [...dict.landing.carouselSlides];

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="pt-28 sm:pt-32">
        <section className="px-5 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto grid grid-cols-12 gap-8 mb-32 sm:mb-40 pb-16 sm:pb-20">
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center min-w-0">
            <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.7rem] sm:text-[3.5rem] lg:text-[4.0rem] mb-8 text-on-surface">
              {dict.landing.heroTitle1}
              <br />
              <span className="italic font-light">{dict.landing.heroTitle2}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed mb-10 sm:mb-12 font-light">
              {dict.landing.heroBody}
            </p>
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
              <Link
                href="/consult/intake"
                className="btn-gradient text-on-primary px-7 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-medium tracking-wide hover:shadow-xl transition-all duration-300"
              >
                {dict.landing.ctaStart}
              </Link>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-primary tracking-wider">
                  {dict.landing.eyebrow}
                </span>
                <span className="text-on-surface-variant text-xs sm:text-sm">
                  {heroSlides[0]?.status ?? ""}
                </span>
              </div>
            </div>
            <p className="mt-8 text-[11px] text-on-surface/45 max-w-xl">
              by continuing you agree to our{" "}
              <a
                className="underline underline-offset-[5px] decoration-on-surface/20 hover:text-primary"
                href="/privacy"
              >
                privacy policy
              </a>{" "}
              and{" "}
              <a
                className="underline underline-offset-[5px] decoration-on-surface/20 hover:text-primary"
                href="/terms"
              >
                terms
              </a>
              .
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-surface-container shadow-inner relative">
              <Image
                src="/demo/welcome-cream-swatch.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
                priority
              />
            </div>

            <div className="absolute -bottom-8 -left-2 sm:-left-12 glass-effect bg-surface/70 p-6 sm:p-8 rounded-xl shadow-sm border border-outline-variant/10 max-w-xs">
              <div className="flex items-start gap-3 mb-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-outline-variant/15 bg-surface-container-lowest">
                  <Image
                    src="/doctors/dr-riris.png"
                    alt="Dr. Riris Asti Respati, Sp.DVE"
                    fill
                    className="object-cover object-top"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary block">
                    {dict.landing.trustItems[0]?.title ?? dict.landing.trustHeading}
                  </span>
                  <p className="text-sm font-headline text-on-surface leading-snug mt-2">
                    Dr. Riris Asti Respati, Sp.DVE
                  </p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                An unhurried read of what you share—so what comes next can feel like it fits you, not a template.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

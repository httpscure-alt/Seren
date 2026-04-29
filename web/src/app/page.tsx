import { LandingHeroVisual } from "@/components/LandingHeroVisual";
import { getDictionary } from "@/i18n/getDictionary";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import type { Metadata } from "next";
import { siteOgForPath } from "@/lib/marketingOg";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const metadata: Metadata = {
  title: "Seren — clinical skin analysis",
  description:
    "AI-assisted skin analysis, reviewed by certified dermatologists. Get a clear routine and treatment plan you can follow.",
  alternates: { canonical: "/" },
  ...siteOgForPath("/"),
};

export default async function Home() {
  const { dict } = await getDictionary();
  const session = await getServerSession(authOptions);
  const isSignedIn = !!session?.user?.email;

  // CTA: always land on the paywall plan picker. Signed-out users are routed through auth first.
  const paywallTarget = `/paywall?returnTo=${encodeURIComponent("/consult/welcome")}`;
  const paywallHref = isSignedIn ? paywallTarget : `/auth?returnTo=${encodeURIComponent(paywallTarget)}`;

  const pricingCtaBase =
    "mt-10 inline-flex h-12 box-border items-center justify-center whitespace-nowrap rounded-full px-8 text-sm font-medium tracking-wide leading-none transition";
  const trust = [
    {
      title: dict.landing.trustItems[0].title,
      desc: dict.landing.trustItems[0].desc,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 12.2l1.8 1.8 3.8-3.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: dict.landing.trustItems[1].title,
      desc: dict.landing.trustItems[1].desc,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M9 4v2M15 4v2M9 18v2M15 18v2M4 9h2M4 15h2M18 9h2M18 15h2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <rect
            x="7"
            y="7"
            width="10"
            height="10"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M10 11h4M10 13h2.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: dict.landing.trustItems[2].title,
      desc: dict.landing.trustItems[2].desc,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M8.5 3h7l2 2v14.5a2.5 2.5 0 0 1-2.5 2.5h-6A4 4 0 0 1 5 18V6.5A3.5 3.5 0 0 1 8.5 3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8 9h8M8 12h6M8 15h7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: dict.landing.trustItems[3].title,
      desc: dict.landing.trustItems[3].desc,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M7.5 11V8.8A4.5 4.5 0 0 1 12 4.3a4.5 4.5 0 0 1 4.5 4.5V11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <rect
            x="6.5"
            y="11"
            width="11"
            height="9.5"
            rx="2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 15.2v2.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ] as const;

  const heroSlides = [
    ...dict.landing.carouselSlides,
  ] as const;

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
              <a
                href="/consult/welcome"
                className="btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
              >
                {dict.landing.ctaStart}
              </a>
              <a
                href="/philosophy"
                className="text-sm text-on-surface/55 hover:text-primary underline underline-offset-[6px] decoration-on-surface/20"
              >
                {dict.landing.ctaPhilosophy}
              </a>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <LandingHeroVisual slides={[...heroSlides]} />
          </div>
        </section>

        <section className="seren-container seren-section">
          <div className="rounded-[2rem] bg-surface-container-low/80 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-12">
              {dict.landing.trustHeading}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
              {trust.map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-5 h-11 w-11 rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/15 grid place-items-center text-primary">
                    {item.icon}
                  </div>
                  <p className="font-headline text-[0.95rem] tracking-tight">
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="seren-container pb-20 sm:pb-28 pt-4">
          <p className="text-center text-sm font-headline tracking-tight text-on-surface mb-12">
            {dict.landing.pricingHeading}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="rounded-[2rem] bg-surface-container-lowest p-8 sm:p-10 flex flex-col border border-outline-variant/12 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface/45 mb-6">
                {dict.landing.pricingSingleTitle}
              </p>
              <p className="text-4xl sm:text-5xl font-headline tracking-tighter">Rp 49.000,-</p>
              <p className="text-on-surface-variant mt-3 leading-relaxed text-[0.95rem]">
                {dict.landing.pricingSingleDesc}
              </p>
              <a
                href={paywallHref}
                className={`${pricingCtaBase} border border-outline-variant/25 bg-surface text-on-surface hover:bg-surface-container-low`}
              >
                {dict.landing.pricingSingleCta}
              </a>
            </div>
            <div className="relative rounded-[2rem] p-8 sm:p-10 flex flex-col border border-primary/25 bg-[radial-gradient(circle_at_25%_20%,rgba(61,99,116,0.16),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(246,217,166,0.14),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.85))] shadow-[0_22px_70px_-42px_rgba(61,99,116,0.22)]">
              <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-on-primary shadow-sm">
                Recommended
              </span>
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface/45 mb-6">
                {dict.landing.pricingJourneyTitle}
              </p>
              <p className="text-4xl sm:text-5xl font-headline tracking-tighter">Rp 99.000,-</p>
              <p className="text-on-surface-variant mt-3 leading-relaxed text-[0.95rem]">
                {dict.landing.pricingJourneyDesc}
              </p>
              <a
                href={paywallHref}
                className={`${pricingCtaBase} btn-gradient border border-transparent text-on-primary hover:brightness-[1.03]`}
              >
                {dict.landing.pricingJourneyCta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

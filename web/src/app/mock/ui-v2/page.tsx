import { LanguageToggle } from "@/components/LanguageToggle";
import { getDictionary } from "@/i18n/getDictionary";
import Link from "next/link";
import Image from "next/image";
import { BrandMark } from "@/components/BrandMark";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default async function MockUiV2LandingPage() {
  const { lang, dict } = await getDictionary();
  const heroSlides = [...dict.landing.carouselSlides];

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-2xl">
        <div className="flex justify-between items-center px-5 sm:px-8 lg:px-12 py-5 sm:py-6 w-full max-w-screen-2xl mx-auto gap-6">
          <BrandMark href="/mock/ui-v2" />

          <div className="hidden md:flex items-center gap-10 font-headline tracking-tight">
            <Link
              className="text-primary border-b-2 border-primary/20 pb-1 hover:text-primary transition-colors duration-300"
              href="/mock/ui-v2"
            >
              {dict.nav.startConsultation}
            </Link>
            <Link
              className="text-on-surface/60 hover:text-primary transition-colors duration-300"
              href="/mock/ui-v2/philosophy"
            >
              {dict.nav.philosophy}
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <LanguageToggle current={lang} />
            <div className="hidden sm:flex items-center gap-4 text-primary">
              <button
                type="button"
                aria-label="Bag"
                className="hover:scale-110 transition-transform"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M7 9V7.7A5 5 0 0 1 12 3a5 5 0 0 1 5 4.7V9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 9h11l-1 11h-9l-1-11Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <Link
                href="/mock/ui-v2/profile"
                aria-label="Account"
                className="hover:scale-110 transition-transform"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M4.5 20.2a8.2 8.2 0 0 1 15 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </div>

            <Link
              href="/consult/intake"
              className="btn-gradient text-on-primary px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium tracking-wide scale-98 active:scale-95 transition-all duration-200 shadow-sm"
            >
              {dict.nav.startConsultation}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 sm:pt-32">
        <section className="px-5 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto grid grid-cols-12 gap-8 mb-32 sm:mb-40">
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.7rem] sm:text-[3.5rem] lg:text-[4.0rem] mb-8">
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
          </div>

          <div className="col-span-12 lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-surface-container shadow-inner">
              <Image
                alt="Portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApXvNkuNWsgr0dFRYWiIRtFfDRNsXn4Wl5p3BGdVj9MmoIac9qtpyJeZUp7u0EmHLOmJntWHK4zQefaBcMQUpXY_8K-aVjI_1uAllOT5Os-4HKoctU6SjJM1S4j6oVTqG4BRnGqFejKRti0LhHAsHocDlub5f85AwkX2NUH3vqC0vTwfjhBs6rsocucjIU0iKL5vZpjo4SdxNXEhiw2pbHUBHwOJt5rcwjpgzkbDvWXTy2W5w_wdVfFvEZ5v6KcH2h7XClNLWW26E"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute -bottom-8 -left-2 sm:-left-12 glass-effect bg-surface/70 p-6 sm:p-8 rounded-xl shadow-sm border border-outline-variant/10 max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  {dict.landing.trustItems[0]?.title ?? dict.landing.trustHeading}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {dict.landing.trustItems[0]?.desc ?? ""}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-24 sm:py-32">
          <div className="px-5 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="p-8 sm:p-10 bg-surface-container-lowest rounded-xl">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-6">
                    {dict.landing.trustItems[0]?.title ?? dict.landing.trustHeading}
                  </h2>
                  <p className="text-on-surface-variant mb-8 leading-relaxed">
                    {dict.landing.trustItems[0]?.desc ?? ""}
                  </p>
                  <div className="flex -space-x-4">
                    {["a", "b", "c"].map((k) => (
                      <div
                        key={k}
                        className="w-12 h-12 rounded-full border-2 border-surface bg-primary/10"
                        aria-hidden="true"
                      />
                    ))}
                    <div className="w-12 h-12 rounded-full border-2 border-surface bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container">
                      +12
                    </div>
                  </div>
                </div>

                <div className="p-8 sm:p-10 bg-tertiary-container/30 rounded-xl">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 grid place-items-center text-primary mb-4">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.2 12.2l1.8 1.8 3.8-3.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{dict.landing.trustItems[3]?.title ?? ""}</h3>
                  <p className="text-sm text-on-tertiary-container">
                    {dict.landing.trustItems[3]?.desc ?? ""}
                  </p>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden relative h-full min-h-[520px]">
                  <div className="p-8 sm:p-12">
                    <div className="flex justify-between items-start mb-10 sm:mb-12 gap-6">
                      <div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-2">
                          {dict.landing.pricingJourneyTitle}
                        </h2>
                        <p className="text-on-surface-variant">{dict.landing.pricingJourneyDesc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs uppercase tracking-tighter font-bold text-outline">
                          {dict.landing.lessNoiseEyebrow}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
                      <div className="space-y-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">
                            {dict.landing.pricingSingleTitle}
                          </span>
                          <p className="text-on-surface leading-relaxed">
                            {dict.landing.pricingSingleDesc}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">
                            {dict.landing.trustHeading}
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {dict.landing.trustItems.slice(0, 3).map((t) => (
                              <span
                                key={t.title}
                                className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs"
                              >
                                {t.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="aspect-square rounded-xl overflow-hidden shadow-sm bg-surface-container-low">
                          <Image
                            alt="Skin texture"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNfkkDYcu3R2kHjW3dozXbEw00xKJLPwtczOLPtlgKQWfGlXaV8ZPq5HYOINE53bAZIaryDN80wvDGPEjNzknbhVGWx53eXq-LLyBpnVvP4Xi5jALhmpOwt7fBW9WFJboN8MOr0zyWoi_7fYYVyKlcJeD6magplL9s1PAYGCAmZV6ahAT3WV_Tx6wazh4f61LEZxCUXjX-FBjrMsBm95iI69xQSzYoqqXRGe8JJC_pe30jpcwn349ELPyq_N5V2bV4AUpT6Qp3QOo"
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover grayscale opacity-80"
                          />
                          <div className="absolute top-4 right-4 glass-effect bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter">
                            {dict.landing.ctaStart}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-10 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32 lg:py-40 px-5 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-6">
              {dict.landing.lessNoiseEyebrow}
            </h2>
            <p className="text-on-surface-variant font-light leading-relaxed">
              {dict.landing.lessNoiseBody}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
            {heroSlides.slice(0, 3).map((s, i) => (
              <div key={s.title} className="flex flex-col gap-6">
                <span className="text-6xl sm:text-7xl font-extrabold text-surface-container tracking-tighter font-headline">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">{s.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{s.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-24 sm:pb-32 lg:pb-40 max-w-screen-2xl mx-auto">
          <div className="bg-primary rounded-[3rem] p-10 sm:p-16 lg:p-20 flex flex-col items-center text-center text-on-primary">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-10 max-w-4xl">
              {dict.landing.pricingHeading}
            </h2>
            <Link
              href="/consult/intake"
              className="bg-surface text-primary px-10 sm:px-12 py-4 sm:py-6 rounded-full text-lg sm:text-xl font-medium tracking-wide hover:scale-[1.03] transition-all duration-300 shadow-xl"
            >
              {dict.landing.ctaStart}
            </Link>
            <p className="mt-8 text-on-primary/60 text-xs sm:text-sm tracking-widest font-bold">
              {dict.landing.lessNoiseTitle}
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-on-surface/5 bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-center px-5 sm:px-8 lg:px-12 py-10 sm:py-16 w-full font-body text-sm tracking-wide max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-2 mb-8 md:mb-0">
            <div className="text-lg font-bold text-on-surface font-headline">
              Seren
            </div>
            <p className="text-on-surface/50">
              © {new Date().getFullYear()} Seren. {dict.footer.rights}
            </p>
          </div>
          <div className="flex gap-6 sm:gap-10 flex-wrap justify-center text-on-surface/50">
            <a className="hover:text-primary transition-colors duration-300" href="#">
              {dict.footer.privacy}
            </a>
            <a className="hover:text-primary transition-colors duration-300" href="#">
              {dict.footer.terms}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


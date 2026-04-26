import { LandingHeroVisual } from "@/components/LandingHeroVisual";
import { HeroCaseCarousel } from "@/components/HeroCaseCarousel";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getDictionary } from "@/i18n/getDictionary";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export default async function FinalMockLandingPage() {
  const { lang } = await getDictionary();

  const en = {
    nav: { philosophy: "Philosophy", start: "Start consultation" },
    hero: {
      eyebrow: "Clinical skin guidance, made simple",
      title1: "Understand your skin in minutes.",
      title2: "Get a dermatologist-reviewed routine you can actually follow.",
      body:
        "Upload photos, describe your concerns, and receive a clear routine reviewed by a dermatologist.",
      cta: "Start consultation",
      secondary: "Our philosophy",
    },
    trust: {
      heading: "Designed for clinical clarity",
      items: [
        { title: "Dermatologist reviewed", desc: "Every result is validated" },
        { title: "AI-assisted", desc: "Faster, structured analysis" },
        { title: "Guided input", desc: "Intake that improves accuracy" },
        { title: "Privacy-first", desc: "Encrypted medical data" },
      ],
    },
    diff: {
      eyebrow: "Less noise. More clarity.",
      title: "No trends. No guesswork.",
      body:
        "Just a clear explanation of your condition, and a routine you can follow daily.",
    },
    pricing: {
      heading: "Choose your level of care",
      once: {
        title: "Single report",
        price: "49k",
        desc: "Dermatologist-reviewed analysis and routine",
        cta: "Start consultation",
      },
      journey: {
        badge: "Recommended",
        title: "30-day skin journey",
        price: "99k",
        desc: "Ongoing guidance, evaluation, and routine adjustments",
        cta: "Start journey",
      },
    },
    carousel: {
      prev: "Prev",
      next: "Next",
      slides: [
        {
          eyebrow: "What you’ll receive",
          title: "Your skin condition",
          status: "A clear explanation of what’s happening",
          accent: "neutral",
        },
        {
          eyebrow: "What you’ll receive",
          title: "A routine you can actually follow",
          status: "Simple steps, built for consistency",
          accent: "warm",
        },
        {
          eyebrow: "What you’ll receive",
          title: "Treatment pathway",
          status: "Next steps if symptoms persist",
          accent: "cool",
        },
      ] as const,
    },
  } as const;

  const id = {
    nav: { philosophy: "Filosofi", start: "Mulai konsultasi" },
    hero: {
      eyebrow: "Panduan kulit klinis, dibuat sederhana",
      title1: "Pahami kondisi kulitmu dalam hitungan menit.",
      title2:
        "Dapatkan rutinitas yang direview dokter—dan bisa benar-benar kamu jalani.",
      body:
        "Unggah foto, jelaskan keluhanmu, lalu dapatkan rutinitas yang jelas dan direview oleh dokter kulit.",
      cta: "Mulai konsultasi",
      secondary: "Lihat filosofi",
    },
    trust: {
      heading: "Dirancang untuk kejelasan dan ketepatan",
      items: [
        {
          title: "Direview dokter kulit",
          desc: "Setiap hasil melalui validasi profesional",
        },
        { title: "Dibantu AI", desc: "Analisis lebih cepat dan terstruktur" },
        { title: "Input terpandu", desc: "Pengisian data yang membantu akurasi" },
        { title: "Privasi terjaga", desc: "Data medis terenkripsi dan aman" },
      ],
    },
    diff: {
      eyebrow: "Lebih sedikit distraksi. Lebih banyak kejelasan.",
      title: "Tanpa ikut tren. Tanpa tebak-tebakan.",
      body:
        "Hanya penjelasan yang jelas tentang kondisi kulitmu,\n dan rutinitas yang bisa kamu jalani setiap hari.",
    },
    pricing: {
      heading: "Pilih cara perawatan yang sesuai",
      once: {
        title: "Laporan sekali",
        price: "49k",
        desc: "Analisis dan rutinitas yang direview dokter kulit",
        cta: "Mulai konsultasi",
      },
      journey: {
        badge: "Recommended",
        title: "Perjalanan kulit 30 hari",
        price: "99k",
        desc:
          "Pendampingan berkelanjutan, evaluasi, dan penyesuaian rutinitas",
        cta: "Mulai perjalanan",
      },
    },
    carousel: {
      prev: "Sebelumnya",
      next: "Berikutnya",
      slides: [
        {
          eyebrow: "Yang kamu terima",
          title: "Kondisi kulitmu",
          status: "Penjelasan jelas tentang apa yang sedang terjadi",
          accent: "neutral",
        },
        {
          eyebrow: "Yang kamu terima",
          title: "Rutinitas yang bisa kamu jalani",
          status: "Langkah sederhana yang dibuat untuk konsistensi",
          accent: "warm",
        },
        {
          eyebrow: "Yang kamu terima",
          title: "Jalur perawatan",
          status: "Langkah berikutnya jika kondisi belum membaik",
          accent: "cool",
        },
      ] as const,
    },
  } as const;

  const copy = lang === "id" ? id : en;

  // Simple icons (same style as landing) — not AI-looking.
  const icons = [
    <svg key="a" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
    </svg>,
    <svg key="b" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
    </svg>,
    <svg key="c" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
    </svg>,
    <svg key="d" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
    </svg>,
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 border-b border-outline-variant/10 bg-surface/75 backdrop-blur-2xl">
        <div className="seren-container flex justify-between items-center py-5 sm:py-6 gap-4">
          <BrandMark href="/" />

          <div className="flex items-center gap-3 sm:gap-6 font-headline text-[9px] sm:text-xs uppercase tracking-[0.2em] text-on-surface/70">
            <Link href="/mock/final/philosophy" className="hover:text-primary transition-colors">
              {copy.nav.philosophy}
            </Link>
            <Link href="/consult/intake" className="hover:text-primary transition-colors">
              {copy.nav.start}
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <LanguageToggle current={lang} />
            <Link
              href="/consult/intake"
              className="btn-gradient text-on-primary px-6 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-sm"
            >
              {copy.nav.start}
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 sm:pt-28">
        <section className="seren-container seren-section grid grid-cols-12 gap-10 lg:gap-14">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-6">
              {copy.hero.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-headline tracking-[-0.02em] leading-[1.05] mb-6">
              {copy.hero.title1}
              <br />
              <span className="italic font-light text-on-surface/90">
                {copy.hero.title2}
              </span>
            </h1>
            <p className="text-on-surface-variant leading-[1.65] max-w-lg text-[0.95rem]">
              {copy.hero.body}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Link
                href="/consult/intake"
                className="btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
              >
                {copy.hero.cta}
              </Link>
              <Link
                href="/mock/final/philosophy"
                className="text-sm text-on-surface/55 hover:text-primary underline underline-offset-[6px] decoration-on-surface/20"
              >
                {copy.hero.secondary}
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <LandingHeroVisual
              slides={[...copy.carousel.slides]}
            />
            <div className="sr-only">
              <HeroCaseCarousel
                slides={[...copy.carousel.slides]}
                prevLabel={copy.carousel.prev}
                nextLabel={copy.carousel.next}
              />
            </div>
          </div>
        </section>

        <section className="seren-container seren-section">
          <div className="rounded-[2rem] bg-surface-container-low/80 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-12">
              {copy.trust.heading}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
              {copy.trust.items.map((item, i) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-5 h-11 w-11 rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant/15 grid place-items-center text-primary">
                    {icons[i]}
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

        <section className="seren-container seren-section">
          <div className="seren-card p-8 sm:p-10 lg:p-12 max-w-4xl">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
              {copy.diff.eyebrow}
            </p>
            <p className="text-2xl sm:text-[1.65rem] font-headline tracking-tight text-on-surface">
              {copy.diff.title}
            </p>
            <p className="text-on-surface-variant mt-5 max-w-xl leading-[1.65] text-[0.95rem] whitespace-pre-line">
              {copy.diff.body}
            </p>
          </div>
        </section>

        <section className="seren-container pb-20 sm:pb-28 pt-4">
          <p className="text-center text-sm font-headline tracking-tight text-on-surface mb-12">
            {copy.pricing.heading}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            <div className="rounded-[2rem] bg-surface-container-lowest p-8 sm:p-10 flex flex-col border border-outline-variant/12 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface/45 mb-6">
                {copy.pricing.once.title}
              </p>
              <p className="text-5xl font-headline tracking-tighter">
                {copy.pricing.once.price}
              </p>
              <p className="text-on-surface-variant mt-3 leading-relaxed text-[0.95rem]">
                {copy.pricing.once.desc}
              </p>
              <Link
                href="/consult/intake"
                className="mt-10 inline-flex rounded-full border border-outline-variant/25 bg-surface px-8 py-3.5 text-sm font-medium tracking-wide text-on-surface hover:bg-surface-container-low transition-colors justify-center"
              >
                {copy.pricing.once.cta}
              </Link>
            </div>

            <div className="relative rounded-[2rem] p-8 sm:p-10 flex flex-col border border-primary/25 bg-[radial-gradient(circle_at_25%_20%,rgba(61,99,116,0.16),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(246,217,166,0.14),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.85))] shadow-[0_22px_70px_-42px_rgba(61,99,116,0.22)]">
              <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-on-primary shadow-sm">
                {copy.pricing.journey.badge}
              </span>
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface/45 mb-6">
                {copy.pricing.journey.title}
              </p>
              <p className="text-5xl font-headline tracking-tighter">
                {copy.pricing.journey.price}
              </p>
              <p className="text-on-surface-variant mt-3 leading-relaxed text-[0.95rem]">
                {copy.pricing.journey.desc}
              </p>
              <Link
                href="/consult/intake"
                className="mt-10 inline-flex btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:brightness-[1.03] transition justify-center"
              >
                {copy.pricing.journey.cta}
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-on-surface/45">
            Mock route: <code>/mock/final</code> — your original pages stay unchanged.
          </p>
        </section>
      </main>
    </div>
  );
}


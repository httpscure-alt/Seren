import { LanguageToggle } from "@/components/LanguageToggle";
import { getDictionary } from "@/i18n/getDictionary";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

function firstNonEmptyLine(text: string) {
  return (
    text
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) ?? ""
  );
}

export default async function FinalMockPhilosophyPage() {
  const { lang } = await getDictionary();

  const en = {
    nav: { home: "Back to home", start: "Start consultation", philosophy: "Philosophy" },
    hero: {
      eyebrow: "Seren — philosophy",
      headline1: "Skincare shouldn’t be trial and error.",
      headline2: "It should be understood.",
      body:
        "Calm, minimal guidance for people who want clarity—without hype, noise, or guessing.",
      cta: "Start consultation",
      secondary: "Back to home",
    },
    core: {
      label: "Core message",
      title: "Understood. Guided. Personal.",
      body: "Skincare isn’t trial and error. It’s understanding, then consistency.",
    },
    blocks: [
      {
        title: "Opening",
        body: "Every skin has its own story.\nIt shouldn’t be treated the same.",
      },
      {
        title: "The problem",
        body:
          "Most people are taught to try, not understand.\n\nSwitching products. Following trends. Hoping for results.\n\nSkin rarely responds to guessing—only to consistency, context, and the right care.",
      },
      {
        title: "The belief",
        body:
          "Skincare isn’t about more products.\n\nIt’s about understanding what your skin truly needs—then supporting it with a routine you can actually follow.",
      },
      {
        title: "The shift",
        body:
          "Not trial and error—\n\nBut a routine that is guided,\nstructured,\nand evolves over time.\n\nGuidance reduces noise.\nStructure makes care sustainable.\nEvolution keeps your routine aligned with what your skin needs next.",
      },
      {
        title: "The role of Seren",
        body:
          "Seren acts as a companion.\n\nHelping you understand your skin\nand follow the right routine step-by-step—\n\nAI drafts,\ndermatologists refine,\nyou receive a plan you can live with.",
      },
      {
        title: "Closing",
        body:
          "Healthy skin is not luck.\n\nIt is the result of the right care.\n\n“I finally know what to do with my skin.”",
      },
    ],
    ctaBlock: {
      headline: "Ready for clinical clarity?",
      cta: "Start consultation",
      sub: "Guided • calm • dermatologist reviewed",
    },
  } as const;

  const id = {
    nav: { home: "Kembali ke beranda", start: "Mulai konsultasi", philosophy: "Filosofi" },
    hero: {
      eyebrow: "Seren — filosofi",
      headline1: "Skincare bukan soal coba-coba.",
      headline2: "Seharusnya dipahami.",
      body:
        "Panduan yang tenang dan jelas,\nuntuk kamu yang ingin kepastian—\ntanpa hype, tanpa distraksi, tanpa menebak.",
      cta: "Mulai konsultasi",
      secondary: "Kembali ke beranda",
    },
    core: {
      label: "Pesan inti",
      title: "Dipahami. Terpandu. Personal.",
      body: "Skincare bukan coba-coba.\nIni tentang memahami, lalu konsisten.",
    },
    blocks: [
      {
        title: "",
        body: "Setiap kulit punya ceritanya sendiri.\n\nDan tidak seharusnya diperlakukan sama.",
      },
      {
        title: "",
        body:
          "Kita sering diajarkan untuk mencoba.\nBukan memahami.\n\nGonta-ganti produk.\nMengikuti tren.\nBerharap hasil.",
      },
      {
        title: "",
        body:
          "Padahal kulit tidak merespons tebakan.\n\nYang bekerja adalah konsistensi,\nkonteks,\ndan perawatan yang tepat.",
      },
      {
        title: "",
        body:
          "Bagi kami, skincare bukan soal lebih banyak produk.\n\nIni tentang memahami apa yang benar-benar dibutuhkan kulitmu,\nlalu menjaganya dengan rutinitas yang bisa kamu jalani.",
      },
      {
        title: "",
        body:
          "Bukan coba-coba.\n\nTapi rutinitas yang terpandu,\nterstruktur,\ndan berkembang seiring waktu.",
      },
      {
        title: "",
        body:
          "Seren hadir sebagai pendamping.\n\nMembantu kamu memahami kondisi kulitmu,\ndan menjalankan perawatan yang tepat—langkah demi langkah.\n\nAI membantu menyusun,\ndokter kulit menyempurnakan,\nkamu mendapatkan rencana yang bisa kamu jalani.",
      },
      {
        title: "",
        body:
          "Karena kulit yang sehat bukan soal keberuntungan.\n\nTapi hasil dari perawatan yang tepat.",
      },
    ],
    ctaBlock: {
      cta: "Mulai konsultasi",
      sub: "",
    },
  } as const;

  const copy = lang === "id" ? id : en;

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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(246,217,166,0.18),transparent_55%),radial-gradient(circle_at_85%_20%,rgba(61,99,116,0.16),transparent_55%),radial-gradient(circle_at_60%_90%,rgba(175,179,174,0.14),transparent_55%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />

          <div className="seren-container seren-section relative">
            <div className="grid grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="col-span-12 lg:col-span-7 lg:col-start-2 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-7">
                  {copy.hero.eyebrow}
                </p>
                <h1 className="text-[2.4rem] sm:text-[3.05rem] lg:text-[3.35rem] font-headline tracking-[-0.03em] leading-[1.02]">
                  {copy.hero.headline1}
                  <br />
                  <span className="italic font-light text-on-surface/90">
                    {copy.hero.headline2}
                  </span>
                </h1>
                <p className="mt-7 text-on-surface-variant leading-[1.8] text-[1.03rem] whitespace-pre-line max-w-[56ch]">
                  {copy.hero.body}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <Link
                    href="/consult/intake"
                    className="btn-gradient text-on-primary px-9 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm text-center"
                  >
                    {copy.hero.cta}
                  </Link>
                  <Link
                    href="/mock/final"
                    className="text-sm text-on-surface/55 hover:text-primary underline underline-offset-[6px] decoration-on-surface/20 text-center sm:text-left"
                  >
                    {copy.hero.secondary}
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-3 lg:col-start-10">
                <div className="glass-effect rounded-[2.5rem] p-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                    Core line
                  </p>
                  <p className="mt-4 font-headline text-lg tracking-tight leading-[1.25]">
                    Rutinitas yang bisa kamu jalani.
                  </p>
                  <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                    {lang === "id"
                      ? "Lebih sedikit distraksi. Lebih banyak kejelasan."
                      : "Less noise. More clarity."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="seren-container pb-18 sm:pb-24 pt-2">
          <div className="seren-content">
            <div className="rounded-[2.25rem] bg-surface-container-low/70 px-7 py-10 sm:px-10 sm:py-12">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                {copy.core.label}
              </p>
              <p className="mt-3 text-2xl sm:text-[1.65rem] font-headline tracking-tight">
                {copy.core.title}
              </p>
              <p className="mt-5 text-on-surface-variant leading-[1.9] text-[1.03rem] whitespace-pre-line max-w-[58ch]">
                {copy.core.body}
              </p>
            </div>

            <div className="mt-14 sm:mt-16 space-y-14 sm:space-y-16">
              {copy.blocks.map((b) => (
                <div key={b.body} className="min-w-0">
                  <p className="text-xl sm:text-2xl font-headline tracking-tight text-on-surface leading-[1.25]">
                    {firstNonEmptyLine(b.body)}
                  </p>
                  <p className="mt-5 text-on-surface-variant leading-[2.0] text-[1.03rem] whitespace-pre-line max-w-[60ch]">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="seren-container pb-20 sm:pb-28 pt-2">
          <div className="seren-content">
            <div className="rounded-[2.25rem] bg-surface-container-low/80 px-8 py-12 sm:px-10 sm:py-14 text-center">
              {"headline" in copy.ctaBlock && copy.ctaBlock.headline ? (
                <p className="text-2xl sm:text-[1.65rem] font-headline tracking-tight">
                  {copy.ctaBlock.headline}
                </p>
              ) : null}
              <div className={"headline" in copy.ctaBlock && copy.ctaBlock.headline ? "mt-8" : ""}>
                <Link
                  href="/consult/intake"
                  className="inline-flex btn-gradient text-on-primary px-10 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm justify-center"
                >
                  {copy.ctaBlock.cta}
                </Link>
              </div>
              {copy.ctaBlock.sub ? (
                <p className="mt-6 text-xs text-on-surface/55 uppercase tracking-[0.22em]">
                  {copy.ctaBlock.sub}
                </p>
              ) : null}
              <p className="mt-8 text-[11px] text-on-surface/45">
                Mock route: <code>/mock/final/philosophy</code> — your original pages stay unchanged.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


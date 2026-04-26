import { LanguageToggle } from "@/components/LanguageToggle";
import { getDictionary } from "@/i18n/getDictionary";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

type Block = { body: string };

function firstNonEmptyLine(text: string) {
  return (
    text
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) ?? ""
  );
}

function VariantCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="seren-card p-7 sm:p-8">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
        {title}
      </p>
      <p className="mt-2 text-sm text-on-surface/60 leading-relaxed">{desc}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function PhilosophyVariantsPage() {
  const { lang } = await getDictionary();

  const en = {
    nav: { home: "Back to home", start: "Start consultation", philosophy: "Philosophy" },
    hero: {
      eyebrow: "Mock • philosophy variants",
      title: "Different structures, same copy.",
      body: "Pick the layout that feels the most calm, tidy, and “Seren”.",
    },
    cta: "Start consultation",
    blocks: [
      { body: "Every skin has its own story.\n\nAnd it shouldn’t be treated the same." },
      {
        body:
          "Most people are taught to try.\nNot to understand.\n\nSwitching products.\nFollowing trends.\nHoping for results.",
      },
      {
        body:
          "Skin doesn’t respond to guessing.\n\nWhat works is consistency,\ncontext,\nand the right care.",
      },
      {
        body:
          "For us, skincare isn’t about more products.\n\nIt’s understanding what your skin truly needs,\nthen supporting it with a routine you can actually follow.",
      },
      {
        body:
          "Not trial and error.\n\nBut a routine that is guided,\nstructured,\nand evolves over time.",
      },
      {
        body:
          "Seren is here as a companion.\n\nHelping you understand your skin,\nand follow the right care—step by step.\n\nAI helps draft,\ndermatologists refine,\nyou get a plan you can live with.",
      },
      {
        body:
          "Because healthy skin isn’t luck.\n\nIt’s the result of the right care.",
      },
    ] as const,
  } as const;

  const id = {
    nav: { home: "Kembali ke beranda", start: "Mulai konsultasi", philosophy: "Filosofi" },
    hero: {
      eyebrow: "Mock • varian filosofi",
      title: "Struktur berbeda, copy sama.",
      body: "Pilih yang paling terasa tenang, rapi, dan “Seren”.",
    },
    cta: "Mulai konsultasi",
    blocks: [
      {
        body:
          "Setiap kulit punya ceritanya sendiri.\n\nDan tidak seharusnya diperlakukan sama.",
      },
      {
        body:
          "Kita sering diajarkan untuk mencoba.\nBukan memahami.\n\nGonta-ganti produk.\nMengikuti tren.\nBerharap hasil.",
      },
      {
        body:
          "Padahal kulit tidak merespons tebakan.\n\nYang bekerja adalah konsistensi,\nkonteks,\ndan perawatan yang tepat.",
      },
      {
        body:
          "Bagi kami, skincare bukan soal lebih banyak produk.\n\nIni tentang memahami apa yang benar-benar dibutuhkan kulitmu,\nlalu menjaganya dengan rutinitas yang bisa kamu jalani.",
      },
      {
        body:
          "Bukan coba-coba.\n\nTapi rutinitas yang terpandu,\nterstruktur,\ndan berkembang seiring waktu.",
      },
      {
        body:
          "Seren hadir sebagai pendamping.\n\nMembantu kamu memahami kondisi kulitmu,\ndan menjalankan perawatan yang tepat—langkah demi langkah.\n\nAI membantu menyusun,\ndokter kulit menyempurnakan,\nkamu mendapatkan rencana yang bisa kamu jalani.",
      },
      {
        body:
          "Karena kulit yang sehat bukan soal keberuntungan.\n\nTapi hasil dari perawatan yang tepat.",
      },
    ] as const,
  } as const;

  const copy = lang === "id" ? id : en;
  const blocks: Block[] = [...copy.blocks];

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
              {copy.cta}
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 sm:pt-28">
        <section className="seren-container seren-section">
          <div className="seren-content">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-6">
              {copy.hero.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl font-headline tracking-tight">
              {copy.hero.title}
            </h1>
            <p className="mt-3 text-on-surface-variant leading-relaxed">
              {copy.hero.body}
            </p>
          </div>
        </section>

        <section className="seren-container pb-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VariantCard
              title="Option A"
              desc="Single surface + timeline rhythm. Structured, premium, very readable."
            >
              <div className="relative overflow-hidden rounded-[2rem] bg-surface-container-lowest/75 border border-outline-variant/10 shadow-[0_22px_76px_-34px_rgba(47,51,48,0.18)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(61,99,116,0.12),transparent_55%),radial-gradient(circle_at_82%_86%,rgba(246,217,166,0.10),transparent_55%)]" />
                <div className="relative p-8 sm:p-10 space-y-10">
                  {blocks.map((b, idx) => (
                    <div key={b.body} className="relative pl-10 min-w-0">
                      <span
                        className="absolute left-0 top-[0.35rem] h-2.5 w-2.5 rounded-full bg-primary/60 shadow-[0_0_0_6px_rgba(61,99,116,0.08)]"
                        aria-hidden="true"
                      />
                      {idx < blocks.length - 1 ? (
                        <span
                          className="absolute left-[5px] top-[1.2rem] bottom-[-2.25rem] w-px bg-outline-variant/20"
                          aria-hidden="true"
                        />
                      ) : null}
                      <p className="text-on-surface-variant leading-[1.8] text-[0.98rem] whitespace-pre-line">
                        {b.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </VariantCard>

            <VariantCard
              title="Option B"
              desc="Editorial blocks + soft dividers. Minimal, no ‘UI’ feel."
            >
              <div className="rounded-[2rem] bg-surface-container-lowest/70 border border-outline-variant/10 p-8 sm:p-10">
                <div className="space-y-9">
                  {blocks.map((b, idx) => (
                    <div key={b.body}>
                      <p className="text-on-surface-variant leading-[1.85] text-[0.98rem] whitespace-pre-line">
                        {b.body}
                      </p>
                      {idx < blocks.length - 1 ? (
                        <div className="mt-8 h-px bg-outline-variant/16" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </VariantCard>

            <VariantCard
              title="Option C"
              desc="Numbered chapters. Most ‘proper’ and scannable for new users."
            >
              <div className="rounded-[2rem] bg-surface-container-lowest/70 border border-outline-variant/10 p-8 sm:p-10">
                <div className="space-y-10">
                  {blocks.map((b, idx) => (
                    <div key={b.body} className="grid grid-cols-12 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <div className="h-9 w-9 rounded-full bg-surface-container-low border border-outline-variant/18 grid place-items-center text-[11px] font-headline text-on-surface/75">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="col-span-10 sm:col-span-11">
                        <p className="text-on-surface-variant leading-[1.85] text-[0.98rem] whitespace-pre-line">
                          {b.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </VariantCard>

            <VariantCard
              title="Option D"
              desc="Alternating emphasis. More emotional, slightly more designed."
            >
              <div className="rounded-[2rem] bg-surface-container-lowest/70 border border-outline-variant/10 p-8 sm:p-10">
                <div className="space-y-10">
                  {blocks.map((b, idx) => (
                    <div
                      key={b.body}
                      className={[
                        "rounded-[1.5rem] p-6 sm:p-7 border",
                        idx % 2 === 0
                          ? "bg-surface-container-low/60 border-outline-variant/14"
                          : "bg-[linear-gradient(180deg,rgba(61,99,116,0.14),rgba(61,99,116,0.06))] border-primary/18",
                      ].join(" ")}
                    >
                      <p className="text-on-surface-variant leading-[1.85] text-[0.98rem] whitespace-pre-line">
                        {b.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </VariantCard>

            <VariantCard
              title="Option E"
              desc="Large-type editorial. Most aesthetic + calm (less ‘UI’, more ‘brand page’)."
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest/75 shadow-[0_24px_90px_-40px_rgba(47,51,48,0.22)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(246,217,166,0.12),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(61,99,116,0.12),transparent_55%)]" />
                <div className="relative p-8 sm:p-12 lg:p-14">
                  <div className="space-y-12 sm:space-y-14">
                    {blocks.map((b, idx) => (
                      <div key={b.body} className="min-w-0">
                        <p className="text-xl sm:text-2xl lg:text-[1.7rem] font-headline tracking-tight text-on-surface leading-[1.25]">
                          {firstNonEmptyLine(b.body)}
                        </p>
                        <p className="mt-4 text-on-surface-variant leading-[1.95] text-[0.98rem] whitespace-pre-line max-w-[52ch]">
                          {b.body}
                        </p>
                        {idx < blocks.length - 1 ? (
                          <div className="mt-10 h-px bg-outline-variant/14" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </VariantCard>

            <VariantCard
              title="Option F"
              desc="Split layout with sticky rail (desktop). Feels ‘proper’ and designed."
            >
              <div className="rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest/75 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-outline-variant/12 bg-[linear-gradient(180deg,rgba(61,99,116,0.12),rgba(61,99,116,0.04))]">
                    <div className="p-8 sm:p-10 lg:sticky lg:top-24">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/55">
                        Seren
                      </p>
                      <p className="mt-4 text-lg font-headline tracking-tight">
                        {lang === "id"
                          ? "Filosofi, ditulis dengan tenang."
                          : "A philosophy, written calmly."}
                      </p>
                      <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                        {lang === "id"
                          ? "Baca pelan. Biarkan jelas."
                          : "Read slowly. Let it land."}
                      </p>

                      <div className="mt-7">
                        <Link
                          href="/consult/intake"
                          className="inline-flex btn-gradient text-on-primary px-7 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm"
                        >
                          {copy.cta}
                        </Link>
                      </div>

                      <div className="mt-10 rounded-[1.75rem] border border-white/20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),transparent_55%),linear-gradient(180deg,rgba(246,217,166,0.12),rgba(61,99,116,0.08))] aspect-[4/5]" />
                    </div>
                  </div>

                  <div className="lg:col-span-8 p-8 sm:p-10">
                    <div className="space-y-10 sm:space-y-12">
                      {blocks.map((b) => (
                        <div key={b.body} className="min-w-0">
                          <p className="text-on-surface-variant leading-[1.9] text-[0.98rem] whitespace-pre-line">
                            {b.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </VariantCard>
          </div>

          <div className="mt-10 seren-content text-center">
            <Link
              href="/mock/final/philosophy"
              className="text-sm text-on-surface/55 hover:text-primary underline underline-offset-[6px] decoration-on-surface/20"
            >
              Back to current mock philosophy
            </Link>
            <p className="mt-3 text-[11px] text-on-surface/45">
              Mock route: <code>/mock/final/philosophy-variants</code>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


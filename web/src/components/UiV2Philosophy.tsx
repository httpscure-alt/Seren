import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { BrandMark } from "@/components/BrandMark";
import { getDictionary } from "@/i18n/getDictionary";
import { requireRole } from "@/lib/authz";

export async function UiV2Philosophy({
  homeHref = "/",
  philosophyHref = "/philosophy",
  consultHref = "/consult/welcome",
  resultsHref = "/results",
  profileHref = "/mock/ui-v2/profile",
  physicianHref = "/physician",
}: {
  homeHref?: string;
  philosophyHref?: string;
  consultHref?: string;
  resultsHref?: string;
  profileHref?: string;
  physicianHref?: string;
}) {
  const { lang } = await getDictionary();
  const physicianSession = await requireRole(["PHYSICIAN", "ADMIN"]);

  const en = {
    nav: { start: "Start consultation", philosophy: "Philosophy" },
    hero: {
      headlineA: "Your path to",
      headlineB: "clinical precision",
      headlineC: "starts here",
      body:
        "An editorial approach to dermatology. We combine advanced diagnostics with the refined eye of human expertise to craft your bespoke skin protocol.",
    },
    bullets: [
      { title: "Takes 2–3 minutes", body: "A brief, comprehensive questionnaire about your skin." },
      { title: "Prepare clear photos", body: "Natural light helps the most accurate analysis." },
      { title: "Reviewed after AI", body: "Every automated insight is verified by a dermatologist." },
    ],
    quote: {
      top: "4 experts online now",
      body:
        "“We combine clinical data with artistic intuition to treat the person, not just the symptom.”",
      left: "Clinical board",
      right: "dr. Riris Asti Respati, SpDVE",
    },
    cta: "Start consultation",
    footer: { rights: "© Seren. All rights reserved.", privacy: "Privacy", terms: "Terms" },
  } as const;

  const id = {
    nav: { start: "Mulai konsultasi", philosophy: "Filosofi" },
    hero: {
      headlineA: "Jalanmu menuju",
      headlineB: "ketepatan klinis",
      headlineC: "dimulai di sini",
      body:
        "Pendekatan editorial untuk dermatologi. Kami memadukan diagnostik modern dengan ketelitian dokter untuk menyusun protokol perawatan yang personal.",
    },
    bullets: [
      { title: "2–3 menit", body: "Kuesioner singkat namun menyeluruh tentang kulitmu." },
      { title: "Siapkan foto jelas", body: "Cahaya natural membantu akurasi analisis." },
      { title: "Direview dokter", body: "Setiap insight dari AI tetap divalidasi dokter kulit." },
    ],
    quote: {
      top: "4 dokter online sekarang",
      body:
        "“Data klinis + intuisi yang terlatih—untuk merawat orangnya, bukan hanya gejalanya.”",
      left: "Dewan klinis",
      right: "dr. Riris Asti Respati, SpDVE",
    },
    cta: "Mulai konsultasi",
    footer: { rights: "© Seren. Semua hak dilindungi.", privacy: "Privasi", terms: "Ketentuan" },
  } as const;

  const copy = lang === "id" ? id : en;

  const BulletIcon = ({ kind }: { kind: "time" | "photo" | "shield" }) => {
    const common =
      "h-9 w-9 rounded-2xl bg-surface/70 backdrop-blur-xl grid place-items-center";
    if (kind === "time")
      return (
        <div className={common} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary">
            <path
              d="M12 7v5l3 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
        </div>
      );
    if (kind === "photo")
      return (
        <div className={common} aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary">
            <path
              d="M7 7h10v10H7z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M9 7l1-2h4l1 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M9 14l2-2 2 2 2-1 2 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    return (
      <div className={common} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary">
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
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-surface/70 backdrop-blur-2xl">
        <div className="seren-container py-5 flex items-center justify-between gap-4">
          <BrandMark href={homeHref} />
          <nav className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.18em] uppercase text-on-surface/60">
            <Link href={consultHref} className="hover:text-primary transition-colors">
              Consultation
            </Link>
            <Link href={resultsHref} className="hover:text-primary transition-colors">
              Results
            </Link>
            <Link href={philosophyHref} className="hover:text-primary transition-colors">
              {copy.nav.philosophy}
            </Link>
            {physicianSession ? (
              <Link href={physicianHref} className="hover:text-primary transition-colors">
                Physician portal
              </Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <LanguageToggle current={lang} />
            <Link
              href={profileHref}
              aria-label="Profile"
              className="hidden sm:inline-flex text-primary hover:scale-110 transition-transform"
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
            <Link
              href={consultHref}
              className="rounded-full bg-primary text-on-primary px-5 py-2.5 text-sm font-medium tracking-wide shadow-sm"
            >
              {copy.nav.start}
            </Link>
          </div>
        </div>
      </header>

      <main className="seren-container pt-10 sm:pt-14 pb-16 sm:pb-20">
        <div className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="col-span-12 lg:col-span-6">
            <h1 className="mt-8 font-headline tracking-[-0.03em] leading-[0.95] text-[2.7rem] sm:text-[3.5rem] lg:text-[4.0rem]">
              {copy.hero.headlineA}
              <br />
              <span className="italic font-light">{copy.hero.headlineB}</span>
              <br />
              {copy.hero.headlineC}
            </h1>

            <p className="mt-7 text-on-surface-variant leading-[1.75] max-w-[56ch]">
              {copy.hero.body}
            </p>

            <div className="mt-10 space-y-4">
              {copy.bullets.map((b, i) => (
                <div
                  key={b.title}
                  className="rounded-3xl bg-surface-container-low/60 px-6 py-5 flex items-start gap-4"
                >
                  <BulletIcon kind={i === 0 ? "time" : i === 1 ? "photo" : "shield"} />
                  <div className="min-w-0">
                    <p className="font-headline tracking-tight text-sm">{b.title}</p>
                    <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href={consultHref}
                className="inline-flex items-center justify-between gap-4 rounded-full bg-primary text-on-primary px-8 py-4 text-sm font-medium tracking-wide shadow-sm w-[min(360px,100%)]"
              >
                <span>{copy.cta}</span>
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="relative rounded-[2.75rem] overflow-hidden bg-surface-container-lowest shadow-[0_30px_100px_-60px_rgba(47,51,48,0.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(246,217,166,0.24),transparent_55%),radial-gradient(circle_at_75%_45%,rgba(61,99,116,0.18),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02))]" />
              <div className="relative aspect-[4/3] sm:aspect-[16/11]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(0,0,0,0.06),transparent_55%),linear-gradient(135deg,rgba(0,0,0,0.06),rgba(255,255,255,0.02))]" />

                <div className="absolute left-7 bottom-7 w-[min(380px,calc(100%-3.5rem))] rounded-3xl bg-surface/70 backdrop-blur-2xl border border-outline-variant/15 shadow-[0_26px_80px_-44px_rgba(47,51,48,0.45)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="h-7 w-7 rounded-full bg-primary/12 border border-outline-variant/10" />
                      <div className="h-7 w-7 rounded-full bg-primary/10 border border-outline-variant/10" />
                      <div className="h-7 w-7 rounded-full bg-primary/8 border border-outline-variant/10" />
                    </div>
                    <p className="text-xs text-on-surface/60">{copy.quote.top}</p>
                  </div>
                  <p className="mt-5 text-sm text-on-surface leading-relaxed">
                    {copy.quote.body}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    <span>{copy.quote.left}</span>
                    <span>{copy.quote.right}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="seren-container py-10 text-xs text-on-surface/55 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p>{copy.footer.rights}</p>
        <div className="flex items-center gap-5">
          <Link className="hover:text-primary transition-colors" href="/privacy">
            {copy.footer.privacy}
          </Link>
          <Link className="hover:text-primary transition-colors" href="/terms">
            {copy.footer.terms}
          </Link>
        </div>
      </footer>
    </div>
  );
}


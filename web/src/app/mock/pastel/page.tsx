import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { getDictionary } from "@/i18n/getDictionary";

function PastelIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function PastelLandingMockPage() {
  const { dict } = await getDictionary();

  // One consistent pastel palette (reused everywhere on this mock page).
  const palette = {
    sage: "rgba(205, 232, 218, 0.85)", // soft green
    blush: "rgba(248, 215, 223, 0.85)", // soft pink
    butter: "rgba(249, 232, 179, 0.85)", // soft yellow
    sky: "rgba(211, 226, 247, 0.85)", // soft blue
    ink: "#2f3330",
  } as const;

  const trust = [
    {
      title: dict.landing.trustItems[0].title,
      desc: dict.landing.trustItems[0].desc,
      icon: <PastelIcon path="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z" />,
      tint: "",
    },
    {
      title: dict.landing.trustItems[1].title,
      desc: dict.landing.trustItems[1].desc,
      icon: <PastelIcon path="M9 4v2M15 4v2M9 18v2M15 18v2M4 9h2M4 15h2M18 9h2M18 15h2M8 8h8v8H8z" />,
      tint: "",
    },
    {
      title: dict.landing.trustItems[2].title,
      desc: dict.landing.trustItems[2].desc,
      icon: <PastelIcon path="M8.5 3h7l2 2v14.5a2.5 2.5 0 0 1-2.5 2.5h-6A4 4 0 0 1 5 18V6.5A3.5 3.5 0 0 1 8.5 3Z M8 9h8M8 12h6M8 15h7" />,
      tint: "",
    },
    {
      title: dict.landing.trustItems[3].title,
      desc: dict.landing.trustItems[3].desc,
      icon: <PastelIcon path="M7.5 11V8.8A4.5 4.5 0 0 1 12 4.3a4.5 4.5 0 0 1 4.5 4.5V11 M6.5 11h11v9.5h-11z M12 15.2v2.6" />,
      tint: "",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="pt-24 sm:pt-28">
        {/* Pastel wash */}
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[520px] sm:h-[640px]"
          style={{
            background:
              `radial-gradient(circle_at_10%_20%, ${palette.sage}, transparent 55%),` +
              `radial-gradient(circle_at_80%_10%, ${palette.butter}, transparent 55%),` +
              `radial-gradient(circle_at_55%_65%, ${palette.sky}, transparent 60%),` +
              `radial-gradient(circle_at_35%_80%, ${palette.blush}, transparent 60%),` +
              "linear-gradient(180deg, rgba(250,249,246,1), rgba(250,249,246,0.70))",
          }}
        />

        {/* Hero */}
        <section className="seren-container seren-section grid grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-6">
              {dict.landing.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-headline tracking-[-0.02em] leading-[1.05] mb-6">
              Clinical skin clarity.
              <br />
              <span className="italic font-light text-on-surface/80">
                Reviewed by a dermatologist.
              </span>
            </h1>
            <p className="text-on-surface-variant leading-[1.65] max-w-lg text-[0.95rem]">
              Upload photos and concerns. Get an AI-assisted draft, refined by a dermatologist, with
              a routine that feels realistic for daily life.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <a
                href="/consult/intake"
                className="rounded-full px-8 py-3.5 text-sm font-medium tracking-wide shadow-sm text-center border border-outline-variant/12 hover:brightness-[1.02] transition"
                style={{
                  color: palette.ink,
                  background: `linear-gradient(180deg, ${palette.sage}, rgba(205,232,218,0.55))`,
                }}
              >
                {dict.landing.ctaStart}
              </a>
              <a
                href="/philosophy"
                className="text-sm text-on-surface/55 hover:text-on-surface underline underline-offset-[6px] decoration-on-surface/20"
              >
                {dict.landing.ctaPhilosophy}
              </a>
              <Link
                href="/auth"
                className="text-sm text-on-surface/55 hover:text-on-surface underline underline-offset-[6px] decoration-on-surface/20"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="rounded-[2.5rem] overflow-hidden border border-outline-variant/12 bg-surface-container-lowest shadow-[0_30px_100px_-70px_rgba(47,51,48,0.28)]">
              <div className="relative aspect-square">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      `radial-gradient(circle_at_20%_20%, ${palette.butter}, transparent 55%),` +
                      `radial-gradient(circle_at_75%_25%, ${palette.sky}, transparent 60%),` +
                      `radial-gradient(circle_at_45%_78%, ${palette.sage}, transparent 60%),` +
                      `radial-gradient(circle_at_70%_80%, ${palette.blush}, transparent 62%)`,
                  }}
                />
                <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#2f3330_0.55px,transparent_0.55px)] [background-size:14px_14px]" />

                <div className="absolute left-6 right-6 bottom-6 rounded-[2rem] bg-surface/70 backdrop-blur-2xl border border-outline-variant/12 p-6 shadow-[0_26px_80px_-55px_rgba(47,51,48,0.45)]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    Case preview
                  </p>
                  <p className="mt-3 text-lg font-headline tracking-tight">
                    Barrier stress + congestion
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                    A gentle 7‑day reset, then one active introduced slowly.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    {[
                      { k: "Clarity", v: "7.8" },
                      { k: "Barrier", v: "6.4" },
                      { k: "Inflamm.", v: "4.9" },
                    ].map((m) => (
                      <div
                        key={m.k}
                        className="rounded-2xl bg-surface-container-lowest border border-outline-variant/10 px-3 py-3"
                      >
                        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                          {m.k}
                        </p>
                        <p className="mt-2 text-base font-headline tracking-tight text-on-surface">
                          {m.v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="seren-container seren-section pt-0">
          <div className="rounded-[2.25rem] bg-surface/60 backdrop-blur border border-outline-variant/10 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-12">
              {dict.landing.trustHeading}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
              {trust.map((item) => (
                <div key={item.title} className="text-center">
                  <div
                    className={[
                      "mx-auto mb-5 h-11 w-11 rounded-full shadow-sm border border-outline-variant/15 grid place-items-center",
                    ].join(" ")}
                    style={{
                      background:
                        item.title === dict.landing.trustItems[0].title
                          ? palette.sage
                          : item.title === dict.landing.trustItems[1].title
                            ? palette.sky
                            : item.title === dict.landing.trustItems[2].title
                              ? palette.butter
                              : palette.blush,
                      color: palette.ink,
                    }}
                  >
                    {item.icon}
                  </div>
                  <p className="font-headline text-[0.95rem] tracking-tight">{item.title}</p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Less noise */}
        <section className="seren-container seren-section pt-0">
          <div className="rounded-[2.25rem] border border-outline-variant/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.82))] shadow-[0_18px_60px_-44px_rgba(47,51,48,0.18)] p-8 sm:p-10 lg:p-12">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-4">
              {dict.landing.lessNoiseEyebrow}
            </p>
            <p className="text-2xl sm:text-[1.65rem] font-headline tracking-tight text-on-surface">
              {dict.landing.lessNoiseTitle}
            </p>
            <p className="text-on-surface-variant mt-5 max-w-xl leading-[1.65] text-[0.95rem]">
              {dict.landing.lessNoiseBody}
            </p>
          </div>
        </section>

        {/* Pricing preview (kept, but pastel) */}
        <section className="seren-container pb-20 sm:pb-28 pt-4">
          <p className="text-center text-sm font-headline tracking-tight text-on-surface mb-12">
            {dict.landing.pricingHeading}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="rounded-[2rem] bg-surface-container-lowest p-8 sm:p-10 flex flex-col border border-outline-variant/12 shadow-[0_18px_60px_-44px_rgba(47,51,48,0.14)]">
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface/45 mb-6">
                {dict.landing.pricingSingleTitle}
              </p>
              <p className="text-5xl font-headline tracking-tighter">49k</p>
              <p className="text-on-surface-variant mt-3 leading-relaxed text-[0.95rem]">
                {dict.landing.pricingSingleDesc}
              </p>
              <a
                href="/consult/intake"
                className="mt-10 inline-flex rounded-full border border-outline-variant/25 bg-surface px-8 py-3.5 text-sm font-medium tracking-wide text-on-surface hover:bg-surface-container-low transition-colors justify-center"
              >
                {dict.landing.pricingSingleCta}
              </a>
            </div>
            <div className="relative rounded-[2rem] p-8 sm:p-10 flex flex-col border border-outline-variant/12 bg-[radial-gradient(circle_at_25%_20%,rgba(191,219,254,0.45),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(253,230,196,0.4),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.86))] shadow-[0_22px_70px_-42px_rgba(61,99,116,0.18)]">
              <span
                className="absolute -top-3 left-8 inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] border border-outline-variant/12 shadow-sm"
                style={{ background: palette.blush, color: palette.ink }}
              >
                Recommended
              </span>
              <p className="text-xs uppercase tracking-[0.22em] text-on-surface/45 mb-6">
                {dict.landing.pricingJourneyTitle}
              </p>
              <p className="text-5xl font-headline tracking-tighter">99k</p>
              <p className="text-on-surface-variant mt-3 leading-relaxed text-[0.95rem]">
                {dict.landing.pricingJourneyDesc}
              </p>
              <a
                href="/consult/intake"
                className="mt-10 inline-flex rounded-full px-8 py-3.5 text-sm font-medium tracking-wide shadow-sm text-center border border-outline-variant/12 hover:brightness-[1.02] transition justify-center"
                style={{
                  color: palette.ink,
                  background: `linear-gradient(180deg, ${palette.sky}, rgba(211,226,247,0.55))`,
                }}
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


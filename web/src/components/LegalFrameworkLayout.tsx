import Link from "next/link";

export type LegalFeature = {
  icon: "lock" | "eye";
  title: string;
  body: string;
};

export type LegalBlock =
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "callout"; title: string; body: string }
  | { type: "features"; left: LegalFeature; right: LegalFeature }
  | { type: "quote"; body: string; attribution: string };

export type LegalFrameworkSection = {
  id: string;
  navLabel: string;
  number: string;
  name: string;
  blocks: ReadonlyArray<LegalBlock>;
  /** Show full-width banner immediately after this section */
  bannerAfter?: boolean;
};

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
      <path
        d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FeatureIcon({ kind }: { kind: "lock" | "eye" }) {
  return (
    <div className="h-10 w-10 rounded-2xl bg-surface-container-low border border-outline-variant/10 grid place-items-center">
      {kind === "lock" ? <LockIcon /> : <EyeIcon />}
    </div>
  );
}

function LegalBanner({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(61,99,116,0.35),transparent_65%),linear-gradient(180deg,rgba(61,99,116,0.12),rgba(47,51,48,0.06))]" />
      <div className="relative px-6 py-14 sm:py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/70 mb-4">
          {line1}
        </p>
        <p className="font-headline text-xl sm:text-2xl tracking-tight text-on-surface max-w-xl mx-auto leading-snug">
          {line2}
        </p>
        <div className="mt-8 flex justify-center gap-6 opacity-60">
          <span className="h-8 w-8 rounded-full border border-outline-variant/20 grid place-items-center text-[10px]">
            ◎
          </span>
          <span className="h-8 w-8 rounded-full border border-outline-variant/20 grid place-items-center text-[10px]">
            ◇
          </span>
          <span className="h-8 w-8 rounded-full border border-outline-variant/20 grid place-items-center text-[10px]">
            ✦
          </span>
        </div>
      </div>
    </div>
  );
}

export function LegalFrameworkLayout({
  frameworkLabel,
  pageTitle,
  updated,
  intro,
  sections,
  banner,
  ctaTitle,
  ctaLinkText,
  ctaHref,
  disclaimer,
  navHrefForSectionId,
}: {
  frameworkLabel: string;
  pageTitle: string;
  updated: string;
  intro: string;
  sections: ReadonlyArray<LegalFrameworkSection>;
  banner: { line1: string; line2: string };
  ctaTitle: string;
  ctaLinkText: string;
  ctaHref: string;
  disclaimer: string;
  /** PSP-friendly paths (e.g. `/terms/payments`). Default: in-page `#id` anchors. */
  navHrefForSectionId?: (sectionId: string) => string;
}) {
  return (
    <main className="pt-24 sm:pt-28 pb-20 sm:pb-28 overflow-x-hidden bg-surface">
      {/* Hero — reference: LEGAL FRAMEWORK + lowercase thin title */}
      <div id="top" className="seren-container">
        <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-6">
          {frameworkLabel}
        </p>
        <h1 className="font-headline font-extralight tracking-[-0.02em] text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] leading-[1.05] text-on-surface lowercase">
          {pageTitle}
        </h1>
        <p className="mt-5 text-xs text-on-surface/40 tracking-wide">{updated}</p>
        <p className="mt-8 max-w-[62ch] text-[0.95rem] sm:text-base text-on-surface-variant leading-[1.75]">
          {intro}
        </p>
      </div>

      <div className="seren-container mt-14 sm:mt-18">
        <div className="grid grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left sidebar — lowercase nav */}
          <aside className="col-span-12 lg:col-span-3">
            <nav className="lg:sticky lg:top-28 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={navHrefForSectionId ? navHrefForSectionId(s.id) : `#${s.id}`}
                  className="block py-2 text-sm text-on-surface/55 hover:text-primary transition-colors tracking-tight border-b border-transparent hover:border-primary/20"
                >
                  {s.navLabel}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main column */}
          <div className="col-span-12 lg:col-span-9 space-y-16 sm:space-y-20">
            {sections.map((s) => (
              <div key={s.id}>
                <section id={s.id} className="scroll-mt-28">
                  <h2 className="text-sm sm:text-base font-headline font-light text-on-surface tracking-tight">
                    <span className="text-on-surface/35 mr-2">..</span>
                    <span className="text-on-surface/50 mr-3 tabular-nums">{s.number}</span>
                    {s.name}
                  </h2>

                  <div className="mt-8 space-y-8">
                    {s.blocks.map((b, i) => {
                      if (b.type === "paragraphs") {
                        return (
                          <div key={i} className="space-y-4">
                            {b.paragraphs.map((p, j) => (
                              <p
                                key={j}
                                className="text-[0.95rem] text-on-surface-variant leading-[1.8] max-w-[62ch]"
                              >
                                {p}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      if (b.type === "callout") {
                        return (
                          <div
                            key={i}
                            className="rounded-2xl bg-surface-container-low border border-outline-variant/10 px-6 py-6 sm:px-8 sm:py-7"
                          >
                            <p className="text-[11px] uppercase tracking-[0.2em] text-on-surface/45 mb-3 lowercase">
                              {b.title}
                            </p>
                            <p className="text-sm text-on-surface-variant leading-[1.75]">
                              {b.body}
                            </p>
                          </div>
                        );
                      }
                      if (b.type === "features") {
                        return (
                          <div
                            key={i}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
                          >
                            <div className="rounded-2xl bg-surface-container-low/80 border border-outline-variant/10 p-6 sm:p-7">
                              <FeatureIcon kind={b.left.icon} />
                              <p className="mt-4 font-headline text-sm text-on-surface lowercase">
                                {b.left.title}
                              </p>
                              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                                {b.left.body}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-surface-container-low/80 border border-outline-variant/10 p-6 sm:p-7">
                              <FeatureIcon kind={b.right.icon} />
                              <p className="mt-4 font-headline text-sm text-on-surface lowercase">
                                {b.right.title}
                              </p>
                              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                                {b.right.body}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      if (b.type === "quote") {
                        return (
                          <div
                            key={i}
                            className="rounded-2xl bg-surface-container-low border border-outline-variant/10 px-6 py-8 sm:px-10 sm:py-9"
                          >
                            <p className="text-sm sm:text-base text-on-surface/80 leading-[1.75] italic">
                              “{b.body}”
                            </p>
                            <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                              {b.attribution}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </section>

                {s.bannerAfter ? (
                  <div className="mt-16 sm:mt-20">
                    <LegalBanner line1={banner.line1} line2={banner.line2} />
                  </div>
                ) : null}
              </div>
            ))}

            {/* CTA — reference: questions on our standards? */}
            <div className="pt-8 text-center max-w-lg mx-auto">
              <p className="font-headline text-2xl sm:text-3xl font-light text-on-surface tracking-tight">
                {ctaTitle}
              </p>
              <Link
                href={ctaHref}
                className="mt-6 inline-block text-sm text-on-surface/60 underline underline-offset-[6px] hover:text-primary transition-colors lowercase"
              >
                {ctaLinkText}
              </Link>
            </div>

            <p className="text-xs text-on-surface/40 leading-relaxed max-w-[62ch] mx-auto text-center">
              {disclaimer}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

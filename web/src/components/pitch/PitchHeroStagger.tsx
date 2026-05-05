import type { ReactNode } from "react";

/**
 * Pitch hero typography — static markup only (no Framer).
 * Motion variants with `initial="hidden"` were leaving the entire hero at opacity 0 in production.
 */
export function PitchHeroStagger({
  eyebrow,
  title,
  tagline,
  sentenceCaseTitle,
  sentenceCaseEyebrow,
  sentenceCaseTagline,
  richBackdrop,
  children,
}: {
  eyebrow?: string;
  title: string;
  tagline?: string;
  sentenceCaseTitle?: boolean;
  sentenceCaseEyebrow?: boolean;
  sentenceCaseTagline?: boolean;
  richBackdrop?: boolean;
  children?: ReactNode;
}) {
  const showEyebrow = Boolean(eyebrow?.trim());
  const richGradientTitle = Boolean(richBackdrop && sentenceCaseTitle);

  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl">
      <HeroStatic
        eyebrow={eyebrow}
        showEyebrow={showEyebrow}
        title={title}
        tagline={tagline}
        sentenceCaseTitle={sentenceCaseTitle}
        sentenceCaseEyebrow={sentenceCaseEyebrow}
        sentenceCaseTagline={sentenceCaseTagline}
        richBackdrop={richBackdrop}
        richGradientTitle={richGradientTitle}
        childrenSlot={children}
      />
    </div>
  );
}

function HeroStatic({
  eyebrow,
  showEyebrow,
  title,
  tagline,
  sentenceCaseTitle,
  sentenceCaseEyebrow,
  sentenceCaseTagline,
  richBackdrop,
  richGradientTitle,
  childrenSlot,
}: {
  eyebrow?: string;
  showEyebrow: boolean;
  title: string;
  tagline?: string;
  sentenceCaseTitle?: boolean;
  sentenceCaseEyebrow?: boolean;
  sentenceCaseTagline?: boolean;
  richBackdrop?: boolean;
  richGradientTitle: boolean;
  childrenSlot?: ReactNode;
}) {
  const titleClass = richGradientTitle
    ? "mb-4 bg-gradient-to-br from-[#1f3a45] via-[#2d4f5d] to-[#3d6374] bg-clip-text font-headline text-4xl font-normal tracking-tight text-transparent md:mb-5 md:text-5xl lg:text-6xl"
    : `mb-4 font-headline text-3xl font-light tracking-tight text-on-surface md:text-5xl ${
        sentenceCaseTitle ? "normal-case" : "lowercase"
      }`;

  const ruleClass = richBackdrop ? "bg-primary/45" : "bg-primary/22";

  return (
    <>
      {/* Wordmark → rule → eyebrow; narrow column so eyebrow lines up with “seren” (not full-bleed). */}
      <div className="mb-8 flex justify-center opacity-[0.88]">
        <div className="flex w-max max-w-full flex-col items-center text-center">
          <span
            className={`font-headline text-5xl font-light tracking-tighter lowercase sm:text-7xl md:text-8xl ${
              richBackdrop ? "text-[#2d4f5d]" : "text-primary"
            }`}
          >
            seren
          </span>
          <div className={`mx-auto mt-4 h-1 w-36 shrink-0 rounded-full sm:w-40 ${ruleClass}`} aria-hidden />
          {showEyebrow ? (
            <span
              className={
                sentenceCaseEyebrow
                  ? "mt-4 max-w-prose px-1 text-pretty font-headline text-xs font-semibold tracking-[0.16em] text-primary normal-case md:text-sm"
                  : "mt-4 max-w-prose px-1 text-pretty font-headline text-xs font-medium tracking-[0.2em] text-primary uppercase"
              }
            >
              {eyebrow}
            </span>
          ) : null}
        </div>
      </div>
      <h1 className={titleClass}>{title}</h1>
      {tagline ? (
        <p
          className={
            sentenceCaseTagline
              ? "mx-auto max-w-2xl text-pretty px-2 font-headline text-sm font-normal leading-relaxed tracking-normal text-on-surface md:text-base"
              : "mx-auto max-w-2xl text-pretty px-2 font-headline text-base font-medium leading-snug tracking-wide text-primary uppercase opacity-[0.72] md:text-lg"
          }
        >
          {tagline}
        </p>
      ) : null}
      {childrenSlot ? <div className="mt-12 flex flex-wrap justify-center gap-4 md:mt-16">{childrenSlot}</div> : null}
    </>
  );
}

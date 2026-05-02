import type { ReactNode } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { PitchNav } from "./PitchNav";
import { PitchReveal } from "./PitchReveal";
import { PitchHeroStagger } from "./PitchHeroStagger";

export function PitchChrome({ query, children }: { query: string; children: ReactNode }) {
  return (
    <div className="pitch-deck-root relative min-h-[100dvh] overflow-x-hidden bg-background font-body text-on-surface antialiased">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 top-40 h-[26rem] w-[26rem] rounded-full bg-primary-container/22 blur-[100px] md:h-[32rem] md:w-[32rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-20 h-[18rem] w-[18rem] rounded-full bg-tertiary-container/28 blur-[88px] md:h-[22rem] md:w-[22rem]"
      />

      <header className="pitch-glass-header fixed top-0 right-0 left-0 z-50 border-b border-outline-variant/10">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center px-6 pt-8 pb-6">
          <Link
            href={`/pitch${query}`}
            className="font-headline text-3xl font-light tracking-[0.25em] text-[#3A3F42] uppercase"
          >
            seren
          </Link>
          <p className="mt-2 max-w-md text-center font-headline text-[10px] font-medium leading-relaxed tracking-[0.18em] text-on-surface-variant uppercase sm:text-[11px] sm:tracking-[0.2em]">
            confidential materials · not for redistribution
          </p>
          <div className="mt-6 w-full max-w-xl">
            <Suspense
              fallback={
                <div className="flex justify-center gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-3 w-14 animate-pulse rounded-full bg-surface-container-high/90" />
                  ))}
                </div>
              }
            >
              <PitchNav query={query} />
            </Suspense>
          </div>
        </div>
      </header>

      <div className="pt-[10.5rem] sm:pt-[11rem]">{children}</div>
    </div>
  );
}

/** Hero band — same rhythm as the visual deck cover. */
export function PitchDeckHero({
  eyebrow,
  title,
  tagline,
  compact,
  children,
}: {
  eyebrow: string;
  title: string;
  tagline?: string;
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden px-6 text-center ${
        compact ? "min-h-[42vh] py-16 md:min-h-[46vh] md:py-20" : "min-h-[70vh] py-20 md:min-h-[76vh] md:py-24"
      }`}
    >
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-primary-container/22 blur-[100px]" />
      <div className="pointer-events-none absolute top-36 -left-28 h-72 w-72 rounded-full bg-tertiary-container/22 blur-[88px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/12 blur-[120px]" />

      <PitchHeroStagger eyebrow={eyebrow} title={title} tagline={tagline}>
        {children}
      </PitchHeroStagger>
    </section>
  );
}

const sectionTones = {
  canvas: "bg-transparent",
  muted: "bg-surface-container-low",
  mist: "bg-primary-container/10",
  white: "bg-surface-container-lowest",
  /** Deck execution / KPI sections */
  bright: "bg-white",
  /** Rich jewel band for beauty / brand story */
  jewel:
    "bg-gradient-to-br from-tertiary-container/35 via-primary-container/25 to-[#fcd9a9]/60",
} as const;

export function PitchDeckSection({
  tone = "canvas",
  children,
  motion = true,
}: {
  tone?: keyof typeof sectionTones;
  children: ReactNode;
  /** Scroll reveal; set false for nested or fixed-height canvases where motion feels redundant */
  motion?: boolean;
}) {
  const inner = <div className="mx-auto max-w-screen-xl px-6">{children}</div>;

  return (
    <section className={`${sectionTones[tone]} py-24 md:py-32`}>
      {motion ? <PitchReveal>{inner}</PitchReveal> : inner}
    </section>
  );
}

/** Section title block — matches deck section headers. */
export function PitchDeckSubhead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-8 max-w-4xl md:mb-10">
      <span className="mb-4 block font-headline text-xs font-medium tracking-[0.2em] text-primary uppercase">
        {eyebrow}
      </span>
      <h2 className="font-headline text-3xl font-light leading-[1.12] tracking-tight text-on-surface lowercase md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </header>
  );
}

const deckPrimaryBtn =
  "pitch-primary-gradient pitch-editorial-shadow rounded-xl px-7 py-3.5 font-headline text-sm font-medium lowercase tracking-wide text-on-primary transition hover:opacity-90 sm:px-8 sm:py-4";
const deckGhostBtn =
  "rounded-xl border border-outline-variant/25 bg-surface-container-lowest/90 px-7 py-3.5 font-headline text-sm font-medium lowercase tracking-wide text-on-secondary-container shadow-sm transition hover:border-primary/25 hover:bg-surface-container-high/80 sm:px-8 sm:py-4";

export function PitchDeckQuickLinks({ query }: { query: string }) {
  return (
    <>
      <Link href={`/pitch/vc${query}`} className={deckPrimaryBtn}>
        vc memo
      </Link>
      <Link href={`/pitch/clinic${query}`} className={deckGhostBtn}>
        clinics
      </Link>
      <Link href={`/pitch/brand${query}`} className={deckGhostBtn}>
        brands
      </Link>
    </>
  );
}

export function PitchIcon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`pitch-material-symbols text-primary ${className}`}>{name}</span>;
}

export function pitchDeckLinkClass() {
  return "font-headline text-[10px] uppercase tracking-[0.2em] text-primary underline-offset-[6px] transition hover:underline sm:text-[11px]";
}

export function PitchEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 block font-headline text-xs font-medium tracking-[0.2em] text-primary uppercase">
      {children}
    </span>
  );
}

export function PitchH1({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={`font-headline text-3xl font-light tracking-tight text-on-surface lowercase md:text-4xl ${className}`}
    >
      {children}
    </h1>
  );
}

/** Inline section title when you do not need the full deck subhead block. */
export function PitchH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 mt-4 font-headline text-2xl font-light tracking-tight text-on-surface lowercase md:text-3xl">
      {children}
    </h2>
  );
}

export function PitchProse({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-6 font-body text-base leading-[1.75] text-on-surface-variant md:text-lg md:leading-[1.8] [&_strong]:font-medium [&_strong]:text-on-surface">
      {children}
    </div>
  );
}

export function PitchCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`pitch-editorial-shadow rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 sm:p-10 ${className}`}
    >
      {children}
    </div>
  );
}

export function PitchTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="pitch-editorial-shadow overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] text-left text-sm text-on-surface-variant">
          <thead>
            <tr className="border-b border-outline-variant/15 bg-surface-container-low/80">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 font-headline text-[10px] font-medium uppercase tracking-[0.18em] text-primary sm:text-[11px] sm:tracking-[0.2em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-outline-variant/10 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-4 align-top font-body text-[0.9375rem] leading-relaxed">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PitchTimeline({
  items,
}: {
  items: { phase: string; title: string; detail: string }[];
}) {
  return (
    <ul className="max-w-3xl space-y-12">
      {items.map((it, idx) => (
        <li key={it.phase} className="grid grid-cols-[auto_1fr] gap-5 sm:gap-6">
          <div className="flex flex-col items-center pt-1">
            <span className="h-3 w-3 shrink-0 rounded-full border-2 border-primary/45 bg-surface-container-lowest shadow-sm" />
            {idx < items.length - 1 ? (
              <span className="mt-2 w-px flex-1 min-h-[2.5rem] bg-gradient-to-b from-primary/25 to-primary/5" />
            ) : null}
          </div>
          <div>
            <span className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary">{it.phase}</span>
            <p className="mt-2 font-headline text-xl font-light lowercase tracking-tight text-on-surface md:text-2xl">
              {it.title}
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant md:text-base">{it.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

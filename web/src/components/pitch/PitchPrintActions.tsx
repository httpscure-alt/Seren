"use client";

import Link from "next/link";

export function PitchPrintActions({ interactiveHref }: { interactiveHref: string }) {
  return (
    <div className="pitch-pdf-actions mb-6 flex flex-col gap-3 border-b border-outline-variant/20 pb-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div>
        <p className="font-headline text-xs font-medium uppercase tracking-[0.2em] text-primary">pdf export</p>
        <p className="mt-1 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
          Use <strong className="text-on-surface">Print → Save as PDF</strong>. Match the memo on screen:{" "}
          <strong className="text-on-surface">A4</strong>, <strong className="text-on-surface">100% scale</strong>,{" "}
          <strong className="text-on-surface">background graphics on</strong>,{" "}
          <strong className="text-on-surface">headers/footers off</strong> (Chrome: More settings). Margins: Default or
          Minimum.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl border border-outline-variant/25 bg-surface-container-lowest px-5 py-2.5 font-headline text-xs font-medium uppercase tracking-[0.18em] text-on-surface transition hover:border-primary/30 hover:bg-surface-container-high/80"
          onClick={() => window.print()}
        >
          print / save pdf
        </button>
        <Link
          href={interactiveHref}
          className="rounded-xl border border-primary/25 bg-primary/10 px-5 py-2.5 font-headline text-xs font-medium uppercase tracking-[0.18em] text-primary transition hover:bg-primary/15"
        >
          interactive memo
        </Link>
      </div>
    </div>
  );
}

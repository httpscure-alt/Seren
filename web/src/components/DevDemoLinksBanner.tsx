import Link from "next/link";

/** Visible only when `next dev` — quick access to intake / regimen prototypes. */
export function DevDemoLinksBanner() {
  if (process.env.NODE_ENV !== "development") return null;

  const linkClass = "text-primary underline underline-offset-4 font-medium";

  return (
    <div className="border-b border-amber-800/15 bg-amber-400/12 text-center">
      <div className="seren-container flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-[11px] text-amber-950/90 sm:text-xs">
        <span className="font-headline font-semibold uppercase tracking-[0.2em] text-amber-950/70">
          Dev mocks
        </span>
        <span className="text-amber-950/35" aria-hidden>
          |
        </span>
        <Link href="/demos/intake-regimen-products-mock" className={linkClass}>
          Brand + catalog search
        </Link>
        <span className="text-amber-950/35" aria-hidden>
          ·
        </span>
        <Link href="/demos/intake-routine-mock" className={linkClass}>
          Routine chips
        </Link>
        <span className="text-amber-950/35" aria-hidden>
          ·
        </span>
        <Link href="/demos" className={linkClass}>
          All demos
        </Link>
      </div>
    </div>
  );
}

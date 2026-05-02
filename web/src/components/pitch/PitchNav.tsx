"use client";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const items = [
  { href: "/pitch", label: "overview", match: (p: string) => p === "/pitch" },
  { href: "/pitch/vc", label: "vc", match: (p: string) => p.startsWith("/pitch/vc") },
  { href: "/pitch/clinic", label: "clinics", match: (p: string) => p.startsWith("/pitch/clinic") },
  { href: "/pitch/brand", label: "brands", match: (p: string) => p.startsWith("/pitch/brand") },
  { href: "/pitch/deck", label: "deck", match: (p: string) => p.startsWith("/pitch/deck") },
] as const;

export function PitchNav({ query }: { query: string }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const t = sp.get("t");
  const q = t ? `?t=${encodeURIComponent(t)}` : query;
  const reduceMotion = useReducedMotion();

  return (
    <LayoutGroup>
      <nav
        className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center font-headline text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.26em]"
        aria-label="Pitch sections"
      >
        {items.map(({ href, label, match }, i) => {
          const active = match(pathname);
          return (
            <span key={href} className="inline-flex items-center">
              {i > 0 ? (
                <span className="mx-2 hidden text-on-surface-variant/35 sm:inline" aria-hidden>
                  ·
                </span>
              ) : null}
              <Link
                href={`${href}${q}`}
                className={
                  active
                    ? reduceMotion
                      ? "border-b border-primary/50 pb-0.5 text-primary"
                      : "relative pb-1 text-primary"
                    : reduceMotion
                      ? "pb-0.5 text-on-surface-variant/80 transition-colors hover:text-primary"
                      : "relative pb-1 text-on-surface-variant/80 transition-colors hover:text-primary"
                }
              >
                {label}
                {active && !reduceMotion ? (
                  <motion.span
                    layoutId="pitch-nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary/55"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
              </Link>
            </span>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}

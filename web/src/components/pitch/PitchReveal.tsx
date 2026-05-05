import type { ReactNode } from "react";

/**
 * Pitch sections — static wrapper only.
 * Scroll/opacity reveal was removed after repeated ref/effect timing issues left the memo blank.
 */
export function PitchReveal({ children }: { children: ReactNode }) {
  return <div className="pitch-deck-section-reveal">{children}</div>;
}

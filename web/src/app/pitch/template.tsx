import type { ReactNode } from "react";

/**
 * Pitch routes remount on each navigation (Next.js template behavior).
 * No wrapper `div` here: a parent with `opacity`/`transform` animations breaks
 * `position: fixed` (glass header) — fixed then positions against that ancestor and can disappear.
 */
export default function PitchTemplate({ children }: { children: ReactNode }) {
  return children;
}

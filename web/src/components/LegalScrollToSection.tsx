"use client";

import { useEffect } from "react";

/** Scrolls to in-page `id` without putting `#` in the URL bar (path is already `/terms/...`). */
export function LegalScrollToSection({ domId }: { domId: string }) {
  useEffect(() => {
    const el = document.getElementById(domId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [domId]);
  return null;
}

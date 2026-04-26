"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentChoice } from "@/lib/consent";

/**
 * Non-blocking cookie notice: bottom bar only (no full-page overlay).
 * Choice is stored in localStorage + cookie; see `lib/consent.ts`.
 */
export function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentChoice>("unset");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChoice(getConsent());
    setMounted(true);
  }, []);

  if (!mounted || choice !== "unset") return null;

  const choose = (next: Exclude<ConsentChoice, "unset">) => {
    setConsent(next);
    setChoice(next);
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-4 pt-2 sm:px-6 sm:pt-3"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div
        className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-outline-variant/20 bg-surface/95 px-5 py-4 shadow-[0_-12px_48px_-20px_rgba(47,51,48,0.18)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        role="dialog"
        aria-label="Analytics cookies"
        aria-describedby="consent-banner-desc"
      >
        <div className="min-w-0">
          <p className="text-sm font-headline tracking-tight text-on-surface">Analytics cookies</p>
          <p id="consent-banner-desc" className="mt-1 max-w-[70ch] text-xs leading-relaxed text-on-surface-variant">
            We use analytics (GA4 + PostHog) to understand usage and improve the product.{" "}
            <Link href="/privacy" className="text-primary underline underline-offset-2 hover:brightness-95">
              Privacy
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="touch-manipulation rounded-full border border-outline-variant/25 px-4 py-2.5 font-headline text-xs uppercase tracking-[0.2em] text-on-surface/70 transition-colors hover:bg-surface-container"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="touch-manipulation rounded-full btn-gradient px-5 py-2.5 font-headline text-xs uppercase tracking-[0.2em] text-on-primary shadow-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

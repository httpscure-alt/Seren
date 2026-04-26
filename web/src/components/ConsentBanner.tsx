"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentChoice } from "@/lib/consent";

export function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentChoice>("unset");

  useEffect(() => {
    setChoice(getConsent());
  }, []);

  if (choice !== "unset") return null;

  const choose = (next: Exclude<ConsentChoice, "unset">) => {
    setConsent(next);
    setChoice(next);
  };

  return (
    <div
      className="fixed inset-0 z-[200] pointer-events-auto select-none"
      onMouseDown={(e) => {
        e.preventDefault();
        choose("rejected");
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        choose("rejected");
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        choose("rejected");
      }}
      onClick={(e) => {
        e.preventDefault();
        choose("rejected");
      }}
      role="presentation"
    >
      <div className="absolute inset-0 bg-on-surface/20" aria-hidden="true" />
      <div className="absolute inset-0 grid place-items-end sm:place-items-center p-5 sm:p-6">
      <div
        className="w-full max-w-3xl rounded-[2rem] border border-outline-variant/20 bg-surface shadow-[0_30px_90px_-60px_rgba(47,51,48,0.55)] p-5 sm:p-6"
        role="dialog"
        aria-label="Analytics cookies"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-headline tracking-tight text-on-surface">
              Analytics cookies
            </p>
            <p className="mt-1 text-xs text-on-surface-variant leading-relaxed max-w-[70ch]">
              We use analytics (GA4 + PostHog) to understand usage and improve the
              product. You can opt out anytime.
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
              Tap outside to dismiss
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("rejected");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("rejected");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("rejected");
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("rejected");
              }}
              className="touch-manipulation pointer-events-auto px-4 py-2.5 rounded-full border border-outline-variant/25 text-on-surface/70 text-xs uppercase tracking-[0.2em] font-headline hover:bg-surface-container transition-colors"
            >
              Reject
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("accepted");
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("accepted");
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("accepted");
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                choose("accepted");
              }}
              className="touch-manipulation pointer-events-auto btn-gradient px-5 py-2.5 rounded-full text-on-primary text-xs uppercase tracking-[0.2em] font-headline shadow-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


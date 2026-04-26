"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  status: string;
  accent?: "warm" | "cool" | "neutral";
};

const DEFAULT_SLIDES: Slide[] = [
  {
    eyebrow: "Case preview",
    title: "Barrier stress + congestion",
    status: "Draft routine ready • awaiting dermatologist review",
    accent: "warm",
  },
  {
    eyebrow: "Case preview",
    title: "Post-acne marks + sensitivity",
    status: "Intake completed • queued for review",
    accent: "neutral",
  },
  {
    eyebrow: "Case preview",
    title: "Texture + uneven tone",
    status: "Dermatologist edits in progress • finalizing routine",
    accent: "cool",
  },
];

function accentGradient(accent: Slide["accent"]) {
  if (accent === "warm") return "from-[#f6d9a6]/60 to-[#c58a4f]/35";
  if (accent === "cool") return "from-primary/35 to-tertiary/20";
  return "from-outline-variant/35 to-surface-container-high/30";
}

export function HeroCaseCarousel({
  slides = DEFAULT_SLIDES,
  intervalMs = 4500,
  showSquares = true,
  onActiveChange,
  prevLabel = "Prev",
  nextLabel = "Next",
}: {
  slides?: Slide[];
  intervalMs?: number;
  showSquares?: boolean;
  onActiveChange?: (nextIndex: number, nextSlide: Slide) => void;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const s = safeSlides[Math.min(active, safeSlides.length - 1)];
    if (!s) return;
    onActiveChange?.(active, s);
  }, [active, onActiveChange, safeSlides]);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const t = setInterval(() => {
      if (pausedRef.current) return;
      setActive((i) => (i + 1) % safeSlides.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, safeSlides.length]);

  const s = safeSlides[Math.min(active, safeSlides.length - 1)];
  if (!s) return null;

  return (
    <div
      className="glass-effect rounded-2xl p-5 w-[min(320px,calc(100vw-2.5rem))] border border-white/30"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
            {s.eyebrow}
          </p>
          <p className="text-sm font-headline mb-1 tracking-tight truncate">
            {s.title}
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {s.status}
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          {showSquares ? (
            <div className="grid grid-cols-2 gap-2">
              <div
                className={[
                  "h-10 w-10 rounded-xl border border-white/25 shadow-sm",
                  `bg-gradient-to-br ${accentGradient(s.accent)}`,
                ].join(" ")}
                aria-hidden="true"
              />
              <div
                className="h-10 w-10 rounded-xl border border-white/25 bg-surface/40 shadow-sm"
                aria-hidden="true"
              />
              <div
                className="h-10 w-10 rounded-xl border border-white/25 bg-surface/25 shadow-sm"
                aria-hidden="true"
              />
              <div
                className={[
                  "h-10 w-10 rounded-xl border border-white/25 shadow-sm",
                  `bg-gradient-to-br ${accentGradient(
                    safeSlides[(active + 1) % safeSlides.length]?.accent ?? "neutral",
                  )}`,
                ].join(" ")}
                aria-hidden="true"
              />
            </div>
          ) : null}

          {safeSlides.length > 1 ? (
            <div className="flex items-center gap-1.5 pt-1">
              {safeSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    i === active
                      ? "w-6 bg-primary/70"
                      : "w-2.5 bg-on-surface/20 hover:bg-on-surface/30",
                  ].join(" ")}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {safeSlides.length > 1 ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setActive((i) => (i - 1 + safeSlides.length) % safeSlides.length)
            }
            className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 hover:text-primary transition-colors"
          >
            {prevLabel}
          </button>
          <span className="text-on-surface/20">•</span>
          <button
            type="button"
            onClick={() => setActive((i) => (i + 1) % safeSlides.length)}
            className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 hover:text-primary transition-colors"
          >
            {nextLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}


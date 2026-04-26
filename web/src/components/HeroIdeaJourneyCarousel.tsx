"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  step: string;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    step: "Step 1",
    title: "Upload photos",
    body: "A guided intake helps capture the right details for review.",
  },
  {
    step: "Step 2",
    title: "Dermatologist review",
    body: "AI drafts the structure, dermatologists refine the conclusions.",
  },
  {
    step: "Step 3",
    title: "Routine you can follow",
    body: "Clear morning + evening steps, plus a treatment pathway if needed.",
  },
];

function Icon({ kind }: { kind: "upload" | "review" | "routine" }) {
  const common = "h-12 w-12 rounded-2xl bg-primary/10 border border-primary/15 grid place-items-center";
  return (
    <div className={common} aria-hidden="true">
      {kind === "upload" ? (
        <span className="text-primary text-xl">⇡</span>
      ) : kind === "review" ? (
        <span className="text-primary text-xl">✓</span>
      ) : (
        <span className="text-primary text-xl">☾</span>
      )}
    </div>
  );
}

export function HeroIdeaJourneyCarousel({ intervalMs = 4500 }: { intervalMs?: number }) {
  const slides = useMemo(() => SLIDES, []);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      if (pausedRef.current) return;
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, slides.length]);

  const s = slides[active];
  const kind = active === 0 ? "upload" : active === 1 ? "review" : "routine";

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-high" />

      <div className="absolute inset-0 grid place-items-center p-8">
        <div className="seren-card p-8 sm:p-10 w-full max-w-md">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
                {s.step}
              </p>
              <p className="mt-3 text-xl font-headline tracking-tight">
                {s.title}
              </p>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                {s.body}
              </p>
            </div>
            <Icon kind={kind} />
          </div>

          <div className="mt-8 flex items-center gap-2">
            {slides.map((_, i) => (
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
        </div>
      </div>
    </div>
  );
}


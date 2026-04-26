"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  tint: "warm" | "neutral" | "cool";
  eyebrow: string;
  title: string;
  status: string;
};

const SLIDES: Slide[] = [
  {
    tint: "warm",
    eyebrow: "Case preview",
    title: "Barrier stress + congestion",
    status: "Draft routine ready • awaiting dermatologist review",
  },
  {
    tint: "neutral",
    eyebrow: "Case preview",
    title: "Post-acne marks + sensitivity",
    status: "Intake completed • queued for review",
  },
  {
    tint: "cool",
    eyebrow: "Case preview",
    title: "Texture + uneven tone",
    status: "Dermatologist edits in progress • finalizing routine",
  },
];

function tintClass(tint: Slide["tint"]) {
  switch (tint) {
    case "warm":
      return "from-[#f6d9a6]/55 via-surface-container-low to-surface-container-high";
    case "cool":
      return "from-primary/15 via-surface-container-low to-surface-container-high";
    default:
      return "from-surface-container-low via-surface-container-low to-surface-container-high";
  }
}

export function HeroIdeaGradientCarousel({ intervalMs = 4500 }: { intervalMs?: number }) {
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
      <div className={`absolute inset-0 bg-gradient-to-br ${tintClass(s.tint)}`} />
      <div className="absolute right-6 sm:right-10 top-6 sm:top-10 w-[min(300px,calc(100vw-3rem))] aspect-square rounded-[2rem] overflow-hidden shadow-lg">
        <div
          className={[
            "absolute inset-0",
            s.tint === "warm"
              ? "bg-[radial-gradient(circle_at_30%_30%,#f6d9a6,transparent_55%),radial-gradient(circle_at_70%_70%,#c58a4f,transparent_55%)]"
              : s.tint === "cool"
                ? "bg-[radial-gradient(circle_at_30%_30%,rgba(61,99,116,0.28),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(78,97,118,0.18),transparent_55%)]"
                : "bg-[radial-gradient(circle_at_30%_30%,rgba(120,124,119,0.18),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(175,179,174,0.18),transparent_55%)]",
          ].join(" ")}
        />
      </div>

      <div className="absolute left-5 sm:left-10 bottom-5 sm:bottom-10 glass-effect rounded-2xl p-5 w-[min(320px,calc(100vw-2.5rem))] border border-white/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
              {s.eyebrow}
            </p>
            <p className="text-sm font-headline mb-1 tracking-tight truncate">
              {s.title}
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">{s.status}</p>
          </div>
          <div className="flex items-center gap-1.5 pt-1 shrink-0">
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

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
            className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 hover:text-primary transition-colors"
          >
            Prev
          </button>
          <span className="text-on-surface/20">•</span>
          <button
            type="button"
            onClick={() => setActive((i) => (i + 1) % slides.length)}
            className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 hover:text-primary transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


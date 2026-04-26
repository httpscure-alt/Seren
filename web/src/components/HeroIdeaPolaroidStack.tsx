"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  title: string;
  note: string;
};

const SLIDES: Slide[] = [
  { title: "Barrier stress + congestion", note: "Draft routine ready • awaiting review" },
  { title: "Redness + sensitivity", note: "Photos uploaded • symptoms confirmed" },
  { title: "Texture + uneven tone", note: "Dermatologist edits in progress" },
];

function Frame({ tone }: { tone: "warm" | "neutral" | "cool" }) {
  const bg =
    tone === "warm"
      ? "bg-[radial-gradient(circle_at_30%_30%,#f6d9a6,transparent_55%),radial-gradient(circle_at_70%_70%,#c58a4f,transparent_55%)]"
      : tone === "cool"
        ? "bg-[radial-gradient(circle_at_30%_30%,rgba(61,99,116,0.28),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(78,97,118,0.18),transparent_55%)]"
        : "bg-[radial-gradient(circle_at_30%_30%,rgba(120,124,119,0.18),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(175,179,174,0.18),transparent_55%)]";

  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/15 shadow-sm p-3">
      <div className={`h-36 rounded-xl ${bg}`} />
      <div className="mt-3 h-3 w-2/3 rounded bg-surface-container-low" />
    </div>
  );
}

export function HeroIdeaPolaroidStack({ intervalMs = 4500 }: { intervalMs?: number }) {
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
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-high" />

      <div className="absolute right-6 sm:right-10 top-8 sm:top-10 w-[min(320px,calc(100vw-3rem))]">
        <div className="relative">
          <div className="absolute right-8 top-6 rotate-6 w-44 sm:w-48">
            <Frame tone="cool" />
          </div>
          <div className="absolute right-2 top-2 -rotate-3 w-44 sm:w-48">
            <Frame tone="neutral" />
          </div>
          <div className="relative w-44 sm:w-48 rotate-1">
            <Frame tone="warm" />
          </div>
        </div>
      </div>

      <div className="absolute left-5 sm:left-10 bottom-5 sm:bottom-10 glass-effect rounded-2xl p-5 w-[min(340px,calc(100vw-2.5rem))] border border-white/30">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
          Case preview
        </p>
        <p className="text-sm font-headline mb-1 tracking-tight">{s.title}</p>
        <p className="text-xs text-on-surface-variant leading-relaxed">{s.note}</p>

        <div className="mt-4 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={[
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-primary/70" : "w-2.5 bg-on-surface/20 hover:bg-on-surface/30",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


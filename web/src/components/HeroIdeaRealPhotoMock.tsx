"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  title: string;
  status: string;
};

const SLIDES: Slide[] = [
  { title: "Case A — Close-up + context", status: "Photos uploaded • ready for review" },
  { title: "Case B — Profile comparison", status: "Dermatologist reviewing • notes pending" },
  { title: "Case C — Follow-up check-in", status: "Routine adjustment • week 2" },
];

function PhotoFrame({ shade }: { shade: "a" | "b" | "c" }) {
  const bg =
    shade === "a"
      ? "bg-[linear-gradient(135deg,rgba(246,217,166,0.55),rgba(250,249,246,0.0)),radial-gradient(circle_at_30%_30%,rgba(197,138,79,0.28),transparent_55%)]"
      : shade === "b"
        ? "bg-[linear-gradient(135deg,rgba(61,99,116,0.22),rgba(250,249,246,0.0)),radial-gradient(circle_at_70%_30%,rgba(78,97,118,0.18),transparent_55%)]"
        : "bg-[linear-gradient(135deg,rgba(175,179,174,0.25),rgba(250,249,246,0.0)),radial-gradient(circle_at_30%_70%,rgba(120,124,119,0.18),transparent_55%)]";

  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/15 shadow-sm p-3">
      <div className={`h-44 sm:h-48 rounded-xl ${bg}`} />
      <div className="mt-3 flex items-center justify-between">
        <div className="h-3 w-2/3 rounded bg-surface-container-low" />
        <div className="h-3 w-8 rounded bg-surface-container-low" />
      </div>
    </div>
  );
}

export function HeroIdeaRealPhotoMock({ intervalMs = 4500 }: { intervalMs?: number }) {
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
  const shade = active === 0 ? "a" : active === 1 ? "b" : "c";

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

      <div className="absolute right-6 sm:right-10 top-8 sm:top-10 w-[min(340px,calc(100vw-3rem))]">
        <PhotoFrame shade={shade} />
        <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-on-surface/45">
          Photo mock — replace with real images (with consent)
        </p>
      </div>

      <div className="absolute left-5 sm:left-10 bottom-5 sm:bottom-10 glass-effect rounded-2xl p-5 w-[min(340px,calc(100vw-2.5rem))] border border-white/30">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
          Case preview
        </p>
        <p className="text-sm font-headline mb-1 tracking-tight">{s.title}</p>
        <p className="text-xs text-on-surface-variant leading-relaxed">{s.status}</p>

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


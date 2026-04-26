"use client";

import { useMemo, useState } from "react";
import { HeroCaseCarousel } from "@/components/HeroCaseCarousel";

type Slide = {
  eyebrow: string;
  title: string;
  status: string;
  accent?: "warm" | "cool" | "neutral";
};

function bigSquareClass(accent: Slide["accent"]) {
  if (accent === "warm")
    return "bg-[radial-gradient(circle_at_30%_30%,rgba(246,217,166,0.92),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(197,138,79,0.62),transparent_55%)]";
  if (accent === "cool")
    return "bg-[radial-gradient(circle_at_30%_30%,rgba(61,99,116,0.40),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(78,97,118,0.28),transparent_55%)]";
  return "bg-[radial-gradient(circle_at_30%_30%,rgba(175,179,174,0.42),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(120,124,119,0.26),transparent_55%)]";
}

export function LandingHeroVisual({ slides }: { slides: Slide[] }) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [accent, setAccent] = useState<Slide["accent"]>(
    safeSlides[0]?.accent ?? "neutral",
  );

  return (
    <div className="relative rounded-[2.5rem] seren-card overflow-hidden min-h-[320px] sm:min-h-[420px]">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-high" />

      <div className="absolute right-6 sm:right-10 top-6 sm:top-10 w-[min(300px,calc(100vw-3rem))] aspect-square rounded-[2rem] overflow-hidden shadow-lg">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${bigSquareClass(accent)}`}
        />
      </div>

      <div className="absolute left-5 sm:left-10 bottom-5 sm:bottom-10">
        <HeroCaseCarousel
          slides={safeSlides}
          showSquares
          onActiveChange={(_, next) => setAccent(next.accent ?? "neutral")}
        />
      </div>
    </div>
  );
}


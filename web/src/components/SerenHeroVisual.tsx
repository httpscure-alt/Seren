import Image from "next/image";

/**
 * Hero visual: cream texture photography + Seren surface / primary / warm radiants.
 * Use inside a `relative` container with defined size (aspect ratio or fixed height).
 */
export function SerenHeroVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <Image
        src="/demo/hero-cream-texture.png"
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 420px"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low/88 via-surface-container/72 to-surface-container-high/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_18%_12%,rgba(61,99,116,0.16),transparent_52%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_88%_78%,rgba(246,217,166,0.14),transparent_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.55)_0%,transparent_45%,rgba(61,99,116,0.04)_100%)]" />
    </div>
  );
}

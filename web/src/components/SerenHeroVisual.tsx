/**
 * Photo-free hero: Seren surface + primary / warm radiants.
 * Use inside a `relative` container with defined size (aspect ratio or fixed height).
 */
export function SerenHeroVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_18%_12%,rgba(61,99,116,0.16),transparent_52%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_88%_78%,rgba(246,217,166,0.14),transparent_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.55)_0%,transparent_45%,rgba(61,99,116,0.04)_100%)]" />
    </div>
  );
}

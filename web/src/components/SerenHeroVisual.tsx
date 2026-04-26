import Image from "next/image";

/** Matches welcome / marketing shell so hero art sits on the same “sky” as the page. */
export const SEREN_MARKETING_PAGE_SKY =
  "radial-gradient(circle at 35% 20%,rgba(61,99,116,0.08),transparent 55%),radial-gradient(circle at 80% 30%,rgba(246,217,166,0.12),transparent 45%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.92))";

/**
 * Hero visual: cream texture photography + Seren surface / primary / warm radiants.
 * Use inside a `relative` container with defined size (aspect ratio or fixed height).
 */
export function SerenHeroVisual({
  className = "",
  imageSrc = "/demo/hero-cream-texture.png",
  /** Feather edges and tint toward page background (welcome / light surfaces). */
  blendToPage = false,
}: {
  className?: string;
  /** Override texture art (e.g. pre-intake welcome swatch). */
  imageSrc?: string;
  blendToPage?: boolean;
}) {
  const edgeMask =
    blendToPage
      ? {
          maskImage:
            "radial-gradient(ellipse 92% 94% at 50% 48%, #000 42%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 92% 94% at 50% 48%, #000 42%, transparent 72%)",
        }
      : undefined;

  if (blendToPage) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
        <div className="absolute inset-0" style={{ background: SEREN_MARKETING_PAGE_SKY }} />
        <div className="absolute inset-0 overflow-hidden" style={edgeMask}>
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover object-center scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_30%,rgba(250,249,246,0.35)_68%,rgba(250,249,246,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_18%_12%,rgba(61,99,116,0.08),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_88%_78%,rgba(246,217,166,0.1),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.35)_0%,transparent_42%,rgba(250,249,246,0.25)_100%)]" />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <Image
        src={imageSrc}
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

import type { Metadata } from "next";

type MarketingPath =
  | "/"
  | "/privacy"
  | "/terms"
  | "/philosophy"
  | "/doku"
  | "/doku/produk"
  | "/doku/ketentuan"
  | "/doku/refund"
  | "/doku/kontak";

/**
 * Default marketing OG/Twitter images point at `/og` (ImageResponse).
 * Kept out of root `layout.tsx` so `/share/**` pages are not merged with a second,
 * first-listed `og:image` (WhatsApp often picks the first tag).
 */
/** MarketingPath or generated paths such as `/terms/payments`. */
export function siteOgForPath(path: MarketingPath | string): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [{ url: "/og", width: 1200, height: 630, alt: "Seren" }];
  return {
    openGraph: { url: path, images },
    twitter: { card: "summary_large_image", images },
  };
}

import type { MetadataRoute } from "next";

function shouldNoIndex() {
  // Default: block indexing for non-production deploys (friends & family, staging).
  // You can override explicitly with SEREN_NO_INDEX=false in production if needed.
  const explicit = process.env.SEREN_NO_INDEX;
  if (explicit === "true") return true;
  if (explicit === "false") return false;

  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") return true;
  if (process.env.NODE_ENV !== "production") return true;
  return false;
}

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";
  const noIndex = shouldNoIndex();

  if (noIndex) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${base}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Confidential pitch / invest routes are also noindex in page metadata — extra belt for crawlers.
        disallow: ["/pitch/", "/invest/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}


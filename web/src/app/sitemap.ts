import type { MetadataRoute } from "next";

const base =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "http://localhost:3000";

// Keep sitemap strictly to public marketing/legal pages.
// Authenticated / admin / report pages should not be listed.
const routes = ["/", "/philosophy", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === "/philosophy" ? 0.7 : 0.4,
  }));
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Public catalog search for intake autocomplete (no PII).
 * Rate-limited; returns active SKUs only.
 */
export async function GET(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit({ key: `skincare-products:${ip}`, limit: 120, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 80);
  const category = (searchParams.get("category") ?? "").trim().toUpperCase();

  const rows = await prisma.skincareProduct.findMany({
    where: {
      isActive: true,
      ...(category && category !== "ALL" ? { category } : {}),
      ...(q.length
        ? {
            OR: [
              { brand: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q.toLowerCase().replace(/\s+/g, "-") } },
            ],
          }
        : {}),
    },
    orderBy: [{ brand: "asc" }, { name: "asc" }],
    take: q.length ? 24 : 40,
    select: {
      id: true,
      brand: true,
      name: true,
      slug: true,
      market: true,
      activesSummary: true,
      category: true,
    },
  });

  return NextResponse.json({ ok: true, products: rows });
}

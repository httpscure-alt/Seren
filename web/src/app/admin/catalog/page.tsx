import { prisma } from "@/lib/db";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const products = await prisma.skincareProduct.findMany({
    orderBy: { brand: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl tracking-tight text-on-surface">
          Product Catalog
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Manage curated skincare SKUs for intake autocomplete.
        </p>
      </div>

      <div className="seren-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50 border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                  Product
                </th>
                <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                  Market
                </th>
                <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                  Actives Summary
                </th>
                <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-headline text-sm text-on-surface">{p.brand}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{p.name}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono bg-surface-container px-2 py-1 rounded">
                      {p.market ?? "Global"}
                    </span>
                  </td>
                  <td className="px-6 py-5 max-w-[300px]">
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {p.activesSummary ?? "—"}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        p.isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-container-high text-on-surface/40",
                      ].join(" ")}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-on-surface-variant">
                      {format(p.createdAt, "MMM d, yyyy")}
                    </p>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    No products found. Seed the database to see results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

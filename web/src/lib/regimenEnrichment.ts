import type { PrismaClient } from "@prisma/client";

export type RegimenLinePayload = {
  productId?: string | null;
  brandRaw: string;
  nameRaw: string;
  usageSlot: "UNKNOWN" | "AM" | "PM" | "BOTH";
  userNote?: string | null;
  source: "PICKED" | "FREE_TEXT";
};

export type EnrichedRegimenLine = {
  sortOrder: number;
  brandRaw: string;
  nameRaw: string;
  usageSlot: "UNKNOWN" | "AM" | "PM" | "BOTH";
  source: "PICKED" | "FREE_TEXT";
  userNote: string | null;
  productId: string | null;
  catalog: {
    brand: string;
    name: string;
    activesSummary: string | null;
  } | null;
};

export async function enrichRegimenLinesForIntake(
  prisma: PrismaClient,
  lines: RegimenLinePayload[],
): Promise<EnrichedRegimenLine[]> {
  return Promise.all(
    lines.map(async (line, sortOrder) => {
      let catalogRow: {
        id: string;
        brand: string;
        name: string;
        activesSummary: string | null;
      } | null = null;

      if (line.productId) {
        catalogRow = await prisma.skincareProduct.findFirst({
          where: { id: line.productId, isActive: true },
          select: { id: true, brand: true, name: true, activesSummary: true },
        });
      }

      return {
        sortOrder,
        brandRaw: line.brandRaw,
        nameRaw: line.nameRaw,
        usageSlot: line.usageSlot,
        source: line.source,
        userNote: line.userNote ?? null,
        productId: catalogRow?.id ?? null,
        catalog: catalogRow
          ? {
              brand: catalogRow.brand,
              name: catalogRow.name,
              activesSummary: catalogRow.activesSummary,
            }
          : null,
      };
    }),
  );
}

/** Validate: every provided productId must resolve to an active catalog row. */
export function regimenProductIdsValid(
  lines: RegimenLinePayload[],
  enriched: EnrichedRegimenLine[],
): boolean {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].productId && !enriched[i].productId) {
      return false;
    }
  }
  return true;
}

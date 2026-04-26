import type { ProductCatalogItem } from "@/lib/aiPrompt";

/** Allowed product references for AI drafting (IDs must match LLM output). */
export const DEFAULT_AI_PRODUCT_CATALOG: ProductCatalogItem[] = [
  {
    id: "cleanser_cetaphil_gentle",
    name: "Cetaphil Gentle Skin Cleanser",
    category: "CLEANSER",
    tier: "BALANCED",
    tags: ["SENSITIVE_SAFE"],
  },
  {
    id: "moisturizer_skintific_5x_ceramide",
    name: "Skintific 5X Ceramide Moisturizer",
    category: "MOISTURIZER",
    tier: "BALANCED",
    tags: ["SENSITIVE_SAFE", "BARRIER_SUPPORT"],
  },
  {
    id: "sunscreen_azarine_hydrasoothe_spf45",
    name: "Azarine Hydrasoothe Sunscreen Gel SPF45 PA++++",
    category: "SUNSCREEN",
    tier: "EVERYDAY",
    tags: ["OILY_FRIENDLY"],
  },
  {
    id: "acne_bpo_benzolac",
    name: "Benzolac (benzoyl peroxide) spot treatment",
    category: "BENZOYL_PEROXIDE",
    tier: "EVERYDAY",
    tags: ["ACNE_TREATMENT", "SPOT_TREATMENT"],
  },
];

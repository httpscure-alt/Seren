/**
 * Seed rows for `SkincareProduct` — Indonesian market examples.
 * Keep in sync with product copy expectations; `activesSummary` is a short hint for derm/AI, not INCI.
 */
export type SkincareCatalogSeedRow = {
  brand: string;
  name: string;
  slug: string;
  category?: string;
  market?: string;
  activesSummary?: string;
  ingredientsJson?: Record<string, unknown>;
};

export const SKINCARE_CATALOG_SEED: SkincareCatalogSeedRow[] = [
  // --- CLEANSER ---
  {
    brand: "CeraVe",
    name: "Foaming Facial Cleanser",
    slug: "cerave-foaming-facial-cleanser",
    category: "CLEANSER",
    market: "ID",
    activesSummary: "Ceramide + niacinamide foaming cleanser.",
  },
  {
    brand: "Cetaphil",
    name: "Gentle Skin Cleanser",
    slug: "cetaphil-gentle-skin-cleanser",
    category: "CLEANSER",
    market: "ID",
    activesSummary: "Soap-free gentle cleanser for sensitive skin.",
  },
  {
    brand: "Senka",
    name: "Perfect Whip Facial Foam",
    slug: "senka-perfect-whip",
    category: "CLEANSER",
    market: "ID",
    activesSummary: "Dense white cocoon foam for deep cleansing.",
  },
  {
    brand: "Bioderma",
    name: "Sensibio H2O Micellar Water",
    slug: "bioderma-sensibio-h2o",
    category: "CLEANSER",
    market: "ID",
    activesSummary: "Micellar water for sensitive skin.",
  },
  {
    brand: "Wardah",
    name: "Lightening Whip Facial Foam",
    slug: "wardah-lightening-whip-foam",
    category: "CLEANSER",
    market: "ID",
    activesSummary: "Creamy whip foam with Niacinamide.",
  },
  {
    brand: "Emina",
    name: "Bright Stuff Face Wash",
    slug: "emina-bright-stuff-wash",
    category: "CLEANSER",
    market: "ID",
    activesSummary: "Gentle brightening wash with Summer Plum extract.",
  },

  // --- TONER ---
  {
    brand: "Hada Labo",
    name: "Gokujyun Hydrating Lotion",
    slug: "hada-labo-gokujyun-hydrating-lotion",
    category: "TONER",
    market: "ID",
    activesSummary: "Hyaluronic acid hydrating toner.",
  },
  {
    brand: "Avoskin",
    name: "Miraculous Refining Toner",
    slug: "avoskin-miraculous-refining-toner",
    category: "TONER",
    market: "ID",
    activesSummary: "AHA-BHA-PHA exfoliating toner.",
  },
  {
    brand: "Npure",
    name: "Centella Asiatica Face Toner",
    slug: "npure-cica-toner",
    category: "TONER",
    market: "ID",
    activesSummary: "Soothing toner with real Cica leaves.",
  },
  {
    brand: "Pyunkang Yul",
    name: "Essence Toner",
    slug: "pyunkang-yul-essence-toner",
    category: "TONER",
    market: "ID",
    activesSummary: "Minimalist hydrating toner with Milk Vetch root.",
  },

  // --- SERUM ---
  {
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1%",
    slug: "the-ordinary-niacinamide-10-zinc-1",
    category: "SERUM",
    market: "ID",
    activesSummary: "Niacinamide + zinc for oil control.",
  },
  {
    brand: "Somethinc",
    name: "Supple Power Hyaluronic + Ceramide Hydrating Serum",
    slug: "somethinc-supple-power-hyaluronic-ceramide-serum",
    category: "SERUM",
    market: "ID",
    activesSummary: "Hyaluronic acid + ceramide hydrating serum.",
  },
  {
    brand: "Avoskin",
    name: "Your Skin Bae Marine Collagen 10% + Ginseng",
    slug: "avoskin-ysb-marine-collagen",
    category: "SERUM",
    market: "ID",
    activesSummary: "Collagen serum for skin texture and hydration.",
  },
  {
    brand: "Whitelab",
    name: "Intense Brightening Serum Niacinamide 10%",
    slug: "whitelab-brightening-serum",
    category: "SERUM",
    market: "ID",
    activesSummary: "High concentration Niacinamide + HyaluComplex.",
  },
  {
    brand: "Innisfree",
    name: "Green Tea Seed Serum",
    slug: "innisfree-green-tea-serum",
    category: "SERUM",
    market: "ID",
    activesSummary: "Moisturizing serum with Jeju green tea extract.",
  },
  {
    brand: "Skintific",
    name: "10% Niacinamide Brightening Serum",
    slug: "skintific-10-niacinamide-serum",
    category: "SERUM",
    market: "ID",
    activesSummary: "Brightening serum with Alpha Arbutin & Ceramides.",
  },

  // --- MOISTURIZER ---
  {
    brand: "Skintific",
    name: "5X Ceramide Barrier Moisture Gel",
    slug: "skintific-5x-ceramide-barrier-moisture-gel",
    category: "MOISTURIZER",
    market: "ID",
    activesSummary: "Ceramide-focused barrier support; gel moisturizer.",
  },
  {
    brand: "Neutrogena",
    name: "Hydro Boost Water Gel",
    slug: "neutrogena-hydro-boost-water-gel",
    category: "MOISTURIZER",
    market: "ID",
    activesSummary: "Hyaluronic acid gel-cream.",
  },
  {
    brand: "Bio-Essence",
    name: "Bio-Water Vitamin B5 Gel",
    slug: "bio-essence-vitamin-b5-gel",
    category: "MOISTURIZER",
    market: "ID",
    activesSummary: "Vitamin B5 (Panthenol) for barrier support.",
  },
  {
    brand: "Wardah",
    name: "Perfect Bright Moisturizer",
    slug: "wardah-perfect-bright-moisturizer",
    category: "MOISTURIZER",
    market: "ID",
    activesSummary: "Brightening moisturizer with SPF 30.",
  },
  {
    brand: "Laneige",
    name: "Water Bank Blue Hyaluronic Cream",
    slug: "laneige-water-bank-cream",
    category: "MOISTURIZER",
    market: "ID",
    activesSummary: "Deep hydration cream with blue hyaluronic acid.",
  },
  {
    brand: "Kiehl's",
    name: "Ultra Facial Cream",
    slug: "kiehls-ultra-facial-cream",
    category: "MOISTURIZER",
    market: "ID",
    activesSummary: "Classic 24-hour daily face moisturizer.",
  },
  {
    brand: "Labore",
    name: "Sensitive Skin Care BiomeRepair Barrier Revitalizing Cream",
    slug: "labore-biomerepair-cream",
    category: "MOISTURIZER",
    market: "ID",
    activesSummary: "Microbiome-friendly moisturizer for sensitive skin.",
  },

  // --- SUNSCREEN ---
  {
    brand: "Azarine",
    name: "Hydrasoothe Sunscreen Gel SPF50 PA++++",
    slug: "azarine-hydrasoothe-sunscreen-gel-spf50",
    category: "SUNSCREEN",
    market: "ID",
    activesSummary: "Chemical UV filters; lightweight gel base.",
  },
  {
    brand: "Biore",
    name: "UV Aqua Rich Watery Essence SPF50+ PA++++",
    slug: "biore-uv-aqua-rich-essence",
    category: "SUNSCREEN",
    market: "ID",
    activesSummary: "Water-based sunscreen with micro defense technology.",
  },
  {
    brand: "Skin Aqua",
    name: "UV Moisture Milk SPF50 PA+++",
    slug: "skin-aqua-uv-moisture-milk",
    category: "SUNSCREEN",
    market: "ID",
    activesSummary: "Daily sunscreen with hyaluronic acid and collagen.",
  },
  {
    brand: "Wardah",
    name: "UV Shield Essential Sunscreen Gel SPF30 PA+++",
    slug: "wardah-uv-shield-spf30",
    category: "SUNSCREEN",
    market: "ID",
    activesSummary: "Vitamin-rich sunscreen gel.",
  },
  {
    brand: "Emina",
    name: "Sun Battle SPF30 PA+++",
    slug: "emina-sun-battle-spf30",
    category: "SUNSCREEN",
    market: "ID",
    activesSummary: "Lightweight sunscreen with Aloe Vera extract.",
  },
  {
    brand: "Anessa",
    name: "Perfect UV Sunscreen Skincare Milk SPF50+",
    slug: "anessa-perfect-uv-milk",
    category: "SUNSCREEN",
    market: "ID",
    activesSummary: "High-performance sunscreen with Auto Booster technology.",
  },
  {
    brand: "La Roche-Posay",
    name: "Anthelios UVMune 400 Invisible Fluid SPF50+",
    slug: "la-roche-posay-anthelios-uvmune-400",
    category: "SUNSCREEN",
    market: "ID",
    activesSummary: "High UVA protection broad spectrum sunscreen.",
  },

  // --- TREATMENT ---
  {
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    slug: "paulas-choice-2-bha-liquid-exfoliant",
    category: "TREATMENT",
    market: "ID",
    activesSummary: "2% Salicylic Acid (BHA) chemical exfoliant.",
  },
  {
    brand: "La Roche-Posay",
    name: "Effaclar Duo (+)",
    slug: "la-roche-posay-effaclar-duo-plus",
    category: "TREATMENT",
    market: "ID",
    activesSummary: "Niacinamide + salicylic acid targeted treatment.",
  },
  {
    brand: "Epiduo",
    name: "Adapalene + Benzoyl Peroxide Gel (prescription)",
    slug: "epiduo-adapalene-bpo-rx",
    category: "TREATMENT",
    market: "ID",
    activesSummary: "Rx: adapalene + benzoyl peroxide.",
  },
  {
    brand: "Somethinc",
    name: "Game Changer Tripeptide Eye Gel",
    slug: "somethinc-eye-gel",
    category: "TREATMENT",
    market: "ID",
    activesSummary: "Peptide eye gel for puffiness and dark circles.",
  },
  {
    brand: "COSRX",
    name: "Advanced Snail 96 Mucin Power Essence",
    slug: "cosrx-snail-mucin-essence",
    category: "TREATMENT",
    market: "ID",
    activesSummary: "Snail mucin for hydration and skin repair.",
  },
];

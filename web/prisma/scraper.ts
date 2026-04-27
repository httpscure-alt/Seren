import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for scraping/seeding.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Note: `SkincareProduct.category` is stored as a string in Prisma schema,
// so keep this mapping as plain strings.
const categoryMap: Record<string, string> = {
  cleanser: "CLEANSER",
  "facial-wash": "CLEANSER",
  toner: "TONER",
  essence: "TONER",
  serum: "SERUM",
  moisturizer: "MOISTURIZER",
  "day-cream": "MOISTURIZER",
  "night-cream": "MOISTURIZER",
  sunscreen: "SUNSCREEN",
  sunblock: "SUNSCREEN",
  treatment: "TREATMENT",
  "acne-spot": "TREATMENT",
  mask: "TREATMENT",
  exfoliator: "TREATMENT",
};

const realProducts = [
  // Somethinc
  { brand: "Somethinc", name: "5% Niacinamide + Moisture Sabi Beet Serum", category: "SERUM", actives: "Niacinamide, Sabi Beet" },
  { brand: "Somethinc", name: "10% Niacinamide + Moisture Sabi Beet Serum", category: "SERUM", actives: "Niacinamide, Sabi Beet" },
  { brand: "Somethinc", name: "Hyaluronic B5", category: "SERUM", actives: "Hyaluronic Acid, Vitamin B5" },
  { brand: "Somethinc", name: "AHA BHA PHA Peeling Solution", category: "TREATMENT", actives: "AHA, BHA, PHA" },
  { brand: "Somethinc", name: "Low pH Gentle Jelly Cleanser", category: "CLEANSER", actives: "Tea Tree, Centella Asiatica" },
  { brand: "Somethinc", name: "Ceramic Skin Saviour Moisturizer Gel", category: "MOISTURIZER", actives: "Ceramides, Collagen" },
  { brand: "Somethinc", name: "Game Changer Tripeptide Eye Concentrate Gel", category: "TREATMENT", actives: "Peptides, Caffeine" },
  { brand: "Somethinc", name: "Lemonade Waterless Vitamin C + Ferulic + NAG", category: "SERUM", actives: "Vitamin C, Ferulic Acid" },
  { brand: "Somethinc", name: "Holygrail Lash Lash Brow Bomber", category: "TREATMENT", actives: "Biotin, Peptides" },
  { brand: "Somethinc", name: "Salmon DNA + Marine Collagen Elixir", category: "SERUM", actives: "Salmon DNA, Collagen" },

  // Skintific
  { brand: "Skintific", name: "5X Ceramide Barrier Repair Moisture Gel", category: "MOISTURIZER", actives: "5X Ceramides, Hyaluronic Acid" },
  { brand: "Skintific", name: "10% Niacinamide Brightening Serum", category: "SERUM", actives: "Niacinamide, Alpha Arbutin" },
  { brand: "Skintific", name: "Mugwort Anti Pores & Acne Clay Mask", category: "TREATMENT", actives: "Mugwort, Niacinamide, Salicylic Acid" },
  { brand: "Skintific", name: "2% Salicylic Acid Anti Acne Serum", category: "SERUM", actives: "Salicylic Acid, Centella" },
  { brand: "Skintific", name: "SymWhite 377 Dark Spot Eraser Serum", category: "SERUM", actives: "SymWhite 377, Niacinamide" },
  { brand: "Skintific", name: "5X Ceramide Low pH Cleanser", category: "CLEANSER", actives: "Ceramides, Amino Acids" },
  { brand: "Skintific", name: "Glycolic Acid Daily Clarifying Toner", category: "TONER", actives: "Glycolic Acid, Niacinamide" },
  { brand: "Skintific", name: "All Day Light Sunscreen Mist SPF 50 PA++++", category: "SUNSCREEN", actives: "UV Filters, Ceramides" },
  
  // Avoskin
  { brand: "Avoskin", name: "Perfect Hydrating Treatment Essence", category: "TONER", actives: "Chamomile, Rosehip Oil" },
  { brand: "Avoskin", name: "Miraculous Refining Toner", category: "TONER", actives: "AHA, BHA, PHA" },
  { brand: "Avoskin", name: "Miraculous Refining Serum", category: "SERUM", actives: "AHA, BHA, PHA" },
  { brand: "Avoskin", name: "Miraculous Retinol Toner", category: "TONER", actives: "Retinol, Niacinamide" },
  { brand: "Avoskin", name: "Miraculous Retinol Ampoule", category: "SERUM", actives: "Retinol, Peptides" },
  { brand: "Avoskin", name: "Your Skin Bae Alpha Arbutin 3% + Grapeseed", category: "SERUM", actives: "Alpha Arbutin, Grapeseed" },
  { brand: "Avoskin", name: "Your Skin Bae Niacinamide 12% + Centella Asiatica", category: "SERUM", actives: "Niacinamide, Centella" },
  { brand: "Avoskin", name: "Your Skin Bae Salicylic Acid 2% + Zinc", category: "SERUM", actives: "Salicylic Acid, Zinc" },
  { brand: "Avoskin", name: "Your Skin Bae Marine Collagen 10% + Ginseng Root", category: "SERUM", actives: "Marine Collagen, Ginseng" },
  { brand: "Avoskin", name: "Your Skin Bae Vitamin C 3% + Niacinamide 2%", category: "SERUM", actives: "Vitamin C, Niacinamide" },

  // Wardah
  { brand: "Wardah", name: "Lightening Day Cream", category: "MOISTURIZER", actives: "Niacinamide, Licorice" },
  { brand: "Wardah", name: "Lightening Night Cream", category: "MOISTURIZER", actives: "Niacinamide, AHA" },
  { brand: "Wardah", name: "Lightening Micellar Gentle Wash", category: "CLEANSER", actives: "Niacinamide" },
  { brand: "Wardah", name: "Acnederm Pure Foaming Cleanser", category: "CLEANSER", actives: "Salicylic Acid" },
  { brand: "Wardah", name: "Acnederm Acne Spot Treatment Gel", category: "TREATMENT", actives: "BHA, Willowherb" },
  { brand: "Wardah", name: "UV Shield Essential Sunscreen Gel SPF 30", category: "SUNSCREEN", actives: "UV Filters, Vitamin E" },
  { brand: "Wardah", name: "UV Shield Aqua Tinted Sunscreen SPF 50", category: "SUNSCREEN", actives: "UV Filters" },
  { brand: "Wardah", name: "Crystal Secret Dark Spot & Brightening Serum", category: "SERUM", actives: "Alpha Arbutin, Niacinamide" },
  { brand: "Wardah", name: "Renew You Anti Aging Intensive Serum", category: "SERUM", actives: "Retinol, Peptides" },

  // Emina
  { brand: "Emina", name: "Bright Stuff Face Wash", category: "CLEANSER", actives: "Plum Extract, Vitamin B3" },
  { brand: "Emina", name: "Bright Stuff Moisturizing Cream", category: "MOISTURIZER", actives: "Plum Extract, Vitamin E" },
  { brand: "Emina", name: "Sun Battle SPF 30 PA+++", category: "SUNSCREEN", actives: "UV Filters, Aloe Vera" },
  { brand: "Emina", name: "Sun Battle SPF 45 PA+++", category: "SUNSCREEN", actives: "UV Filters, Grape Leaf" },
  { brand: "Emina", name: "Ms. Pimple Acne Solution Face Wash", category: "CLEANSER", actives: "Salicylic Acid, Rosebay Willowherb" },
  { brand: "Emina", name: "Ms. Pimple Acne Solution Spot Gel", category: "TREATMENT", actives: "Salicylic Acid, Centella Asiatica" },

  // Azarine
  { brand: "Azarine", name: "Hydrasoothe Sunscreen Gel SPF 45 PA++++", category: "SUNSCREEN", actives: "Propolis, Aloe Vera, Green Tea" },
  { brand: "Azarine", name: "Hydramax-C Sunscreen Serum SPF 50 PA++++", category: "SUNSCREEN", actives: "Vitamin C, Hyaluronic Acid" },
  { brand: "Azarine", name: "Tone Up Mineral Sunscreen Serum SPF 50", category: "SUNSCREEN", actives: "Zinc Oxide, Titanium Dioxide" },
  { brand: "Azarine", name: "Retinol Smooth Glowing Serum", category: "SERUM", actives: "Retinol, Ceramide" },
  { brand: "Azarine", name: "Radiant Luminous Serum", category: "SERUM", actives: "Vitamin C, Niacinamide" },

  // COSRX (Highly popular in Indo)
  { brand: "COSRX", name: "Low pH Good Morning Gel Cleanser", category: "CLEANSER", actives: "Tea Tree, BHA" },
  { brand: "COSRX", name: "Salicylic Acid Daily Gentle Cleanser", category: "CLEANSER", actives: "Salicylic Acid" },
  { brand: "COSRX", name: "AHA/BHA Clarifying Treatment Toner", category: "TONER", actives: "AHA, BHA" },
  { brand: "COSRX", name: "Advanced Snail 96 Mucin Power Essence", category: "TONER", actives: "Snail Secretion Filtrate" },
  { brand: "COSRX", name: "Advanced Snail 92 All In One Cream", category: "MOISTURIZER", actives: "Snail Secretion Filtrate" },
  { brand: "COSRX", name: "Centella Blemish Cream", category: "TREATMENT", actives: "Centella Asiatica, Zinc Oxide" },
  { brand: "COSRX", name: "Acne Pimple Master Patch", category: "TREATMENT", actives: "Hydrocolloid" },

  // The Ordinary
  { brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", category: "SERUM", actives: "Niacinamide, Zinc" },
  { brand: "The Ordinary", name: "AHA 30% + BHA 2% Peeling Solution", category: "TREATMENT", actives: "AHA, BHA" },
  { brand: "The Ordinary", name: "Hyaluronic Acid 2% + B5", category: "SERUM", actives: "Hyaluronic Acid, Vitamin B5" },
  { brand: "The Ordinary", name: "Salicylic Acid 2% Solution", category: "SERUM", actives: "Salicylic Acid" },
  { brand: "The Ordinary", name: "Glycolic Acid 7% Toning Solution", category: "TONER", actives: "Glycolic Acid" },

  // CeraVe
  { brand: "CeraVe", name: "Hydrating Cleanser", category: "CLEANSER", actives: "Ceramides, Hyaluronic Acid" },
  { brand: "CeraVe", name: "Foaming Cleanser", category: "CLEANSER", actives: "Ceramides, Niacinamide" },
  { brand: "CeraVe", name: "SA Smoothing Cleanser", category: "CLEANSER", actives: "Salicylic Acid, Ceramides" },
  { brand: "CeraVe", name: "Moisturising Cream", category: "MOISTURIZER", actives: "Ceramides, Hyaluronic Acid" },
  { brand: "CeraVe", name: "Daily Moisturising Lotion", category: "MOISTURIZER", actives: "Ceramides, Hyaluronic Acid" },

  // Cetaphil
  { brand: "Cetaphil", name: "Gentle Skin Cleanser", category: "CLEANSER", actives: "Glycerin, Panthenol" },
  { brand: "Cetaphil", name: "Oily Skin Cleanser", category: "CLEANSER", actives: "Glycerin" },
  { brand: "Cetaphil", name: "Moisturising Cream", category: "MOISTURIZER", actives: "Sweet Almond Oil, Vitamin E" },
  { brand: "Cetaphil", name: "Daily Advance Ultra Hydrating Lotion", category: "MOISTURIZER", actives: "Shea Butter, Panthenol" },

  // Hada Labo
  { brand: "Hada Labo", name: "Gokujyun Ultimate Moisturizing Face Wash", category: "CLEANSER", actives: "Hyaluronic Acid" },
  { brand: "Hada Labo", name: "Gokujyun Ultimate Moisturizing Lotion", category: "TONER", actives: "Hyaluronic Acid" },
  { brand: "Hada Labo", name: "Shirojyun Ultimate Whitening Face Wash", category: "CLEANSER", actives: "Arbutin, Vitamin C" },
  { brand: "Hada Labo", name: "Shirojyun Ultimate Whitening Lotion", category: "TONER", actives: "Arbutin, Vitamin C" },

  // N'Pure
  { brand: "N'Pure", name: "Cica Clear Pad", category: "TONER", actives: "Centella Asiatica, AHA, BHA" },
  { brand: "N'Pure", name: "Cica Face Wash", category: "CLEANSER", actives: "Centella Asiatica, Green Tea" },
  { brand: "N'Pure", name: "Cica Beat The Sun SPF 50 PA++++", category: "SUNSCREEN", actives: "UV Filters, Centella Asiatica" },

  // True to Skin
  { brand: "True to Skin", name: "Bakuchiol Anti-Aging Serum", category: "SERUM", actives: "Bakuchiol, PHA" },
  { brand: "True to Skin", name: "Niacinamide Brightening Serum", category: "SERUM", actives: "Niacinamide, Zinc" },
  { brand: "True to Skin", name: "Mugwort Cica Soothing & Hydrating Gel", category: "MOISTURIZER", actives: "Mugwort, Centella Asiatica" },

  // Whitelab
  { brand: "Whitelab", name: "Brightening Face Wash", category: "CLEANSER", actives: "Niacinamide, Collagen" },
  { brand: "Whitelab", name: "Brightening Face Toner", category: "TONER", actives: "Niacinamide, Collagen" },
  { brand: "Whitelab", name: "Intense Brightening Serum", category: "SERUM", actives: "Niacinamide, Hyaluronic Acid" },
  { brand: "Whitelab", name: "Acne Calming Serum", category: "SERUM", actives: "Tea Tree, Centella Asiatica" },

  // Dear Me Beauty
  { brand: "Dear Me Beauty", name: "Skin Barrier Water Cream", category: "MOISTURIZER", actives: "Ceramides, Hyaluronic Acid" },
  { brand: "Dear Me Beauty", name: "10% Niacinamide + Watermelon Extract", category: "SERUM", actives: "Niacinamide, Watermelon Extract" },

  // Studio Tropik
  { brand: "Studio Tropik", name: "Rich Skin Barrier Cream", category: "MOISTURIZER", actives: "Squalane, Probiotics" },
  { brand: "Studio Tropik", name: "Herloom Cica Ceramides", category: "SERUM", actives: "Centella Asiatica, Ceramides" },

  // Skin Aqua
  { brand: "Skin Aqua", name: "UV Moisture Milk SPF 50 PA+++", category: "SUNSCREEN", actives: "Hyaluronic Acid, Collagen" },
  { brand: "Skin Aqua", name: "UV Moisture Gel SPF 30 PA++", category: "SUNSCREEN", actives: "Hyaluronic Acid, Vitamin B5" },
  { brand: "Skin Aqua", name: "Tone Up UV Essence SPF 50 PA++++", category: "SUNSCREEN", actives: "Hyaluronic Acid, Vitamin C" },

  // Biore
  { brand: "Biore", name: "UV Aqua Rich Watery Essence SPF 50 PA++++", category: "SUNSCREEN", actives: "Hyaluronic Acid, Royal Jelly" },
  { brand: "Biore", name: "UV Aqua Rich Watery Gel SPF 50 PA++++", category: "SUNSCREEN", actives: "Hyaluronic Acid, Royal Jelly" },

  // Lacoco
  { brand: "Lacoco", name: "Dark Spot Essence", category: "SERUM", actives: "AHA, BHA, PHA" },
  { brand: "Lacoco", name: "Watermelon Glow Mask", category: "TREATMENT", actives: "Watermelon Extract, Banana Extract" },

  // Sensatia Botanicals
  { brand: "Sensatia Botanicals", name: "Tea Tree & Lemon Facial Cleanser", category: "CLEANSER", actives: "Tea Tree, Lemon" },
  { brand: "Sensatia Botanicals", name: "Chamomile Tea Facial Toner", category: "TONER", actives: "Chamomile, Green Tea" },

  // Base
  { brand: "Base", name: "Ultra Matte Natural Sunscreen SPF 50", category: "SUNSCREEN", actives: "Zinc Oxide, Titanium Dioxide" },
  { brand: "Base", name: "Nine to Ten Hydrating Lip Balm", category: "TREATMENT", actives: "Shea Butter, Jojoba Oil" },

  // Senka
  { brand: "Senka", name: "Perfect Whip", category: "CLEANSER", actives: "Silk Essence, Hyaluronic Acid" },
  { brand: "Senka", name: "Perfect Whip Acne Care", category: "CLEANSER", actives: "Salicylic Acid, Kyoto Chamomile" },

  // Olay
  { brand: "Olay", name: "Total Effects 7 in 1 Day Cream", category: "MOISTURIZER", actives: "Niacinamide, Vitamin E" },
  { brand: "Olay", name: "Regenerist Micro-Sculpting Cream", category: "MOISTURIZER", actives: "Amino-Peptides, Hyaluronic Acid" },

  // Pond's
  { brand: "Pond's", name: "Bright Beauty Facial Foam", category: "CLEANSER", actives: "Vitamin B3" },
  { brand: "Pond's", name: "Age Miracle Night Cream", category: "MOISTURIZER", actives: "Retinol-C Complex" },

  // Garnier
  { brand: "Garnier", name: "Micellar Cleansing Water", category: "CLEANSER", actives: "Micelles" },
  { brand: "Garnier", name: "Light Complete Vitamin C Serum", category: "SERUM", actives: "Vitamin C, Yuzu Lemon" }
];

async function scrapeProducts() {
  console.log("🚀 Starting Authentic Indonesian Market Product Injection...");
  
  let totalAdded = 0;

  for (const product of realProducts) {
    const slug = `${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    
    const payload = {
      slug,
      brand: product.brand,
      name: product.name,
      category: product.category,
      activesSummary: product.actives,
      isActive: true
    };

    try {
      await prisma.skincareProduct.upsert({
        where: { slug: payload.slug },
        update: payload,
        create: payload,
      });
      totalAdded++;
    } catch (err) {
      console.error(`Failed to inject ${slug}:`, err);
    }
  }

  console.log(`\n✅ Database Injection Complete!`);
  console.log(`🎉 Successfully injected ${totalAdded} highly-specific authentic Indonesian products into the database.`);

  await createMockCase();
}

async function createMockCase() {
  console.log("\n🧪 Injecting 'WOW' Mock Case for Physician POV...");

  try {
    const user = await prisma.user.upsert({
      where: { email: "patient-wow@example.com" },
      update: {},
      create: {
        email: "patient-wow@example.com",
        name: "Budi Santoso",
      },
    });

    const newCase = await prisma.case.create({
      data: {
        publicId: `SRN-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user.id,
        status: "AI_DRAFTED",
        symptoms: ["Active Acne", "Redness", "Dark Spots"],
        note: "My skin is getting worse after using a new scrub I bought. It stings a bit.",
        regimenLines: {
          create: [
            {
              brandRaw: "Wardah",
              nameRaw: "Acnederm Pure Foaming Cleanser",
              usageSlot: "BOTH",
              source: "PICKED",
            },
            {
              brandRaw: "Scrub ABC",
              nameRaw: "Extra Deep Physical Scrub",
              usageSlot: "PM",
              source: "FREE_TEXT",
              userNote: "Bought this 2 months ago, feels like it's cleaning deeply but stings.",
            },
            {
              brandRaw: "Skintific",
              nameRaw: "5X Ceramide Barrier Repair Moisture Gel",
              usageSlot: "BOTH",
              source: "PICKED",
            },
          ],
        },
      },
    });

    const aiDraft = {
      severity: "Moderate",
      condition: "Acne Vulgaris with Post-Inflammatory Hyperpigmentation (PIH). The skin barrier is currently compromised from over-exfoliation (physical scrub).",
      routine: {
        morning: [
          { step: "Cleanse: Wardah Acnederm Pure Foaming Cleanser", productIds: [], why: "Gentle wash to remove sweat", alternatives: [] },
          { step: "Hydrate: Skintific 5X Ceramide Barrier Moisture Gel", productIds: [], why: "Barrier support", alternatives: [] },
          { step: "Protect: Azarine Hydrasoothe Sunscreen Gel SPF45", productIds: [], why: "Sunscreen is vital for PIH", alternatives: [] }
        ],
        evening: [
          { step: "Cleanse: Wardah Acnederm Pure Foaming Cleanser", productIds: [], why: "Remove pollutants", alternatives: [] },
          { step: "Treat: Azelaic Acid 10% (alternate nights)", productIds: [], why: "Target acne bacteria and PIH", alternatives: [] },
          { step: "Repair: Skintific 5X Ceramide Barrier Moisture Gel", productIds: [], why: "Overnight recovery", alternatives: [] }
        ]
      },
      routineAnalysis: [
        {
          productName: "Wardah Acnederm Pure Foaming Cleanser",
          scores: {
            concernFit: 5,
            ingredientQuality: 4,
            tolerance: 5,
            durationResult: 3,
            compatibility: 5
          },
          action: "KEEP",
          reasoning: "Solid salicylic acid cleanser that matches the acne concern well. Patient tolerates it fine."
        },
        {
          productName: "Extra Deep Physical Scrub",
          scores: {
            concernFit: 1,
            ingredientQuality: 2,
            tolerance: 0,
            durationResult: 1,
            compatibility: 1
          },
          action: "IMMEDIATE_REPLACE",
          reasoning: "Physical scrubs are contra-indicated for active acne as they spread bacteria and damage the barrier. Patient reported stinging (Score 0)."
        },
        {
          productName: "Skintific 5X Ceramide Barrier Repair Moisture Gel",
          scores: {
            concernFit: 4,
            ingredientQuality: 5,
            tolerance: 5,
            durationResult: 4,
            compatibility: 5
          },
          action: "KEEP",
          reasoning: "Excellent barrier repair formulation. High concentration of ceramides helps recover from the scrub damage."
        }
      ],
      next7Days: ["Stop the physical scrub immediately", "Use cold water only", "Focus on Skintific moisturizer"],
      next30Days: ["Introduce gentle chemical exfoliant", "Continue SPF 50 daily"]
    };

    await prisma.report.create({
      data: {
        caseId: newCase.id,
        contentJson: { aiDraft },
      },
    });

    await prisma.aiJob.create({
      data: {
        caseId: newCase.id,
        status: "SUCCEEDED",
        inputJson: {
          intake: {
            chiefComplaint: ["Acne", "Dark spots"],
            duration: "2 months",
            severity: "MODERATE",
            oilAfterWash: "OILY",
            stingsWithProducts: true,
            easyRed: true,
            extraNote: "It stings a lot when I use the scrub.",
          },
        },
        outputJson: { aiDraft },
      },
    });

    console.log(`✅ Mock Case Created for Budi Santoso! (ID: ${newCase.publicId})`);
  } catch (err) {
    console.error("Failed to create mock case:", err);
  }
}

scrapeProducts()
  .catch((e) => {
    console.error("Scraper encountered a critical error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

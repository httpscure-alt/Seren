import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🛠️ Injecting 'WOW' Mock Case (Plain JS)...");

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
    condition: "Acne Vulgaris with Post-Inflammatory Hyperpigmentation (PIH) and potentially impaired skin barrier from over-exfoliation.",
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

  console.log(`\n✅ Mock Case Created!`);
  console.log(`👤 Patient: Budi Santoso`);
  console.log(`🆔 Public ID: ${newCase.publicId}`);
  console.log(`🔗 View it at: http://localhost:3000/physician`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

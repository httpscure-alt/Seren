import "dotenv/config";
import { PrismaClient, CaseStatus, RegimenUsageSlot, RegimenLineSource } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🛠️ Injecting 'WOW' Mock Case for Physician POV...");

  // 1. Get or create a user
  const user = await prisma.user.upsert({
    where: { email: "patient-wow@example.com" },
    update: {},
    create: {
      email: "patient-wow@example.com",
      name: "Budi Santoso",
    },
  });

  // 2. Create the case
  const newCase = await prisma.case.create({
    data: {
      publicId: `SRN-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      status: CaseStatus.AI_DRAFTED,
      symptoms: ["Active Acne", "Redness", "Dark Spots"],
      note: "My skin is getting worse after using a new scrub I bought. It stings a bit.",
      regimenLines: {
        create: [
          {
            brandRaw: "Wardah",
            nameRaw: "Acnederm Pure Foaming Cleanser",
            usageSlot: RegimenUsageSlot.BOTH,
            source: RegimenLineSource.PICKED,
          },
          {
            brandRaw: "Scrub ABC",
            nameRaw: "Extra Deep Physical Scrub",
            usageSlot: RegimenUsageSlot.PM,
            source: RegimenLineSource.FREE_TEXT,
            userNote: "Bought this 2 months ago, feels like it's cleaning deeply but stings.",
          },
          {
            brandRaw: "Skintific",
            nameRaw: "5X Ceramide Barrier Repair Moisture Gel",
            usageSlot: RegimenUsageSlot.BOTH,
            source: RegimenLineSource.PICKED,
          },
        ],
      },
    },
  });

  // 3. Create the AI Draft with the 5-Pillar Scoring Report Card
  const aiDraft = {
    severity: "Moderate",
    condition: "Acne Vulgaris with Post-Inflammatory Hyperpigmentation (PIH) and potentially impaired skin barrier from over-exfoliation.",
    routine: {
      morning: [
        { step: "Cleanse", productIds: [], why: "Gentle wash to remove sweat", alternatives: [] },
        { step: "Hydrate", productIds: [], why: "Barrier support", alternatives: [] },
        { step: "Protect", productIds: [], why: "Sunscreen is vital for PIH", alternatives: [] }
      ],
      evening: [
        { step: "Cleanse", productIds: [], why: "Remove pollutants", alternatives: [] },
        { step: "Treat", productIds: [], why: "Target acne bacteria", alternatives: [] },
        { step: "Repair", productIds: [], why: "Overnight recovery", alternatives: [] }
      ]
    },
    // THIS IS THE NEW SCORING FRAMEWORK
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

  // 4. Attach the report
  await prisma.report.create({
    data: {
      caseId: newCase.id,
      contentJson: { aiDraft },
    },
  });

  // 5. Add a mock AI Job entry
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

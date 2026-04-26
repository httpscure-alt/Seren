/**
 * Seeds 1–2 real cases with intake answers that match the digital intake form.
 * This is for demoing the physician portal with real DB rows (no mock-* IDs).
 */
import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { makePublicCaseId } from "../src/lib/publicId";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

async function main() {
  const connectionString = mustEnv("DATABASE_URL");
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const now = Date.now();

  const emmy = await prisma.user.upsert({
    where: { email: "emmy@seren.local" },
    create: {
      email: "emmy@seren.local",
      name: "Emmy Noviawati",
      role: Role.USER,
      // password is set during signup already; keep null here.
    },
    update: { name: "Emmy Noviawati", role: Role.USER },
    select: { id: true },
  });

  const sarah = await prisma.user.upsert({
    where: { email: "sarah@seren.local" },
    create: {
      email: "sarah@seren.local",
      name: "Sarah Jenkins",
      role: Role.USER,
    },
    update: { name: "Sarah Jenkins", role: Role.USER },
    select: { id: true },
  });

  const sampleIntake1 = {
    v: 1,
    age: 27,
    gender: "FEMALE",
    chiefComplaint: ["Acne", "Sensitive / easily irritated"],
    duration: "3 months",
    severity: "MODERATE",
    onset: "After switching skincare (retinol) + stress",
    course: "FLARES",
    oilAfterWash: "2-4H",
    oilyAreas: ["T_ZONE"],
    afterWashFeel: "TIGHT",
    barrierSigns: ["DRY_FEEL", "ITCHY"],
    easyRed: true,
    stingsWithProducts: true,
    historyAllergy: false,
    sensitivityNote: "Stings with retinol, benzoyl peroxide.",
    acneActive: true,
    darkSpots: true,
    pigmentationTypes: ["ACNE_MARKS"],
    extraNote: "Often outdoors. Sunscreen sometimes pills.",
  };

  const sampleIntake2 = {
    v: 1,
    age: 31,
    gender: "FEMALE",
    chiefComplaint: ["Dark spots / hyperpigmentation", "Dullness"],
    duration: "1 year",
    severity: "MILD",
    onset: "After acne improved",
    course: "STABLE",
    oilAfterWash: "4H+",
    oilyAreas: ["NONE"],
    afterWashFeel: "NORMAL",
    barrierSigns: [],
    easyRed: false,
    stingsWithProducts: false,
    historyAllergy: false,
    sensitivityNote: "",
    acneActive: false,
    darkSpots: true,
    pigmentationTypes: ["MELASMA", "FRECKLES"],
    extraNote: "Works indoors, wants brighter tone safely.",
  };

  async function createCase(opts: {
    userId: string;
    intake: any;
    symptoms: string[];
    note: string;
    status: "SUBMITTED" | "AI_DRAFTED" | "UNDER_REVIEW";
    withAiDraft: boolean;
  }) {
    let publicId = makePublicCaseId();
    // cheap uniqueness loop
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.case.findUnique({ where: { publicId } });
      if (!exists) break;
      publicId = makePublicCaseId();
    }

    const created = await prisma.case.create({
      data: {
        publicId,
        userId: opts.userId,
        status: opts.status as any,
        symptoms: opts.symptoms,
        note: opts.note,
        aiJobs: {
          create: {
            status: "SUCCEEDED",
            inputJson: { symptoms: opts.symptoms, note: opts.note, intake: opts.intake },
            outputJson: opts.withAiDraft
              ? {
                  aiDraft: {
                    severity: "Moderate",
                    condition: "Inflammatory acne with barrier stress and reactive sensitivity.",
                    routine: {
                      morning: ["Gentle cleanser", "Barrier moisturizer", "SPF 50+"],
                      evening: [
                        "Gentle cleanse",
                        "Azelaic acid (low %) alternate nights",
                        "Barrier repair cream",
                      ],
                    },
                  },
                }
              : undefined,
          },
        },
        report: opts.withAiDraft
          ? {
              create: {
                contentJson: {
                  aiDraft: {
                    severity: "Moderate",
                    condition: "Inflammatory acne with barrier stress and reactive sensitivity.",
                    routine: {
                      morning: ["Gentle cleanser", "Barrier moisturizer", "SPF 50+"],
                      evening: [
                        "Gentle cleanse",
                        "Azelaic acid (low %) alternate nights",
                        "Barrier repair cream",
                      ],
                    },
                  },
                  clinicianEdits: { diagnosis: "", routine: "", updatedAt: new Date(now).toISOString() },
                },
              },
            }
          : undefined,
      },
      select: { id: true, publicId: true, status: true },
    });

    return created;
  }

  const c1 = await createCase({
    userId: emmy.id,
    intake: sampleIntake1,
    symptoms: ["Acne", "Sensitive / easily irritated"],
    note: "Jawline breakouts. Stings with retinol/BPO.",
    status: "AI_DRAFTED",
    withAiDraft: true,
  });

  const c2 = await createCase({
    userId: sarah.id,
    intake: sampleIntake2,
    symptoms: ["Dark spots / hyperpigmentation", "Dullness"],
    note: "Wants tone-evening plan, minimal irritation.",
    status: "SUBMITTED",
    withAiDraft: false,
  });

  console.log("Seeded sample cases:", c1, c2);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


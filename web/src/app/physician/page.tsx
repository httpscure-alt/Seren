import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { requireRole } from "@/lib/authz";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PhysicianPortalClient } from "./PhysicianPortalClient";

export default async function PhysicianPortalPage() {
  const session = await requireRole(["PHYSICIAN", "ADMIN"]);
  if (!session) redirect("/auth?returnTo=%2Fphysician");

  const cases = await prisma.case.findMany({
    where: { status: { in: ["AI_DRAFTED", "UNDER_REVIEW", "SUBMITTED"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      publicId: true,
      status: true,
      createdAt: true,
      symptoms: true,
      note: true,
      uploads: { select: { id: true, kind: true, url: true, createdAt: true } },
      aiJobs: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, status: true, inputJson: true, createdAt: true },
      },
      report: {
        select: {
          id: true,
          publishedAt: true,
          clinicianId: true,
          contentJson: true,
          updatedAt: true,
        },
      },
      user: { select: { email: true, name: true } },
    },
  });

  const mockCases =
    cases.length > 0
      ? cases
      : ([
          {
            id: "mock-case-emmy",
            publicId: "SRN-1204",
            status: "AI_DRAFTED",
            createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
            symptoms: ["Acne", "Redness", "Texture"],
            note: "Breakouts around jawline. Sensitive to new actives.",
            uploads: [
              {
                id: "mock-upload-emmy-1",
                kind: "primary",
                url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=70",
                createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
              },
            ],
            report: {
              id: "mock-report-emmy",
              publishedAt: null,
              clinicianId: null,
              updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
              contentJson: {
                aiDraft: {
                  severity: "Moderate",
                  condition: "Inflammatory acne with barrier stress and reactive sensitivity.",
                  routine: {
                    morning: ["Gentle cleanser", "Barrier moisturizer", "SPF 50+"],
                    evening: ["Gentle cleanse", "Azelaic acid (low %) alternate nights", "Barrier repair cream"],
                  },
                },
                clinicianEdits: {
                  diagnosis: "",
                  routine: "",
                },
              },
            },
            user: { email: "emmy.noviawati@demo.local", name: "Emmy Noviawati" },
          },
          {
            id: "mock-case-2",
            publicId: "SRN-1188",
            status: "SUBMITTED",
            createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
            symptoms: ["Hyperpigmentation", "Uneven tone"],
            note: "Post-inflammatory marks after acne.",
            uploads: [],
            report: null,
            user: { email: "sarah.jenkins@demo.local", name: "Sarah Jenkins" },
          },
        ] as any[]);

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <PhysicianPortalClient initialCases={mockCases as any} />

      <SiteFooter />
    </div>
  );
}


import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { PostIntakePendingPaymentView } from "@/components/results/PostIntakePendingPaymentView";
import { requireSignedInPatientUser } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { hasActiveSubscription } from "@/lib/entitlement";

function goalsFromIntakeAndProfile(intakeJson: Prisma.JsonValue | null, skinGoals: string | null): string[] {
  const fromProfile = (skinGoals ?? "")
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromProfile.length) return fromProfile.slice(0, 14);
  if (intakeJson && typeof intakeJson === "object" && !Array.isArray(intakeJson)) {
    const rec = intakeJson as Record<string, unknown>;
    const g = rec.skinGoals;
    if (Array.isArray(g) && g.every((x) => typeof x === "string")) return (g as string[]).slice(0, 14);
    const goals = rec.goals;
    if (Array.isArray(goals) && goals.every((x) => typeof x === "string")) return (goals as string[]).slice(0, 14);
  }
  return [];
}

export default async function ResultsPendingPaymentPage() {
  const returnPath = "/results/pending-payment";
  const session = await requireSignedInPatientUser(returnPath);
  const userId = (session as { userId?: string }).userId!;

  if (await hasActiveSubscription(userId)) {
    redirect("/results");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { skinGoals: true },
  });

  const submittedCase = await prisma.case.findFirst({
    where: { userId, NOT: { status: "DRAFT" } },
    orderBy: { createdAt: "desc" },
    select: {
      symptoms: true,
      intakeJson: true,
      createdAt: true,
      _count: { select: { uploads: true } },
    },
  });

  if (!submittedCase) {
    const draft = await prisma.case.findFirst({
      where: { userId, status: "DRAFT" },
      select: { id: true },
    });
    redirect(draft ? "/consult/intake" : "/consult/welcome");
  }

  const concerns = submittedCase.symptoms.length > 0 ? submittedCase.symptoms : [];
  const goals = goalsFromIntakeAndProfile(submittedCase.intakeJson, user?.skinGoals ?? null);
  const uploadedImagesCount = submittedCase._count.uploads;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface text-on-surface">
      <SiteNavbar />
      <div className="flex-1 pt-24 sm:pt-28">
        <PostIntakePendingPaymentView
          variant="live"
          showStandaloneBrandHeader={false}
          concerns={concerns}
          goals={goals}
          hasUploadedPhotos={uploadedImagesCount > 0}
          uploadedImagesCount={uploadedImagesCount}
          createdAt={submittedCase.createdAt}
          selectedPlan={null}
          paywallReturnTo={returnPath}
        />
      </div>
      <SiteFooter />
    </div>
  );
}

"use client";

import { PostIntakePendingPaymentView } from "@/components/results/PostIntakePendingPaymentView";

const MOCK = {
  selectedPlan: "journey" as "single" | "journey" | null,
  hasUploadedPhotos: true,
  uploadedImagesCount: 3,
  concerns: ["Acne breakouts", "Redness", "Uneven texture"],
  goals: ["Barrier repair", "Clearer tone", "Fewer flare-ups"],
  createdAt: new Date("2026-05-12T14:32:00"),
};

export function UnpaidDashboardMockClient() {
  return (
    <PostIntakePendingPaymentView
      variant="demo"
      concerns={MOCK.concerns}
      goals={MOCK.goals}
      hasUploadedPhotos={MOCK.hasUploadedPhotos}
      uploadedImagesCount={MOCK.uploadedImagesCount}
      createdAt={MOCK.createdAt}
      selectedPlan={MOCK.selectedPlan}
      paywallReturnTo="/results"
    />
  );
}

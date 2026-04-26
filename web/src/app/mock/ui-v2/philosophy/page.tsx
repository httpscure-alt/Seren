import { UiV2Philosophy } from "@/components/UiV2Philosophy";

export default async function MockUiV2PhilosophyPage() {
  return (
    <UiV2Philosophy
      homeHref="/mock/ui-v2"
      philosophyHref="/mock/ui-v2/philosophy"
      profileHref="/mock/ui-v2/profile"
    />
  );
}


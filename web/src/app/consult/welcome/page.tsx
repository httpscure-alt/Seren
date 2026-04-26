import type { Metadata } from "next";
import { ConsultWelcomeScreen } from "@/components/ConsultWelcomeScreen";

export const metadata: Metadata = {
  title: "Before your consultation",
  description:
    "What to expect before you begin: a short assessment, clear photos, and dermatologist-reviewed guidance.",
};

export default function ConsultWelcomePage() {
  return <ConsultWelcomeScreen />;
}

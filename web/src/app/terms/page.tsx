import type { Metadata } from "next";
import { siteOgForPath } from "@/lib/marketingOg";
import { TermsDocument } from "./TermsDocument";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms governing the use of Seren and our clinical consultation experience.",
  alternates: { canonical: "/terms" },
  ...siteOgForPath("/terms"),
};

export default async function TermsPage() {
  return <TermsDocument />;
}

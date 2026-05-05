import type { Metadata } from "next";
import { PitchChrome } from "@/components/pitch/PitchChrome";
import { PitchPrintActions } from "@/components/pitch/PitchPrintActions";
import { PitchVcMemoBody } from "@/components/pitch/PitchVcMemoBody";
import { resolvePitchAccess } from "@/lib/investorPitchProposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Seren — VC memo (export)",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type PageProps = { searchParams: Promise<{ t?: string | string[] } | undefined> };

export default async function PitchVcPrintPage({ searchParams }: PageProps) {
  const { query } = await resolvePitchAccess(searchParams);

  return (
    <div className="pitch-vc-pdf-root">
      <PitchChrome query={query} layout="content">
        <PitchPrintActions interactiveHref={`/pitch/vc${query}`} />
        <PitchVcMemoBody forExport={false} />
      </PitchChrome>
    </div>
  );
}

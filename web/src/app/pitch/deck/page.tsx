import type { Metadata } from "next";
import { PitchChrome, PitchDeckHero, PitchDeckSection } from "@/components/pitch/PitchChrome";
import { InvestorPitchProposalIframe, resolvePitchAccess } from "@/lib/investorPitchProposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pitch — full deck",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type PageProps = { searchParams: Promise<{ t?: string }> };

export default async function PitchDeckPage({ searchParams }: PageProps) {
  const { query } = await resolvePitchAccess(searchParams);

  return (
    <PitchChrome query={query}>
      <PitchDeckHero
        eyebrow="visual one-pager"
        title="pre-seed funding deck"
        tagline="scroll inside the frame · use nav for audience memos"
        compact
      />
      <PitchDeckSection tone="mist">
        <div className="pitch-editorial-shadow mx-auto max-w-6xl overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest/90 p-2 sm:p-3">
          <InvestorPitchProposalIframe embedded />
        </div>
      </PitchDeckSection>
    </PitchChrome>
  );
}

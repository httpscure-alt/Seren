import type { Metadata } from "next";
import { InvestorPitchProposalIframe, requireInvestorDeckPathSecret } from "@/lib/investorPitchProposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Investor deck — confidential",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, noarchive: true } },
};

/** Secret path segment equals `process.env.INVESTOR_DECK_PATH_SECRET` — no nav links here. */
type Props = { params: Promise<{ slug: string }> };

export default async function InvestorDeckPathPage({ params }: Props) {
  const { slug } = await params;
  await requireInvestorDeckPathSecret(slug);

  return (
    <div className="min-h-[100dvh] bg-[#faf9f6]">
      <p className="sr-only">
        Confidential Seren investor materials. Share only with explicit permission.
      </p>
      <InvestorPitchProposalIframe embedded={false} />
    </div>
  );
}

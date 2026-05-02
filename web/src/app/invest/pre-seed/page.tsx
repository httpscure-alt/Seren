import { redirect } from "next/navigation";
import { resolvePitchAccess } from "@/lib/investorPitchProposal";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ t?: string }> };

/** Canonical pitch deck lives under `/pitch/deck`; keep this URL as a stable alias. */
export default async function InvestPreSeedRedirect({ searchParams }: PageProps) {
  const { query } = await resolvePitchAccess(searchParams);
  redirect(`/pitch/deck${query}`);
}

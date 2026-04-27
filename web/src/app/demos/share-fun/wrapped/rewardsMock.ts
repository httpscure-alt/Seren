/**
 * Mock catalog for referral (Seren) points — replace with DB + admin CMS later.
 */
export type RewardCategory = "SUBSCRIPTION" | "CASH" | "TREATMENT";

export type ReferralRewardRow = {
  id: string;
  /** Short label in the table */
  name: string;
  category: RewardCategory;
  /** Plain language: what the member actually receives */
  youGet: string;
  pointsCost: number;
  /**
   * Rough retail / cash equivalent in IDR so people can sanity-check point cost (mock only).
   * null = not a simple IDR amount (e.g. extension).
   */
  approxValueIdr: number | null;
  /** Short caveats: eligibility, tax, partner limits */
  goodToKnow: string;
};

export const CATEGORY_SECTION: Record<
  RewardCategory,
  { title: string; description: string }
> = {
  SUBSCRIPTION: {
    title: "Subscription & app access",
    description:
      "Spend points on more time inside Seren—extensions and extra assessment credits. Applies to digital plans only.",
  },
  CASH: {
    title: "Cash rewards",
    description:
      "Exchange points for money sent to your bank or e-wallet after identity checks. Amounts and tax rules TBD with finance.",
  },
  TREATMENT: {
    title: "In-person treatment",
    description:
      "Redeem for vouchers or credits at Seren partner clinics—facials, consults, or procedures where available.",
  },
};

/** Display order: clinic first (hero), subscription middle, cash last. */
const CATEGORY_ORDER: RewardCategory[] = ["TREATMENT", "SUBSCRIPTION", "CASH"];

export function rewardsGrouped(): { category: RewardCategory; rows: ReferralRewardRow[] }[] {
  const byCat = new Map<RewardCategory, ReferralRewardRow[]>();
  for (const c of CATEGORY_ORDER) byCat.set(c, []);
  for (const r of REFERRAL_REWARDS_MOCK) {
    byCat.get(r.category)!.push(r);
  }
  return CATEGORY_ORDER.map((category) => ({
    category,
    rows: (byCat.get(category) ?? []).sort((a, b) => a.pointsCost - b.pointsCost),
  }));
}

export const REFERRAL_REWARDS_MOCK: ReferralRewardRow[] = [
  {
    id: "sub-7d",
    name: "7-day Journey extension",
    category: "SUBSCRIPTION",
    youGet: "Adds 7 calendar days to your active Journey subscription so your plan stays unlocked longer.",
    pointsCost: 1_200,
    approxValueIdr: null,
    goodToKnow: "Mock: only if you already have an active Journey. Cannot be sold or transferred.",
  },
  {
    id: "sub-single",
    name: "One full assessment credit",
    category: "SUBSCRIPTION",
    youGet: "One additional end-to-end assessment cycle (new photos + derm review path)—same as buying a single track once.",
    pointsCost: 2_400,
    approxValueIdr: 350_000,
    goodToKnow: "Mock anchor only. Real catalog price may differ. Non-refundable once redeemed.",
  },
  {
    id: "cash-50",
    name: "Cash — Rp 50,000",
    category: "CASH",
    youGet: "Rp 50,000 transferred to your verified bank account or supported e-wallet after processing.",
    pointsCost: 800,
    approxValueIdr: 50_000,
    goodToKnow: "Mock: KYC required. Withholding tax may apply. Weekly payout cap may apply later.",
  },
  {
    id: "cash-150",
    name: "Cash — Rp 150,000",
    category: "CASH",
    youGet: "Rp 150,000 transferred the same way as smaller cash rewards—larger lump sum.",
    pointsCost: 2_200,
    approxValueIdr: 150_000,
    goodToKnow: "Mock: may require minimum successful referrals or account age—rules TBD.",
  },
  {
    id: "trx-basic",
    name: "Partner facial voucher",
    category: "TREATMENT",
    youGet: "Voucher for a basic facial (or equivalent) at a participating Seren partner clinic in eligible cities.",
    pointsCost: 3_500,
    approxValueIdr: 400_000,
    goodToKnow: "Mock: subject to partner inventory, booking rules, and expiry. Not all locations.",
  },
  {
    id: "trx-derm",
    name: "In-clinic dermatologist consult credit",
    category: "TREATMENT",
    youGet: "Credit toward an in-person consult fee at a partner clinic—reduces what you pay at checkout.",
    pointsCost: 6_500,
    approxValueIdr: 750_000,
    goodToKnow: "Mock: does not guarantee appointment slot; clinic policies apply. May not stack with promos.",
  },
  {
    id: "trx-laser",
    name: "Procedure credit (tier 1)",
    category: "TREATMENT",
    youGet: "Credit toward a defined list of laser / energy-device sessions (tier 1) at partner sites.",
    pointsCost: 15_000,
    approxValueIdr: 2_000_000,
    goodToKnow: "Mock: medical eligibility required; large redemptions may need manual approval.",
  },
];

export function categoryLabel(c: RewardCategory): string {
  switch (c) {
    case "SUBSCRIPTION":
      return "App / subscription";
    case "CASH":
      return "Cash";
    case "TREATMENT":
      return "Clinic treatment";
    default:
      return c;
  }
}

export function categoryBadgeClass(c: RewardCategory): string {
  switch (c) {
    case "SUBSCRIPTION":
      return "border-primary/25 bg-primary/10 text-primary";
    case "CASH":
      return "border-amber-700/30 bg-amber-500/15 text-amber-950";
    case "TREATMENT":
      return "border-tertiary/30 bg-tertiary-container/50 text-on-tertiary-container";
    default:
      return "border-outline-variant/20 bg-surface text-on-surface/70";
  }
}

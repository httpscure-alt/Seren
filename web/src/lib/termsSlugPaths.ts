/**
 * Path segments for `/terms/[slug]` — no hashes or query strings for PSP forms.
 */

export type TermsSlug =
  | "clinical"
  | "privacy"
  | "security"
  | "payments"
  | "refund"
  | "disputes"
  | "merchant";

export const TERMS_SLUGS = [
  "clinical",
  "privacy",
  "security",
  "payments",
  "refund",
  "disputes",
  "merchant",
] as const satisfies readonly TermsSlug[];

const BY_SLUG: Record<TermsSlug, { en: string; id: string }> = {
  clinical: { en: "clinical-responsibility", id: "tanggung-jawab-klinis" },
  privacy: { en: "data-privacy", id: "privasi-data" },
  security: { en: "security-protocol", id: "protokol-keamanan" },
  payments: { en: "payments-and-promotions", id: "pembayaran-dan-promo" },
  refund: { en: "refund", id: "refund" },
  disputes: { en: "dispute-resolution", id: "penyelesaian-sengketa" },
  merchant: { en: "contact", id: "kontak" },
};

export function slugForSectionId(sectionId: string): TermsSlug | null {
  const entry = (Object.entries(BY_SLUG) as Array<[TermsSlug, { en: string; id: string }]>).find(
    ([, v]) => v.en === sectionId || v.id === sectionId,
  );
  return entry ? entry[0] : null;
}

export function sectionIdForSlug(slug: string, lang: "en" | "id"): string | null {
  if (!TERMS_SLUGS.includes(slug as TermsSlug)) return null;
  const row = BY_SLUG[slug as TermsSlug];
  return lang === "id" ? row.id : row.en;
}

export function termsPath(slug: TermsSlug): string {
  return `/terms/${slug}`;
}

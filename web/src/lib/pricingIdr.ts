/** Canonical IDR amounts for checkout, DOKU charges, and marketing copy (keep in sync). */
export const PRICING_SINGLE_IDR = 79_000;
export const PRICING_JOURNEY_30D_IDR = 199_000;

export function formatIdr(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

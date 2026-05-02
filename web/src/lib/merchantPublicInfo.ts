export const MERCHANT_LEGAL_NAME = "PT Sene Kamayu Venture";

export type MerchantPublicContact = {
  companyName: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
};

export function merchantPublicContact(): MerchantPublicContact {
  const rawPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "+6285129786294";
  const phoneHref = `tel:${rawPhone.replace(/\s+/g, "")}`;
  return {
    companyName: MERCHANT_LEGAL_NAME,
    address:
      process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() ||
      "Masjid Barkah, Manggarai Selatan, Tebet, Jakarta Selatan, DKI Jakarta",
    phoneDisplay: rawPhone,
    phoneHref,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "httpscure@gmail.com",
  };
}

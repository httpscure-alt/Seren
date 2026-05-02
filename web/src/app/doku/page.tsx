import type { Metadata } from "next";
import { siteOgForPath } from "@/lib/marketingOg";
import { DokuDisclosure } from "@/components/DokuDisclosure";

export const metadata: Metadata = {
  title: "Informasi merchant DOKU · DOKU merchant disclosure",
  description:
    "URL aktif untuk pendaftaran DOKU: produk, harga, syarat & ketentuan, refund, dan kontak pemilik website Seren.",
  alternates: { canonical: "/doku" },
  ...siteOgForPath("/doku"),
};

export default function DokuMerchantIndexPage() {
  return <DokuDisclosure />;
}

import type { Metadata } from "next";
import { LegalScrollToSection } from "@/components/LegalScrollToSection";
import { DokuDisclosure } from "@/components/DokuDisclosure";
import { siteOgForPath } from "@/lib/marketingOg";

export const metadata: Metadata = {
  title: "Produk & harga Seren · DOKU",
  description:
    "Produk langganan digital Seren untuk konsultasi dermatologi AI + review dokter, harga IDR untuk pembayaran via DOKU.",
  alternates: { canonical: "/doku/produk" },
  ...siteOgForPath("/doku/produk"),
};

export default function DokuProductsPage() {
  return (
    <>
      <LegalScrollToSection domId="produk" />
      <DokuDisclosure focus="produk" />
    </>
  );
}

import type { Metadata } from "next";
import { LegalScrollToSection } from "@/components/LegalScrollToSection";
import { DokuDisclosure } from "@/components/DokuDisclosure";
import { siteOgForPath } from "@/lib/marketingOg";

export const metadata: Metadata = {
  title: "Syarat & ketentuan (DOKU) · Seren",
  description:
    "Syarat & ketentuan layanan Seren untuk transaksi pembayaran terkait DOKU dan link ke Ketentuan Layanan lengkap.",
  alternates: { canonical: "/doku/ketentuan" },
  ...siteOgForPath("/doku/ketentuan"),
};

export default function DokuTermsPage() {
  return (
    <>
      <LegalScrollToSection domId="tnc" />
      <DokuDisclosure focus="tnc" />
    </>
  );
}

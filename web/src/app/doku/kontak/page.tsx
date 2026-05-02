import type { Metadata } from "next";
import { LegalScrollToSection } from "@/components/LegalScrollToSection";
import { DokuDisclosure } from "@/components/DokuDisclosure";
import { siteOgForPath } from "@/lib/marketingOg";

export const metadata: Metadata = {
  title: "Kontak merchant · DOKU / Seren",
  description:
    "Kontak PT Sene Kamayu Venture (Seren): telepon, email, dan alamat untuk pembayaran & keluhan pembayaran DOKU.",
  alternates: { canonical: "/doku/kontak" },
  ...siteOgForPath("/doku/kontak"),
};

export default function DokuContactPage() {
  return (
    <>
      <LegalScrollToSection domId="kontak" />
      <DokuDisclosure focus="kontak" />
    </>
  );
}

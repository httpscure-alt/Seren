import type { Metadata } from "next";
import { LegalScrollToSection } from "@/components/LegalScrollToSection";
import { DokuDisclosure } from "@/components/DokuDisclosure";
import { siteOgForPath } from "@/lib/marketingOg";

export const metadata: Metadata = {
  title: "Kebijakan refund · DOKU / Seren",
  description:
    "Kebijakan pengembalian dana dan penanganan keluhan pembayaran digital Seren bagi pelanggan DOKU PT Sene Kamayu Venture.",
  alternates: { canonical: "/doku/refund" },
  ...siteOgForPath("/doku/refund"),
};

export default function DokuRefundPage() {
  return (
    <>
      <LegalScrollToSection domId="refund" />
      <DokuDisclosure focus="refund" />
    </>
  );
}

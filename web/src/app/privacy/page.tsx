import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  LegalFrameworkLayout,
  type LegalFrameworkSection,
} from "@/components/LegalFrameworkLayout";
import { getDictionary } from "@/i18n/getDictionary";
import type { Metadata } from "next";
import { siteOgForPath } from "@/lib/marketingOg";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Seren collects, uses, and protects your account, consultation details, and clinical photos.",
  alternates: { canonical: "/privacy" },
  ...siteOgForPath("/privacy"),
};

export default async function PrivacyPage() {
  const { lang } = await getDictionary();
  const isId = lang === "id";

  const frameworkLabel = isId ? "KERANGKA HUKUM" : "LEGAL FRAMEWORK";
  const pageTitle = isId ? "kebijakan privasi" : "privacy policy";
  const updated = isId ? "Terakhir diperbarui: 16 Apr 2026" : "Last updated: Apr 16, 2026";
  const intro = isId
    ? "Kami menjelaskan data apa yang kami kumpulkan, mengapa kami membutuhkannya, dan bagaimana kamu dapat mengontrolnya. Privasi adalah bagian dari standar klinis Seren."
    : "We explain what we collect, why we need it, and how you can control it. Privacy is part of Seren’s clinical standards.";

  const banner = {
    line1: isId ? "Data klinis aman" : "Clinical data stewardship",
    line2: isId
      ? "Menjaga foto, keluhan, dan riwayat konsultasimu dengan transparansi dan perlindungan yang konsisten."
      : "Safeguarding your photos, concerns, and consultation history with transparency and consistent protection.",
  };

  const ctaTitle = isId ? "Ada pertanyaan tentang privasi?" : "Questions about privacy?";
  const ctaLinkText = isId ? "hubungi tim privasi" : "contact privacy";
  const disclaimer = isId
    ? "Ringkasan ini untuk informasi umum. Versi final harus ditinjau penasihat hukum sebelum peluncuran publik."
    : "This summary is for general information. Final wording should be reviewed by counsel before public launch.";

  const sections: LegalFrameworkSection[] = isId
    ? [
        {
          id: "data-yang-dikumpulkan",
          navLabel: "Data yang dikumpulkan",
          number: "01",
          name: "Data yang dikumpulkan",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Kami mengumpulkan data akun (nama, email), data konsultasi (keluhan, gejala, jawaban intake), foto klinis yang kamu unggah, serta data teknis terbatas (log, perangkat/browser) untuk keandalan layanan.",
              ],
            },
            {
              type: "callout",
              title: "minimalisasi data",
              body: "Kami hanya meminta informasi yang relevan untuk penilaian klinis dan penyediaan laporan. Kamu dapat menolak memberikan data opsional; beberapa fitur mungkin terbatas.",
            },
          ],
        },
        {
          id: "penggunaan-data",
          navLabel: "Penggunaan data",
          number: "02",
          name: "Penggunaan data",
          bannerAfter: true,
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Data digunakan untuk menyusun ringkasan kondisi kulit, rutinitas, jalur perawatan, dan untuk memungkinkan review serta penandatanganan oleh dokter kulit.",
              ],
            },
            {
              type: "features",
              left: {
                icon: "lock",
                title: "enkripsi & akses",
                body: "Kontrol akses berbasis peran dan enkripsi saat transit untuk melindungi data sensitif.",
              },
              right: {
                icon: "eye",
                title: "transparansi",
                body: "Kamu dapat meminta penjelasan ringkas tentang pemrosesan utama melalui kontak privasi.",
              },
            },
            {
              type: "paragraphs",
              paragraphs: [
                "Kami juga menggunakan data agregat atau teranonimkan untuk meningkatkan produk, tanpa mengidentifikasi individu kecuali dengan persetujuan terpisah jika diperlukan.",
              ],
            },
          ],
        },
        {
          id: "berbagi-data",
          navLabel: "Berbagi data",
          number: "03",
          name: "Berbagi data",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Kami tidak menjual data pribadi kamu. Data dapat dibagikan kepada dokter/klinisi yang menangani kasusmu dan kepada penyedia infrastruktur (hosting, penyimpanan) yang membantu menjalankan layanan, sesuai perjanjian kerahasiaan.",
                "Kami dapat mengungkapkan informasi jika diwajibkan oleh hukum atau untuk melindungi hak dan keamanan pengguna.",
              ],
            },
          ],
        },
        {
          id: "protokol-keamanan",
          navLabel: "Protokol keamanan",
          number: "04",
          name: "Protokol keamanan",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Kami menerapkan langkah keamanan wajar secara industri. Tidak ada sistem yang 100% aman; kami akan memberi tahu kamu tentang pelanggaran material sesuai kewajiban hukum.",
              ],
            },
            {
              type: "quote",
              body: "Melindungi data kesehatan berarti memperlakukan setiap unggahan foto dengan tingkat kehati-hatian yang sama seperti catatan klinis.",
              attribution: "— tim keamanan & kepatuhan (internal)",
            },
          ],
        },
        {
          id: "hak-dan-kontak",
          navLabel: "Hak & kontak",
          number: "05",
          name: "Hak & kontak",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Tergantung hukum yang berlaku, kamu dapat meminta akses, koreksi, atau penghapusan data tertentu. Menarik persetujuan untuk pemrosesan dapat membatasi layanan.",
                "Pertanyaan privasi: privacy@seren.example",
              ],
            },
          ],
        },
      ]
    : [
        {
          id: "information-we-collect",
          navLabel: "Information we collect",
          number: "01",
          name: "Information we collect",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "We collect account data (name, email), consultation data (concerns, symptoms, intake responses), clinical photos you upload, and limited technical data (logs, device/browser) for service reliability.",
              ],
            },
            {
              type: "callout",
              title: "data minimization",
              body: "We only ask for information needed for clinical assessment and reporting. You may decline optional fields; some features may be limited.",
            },
          ],
        },
        {
          id: "how-we-use-data",
          navLabel: "How we use data",
          number: "02",
          name: "How we use data",
          bannerAfter: true,
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "We use data to generate your skin summary, routine, care pathway, and to enable dermatologist review and sign-off.",
              ],
            },
            {
              type: "features",
              left: {
                icon: "lock",
                title: "encryption & access",
                body: "Role-based access controls and encryption in transit for sensitive health data.",
              },
              right: {
                icon: "eye",
                title: "transparency",
                body: "You may request a plain-language overview of core processing via our privacy contact.",
              },
            },
            {
              type: "paragraphs",
              paragraphs: [
                "We may use aggregated or de-identified data to improve the product, without identifying individuals unless separate consent is obtained where required.",
              ],
            },
          ],
        },
        {
          id: "sharing",
          navLabel: "Sharing",
          number: "03",
          name: "Sharing",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "We do not sell your personal data. We may share data with clinicians handling your case and with infrastructure providers (hosting/storage) under confidentiality obligations.",
                "We may disclose information if required by law or to protect the rights and safety of users.",
              ],
            },
          ],
        },
        {
          id: "security-protocol",
          navLabel: "Security protocol",
          number: "04",
          name: "Security protocol",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "We implement reasonable industry security measures. No system is perfectly secure; we will notify you of material breaches as required by law.",
              ],
            },
            {
              type: "quote",
              body: "Protecting health data means treating every uploaded photo with the same care as a clinical note.",
              attribution: "— security & compliance (internal)",
            },
          ],
        },
        {
          id: "your-rights-and-contact",
          navLabel: "Your rights & contact",
          number: "05",
          name: "Your rights & contact",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Depending on applicable law, you may request access, correction, or deletion of certain data. Withdrawing consent for processing may limit the service.",
                "Privacy questions: privacy@seren.example",
              ],
            },
          ],
        },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />
      <LegalFrameworkLayout
        frameworkLabel={frameworkLabel}
        pageTitle={pageTitle}
        updated={updated}
        intro={intro}
        sections={sections}
        banner={banner}
        ctaTitle={ctaTitle}
        ctaLinkText={ctaLinkText}
        ctaHref="mailto:privacy@seren.example"
        disclaimer={disclaimer}
      />
      <SiteFooter />
    </div>
  );
}

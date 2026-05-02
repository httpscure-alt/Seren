import { LegalScrollToSection } from "@/components/LegalScrollToSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  LegalFrameworkLayout,
  type LegalFrameworkSection,
} from "@/components/LegalFrameworkLayout";
import { getDictionary } from "@/i18n/getDictionary";
import { merchantPublicContact, MERCHANT_LEGAL_NAME } from "@/lib/merchantPublicInfo";
import { slugForSectionId, termsPath } from "@/lib/termsSlugPaths";

/** Full terms page; optional `scrollDomId` scrolls to section when using `/terms/[slug]` without `#` in URLs. */
export async function TermsDocument({ scrollDomId }: { scrollDomId?: string }) {
  const { lang } = await getDictionary();
  const isId = lang === "id";
  const contact = merchantPublicContact();

  const frameworkLabel = isId ? "KERANGKA HUKUM" : "LEGAL FRAMEWORK";
  const pageTitle = isId ? "ketentuan layanan" : "terms of service";
  const updated = isId ? "Terakhir diperbarui: 16 Apr 2026" : "Last updated: Apr 16, 2026";
  const intro = isId
    ? "Dokumen ini menjelaskan hak dan tanggung jawab kamu saat menggunakan Seren. Kami merancang layanan untuk hubungan pasien–klinisi yang jelas, aman, dan transparan."
    : "This document explains your rights and responsibilities when using Seren. We designed the service for a clear, safe, and transparent patient–clinician relationship.";

  const banner = {
    line1: isId ? "Lindungi data klinismu" : "Protecting your clinical data",
    line2: isId
      ? "Menjaga identitas dan riwayat kesehatanmu dengan standar keamanan yang konsisten."
      : "Safeguarding your identity and health history with consistent security standards.",
  };

  const ctaTitle = isId ? "Ada pertanyaan tentang standar kami?" : "Questions on our standards?";
  const ctaLinkText = isId ? "hubungi tim legal" : "contact legal";
  const disclaimer = isId
    ? "Dokumen ini bersifat informasi umum dan bukan nasihat hukum. Versi final dapat disesuaikan dengan penasihat hukum sebelum peluncuran publik."
    : "This document is for general information and is not legal advice. Final wording should be reviewed by counsel before public launch.";

  const sections: LegalFrameworkSection[] = isId
    ? [
        {
          id: "tanggung-jawab-klinis",
          navLabel: "Tanggung jawab klinis",
          number: "01",
          name: "Tanggung jawab klinis",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Seren menyediakan alur konsultasi digital, ringkasan kondisi kulit, rekomendasi rutinitas, dan jalur perawatan. Layanan ini melengkapi, bukan menggantikan, pemeriksaan langsung oleh dokter kulit bila diperlukan.",
                "Kamu setuju menggunakan informasi yang akurat dan tidak menyesatkan. Layanan tidak untuk diagnosis darurat atau kondisi yang mengancam jiwa.",
              ],
            },
            {
              type: "callout",
              title: "integritas resep",
              body: "Rekomendasi yang ditampilkan bersifat klinis dan disesuaikan dengan konteks intake. Dokter kulit dapat menyempurnakan atau menolak saran otomatis sebelum laporan dipublikasikan.",
            },
          ],
        },
        {
          id: "privasi-data",
          navLabel: "Privasi data",
          number: "02",
          name: "Privasi data",
          bannerAfter: true,
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Kami memproses data konsultasi dan foto klinis sesuai kebutuhan layanan dan kebijakan privasi Seren. Data tidak dijual ke pihak ketiga untuk pemasaran.",
              ],
            },
            {
              type: "features",
              left: {
                icon: "lock",
                title: "selaras privasi kesehatan",
                body: "Kontrol akses, enkripsi saat transit, dan pemisahan peran untuk data sensitif.",
              },
              right: {
                icon: "eye",
                title: "penelitian teranonimkan",
                body: "Jika digunakan, data agregat tidak mengidentifikasi individu tanpa persetujuan terpisah.",
              },
            },
            {
              type: "paragraphs",
              paragraphs: [
                "Detail tambahan ada di halaman Kebijakan Privasi. Dengan melanjutkan, kamu mengakui pemrosesan sesuai ketentuan tersebut.",
              ],
            },
          ],
        },
        {
          id: "protokol-keamanan",
          navLabel: "Protokol keamanan",
          number: "03",
          name: "Protokol keamanan",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Kami menerapkan praktik keamanan standar industri, pemantauan akses, dan mitigasi risiko. Tidak ada sistem yang sepenuhnya bebas risiko; kami berkomitmen memperbaiki celah yang ditemukan secara bertanggung jawab.",
              ],
            },
            {
              type: "quote",
              body: "Keamanan bukan sekadar fitur—ini fondasi bagaimana kami membangun kepercayaan klinis.",
              attribution: "— kepala infrastruktur digital (peran internal)",
            },
          ],
        },
        {
          id: "pembayaran-dan-promo",
          navLabel: "Pembayaran & promo",
          number: "04",
          name: "Pembayaran & promo",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Harga, kupon, dan program referral dapat berubah. Ketentuan spesifik (harga final, masa berlaku, batas pemakaian) ditampilkan saat checkout atau dalam komunikasi resmi Seren.",
                "Pembayaran diproses melalui penyedia yang kami tunjuk; kamu setuju pada syarat penyedia pembayaran tersebut sejauh berlaku.",
              ],
            },
            {
              type: "paragraphs",
              paragraphs: [
                "Ringkasan produk & harga (dalam IDR):",
                "• Laporan sekali (Single report): Rp 49.000,- (akses ± 7 hari).",
                "• Perjalanan kulit 30 hari (30-day skin journey): Rp 99.000,- (akses ± 30 hari).",
                "Harga yang mengikat adalah yang tercantum di ringkasan order sebelum diarahkan ke halaman pembayaran. Biaya jaringan perbankan/PSP (jika ada) mengikuti ketentuan penyedia terkait.",
              ],
            },
          ],
        },
        {
          id: "refund",
          navLabel: "Refund",
          number: "05",
          name: "Refund / pengembalian dana",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Produk Seren pada umumnya adalah akses digital. Setelah akses berhasil dibuka dan pembayaran tercatat sukses, pembelian umumnya tidak refundable kecuali diwajibkan hukum konsumen yang berlaku atau terdapat kesalahan material dari pihak Seren.",
                "Jika terjadi pembayaran ganda, status pembayaran tidak konsisten, atau kegagalan layanan material, mohon hubungi kami dengan menyertakan email akun Seren, perkiraan waktu pembayaran, dan referensi order/struk transaksi.",
              ],
            },
          ],
        },
        {
          id: "penyelesaian-sengketa",
          navLabel: "Penyelesaian sengketa",
          number: "06",
          name: "Penyelesaian sengketa",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Sejauh diizinkan hukum, ketentuan ini diatur oleh hukum yang berlaku di wilayah operasional Seren. Untuk sengketa non-formal, hubungi tim dukungan terlebih dahulu.",
              ],
            },
          ],
        },
        {
          id: "kontak",
          navLabel: "Kontak",
          number: "07",
          name: "Kontak merchant",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                `Entitas hukum: ${MERCHANT_LEGAL_NAME}.`,
                `Telepon: ${contact.phoneDisplay}.`,
                `Email: ${contact.email}.`,
                `Alamat: ${contact.address}.`,
              ],
            },
          ],
        },
      ]
    : [
        {
          id: "clinical-responsibility",
          navLabel: "Clinical responsibility",
          number: "01",
          name: "Clinical responsibility",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Seren provides a digital intake flow, skin condition summaries, routine recommendations, and care pathways. The service complements—and does not replace—an in-person dermatology exam when needed.",
                "You agree to provide accurate, non-misleading information. The service is not for emergency diagnosis or life-threatening conditions.",
              ],
            },
            {
              type: "callout",
              title: "prescriptive integrity",
              body: "Recommendations are clinical in nature and grounded in your intake context. A dermatologist may refine or reject automated suggestions before a report is published.",
            },
          ],
        },
        {
          id: "data-privacy",
          navLabel: "Data privacy",
          number: "02",
          name: "Data privacy",
          bannerAfter: true,
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "We process consultation data and clinical photos as described in Seren’s privacy policy. We do not sell your personal data to third parties for marketing.",
              ],
            },
            {
              type: "features",
              left: {
                icon: "lock",
                title: "privacy alignment",
                body: "Access controls, encryption in transit, and role separation for sensitive health data.",
              },
              right: {
                icon: "eye",
                title: "anonymized research",
                body: "If used, aggregate or de-identified data does not identify you without separate consent.",
              },
            },
            {
              type: "paragraphs",
              paragraphs: [
                "Further detail is in our Privacy Policy. By continuing, you acknowledge processing as described there.",
              ],
            },
          ],
        },
        {
          id: "security-protocol",
          navLabel: "Security protocol",
          number: "03",
          name: "Security protocol",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "We apply industry-standard security practices, access monitoring, and risk mitigation. No system is risk-free; we commit to responsible disclosure and remediation when issues are found.",
              ],
            },
            {
              type: "quote",
              body: "Security is not a feature—it is the foundation of how we earn clinical trust.",
              attribution: "— head of digital infrastructure (internal role)",
            },
          ],
        },
        {
          id: "payments-and-promotions",
          navLabel: "Payments & promotions",
          number: "04",
          name: "Payments & promotions",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Pricing, coupons, and referral programs may change. Specific terms (final price, expiry, redemption limits) are shown at checkout or in official Seren communications.",
                "Payments are processed through designated providers; you agree to their terms where applicable.",
              ],
            },
            {
              type: "paragraphs",
              paragraphs: [
                "Product & pricing summary (IDR):",
                "• Single report: Rp 49.000,- (~7 days access).",
                "• 30-day skin journey: Rp 99.000,- (~30 days access).",
                "The binding quote is the amount shown in the order summary before you are redirected to the payment page. Any network/issuer fees (if applicable) follow the PSP and bank rules.",
              ],
            },
          ],
        },
        {
          id: "refund",
          navLabel: "Refund",
          number: "05",
          name: "Refund policy",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "Seren purchases are primarily digital access. Once paid access is granted successfully and the payment is recorded as successful, purchases are generally non-refundable except where consumer law compels otherwise or Seren confirms a material delivery error.",
                "For duplicate captures, contradictory payment statuses, or material service delivery failures attributable to Seren, contact us with your Seren account email, approximate payment timestamp, and any order/payment reference shown on the receipt.",
              ],
            },
          ],
        },
        {
          id: "dispute-resolution",
          navLabel: "Dispute resolution",
          number: "06",
          name: "Dispute resolution",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                "To the extent permitted by law, these terms are governed by applicable law in Seren’s operating jurisdiction. For informal disputes, contact support before formal proceedings.",
              ],
            },
          ],
        },
        {
          id: "contact",
          navLabel: "Contact",
          number: "07",
          name: "Merchant contact",
          blocks: [
            {
              type: "paragraphs",
              paragraphs: [
                `Legal entity: ${MERCHANT_LEGAL_NAME}.`,
                `Phone: ${contact.phoneDisplay}.`,
                `Email: ${contact.email}.`,
                `Address: ${contact.address}.`,
              ],
            },
          ],
        },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      {scrollDomId ? <LegalScrollToSection domId={scrollDomId} /> : null}
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
        ctaHref={`mailto:${contact.email}`}
        disclaimer={disclaimer}
        navHrefForSectionId={(id) => {
          const slug = slugForSectionId(id);
          return slug ? termsPath(slug) : "/terms";
        }}
      />
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";

import { termsPath } from "@/lib/termsSlugPaths";
import { merchantPublicContact, MERCHANT_LEGAL_NAME } from "@/lib/merchantPublicInfo";

type SectionId = "produk" | "tnc" | "refund" | "kontak";

const sections: Array<{ id: SectionId; labelId: string; labelEn: string }> = [
  { id: "produk", labelId: "Produk & harga", labelEn: "Products & pricing" },
  { id: "tnc", labelId: "Syarat & ketentuan", labelEn: "Terms & conditions" },
  { id: "refund", labelId: "Refund", labelEn: "Refund policy" },
  { id: "kontak", labelId: "Kontak", labelEn: "Contact us" },
];

const sectionPath: Record<SectionId, string> = {
  produk: "/doku/produk",
  tnc: "/doku/ketentuan",
  refund: "/doku/refund",
  kontak: "/doku/kontak",
};

function Nav({ active }: { active?: SectionId }) {
  return (
    <nav
      aria-label="DOKU disclosure sections"
      className="rounded-[1.5rem] border border-outline-variant/12 bg-surface-container-lowest p-4 sm:p-5"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-3">
        Policies · DOKU
      </p>
      <div className="flex flex-col gap-1">
        {sections.map((s) => (
          <Link
            key={s.id}
            href={sectionPath[s.id]}
            className={[
              "rounded-xl px-3 py-2 text-sm transition-colors",
              active === s.id
                ? "bg-primary/[0.08] text-on-surface"
                : "text-on-surface/70 hover:bg-surface-container-low",
            ].join(" ")}
          >
            <span className="block text-[11px] sm:text-xs font-medium">{s.labelId}</span>
            <span className="block text-[11px] text-on-surface/50">{s.labelEn}</span>
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant/10">
        <Link
          href="/"
          className="inline-flex w-full justify-center rounded-full border border-outline-variant/25 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-on-surface/70 hover:bg-surface-container-low transition-colors"
        >
          Back to Seren
        </Link>
      </div>
    </nav>
  );
}

function SectionHeader({
  id,
  titleId,
  titleEn,
}: {
  id: SectionId;
  titleId: string;
  titleEn: string;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
        {titleId} · {titleEn}
      </p>
      <h2 className="mt-3 font-headline tracking-tight text-2xl sm:text-3xl text-on-surface">
        {titleId}
      </h2>
    </div>
  );
}

export function DokuDisclosure({ focus }: { focus?: SectionId }) {
  const c = merchantPublicContact();

  return (
    <main className="seren-container pt-10 sm:pt-12 pb-24 flex-1">
      <header className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
          Merchant disclosure · DOKU
        </p>
        <h1 className="font-headline tracking-tight text-[2rem] sm:text-[2.4rem] leading-tight">
          Policies &amp; customer information
        </h1>
        <p className="mt-5 text-sm text-on-surface-variant leading-relaxed">
          This page provides the required public disclosures for payment onboarding where DOKU is enabled as a payment
          gateway: products &amp; pricing, terms &amp; conditions, refund policy, and merchant contact details.
        </p>
        <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
          Halaman ini menyediakan informasi publik yang diminta untuk onboarding pembayaran melalui DOKU: produk &amp;
          harga, syarat &amp; ketentuan, kebijakan refund, dan kontak merchant.
        </p>
      </header>

      <section className="mt-12 grid grid-cols-12 gap-8 lg:gap-10 items-start">
        <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24">
          <Nav active={focus} />
        </aside>

        <div className="col-span-12 lg:col-span-8 space-y-12">
          {/* Products & pricing */}
          <section className="rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-7 sm:p-9">
            <SectionHeader id="produk" titleId="Produk & harga" titleEn="Products & pricing" />
            <p className="mt-5 text-sm text-on-surface-variant leading-relaxed">
              Seren adalah layanan konsultasi dermatologi digital dengan akses laporan dan pendampingan. Harga final
              (termasuk promo/kupon yang valid) ditampilkan sebelum Anda diarahkan ke halaman pembayaran.
            </p>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Seren provides digital dermatology consultations and report access. The final payable amount is shown on
              the order summary before redirection to DOKU.
            </p>

            <div className="mt-7 rounded-[1.5rem] border border-outline-variant/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-on-surface/50">
                      Product
                    </th>
                    <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.18em] text-on-surface/50 w-[140px]">
                      Price (IDR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-outline-variant/10">
                    <td className="px-5 py-5 align-top">
                      <p className="text-on-surface font-medium">Single report · Laporan sekali</p>
                      <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                        Full report unlock (~7 days access).
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
                        Akses laporan lengkap (± 7 hari).
                      </p>
                    </td>
                    <td className="px-5 py-5 align-top font-headline tracking-tight text-lg whitespace-nowrap">
                      Rp 49.000,-
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-5 align-top">
                      <p className="text-on-surface font-medium">30-day skin journey · Perjalanan kulit 30 hari</p>
                      <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                        Guided program (~30 days) per product description.
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
                        Program pendampingan 30 hari (evaluasi berkala, Q&amp;A medis dalam batas layanan).
                      </p>
                    </td>
                    <td className="px-5 py-5 align-top font-headline tracking-tight text-lg whitespace-nowrap">
                      Rp 99.000,-
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Terms */}
          <section className="rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-7 sm:p-9">
            <SectionHeader id="tnc" titleId="Syarat & ketentuan" titleEn="Terms & conditions" />
            <p className="mt-5 text-sm text-on-surface-variant leading-relaxed">
              By using Seren and selecting payment flows where DOKU is enabled as a gateway, you agree to Seren’s Terms
              and Privacy Policy, and to DOKU/issuer policies applicable at payment authorization time.
            </p>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Dengan menggunakan Seren dan memilih alur pembayaran dengan DOKU, Anda menyetujui Ketentuan Layanan Seren,
              Kebijakan Privasi, dan ketentuan DOKU/bank yang berlaku pada saat pembayaran.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/terms"
                className="inline-flex rounded-full btn-gradient text-on-primary px-6 py-3 text-sm font-medium tracking-wide"
              >
                Terms (index)
              </Link>
              <Link
                href={termsPath("payments")}
                className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-6 py-3 text-sm font-medium text-primary hover:bg-primary/15 transition-colors"
              >
                Pricing & payments
              </Link>
              <Link
                href="/privacy"
                className="inline-flex rounded-full border border-outline-variant/25 px-6 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Privacy
              </Link>
            </div>
          </section>

          {/* Refund */}
          <section className="rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-7 sm:p-9">
            <SectionHeader id="refund" titleId="Refund" titleEn="Refund policy" />
            <p className="mt-5 text-sm text-on-surface-variant leading-relaxed">
              Default policy: digital access purchases are <strong className="text-on-surface/80">non-refundable</strong>{" "}
              once access is granted successfully, except where required by applicable consumer law or where Seren confirms
              a material service delivery error.
            </p>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Kebijakan umum: pembelian akses digital <strong className="text-on-surface/80">tidak refundable</strong>{" "}
              setelah akses berhasil dibuka, kecuali diwajibkan oleh hukum konsumen yang berlaku atau terdapat kesalahan
              material dari pihak Seren.
            </p>

            <div className="mt-6 rounded-2xl border border-outline-variant/10 bg-surface-container-low/50 p-5 text-sm text-on-surface-variant leading-relaxed">
              <p className="text-on-surface font-medium">If you need help / Jika butuh bantuan</p>
              <p className="mt-2">
                Contact us via the channels below with your Seren email, approximate payment timestamp, and order/payment
                reference shown on the payment page/receipt.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-[2rem] border border-outline-variant/12 bg-surface-container-lowest p-7 sm:p-9">
            <SectionHeader id="kontak" titleId="Kontak" titleEn="Contact us" />
            <p className="mt-5 text-sm text-on-surface-variant leading-relaxed">
              Merchant legal entity: <span className="text-on-surface/80 font-medium">{MERCHANT_LEGAL_NAME}</span>.
            </p>

            <div className="mt-7 grid gap-5 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/45 mb-1">Phone</p>
                <a className="text-primary hover:underline font-medium" href={c.phoneHref}>
                  {c.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/45 mb-1">Email</p>
                <a className="text-primary hover:underline font-medium break-all" href={`mailto:${c.email}`}>
                  {c.email}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface/45 mb-1">Address</p>
                <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">{c.address}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}


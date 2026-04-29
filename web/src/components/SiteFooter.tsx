import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";

export async function SiteFooter() {
  const { dict } = await getDictionary();
  const businessAddress =
    "Jl Puter 5 blok ed 5 no 14, Pondok Aren, Pondok Aren, Tangerang Selatan, Banten, 15224, ID";
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "support@seren.id";
  const footerLinks = [
    { href: "/privacy", label: dict.footer.privacy },
    { href: "/terms", label: dict.footer.terms },
  ];
  return (
    <footer className="w-full border-t border-outline-variant/10 bg-surface mt-auto">
      <div className="seren-container py-12 sm:py-14 text-xs text-on-surface/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            <span className="block">
              © {new Date().getFullYear()} Seren. {dict.footer.rights}
            </span>
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-5 text-on-surface/55">
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Business information</p>
              <p className="mt-2 leading-relaxed">
                <span className="text-on-surface/60">Address:</span> {businessAddress}
              </p>
              <p className="mt-2 leading-relaxed">
                <span className="text-on-surface/60">Contact:</span>{" "}
                {contactPhone ? `Phone ${contactPhone}` : "Phone (set NEXT_PUBLIC_CONTACT_PHONE)"} •{" "}
                {contactEmail}
              </p>
            </div>
          </div>

          <div className="flex gap-8 uppercase tracking-[0.18em] text-[10px] sm:justify-end">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                className="text-on-surface/50 hover:text-primary transition-colors"
                href={l.href}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

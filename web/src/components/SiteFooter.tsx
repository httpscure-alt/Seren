import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { merchantPublicContact } from "@/lib/merchantPublicInfo";

export async function SiteFooter({ showContact = false }: { showContact?: boolean }) {
  const { dict } = await getDictionary();
  const c = merchantPublicContact();
  const companyName = c.companyName;
  const businessAddress = c.address;
  const contactPhone = c.phoneDisplay;
  const contactEmail = c.email;
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
              © {new Date().getFullYear()} {companyName}. {dict.footer.rights}
            </span>
            {showContact ? (
              <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/10 p-5 text-on-surface/55">
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Contact us</p>
                <p className="mt-2 leading-relaxed">
                  <span className="text-on-surface/60">Phone:</span>{" "}
                  {contactPhone ? (
                    <a
                      className="text-on-surface/70 hover:text-primary transition-colors"
                      href={c.phoneHref}
                    >
                      {contactPhone}
                    </a>
                  ) : (
                    "Set NEXT_PUBLIC_CONTACT_PHONE"
                  )}
                </p>
                <p className="mt-2 leading-relaxed">
                  <span className="text-on-surface/60">Email:</span>{" "}
                  <a
                    className="text-on-surface/70 hover:text-primary transition-colors"
                    href={`mailto:${contactEmail}`}
                  >
                    {contactEmail}
                  </a>
                </p>
                <p className="mt-2 leading-relaxed">
                  <span className="text-on-surface/60">Address:</span> {businessAddress}
                </p>
              </div>
            ) : null}
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

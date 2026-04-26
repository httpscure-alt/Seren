import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";

export async function SiteFooter() {
  const { dict } = await getDictionary();
  const footerLinks = [
    { href: "/privacy", label: dict.footer.privacy },
    { href: "/terms", label: dict.footer.terms },
  ];
  return (
    <footer className="w-full border-t border-outline-variant/10 bg-surface mt-auto">
      <div className="seren-container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-12 sm:py-14 text-xs text-on-surface/50">
        <span>
          © {new Date().getFullYear()} Seren. {dict.footer.rights}
        </span>
        <div className="flex gap-8 uppercase tracking-[0.18em] text-[10px]">
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
    </footer>
  );
}

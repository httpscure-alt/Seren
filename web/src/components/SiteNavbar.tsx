import { getDictionary } from "@/i18n/getDictionary";
import { LanguageToggle } from "@/components/LanguageToggle";
import { BrandMark } from "@/components/BrandMark";
import { NavbarAuthControls } from "@/components/NavbarAuthControls";
import { SiteNavbarLinksClient, type NavbarLink } from "@/components/SiteNavbarLinksClient";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { getExpiringSoonSubscription } from "@/lib/entitlement";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { NavbarConsultEntryLink } from "@/components/NavbarConsultEntryLink";

const baseLinks: Array<{ href: string; key: "philosophy" | "results" | "physician" | "admin" }> = [
  { href: "/philosophy", key: "philosophy" },
];

export async function SiteNavbar() {
  const { lang, dict } = await getDictionary();
  const session = await getServerSession(authOptions);
  const isAuthed = !!session?.user?.email;
  const role = (session as any)?.role as "USER" | "PHYSICIAN" | "ADMIN" | undefined;
  const userId = (session as any)?.userId as string | undefined;
  const expiring =
    isAuthed && userId ? await getExpiringSoonSubscription(userId, 3) : null;

  const roleLinks: Array<{ href: string; key: "results" | "physician" | "admin" }> =
    role === "PHYSICIAN"
      ? [{ href: "/physician", key: "physician" }]
      : role === "ADMIN"
        ? [{ href: "/admin", key: "admin" }]
        : isAuthed
          ? [{ href: "/results", key: "results" }]
          : [];

  const linkDefs = [...baseLinks, ...roleLinks];
  const links: NavbarLink[] = linkDefs.map((l) => ({
    href: l.href,
    label:
      l.key === "philosophy"
        ? dict.nav.philosophy
        : l.key === "results"
          ? dict.nav.results
          : l.key === "physician"
            ? "Physician portal"
            : "Admin",
  }));

  const showConsultCta = !isAuthed || role === "USER";
  return (
    <nav className="fixed top-0 w-full z-50">
      {expiring ? <SubscriptionBanner expiresAtIso={expiring.expiresAt.toISOString()} /> : null}
      <div className="border-b border-outline-variant/10 bg-surface/75 backdrop-blur-2xl">
        <div className="seren-container flex justify-between items-center py-5 sm:py-6 gap-4">
          <BrandMark href="/" />

          <div className="hidden md:flex items-center gap-3 sm:gap-6 lg:gap-10 font-headline text-[9px] sm:text-xs uppercase tracking-[0.2em] text-on-surface/70 flex-nowrap justify-end min-w-0">
            <SiteNavbarLinksClient links={links} />
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {process.env.NEXT_PUBLIC_SHOW_LANGUAGE_TOGGLE === "true" ? (
              <LanguageToggle current={lang} />
            ) : null}
            <NavbarAuthControls isAuthed={isAuthed} role={role} userInboxLabel={dict.nav.inbox} />
            {showConsultCta ? (
              <NavbarConsultEntryLink className="btn-gradient text-on-primary px-6 py-2.5 rounded-full text-sm font-medium tracking-wide active:scale-95 transition-all duration-200 shadow-sm whitespace-nowrap">
                {dict.nav.startConsultation}
              </NavbarConsultEntryLink>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}


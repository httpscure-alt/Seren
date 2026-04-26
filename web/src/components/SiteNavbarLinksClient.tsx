"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavbarLink = { href: string; label: string };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavbarLinksClient({
  links,
}: {
  links: NavbarLink[];
}) {
  const pathname = usePathname();
  return (
    <>
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={[
              "transition-colors duration-300 shrink-0",
              active ? "text-primary" : "hover:text-primary text-on-surface/70",
            ].join(" ")}
          >
            <span className={active ? "underline underline-offset-[10px] decoration-primary/30" : ""}>
              {l.label}
            </span>
          </Link>
        );
      })}
    </>
  );
}


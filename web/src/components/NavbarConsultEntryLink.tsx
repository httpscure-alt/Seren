"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const WELCOME = "/consult/welcome";
const INTAKE = "/consult/intake";

/** Navbar “Start consultation” always opens the welcome step; only the intake step links to intake. */
function consultEntryHref(pathname: string): string {
  if (
    pathname.startsWith("/consult/intake") ||
    pathname.startsWith("/consult/analyzing")
  ) {
    return INTAKE;
  }
  return WELCOME;
}

export function NavbarConsultEntryLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const href = consultEntryHref(pathname);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

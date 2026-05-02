import Link from "next/link";

const links = [
  { href: "/doku", label: "Indeks DOKU / DOKU index" },
  { href: "/doku/produk", label: "Produk & harga / Pricing" },
  { href: "/doku/ketentuan", label: "Syarat & ketentuan / Terms" },
  { href: "/doku/refund", label: "Refund / Pengembalian dana" },
  { href: "/doku/kontak", label: "Kontak / Contact" },
];

export function DokuPortalNav() {
  return (
    <nav
      aria-label="DOKU merchant pages"
      className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-6 sm:gap-y-2 text-[10px] sm:text-xs uppercase tracking-[0.16em]"
    >
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-on-surface/55 hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

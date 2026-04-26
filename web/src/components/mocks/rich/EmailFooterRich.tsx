import Link from "next/link";

const linkClass =
  "text-[10px] uppercase tracking-[0.2em] text-[#707070] hover:text-[#2D2D2D] transition-colors";

export function EmailFooterRich({ year = 2026 }: { year?: number }) {
  return (
    <footer className="pt-10 pb-2">
      <div className="relative flex items-center justify-center mb-8">
        <div className="h-px w-full bg-[#E5E5E5]" />
        <div
          className="absolute w-8 h-4 border border-[#E5E5E5] border-b-0 rounded-t-full bg-[#FDFCFB]"
          aria-hidden
        />
      </div>
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-6">
        <Link className={linkClass} href="/privacy">
          Privacy policy
        </Link>
        <Link className={linkClass} href="/terms">
          Terms of service
        </Link>
        <span className={`${linkClass} cursor-default`}>Unsubscribe</span>
        <span className={`${linkClass} cursor-default`}>Support</span>
      </nav>
      <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[#9a9a9a]">
        © {year} Seren. Designed for restoration.
      </p>
    </footer>
  );
}

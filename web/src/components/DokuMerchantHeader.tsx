import Link from "next/link";

export function DokuMerchantHeader() {
  return (
    <header className="border-b border-outline-variant/10 bg-surface/85 backdrop-blur-2xl">
      <div className="seren-container py-5 sm:py-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
            Merchant disclosure · DOKU
          </p>
          <p className="mt-1 font-headline tracking-tight text-base text-on-surface">
            Seren — PT Sene Kamayu Venture
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="rounded-full border border-outline-variant/25 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-on-surface/70 hover:bg-surface-container-low transition-colors"
          >
            Back to Seren
          </Link>
        </div>
      </div>
    </header>
  );
}


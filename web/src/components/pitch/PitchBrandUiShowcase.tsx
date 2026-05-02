import Image from "next/image";

/**
 * Mirrors live recommendations routine UI (`/demos/recommendations`):
 * “Recommended set” / Morning routine, ProductRow-style cards — partner SKU surfaced as **Your product**.
 */
export function PitchBrandUiShowcase() {
  const rowBase =
    "rounded-[1.15rem] sm:rounded-[1.75rem] bg-surface-container-lowest border border-outline-variant/10 p-4 sm:p-[1.125rem]";
  return (
    <div className="relative flex min-h-[min(520px,100%)] w-full flex-1 flex-col overflow-hidden rounded-[1.875rem] bg-gradient-to-br from-primary/[0.12] via-surface-container-low/96 to-[#f6daa6]/22 p-[2px] shadow-[0_38px_110px_-48px_rgba(61,99,116,0.42)] md:rounded-[2.15rem]">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.9375rem] bg-background md:rounded-[2.125rem]">
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.98]"
          style={{
            background:
              "radial-gradient(circle at 24% 0%,rgba(61,99,116,0.06),transparent 48%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,249,246,1))",
          }}
        />

        <div className="relative flex min-h-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
          {/* App chrome — same language as PitchVcUiShowcase + recommendations route */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl shadow-md shadow-primary/10 ring-1 ring-outline-variant/12">
                <Image
                  src="/brand/seren-app-icon-240.png"
                  alt=""
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-headline text-[10px] font-semibold uppercase tracking-[0.26em] text-primary">seren</p>
                <p className="truncate font-body text-[11px] text-on-surface-variant">
                  Routine suggestions · same layout as{" "}
                  <span className="text-on-surface/65">/demos/recommendations</span>
                </p>
              </div>
            </div>
          </div>

          {/* Main recommendations block — parallels `seren-card` + headings on demos/recommendations */}
          <div className="seren-card relative min-h-0 flex-1 overflow-hidden p-4 sm:p-[1.35rem]">
            <p className="font-headline text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Recommended set</p>
            <h2 className="mt-1.5 font-headline text-lg tracking-[-0.02em] text-on-surface sm:text-xl">Morning routine</h2>
            <p className="mt-2 font-body text-[11px] leading-relaxed text-on-surface-variant sm:text-[12px]">
              Barrier-forward + humid climate — keep the protocol stable before rotating actives.
            </p>

            <div className="mt-4 space-y-3">
              {/* Compact step 1 — same card shell as ProductRow */}
              <div className={rowBase}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-headline text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                      AM · Step 1
                    </p>
                    <p className="mt-1.5 font-headline text-[13px] tracking-tight text-on-surface sm:text-sm">
                      Gentle cleanser
                    </p>
                    <p className="mt-1 font-body text-[11px] leading-relaxed text-on-surface-variant">
                      Lift oil/sweat without stripping barrier lipids.
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="pointer-events-none rounded-full border border-outline-variant/25 px-3 py-1.5 font-headline text-[9px] uppercase tracking-[0.18em] text-on-surface-variant"
                  >
                    See alternatives
                  </button>
                </div>
              </div>

              {/* Partner SKU — emphasized “your product” row */}
              <div className={`${rowBase} ring-1 ring-primary/18`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-headline text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                      AM · Step 2
                    </p>
                    <p className="mt-1.5 font-headline text-base tracking-tight text-on-surface sm:text-[1.05rem]">
                      Your product
                    </p>
                    <p className="mt-0.5 font-body text-[10px] text-on-surface-variant/90 sm:text-[11px]">
                      Brand hero SKU · clinically eligible placement
                    </p>
                    <p className="mt-2 font-body text-[11px] leading-relaxed text-on-surface-variant">
                      Ceramide-support texture; positions your line inside the signed protocol—not a generic PDP.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 font-headline text-[9px] uppercase tracking-[0.2em] text-primary">
                      In protocol
                    </span>
                    <span className="rounded-full border border-outline-variant/20 bg-surface-container-low/80 px-2.5 py-1 font-headline text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
                      Partner
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="pointer-events-none rounded-full border border-outline-variant/25 px-3 py-1.5 font-headline text-[9px] uppercase tracking-[0.18em] text-on-surface-variant"
                  >
                    See alternatives
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="pointer-events-none rounded-full border border-outline-variant/25 px-3 py-1.5 font-headline text-[9px] uppercase tracking-[0.18em] text-on-surface-variant"
                  >
                    Where to buy
                  </button>
                </div>
              </div>

              <div className={rowBase}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-headline text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                      AM · Step 3
                    </p>
                    <p className="mt-1.5 font-headline text-[13px] tracking-tight text-on-surface sm:text-sm">
                      SPF50 PA++++ sunscreen
                    </p>
                    <p className="mt-1 font-body text-[11px] leading-relaxed text-on-surface-variant">
                      Protect barrier repair; reduce PIH risk in tropical UV.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 font-headline text-[9px] uppercase tracking-[0.2em] text-primary">
                    Key
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

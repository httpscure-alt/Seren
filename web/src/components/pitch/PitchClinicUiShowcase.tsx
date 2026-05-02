import Image from "next/image";

/**
 * Clinic partner story: routing / booking metaphor using real Seren chrome (cards, gradients, btn language).
 */
export function PitchClinicUiShowcase() {
  return (
    <div className="relative flex min-h-[min(520px,100%)] w-full flex-1 flex-col overflow-hidden rounded-[1.875rem] bg-gradient-to-br from-primary/[0.12] via-surface-container-low/96 to-[#c0e9fc]/35 p-[2px] shadow-[0_38px_110px_-48px_rgba(61,99,116,0.42)] md:rounded-[2.15rem]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit] bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-95"
          style={{
            background:
              "radial-gradient(circle at 75% 20%,rgba(192,233,252,0.45),transparent 50%),radial-gradient(circle at 15% 80%,rgba(61,99,116,0.08),transparent 52%),linear-gradient(180deg,#faf9f6,#edeeea)",
          }}
        />
        <div className="relative flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-outline-variant/12">
              <Image src="/brand/seren-app-icon-240.png" alt="" width={72} height={72} className="object-cover" />
            </div>
            <div>
              <p className="font-headline text-[10px] uppercase tracking-[0.24em] text-primary">routing</p>
              <p className="text-[11px] text-on-surface-variant">Clinic OS preview</p>
            </div>
          </div>

          {/* Map slab — abstract */}
          <div className="relative h-28 overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-low">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(61,99,116,0.14),transparent_60%),radial-gradient(circle_at_72%_30%,rgba(246,217,166,0.25),transparent_48%)]" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-surface/90 px-2.5 py-1 shadow-sm ring-1 ring-outline-variant/10 backdrop-blur-sm">
              <span className="pitch-material-symbols text-lg text-primary">location_on</span>
              <span className="font-headline text-[10px] uppercase tracking-widest text-on-surface">2.4 km · Kemang</span>
            </div>
            <div className="absolute right-8 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-primary/85 shadow-lg shadow-primary/30 ring-4 ring-white/80" />
          </div>

          {/* Booking card — onboarding-style gradient border */}
          <div className="rounded-[1.35rem] p-px bg-gradient-to-br from-primary/35 via-surface-container to-amber-200/25 shadow-md">
            <div className="rounded-[calc(1.35rem-1px)] bg-surface/95 px-4 py-4 backdrop-blur-sm">
              <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary">next opening</p>
              <p className="mt-2 font-headline text-lg font-light tracking-tight text-on-surface">Thu · 14:30</p>
              <p className="mt-1 text-xs text-on-surface-variant">Dermatology consult · Face mapping</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["CO2 fractional", "Pico", "Acne peel"].map((x) => (
                  <span
                    key={x}
                    className="rounded-full border border-outline-variant/20 bg-surface-container-low px-2 py-1 text-[10px] text-on-surface-variant"
                  >
                    {x}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-full bg-gradient-to-r from-primary to-primary-dim px-4 py-2.5 text-center font-headline text-[11px] font-medium lowercase tracking-wide text-on-primary shadow-md shadow-primary/25">
                confirm structured booking
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/15 bg-primary/6 px-3 py-2.5 font-body text-[10px] leading-relaxed text-on-surface-variant">
            Seren maps patient indication to clinics’ <strong className="text-on-surface">real device & doctor capacity</strong>—fewer mismatched chairs.
          </div>
        </div>
      </div>
    </div>
  );
}

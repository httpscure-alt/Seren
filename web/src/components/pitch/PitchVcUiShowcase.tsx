import Image from "next/image";

/**
 * Pixel-faithful mini mock of live routes:
 * - Intake stepper + progress (`/consult/intake`)
 * - Analyzing glass card + checklist (`/consult/analyzing`)
 */
export function PitchVcUiShowcase() {
  return (
    <div className="relative flex min-h-[min(520px,100%)] w-full flex-1 flex-col overflow-hidden rounded-[1.875rem] bg-gradient-to-br from-primary/[0.14] via-surface-container-low/96 to-[#f6daa6]/26 p-[2px] shadow-[0_38px_110px_-48px_rgba(61,99,116,0.46)] md:rounded-[2.15rem]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.9375rem] bg-background md:rounded-[2.125rem]">
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.97]"
          style={{
            background:
              "radial-gradient(circle at 38% 8%,rgba(61,99,116,0.12),transparent 46%),radial-gradient(circle at 82% 18%,rgba(246,217,166,0.2),transparent 42%),linear-gradient(180deg,rgba(255,255,255,0.75),rgba(250,249,246,0.97))",
          }}
        />

        <div className="relative flex flex-1 flex-col gap-4 p-4 sm:p-5">
          {/* Masthead — real app chrome */}
          <div className="flex items-center gap-2.5">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl shadow-md shadow-primary/12 ring-1 ring-outline-variant/12">
              <Image
                src="/brand/seren-app-icon-240.png"
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-headline text-[10px] font-semibold uppercase tracking-[0.26em] text-primary">seren</p>
              <p className="truncate font-body text-[11px] text-on-surface-variant">Intake · same components as production</p>
            </div>
          </div>

          {/* Intake — progress + stepper (matches IntakeClient) */}
          <div className="space-y-2">
            <div className="flex items-end justify-between gap-2">
              <p className="font-body text-[11px] text-on-surface-variant">Step 3 of 4 · Skin profile</p>
              <p className="font-headline text-[11px] tracking-widest text-primary">75%</p>
            </div>
            <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="relative h-full w-3/4 bg-primary transition-all duration-1000">
                <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white/25 to-transparent blur-[1px]" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Photos", "Profile", "Skin", "Review"].map((label, i) => (
                <span
                  key={label}
                  className={[
                    "rounded-full border px-2.5 py-1 font-headline text-[9px] uppercase tracking-[0.18em]",
                    i === 2
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-outline-variant/25 bg-surface text-on-surface/55",
                  ].join(" ")}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Analyzing — matches /consult/analyzing hero card */}
          <div className="relative w-full flex-1 overflow-hidden rounded-[2.25rem] bg-surface-container-lowest shadow-[0_24px_80px_-50px_rgba(47,51,48,0.38)] sm:rounded-[2.75rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(246,217,166,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(61,99,116,0.14),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.02))]" />
            <div className="relative flex min-h-[200px] flex-col items-center justify-center p-4 sm:min-h-[220px] sm:p-6">
              <div className="glass-effect w-full max-w-[280px] rounded-3xl border border-outline-variant/12 bg-surface/70 p-5 text-center shadow-sm sm:p-7">
                <div className="mb-3 flex justify-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 animate-spin text-primary" aria-hidden="true">
                    <path
                      d="M12 4a8 8 0 1 1-7.5 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4.5 9.2V5.8H7.9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="mb-1.5 font-headline text-lg tracking-tight text-on-surface sm:text-xl">
                  Analyzing skin patterns…
                </h2>
                <p className="font-body text-xs leading-relaxed text-on-surface-variant sm:text-sm">
                  Preparing your assessment while your case is reviewed by a dermatologist.
                </p>
                <p className="mt-2.5 text-[10px] uppercase tracking-[0.18em] text-on-surface/45">
                  Mapping 1,402 unique dermal markers
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-primary/5 blur-[70px]" />
          </div>

          {/* Status rail — same checklist language as analyzing page */}
          <div className="space-y-2.5 rounded-2xl border border-outline-variant/12 bg-surface-container-low/80 p-3">
            {[
              { title: "Dermal mapping complete", sub: "Surface topology verified", done: true },
              { title: "Clinical cross-referencing", sub: "Matching patterns to archive", done: true },
              { title: "Physician verification", sub: "Report being prepared", done: false },
            ].map((s) => (
              <div key={s.title} className="flex items-start gap-2.5">
                <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-outline-variant/12 bg-surface-container-low">
                  {s.done ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-primary" aria-hidden="true">
                      <path
                        d="M9.2 12.2l1.8 1.8 3.8-3.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-outline-variant/50" />
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-headline text-[11px] font-medium leading-tight text-on-surface">{s.title}</p>
                  <p className="text-[10px] text-on-surface-variant">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

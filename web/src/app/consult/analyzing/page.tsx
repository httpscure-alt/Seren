import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";

export default function AnalyzingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <SiteNavbar />

      <main className="seren-container pt-28 sm:pt-32 pb-24">
        {/* Hero — match reference structure */}
        <section className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="col-span-12 lg:col-span-7 relative">
            <div className="relative w-full rounded-[2.75rem] overflow-hidden bg-surface-container-lowest shadow-[0_30px_100px_-60px_rgba(47,51,48,0.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(246,217,166,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(61,99,116,0.14),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02))]" />
              <div className="relative aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center p-6 sm:p-10">
                <div className="glass-effect bg-surface/70 p-7 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/12 max-w-md w-full text-center">
                  <div className="mb-4 flex justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-primary animate-spin"
                      aria-hidden="true"
                    >
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
                  <h2 className="font-headline text-xl sm:text-2xl mb-2 tracking-tight">
                    Analyzing skin patterns…
                  </h2>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                    Preparing your assessment while your case is reviewed by a
                    dermatologist.
                  </p>
                  <p className="mt-3 text-[11px] text-on-surface/45 uppercase tracking-[0.18em]">
                    Mapping 1,402 unique dermal markers
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
          </div>

          <div className="col-span-12 lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-4">
              Clinical intelligence engine
            </p>
            <h1 className="font-headline tracking-[-0.03em] leading-[0.95] text-[2.2rem] sm:text-[2.7rem]">
              Comparing with clinical
              <br />
              <span className="italic font-light">database</span>
            </h1>
            <p className="mt-6 text-on-surface-variant leading-[1.75] max-w-[60ch]">
              Your scan is being compared with dermatologist-verified cases. We
              prioritize accuracy and subtlety in every diagnosis.
            </p>

            <div className="mt-10 space-y-4">
              {[
                {
                  title: "Dermal mapping complete",
                  body: "Surface topology verified",
                  done: true,
                },
                {
                  title: "Clinical cross-referencing",
                  body: "Matching patterns to pathological archive",
                  done: true,
                },
                {
                  title: "Physician verification",
                  body: "Report being prepared by Dr. Riris Asti Respati, SpDVE",
                  done: false,
                },
              ].map((s) => (
                <div key={s.title} className="flex items-start gap-4">
                  <div className="mt-0.5 h-7 w-7 rounded-full bg-surface-container-low border border-outline-variant/12 grid place-items-center shrink-0">
                    {s.done ? (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" aria-hidden="true">
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
                      <div className="h-2 w-2 rounded-full bg-primary/50" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline tracking-tight text-sm">
                      {s.title}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl bg-surface-container-low/60 px-6 py-6 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/12 grid place-items-center text-primary">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.2 12.2l1.8 1.8 3.8-3.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                  Clinical privacy protocol active
                </p>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                All data is encrypted and anonymized. Your information remains
                secure within Seren.
              </p>
              <div className="mt-6">
                <Link
                  href="/results"
                  className="btn-gradient inline-flex text-on-primary px-7 py-3 rounded-full text-sm font-medium tracking-wide shadow-sm"
                >
                  View status
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Lower feature cards */}
        <section className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "High-resolution imaging",
              body:
                "Our engine analyzes subsurface vascularity and pigment distribution beyond the human eye’s capacity.",
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
                  <path
                    d="M8.5 3h7l2 2v14.5a2.5 2.5 0 0 1-2.5 2.5h-6A4 4 0 0 1 5 18V6.5A3.5 3.5 0 0 1 8.5 3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 9h8M8 12h6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
            {
              title: "Personalized synthesis",
              body:
                "Results are curated into a bespoke skincare curriculum tailored specifically to your clinical profile.",
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
                  <path
                    d="M12 3l1.2 4.3L17 9l-3.8 1.7L12 15l-1.2-4.3L7 9l3.8-1.7L12 3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 14l.7 2.6L8 18l-2.3 1.4L5 22l-.7-2.6L2 18l2.3-1.4L5 14Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Seren standards",
              body:
                "Every digital analysis is overseen by clinical leads to ensure professional excellence.",
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" aria-hidden="true">
                  <path
                    d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.2 12.2l1.8 1.8 3.8-3.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-[2.5rem] bg-surface-container-lowest p-8 sm:p-9 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]"
            >
              <div className="h-11 w-11 rounded-2xl bg-primary/10 border border-primary/12 grid place-items-center mb-5">
                {c.icon}
              </div>
              <p className="font-headline tracking-tight text-base">{c.title}</p>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                {c.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

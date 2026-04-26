import { SerenHeroVisual } from "@/components/SerenHeroVisual";
import type { TransactionalEmailTemplate } from "@/lib/email/transactionalTemplates";
import { EmailFooterRich } from "@/components/mocks/rich/EmailFooterRich";
import { EmailPreviewChrome } from "@/components/mocks/rich/EmailPreviewChrome";

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 3C8.5 3 5.5 5.5 4.5 9c-.8 3 0 6 2.5 8.5C9.5 20 13 20.5 16 19c3-2 5-6 5-10 0-4-3.5-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 3v18M7 12c2.5 1.5 5.5 1.5 8 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  template: TransactionalEmailTemplate;
  showExampleUrls?: boolean;
};

export function WelcomeEmailRichPreview({ template, showExampleUrls = true }: Props) {
  return (
    <EmailPreviewChrome subject={template.subject}>
      <article
        className="mx-auto max-w-[640px] bg-[#FDFCFB] text-[#1A1A1A] shadow-[0_12px_48px_-16px_rgba(0,0,0,0.08)] border border-[#EFECE7]"
        aria-label="Welcome email mock"
      >
        <div className="px-6 sm:px-12 pt-12 sm:pt-14 pb-2">
          <p className="text-center text-[13px] font-medium uppercase tracking-[0.45em] text-[#2D2D2D]">
            Seren
          </p>
        </div>

        <div className="px-6 sm:px-12 pt-8">
          {/* Fixed height: `fill` + aspect-ratio + max-h can collapse in some browsers */}
          <div className="relative w-full h-[300px] sm:h-[360px] rounded-sm overflow-hidden bg-surface-container">
            <SerenHeroVisual />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-[min(100%,280px)] rounded-sm bg-white p-5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] border border-[#F0F0F0]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#888888] mb-2">
                Welcome home
              </p>
              <p className="text-[1.05rem] leading-snug font-medium text-[#2D2D2D] tracking-[-0.02em]">
                Your skin, finally at peace.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-12 pt-12 pb-2 text-center">
          <p className="text-[0.9375rem] leading-[1.75] text-[#4A4A4A] max-w-[52ch] mx-auto">
            Hello, and welcome to Seren. We believe that skincare is more than a routine—it is a
            restorative practice for both body and mind.
          </p>
          <p className="mt-4 text-[0.9375rem] leading-[1.75] text-[#4A4A4A] max-w-[52ch] mx-auto">
            You’ve taken the first step toward a more clinical, intentional approach to your
            well-being. Please confirm your email so we can keep your consultation secure.
          </p>
          <div className="mt-10 h-px max-w-[120px] mx-auto bg-[#E5E5E5]" />
        </div>

        <div className="px-6 sm:px-12 py-10">
          <div className="rounded-lg bg-white border border-[#EFEFEF] shadow-[0_4px_24px_-12px_rgba(0,0,0,0.06)] px-6 sm:px-8 py-8">
            <div className="flex items-start gap-3">
              <LeafIcon className="shrink-0 text-primary mt-0.5" />
              <div>
                <h2 className="text-lg font-medium text-[#2D2D2D] tracking-[-0.02em]">
                  How we pace your first month
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#666666]">
                  Think of it as short chapters—not a flood of new products. Each phase has one clear
                  job, so you always know the next step and nothing lands on your shelf without a
                  reason.
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-left border-t border-[#F0F0F0] pt-8">
              {[
                { w: "Week 1", d: "Listen & simplify" },
                { w: "Weeks 2–3", d: "Adjust together" },
                { w: "Week 4", d: "Carry it forward" },
              ].map((row) => (
                <div key={row.w}>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#909090]">{row.w}</p>
                  <p className="mt-1.5 text-xs font-medium text-[#3D3D3D]">{row.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-12 pb-6 text-center">
          <a
            href={template.ctaHrefExample}
            className="inline-block rounded-full btn-gradient text-on-primary text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] px-8 py-3.5 shadow-[0_12px_40px_-28px_rgba(61,99,116,0.55)] hover:brightness-[1.05] transition-[filter]"
          >
            {template.ctaLabel}
          </a>
          <p className="mt-4 text-xs text-[#888888]">
            Link expires in 24 hours · Then start your first assessment — approx. 4 minutes
          </p>
          {showExampleUrls ? (
            <p className="mt-6 text-[10px] leading-relaxed text-[#AAAAAA] font-mono break-all max-w-full">
              {template.ctaHrefExample}
            </p>
          ) : null}
          {template.secondaryNote ? (
            <p className="mt-6 text-xs text-[#888888] max-w-md mx-auto">{template.secondaryNote}</p>
          ) : null}
        </div>

        <div className="px-6 sm:px-12 py-12 border-t border-[#F0F0F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#888888] mb-3">
                Expert curation
              </p>
              <h3 className="text-xl font-medium text-[#2D2D2D] tracking-[-0.02em] leading-snug">
                Designed for restoration, guided by science.
              </h3>
              <p className="mt-4 text-sm leading-[1.7] text-[#666666]">
                Every recommendation in your journey is reviewed through a clinical lens—efficacy
                first, irritation minimized.
              </p>
            </div>
            <div
              className="relative w-full h-[240px] sm:h-[260px] md:h-[300px] rounded-sm overflow-hidden bg-gradient-to-br from-primary/12 via-surface-container to-surface-container-high border border-[#EFECE7]"
              aria-hidden
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(61,99,116,0.14),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(246,217,166,0.12),transparent_45%)]" />
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-12">
          <EmailFooterRich />
        </div>
      </article>
    </EmailPreviewChrome>
  );
}

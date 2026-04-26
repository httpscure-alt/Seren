import type { TransactionalEmailTemplate } from "@/lib/email/transactionalTemplates";
import { EmailFooterRich } from "@/components/mocks/rich/EmailFooterRich";
import { EmailPreviewChrome } from "@/components/mocks/rich/EmailPreviewChrome";

type Props = {
  template: TransactionalEmailTemplate;
  showExampleUrls?: boolean;
};

export function SuccessResetRichPreview({ template, showExampleUrls = true }: Props) {
  return (
    <EmailPreviewChrome subject={template.subject}>
      <article
        className="mx-auto max-w-[640px] bg-[#FDFCFB] text-[#2D2D2D] shadow-[0_12px_48px_-16px_rgba(0,0,0,0.08)] border border-[#EFECE7]"
        aria-label="Password updated email mock"
      >
        <div className="px-6 sm:px-12 pt-14 pb-6 text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.45em] text-[#2D2D2D]">
            Seren
          </p>
          <div className="mt-10 mx-auto w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary text-xl font-light">
            ✓
          </div>
          <h1 className="mt-8 text-[1.6rem] sm:text-[1.75rem] font-medium tracking-[-0.03em]">
            {template.headline}
          </h1>
          <div className="mt-6 space-y-4 text-[0.9375rem] leading-[1.75] text-[#666666] max-w-[48ch] mx-auto text-left sm:text-center">
            {template.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="px-6 sm:px-12 pb-4 text-center">
          <a
            href={template.ctaHrefExample}
            className="inline-block rounded-full btn-gradient text-on-primary text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] px-8 py-3.5 shadow-[0_12px_40px_-28px_rgba(61,99,116,0.55)] hover:brightness-[1.05] transition-[filter]"
          >
            {template.ctaLabel}
          </a>
          {showExampleUrls ? (
            <p className="mt-6 text-[10px] text-[#AAAAAA] font-mono break-all">{template.ctaHrefExample}</p>
          ) : null}
          {template.secondaryNote ? (
            <p className="mt-8 text-xs text-[#888888] max-w-md mx-auto">{template.secondaryNote}</p>
          ) : null}
        </div>

        <div className="px-6 sm:px-12">
          <EmailFooterRich />
        </div>
      </article>
    </EmailPreviewChrome>
  );
}

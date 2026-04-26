import type { TransactionalEmailTemplate } from "@/lib/email/transactionalTemplates";
import { EmailFooterRich } from "@/components/mocks/rich/EmailFooterRich";
import { EmailPreviewChrome } from "@/components/mocks/rich/EmailPreviewChrome";

type Props = {
  template: TransactionalEmailTemplate;
  showExampleUrls?: boolean;
};

export function ResetPasswordRichPreview({ template, showExampleUrls = true }: Props) {
  return (
    <EmailPreviewChrome subject={template.subject}>
      <article
        className="mx-auto max-w-[640px] bg-[#F9F9F7] text-[#2D2D2D] shadow-[0_12px_48px_-16px_rgba(0,0,0,0.08)] border border-[#EDECE8]"
        aria-label="Reset password email mock"
      >
        <div className="px-6 sm:px-12 pt-12 sm:pt-14 pb-4">
          <p className="text-center text-[13px] font-medium uppercase tracking-[0.45em] text-[#2D2D2D]">
            Seren
          </p>
        </div>

        <div className="px-6 sm:px-12">
          <div
            className="relative w-full h-[200px] sm:h-[260px] rounded-md overflow-hidden bg-gradient-to-br from-surface-container-low via-[#ebe8e1] to-surface-container-high"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.7)_0%,transparent_42%,rgba(61,99,116,0.07)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(165deg,transparent_55%,rgba(47,51,48,0.06)_100%)]" />
          </div>
        </div>

        <div className="px-6 sm:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            <aside className="md:col-span-4 md:pt-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#9A9A9A]">
                Security notice
              </p>
              <p className="mt-3 text-sm italic text-[#8A8A8A] leading-relaxed">
                Restoring access to your personal sanctuary of focus and calm.
              </p>
            </aside>
            <div className="md:col-span-8">
              <h1 className="text-[1.65rem] sm:text-[1.85rem] font-medium tracking-[-0.03em] text-[#2D2D2D] leading-tight">
                Find your way back to Seren.
              </h1>
              <p className="mt-5 text-[0.9375rem] leading-[1.75] text-[#6B6B6B]">
                We received a request to reset the password for your Seren account. Security is an
                essential part of the restorative space we provide.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href={template.ctaHrefExample}
              className="inline-block rounded-full btn-gradient text-on-primary text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] px-10 py-3.5 shadow-[0_12px_40px_-28px_rgba(61,99,116,0.55)] hover:brightness-[1.05] transition-[filter]"
            >
              {template.ctaLabel}
            </a>
            {template.finePrint ? (
              <p className="mt-4 text-xs text-[#888888]">{template.finePrint}</p>
            ) : null}
            {showExampleUrls ? (
              <p className="mt-6 text-[10px] leading-relaxed text-[#AAAAAA] font-mono break-all">
                {template.ctaHrefExample}
              </p>
            ) : null}
          </div>

          <div className="mt-10 rounded-md bg-[#F0F0ED] border border-[#E8E8E4] px-6 py-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#707070]">
              Did you not request this?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#7A7A7A]">
              {template.secondaryNote ??
                "If you did not make this request, you can safely ignore this email. Your current password will remain unchanged and your account stays secure."}
            </p>
          </div>
        </div>

        <div className="px-6 sm:px-12 pb-4">
          <EmailFooterRich />
        </div>
      </article>
    </EmailPreviewChrome>
  );
}

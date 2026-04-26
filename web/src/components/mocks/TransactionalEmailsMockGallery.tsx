import Link from "next/link";
import { ResetPasswordRichPreview } from "@/components/mocks/rich/ResetPasswordRichPreview";
import { SuccessResetRichPreview } from "@/components/mocks/rich/SuccessResetRichPreview";
import { WelcomeEmailRichPreview } from "@/components/mocks/rich/WelcomeEmailRichPreview";
import {
  TRANSACTIONAL_EMAIL_TEMPLATES,
  type TransactionalEmailId,
} from "@/lib/email/transactionalTemplates";

const ORDER: TransactionalEmailId[] = ["verify", "forgot-password", "reset-success"];

const LABELS: Record<TransactionalEmailId, string> = {
  verify: "Welcome + confirm email",
  "forgot-password": "Reset password",
  "reset-success": "Password updated",
};

export function TransactionalEmailsMockGallery() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="border-b border-outline-variant/15 bg-surface/90 backdrop-blur-md">
        <div className="seren-container py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-2">
              Mock • Transactional email
            </p>
            <h1 className="font-headline text-2xl sm:text-3xl tracking-[-0.02em]">
              Account emails
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Editorial layouts aligned to Seren mockups (welcome journey, reset password, success).
              Not wired to sending — for design and copy review.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-primary hover:underline underline-offset-4 shrink-0"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="seren-container py-10 sm:py-14 space-y-16 sm:space-y-20">
        {ORDER.map((id) => {
          const template = TRANSACTIONAL_EMAIL_TEMPLATES[id];
          return (
            <section key={id} className="scroll-mt-8" id={id}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
                <h2 className="font-headline text-lg text-on-surface">{LABELS[id]}</h2>
                <p className="text-xs text-on-surface/45 font-mono">{template.subject}</p>
              </div>
              {id === "verify" ? (
                <WelcomeEmailRichPreview template={template} />
              ) : id === "forgot-password" ? (
                <ResetPasswordRichPreview template={template} />
              ) : (
                <SuccessResetRichPreview template={template} />
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}

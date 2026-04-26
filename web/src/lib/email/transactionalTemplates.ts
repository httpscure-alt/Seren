/**
 * Copy for transactional emails (verify signup, password reset).
 * Used by design mocks; can be reused later for HTML/text email builders.
 */

export type TransactionalEmailId = "verify" | "forgot-password" | "reset-success";

export type TransactionalEmailTemplate = {
  id: TransactionalEmailId;
  subject: string;
  headline: string;
  body: string[];
  ctaLabel: string;
  ctaHrefExample: string;
  finePrint?: string;
  secondaryNote?: string;
};

export const TRANSACTIONAL_EMAIL_TEMPLATES: Record<
  TransactionalEmailId,
  TransactionalEmailTemplate
> = {
  verify: {
    id: "verify",
    subject: "Welcome to Seren — confirm your email",
    headline: "Welcome. Confirm your email to get started.",
    body: [
      "Thanks for creating your Seren account. To finish setup and keep your consultation details secure, please confirm this email address.",
    ],
    ctaLabel: "Confirm your email",
    ctaHrefExample: "https://seren.app/auth/verify?token=example-token",
    finePrint:
      "This link expires in 24 hours. If the button doesn’t work, copy and paste the URL into your browser.",
    secondaryNote:
      "If you didn’t create a Seren account, you can ignore this message.",
  },
  "forgot-password": {
    id: "forgot-password",
    subject: "Reset your Seren password",
    headline: "Reset your password",
    body: [
      "We received a request to reset the password for your account. Use the button below to choose a new password.",
    ],
    ctaLabel: "Reset password",
    ctaHrefExample: "https://seren.app/auth/reset-password?token=example-token",
    finePrint: "This link expires in 1 hour for your security.",
    secondaryNote:
      "If you didn’t request a reset, you can safely ignore this email — your password will stay the same.",
  },
  "reset-success": {
    id: "reset-success",
    subject: "Your Seren password was updated",
    headline: "You’re all set",
    body: [
      "Your password was successfully changed. You can now sign in with your new password.",
      "If you didn’t make this change, please contact us immediately so we can help secure your account.",
    ],
    ctaLabel: "Sign in to Seren",
    ctaHrefExample: "https://seren.app/auth",
    secondaryNote: "For your security, we’ll never ask for your password by email.",
  },
};

import { Resend } from "resend";
import { getAppOrigin } from "@/lib/email/site";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(inner: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="color-scheme" content="light only"/></head>
<body style="margin:0;padding:0;background:#faf9f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2f3330;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#faf9f6;padding:28px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:20px;border:1px solid rgba(175,179,174,0.22);overflow:hidden;">
${inner}
<tr><td style="padding:20px 24px;background:#f4f4f0;border-top:1px solid rgba(175,179,174,0.2);">
<p style="margin:0;font-size:11px;color:#787c77;line-height:1.6;">You’re receiving this because of activity on your Seren account.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#3d6374;background-image:linear-gradient(135deg,#3d6374 0%,#305767 100%);color:#f0f9ff;text-decoration:none;font-weight:650;font-size:14px;line-height:48px;height:48px;padding:0 22px;border-radius:999px;border:1px solid rgba(47,51,48,0.12);">${escapeHtml(label)}</a>`;
}

async function sendMail(to: string, subject: string, html: string): Promise<{ ok: boolean; skipped?: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Seren <onboarding@resend.dev>";
  if (!key) {
    console.warn("[email] RESEND_API_KEY missing; not sending:", subject, "→", to);
    return { ok: false, skipped: true };
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    console.error("[email] Resend error:", error);
    return { ok: false };
  }
  return { ok: true };
}

export async function sendSignupWelcomeEmail(opts: {
  to: string;
  name?: string | null;
  verifyToken: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  const origin = getAppOrigin();
  const verifyUrl = `${origin}/api/auth/verify-email?token=${encodeURIComponent(opts.verifyToken)}`;
  const greeting = opts.name?.trim() ? `Hi ${escapeHtml(opts.name.trim())},` : "Hi,";
  const inner = `<tr><td style="padding:28px 24px 12px 24px;">
<p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#3d6374;">Seren</p>
<h1 style="margin:0;font-size:22px;line-height:1.25;color:#2f3330;">Welcome — confirm your email</h1>
<p style="margin:14px 0 0 0;font-size:14px;line-height:1.7;color:#5c605c;">${greeting}</p>
<p style="margin:12px 0 0 0;font-size:14px;line-height:1.7;color:#5c605c;">Thanks for creating your Seren account. Confirm your email so we can keep your consultation details secure.</p>
</td></tr>
<tr><td style="padding:8px 24px 24px 24px;">${ctaButton(verifyUrl, "Confirm your email")}<p style="margin:14px 0 0 0;font-size:12px;line-height:1.6;color:#5c605c;">This link expires in 24 hours. If you didn’t sign up, you can ignore this message.</p></td></tr>`;
  return sendMail(opts.to, "Welcome to Seren — confirm your email", layout(inner));
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  name?: string | null;
  resetToken: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  const origin = getAppOrigin();
  const resetUrl = `${origin}/auth/reset-password?token=${encodeURIComponent(opts.resetToken)}`;
  const inner = `<tr><td style="padding:28px 24px 12px 24px;">
<p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#3d6374;">Seren</p>
<h1 style="margin:0;font-size:22px;line-height:1.25;color:#2f3330;">Reset your password</h1>
<p style="margin:14px 0 0 0;font-size:14px;line-height:1.7;color:#5c605c;">We received a request to reset the password for your Seren account. Use the button below to choose a new password.</p>
</td></tr>
<tr><td style="padding:8px 24px 24px 24px;">${ctaButton(resetUrl, "Reset password")}<p style="margin:14px 0 0 0;font-size:12px;line-height:1.6;color:#5c605c;">This link expires in 1 hour. If you didn’t request this, you can safely ignore this email.</p></td></tr>`;
  return sendMail(opts.to, "Reset your Seren password", layout(inner));
}

export async function sendPasswordChangedEmail(opts: {
  to: string;
  name?: string | null;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  const origin = getAppOrigin();
  const signInUrl = `${origin}/auth`;
  const inner = `<tr><td style="padding:28px 24px 12px 24px;">
<p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#3d6374;">Seren</p>
<h1 style="margin:0;font-size:22px;line-height:1.25;color:#2f3330;">Your password was updated</h1>
<p style="margin:14px 0 0 0;font-size:14px;line-height:1.7;color:#5c605c;">Your password was successfully changed. You can now sign in with your new password.</p>
<p style="margin:12px 0 0 0;font-size:14px;line-height:1.7;color:#5c605c;">If you didn’t make this change, please contact support right away.</p>
</td></tr>
<tr><td style="padding:8px 24px 24px 24px;">${ctaButton(signInUrl, "Sign in to Seren")}<p style="margin:14px 0 0 0;font-size:12px;line-height:1.6;color:#5c605c;">We’ll never ask for your password by email.</p></td></tr>`;
  return sendMail(opts.to, "Your Seren password was updated", layout(inner));
}

export type ConsentChoice = "accepted" | "rejected" | "unset";

const CONSENT_KEY = "seren_consent_analytics";

function readCookie(name: string): string | null {
  try {
    const parts = document.cookie.split(";").map((p) => p.trim());
    for (const p of parts) {
      if (!p) continue;
      const eq = p.indexOf("=");
      if (eq === -1) continue;
      const k = p.slice(0, eq);
      if (k !== name) continue;
      return decodeURIComponent(p.slice(eq + 1));
    }
  } catch {}
  return null;
}

export function getConsent(): ConsentChoice {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    if (v === "accepted" || v === "rejected") return v;
  } catch {}
  // Fallback for browsers/webviews where localStorage is unreliable.
  const c = readCookie(CONSENT_KEY);
  if (c === "accepted" || c === "rejected") return c;
  return "unset";
}

export function setConsent(choice: Exclude<ConsentChoice, "unset">) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {}
  // mirror into a cookie for potential server-side checks later
  try {
    document.cookie = `${CONSENT_KEY}=${choice}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch {}
}


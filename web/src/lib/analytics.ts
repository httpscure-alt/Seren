import { getConsent } from "@/lib/consent";

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    posthog?: { capture: (event: string, props?: Record<string, any>) => void };
  }
}

export function track(event: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;

  try {
    window.gtag?.("event", event, props ?? {});
  } catch {}

  try {
    window.posthog?.capture?.(event, props ?? {});
  } catch {}
}


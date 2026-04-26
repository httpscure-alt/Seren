"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  useEffect(() => {
    if (!key) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // we capture ourselves
    });
    (window as any).posthog = posthog;
  }, [key, host]);

  return null;
}


"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getConsent } from "@/lib/consent";
import { track } from "@/lib/analytics";
import { GA } from "@/components/Analytics/GA";
import { PostHog } from "@/components/Analytics/PostHog";

export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const sp = useSearchParams();

  useEffect(() => {
    const update = () => setEnabled(getConsent() === "accepted");
    update();
    window.addEventListener("storage", update);
    window.addEventListener("seren-consent-change", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("seren-consent-change", update);
    };
  }, []);

  const url = useMemo(() => {
    const qs = sp?.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, sp]);

  useEffect(() => {
    if (!enabled) return;
    track("page_view", { path: url });
  }, [enabled, url]);

  if (!enabled) return null;
  return (
    <>
      <GA />
      <PostHog />
    </>
  );
}


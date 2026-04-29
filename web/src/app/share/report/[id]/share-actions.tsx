"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export function ShareActions({
  publicId,
  viewerKind = "anon",
}: {
  publicId: string;
  viewerKind?: "anon" | "user" | "staff";
}) {
  const [copied, setCopied] = useState(false);

  /** Same path as `generateMetadata` `openGraph.url` so scrapers and users hit one canonical share URL. */
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const base = `${window.location.origin}/share/report/${publicId.toLowerCase()}`;
    return viewerKind === "staff" ? `${base}?viewer=staff` : base;
  }, [publicId, viewerKind]);

  async function copy() {
    try {
      const url = shareUrl || "";
      if (!url) return;
      const message = `${url}\nBaru dapet Seren skin plan - simple dan masuk akal. Mau liat share card-nya?`;
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-7">
      <p className="font-headline tracking-tight text-base">Share options</p>
      <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
        Copy a link for friends & family. The preview is safe by default.
      </p>

      <div className="mt-6 space-y-3">
        <Link
          href="/consult/welcome"
          className="w-full inline-flex items-center justify-center btn-gradient text-on-primary px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-headline shadow-sm"
        >
          Get my plan
        </Link>

        <button
          type="button"
          onClick={copy}
          className="w-full btn-gradient text-on-primary px-6 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-headline shadow-sm"
        >
          {copied ? "Copied message + link" : "Copy message + link"}
        </button>

        <Link
          href={`/report/${publicId.toLowerCase()}`}
          className="w-full inline-flex items-center justify-center rounded-full border border-outline-variant/25 px-6 py-3 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          View full report (login)
        </Link>

        <Link
          href="/results"
          className="w-full inline-flex items-center justify-center rounded-full border border-outline-variant/25 px-6 py-3 text-xs uppercase tracking-[0.2em] font-headline text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-2">
          Privacy defaults
        </p>
        <ul className="text-sm text-on-surface-variant leading-relaxed list-disc pl-5 space-y-2">
          <li>No clinical photos in previews.</li>
          <li>No diagnosis text in previews.</li>
          <li>Full details require sign-in.</li>
        </ul>
      </div>
    </div>
  );
}


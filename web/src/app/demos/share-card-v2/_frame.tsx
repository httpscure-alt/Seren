import type { ReactNode } from "react";

export function OgFrame({ children }: { children: ReactNode }) {
  return (
    <div className="seren-card p-8 sm:p-10">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface/45 mb-6">OG preview frame (mock)</p>
      <div className="w-full aspect-[1200/630] max-w-[1200px] mx-auto">{children}</div>
      <p className="mt-6 text-xs text-on-surface/45 leading-relaxed">
        This approximates what WhatsApp/iMessage/X render from <code>og:image</code>.
      </p>
    </div>
  );
}


import type { ReactNode } from "react";

type Props = {
  subject: string;
  children: ReactNode;
};

export function EmailPreviewChrome({ subject, children }: Props) {
  return (
    <div className="rounded-2xl border border-outline-variant/25 bg-surface-container-low overflow-hidden shadow-sm">
      <div className="border-b border-outline-variant/15 bg-surface-container px-4 py-2.5 flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
          Email preview
        </span>
        <span className="text-[10px] text-on-surface/40 truncate font-mono max-w-[55%]">
          {subject}
        </span>
      </div>
      <div className="bg-[#e5e6e2] p-6 sm:p-8">{children}</div>
    </div>
  );
}

"use client";

import { usePathname, useSearchParams } from "next/navigation";

function buildNext(pathname: string, search: URLSearchParams) {
  const qs = search.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function LanguageToggle({ current }: { current: "en" | "id" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const next = buildNext(pathname, new URLSearchParams(searchParams.toString()));

  const base =
    "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-colors";
  const active = "border-primary/30 bg-primary/10 text-primary";
  const inactive = "border-outline-variant/20 text-on-surface/55 hover:text-primary hover:border-primary/25";

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/api/lang?lang=en&next=${encodeURIComponent(next)}`}
        className={`${base} ${current === "en" ? active : inactive}`}
      >
        EN
      </a>
      <a
        href={`/api/lang?lang=id&next=${encodeURIComponent(next)}`}
        className={`${base} ${current === "id" ? active : inactive}`}
      >
        ID
      </a>
    </div>
  );
}


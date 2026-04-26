"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Hit = {
  x: number;
  y: number;
  tag: string;
  id?: string;
  className?: string;
  zIndex?: string;
  pointerEvents?: string;
  position?: string;
};

function pick(el: Element | null, x: number, y: number): Hit | null {
  if (!el) return null;
  const htmlEl = el as HTMLElement;
  const cs = window.getComputedStyle(htmlEl);
  return {
    x,
    y,
    tag: el.tagName.toLowerCase(),
    id: htmlEl.id || undefined,
    className: typeof htmlEl.className === "string" ? htmlEl.className : undefined,
    zIndex: cs.zIndex,
    pointerEvents: cs.pointerEvents,
    position: cs.position,
  };
}

export function TapDebugger() {
  const sp = useSearchParams();
  const enabled = useMemo(() => sp?.get("debugTap") === "1", [sp]);
  const [last, setLast] = useState<Hit | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const onDown = (e: PointerEvent) => {
      const x = Math.round(e.clientX);
      const y = Math.round(e.clientY);
      const el = document.elementFromPoint(x, y);
      setLast(pick(el, x, y));
    };

    window.addEventListener("pointerdown", onDown, { capture: true });
    return () => window.removeEventListener("pointerdown", onDown, { capture: true } as any);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed z-[1000] top-3 left-3 right-3 sm:right-auto sm:w-[520px] pointer-events-none">
      <div className="pointer-events-auto rounded-2xl border border-outline-variant/25 bg-surface/95 shadow-[0_26px_80px_-55px_rgba(47,51,48,0.45)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/55">
              Tap debugger (dev)
            </p>
            <p className="mt-1 text-sm font-headline tracking-tight text-on-surface">
              Tap anywhere — I’ll show the top element.
            </p>
          </div>
          <a
            className="text-[10px] uppercase tracking-[0.22em] text-primary underline underline-offset-4 pointer-events-auto"
            href={(() => {
              const u = new URL(window.location.href);
              u.searchParams.delete("debugTap");
              return u.toString();
            })()}
          >
            Close
          </a>
        </div>

        <div className="mt-3 rounded-xl bg-surface-container-low border border-outline-variant/15 p-3 text-xs text-on-surface/80 font-mono overflow-x-auto">
          {last ? (
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(last, null, 2)}</pre>
          ) : (
            <p className="text-on-surface-variant">No tap captured yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}


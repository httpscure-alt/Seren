"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastTone = "success" | "error" | "info";
type Toast = { id: string; tone: ToastTone; title: string; detail?: string };

const ToastContext = createContext<{
  push: (t: Omit<Toast, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const toast: Toast = { id, ...t };
    setToasts((prev) => [...prev, toast].slice(-3));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-[100] bottom-5 right-5 left-5 sm:left-auto sm:w-[420px] space-y-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_26px_70px_-50px_rgba(47,51,48,0.45)] backdrop-blur-2xl bg-surface/80",
              t.tone === "success"
                ? "border-primary/15"
                : t.tone === "error"
                  ? "border-error/20"
                  : "border-outline-variant/15",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 h-2.5 w-2.5 rounded-full",
                  t.tone === "success"
                    ? "bg-primary"
                    : t.tone === "error"
                      ? "bg-error"
                      : "bg-outline",
                ].join(" ")}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-headline tracking-tight text-on-surface">
                  {t.title}
                </p>
                {t.detail ? (
                  <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
                    {t.detail}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


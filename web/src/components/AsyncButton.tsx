"use client";

import type { ButtonHTMLAttributes } from "react";

export function AsyncButton({
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
}) {
  const isDisabled = disabled || !!isLoading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={isLoading ? "true" : undefined}
      className={[
        className ?? "",
        isDisabled ? "opacity-60" : "",
        "disabled:cursor-not-allowed",
      ].join(" ")}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {isLoading ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden="true">
            <path
              d="M12 4a8 8 0 1 1-7.5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M4.5 9.2V5.8H7.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
        <span>{children}</span>
      </span>
    </button>
  );
}


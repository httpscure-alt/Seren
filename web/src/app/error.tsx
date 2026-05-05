"use client";

/** Segment error UI — must not render `<html>` / `<body>` (those belong only in `global-error.tsx`). */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] bg-surface text-on-surface">
      <div className="seren-container py-20">
        <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-on-surface/45">Something went wrong</p>
        <h1 className="font-headline text-3xl tracking-tight sm:text-4xl">We couldn&apos;t load this view.</h1>
        <p className="mt-6 max-w-[70ch] leading-relaxed text-on-surface-variant">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="btn-gradient mt-10 rounded-full px-8 py-3.5 text-sm font-medium tracking-wide text-on-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

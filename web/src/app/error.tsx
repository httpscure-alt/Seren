"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-surface text-on-surface">
        <div className="seren-container py-20">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45 mb-6">
            Something went wrong
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl tracking-tight">
            We couldn’t load this view.
          </h1>
          <p className="mt-6 text-on-surface-variant leading-relaxed max-w-[70ch]">
            {error.message}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-10 btn-gradient text-on-primary px-8 py-3.5 rounded-full text-sm font-medium tracking-wide"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}


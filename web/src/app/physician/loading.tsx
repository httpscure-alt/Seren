export default function Loading() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="seren-container pt-28 sm:pt-32 pb-16 flex flex-col md:flex-row gap-12 lg:gap-16">
        <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
          <div className="flex items-baseline justify-between">
            <div className="h-6 w-32 rounded bg-surface-container animate-pulse" />
            <div className="h-4 w-20 rounded bg-surface-container animate-pulse" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/10"
              >
                <div className="h-5 w-40 rounded bg-surface-container animate-pulse mb-3" />
                <div className="h-3 w-full rounded bg-surface-container animate-pulse mb-2" />
                <div className="h-3 w-10/12 rounded bg-surface-container animate-pulse" />
              </div>
            ))}
          </div>
        </aside>
        <section className="flex-grow space-y-6">
          <div className="h-10 w-56 rounded bg-surface-container animate-pulse" />
          <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-8 space-y-4">
            <div className="h-6 w-64 rounded bg-surface-container animate-pulse" />
            <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
            <div className="h-4 w-10/12 rounded bg-surface-container animate-pulse" />
          </div>
        </section>
      </div>
    </div>
  );
}


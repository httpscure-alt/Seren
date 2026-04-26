export default function Loading() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="seren-container pt-28 sm:pt-32 pb-24">
        <div className="max-w-4xl mx-auto mb-14 sm:mb-16">
          <div className="flex justify-between items-end gap-4 mb-4">
            <div className="space-y-3">
              <div className="h-8 w-48 rounded-lg bg-surface-container animate-pulse" />
              <div className="h-4 w-72 rounded-lg bg-surface-container animate-pulse" />
            </div>
            <div className="h-4 w-24 rounded-lg bg-surface-container animate-pulse" />
          </div>
          <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary/30 w-1/2 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-12">
          <aside className="col-span-12 lg:col-span-3 order-2 lg:order-1 space-y-6">
            <div className="p-8 rounded-2xl bg-surface-container-low space-y-3">
              <div className="h-5 w-44 rounded-lg bg-surface-container animate-pulse" />
              <div className="h-3 w-full rounded bg-surface-container animate-pulse" />
              <div className="h-3 w-11/12 rounded bg-surface-container animate-pulse" />
              <div className="h-3 w-10/12 rounded bg-surface-container animate-pulse" />
            </div>
            <div className="p-8 rounded-2xl bg-surface-container-low space-y-3">
              <div className="h-3 w-full rounded bg-surface-container animate-pulse" />
              <div className="h-3 w-10/12 rounded bg-surface-container animate-pulse" />
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-9 order-1 lg:order-2 space-y-6">
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-8 sm:p-10 space-y-4">
              <div className="h-6 w-56 rounded-lg bg-surface-container animate-pulse" />
              <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-10/12 rounded bg-surface-container animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-surface-container animate-pulse" />
            </div>
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-8 sm:p-10 space-y-4">
              <div className="h-6 w-44 rounded-lg bg-surface-container animate-pulse" />
              <div className="h-24 w-full rounded-2xl bg-surface-container animate-pulse" />
            </div>
            <div className="h-12 w-56 rounded-full bg-surface-container animate-pulse" />
          </section>
        </div>
      </div>
    </div>
  );
}


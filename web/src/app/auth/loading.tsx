export default function Loading() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="seren-container pt-28 sm:pt-32 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-12 gap-12 lg:gap-16">
          <section className="col-span-12 lg:col-span-7">
            <div className="max-w-lg mx-auto lg:mx-0">
              <div className="h-10 w-56 rounded-xl bg-surface-container animate-pulse" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-lg bg-surface-container animate-pulse" />
                <div className="h-4 w-11/12 rounded-lg bg-surface-container animate-pulse" />
                <div className="h-4 w-10/12 rounded-lg bg-surface-container animate-pulse" />
              </div>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 rounded-2xl bg-surface-container animate-pulse" />
                <div className="h-12 rounded-2xl bg-surface-container animate-pulse" />
              </div>
              <div className="mt-12 h-px bg-outline-variant/20" />
              <div className="mt-10 space-y-4">
                <div className="h-12 rounded-xl bg-surface-container animate-pulse" />
                <div className="h-12 rounded-xl bg-surface-container animate-pulse" />
                <div className="h-12 rounded-full bg-surface-container animate-pulse" />
              </div>
            </div>
          </section>
          <aside className="col-span-12 lg:col-span-5">
            <div className="seren-card p-8 sm:p-10 lg:sticky lg:top-28">
              <div className="h-12 w-12 rounded-2xl bg-surface-container animate-pulse mb-6" />
              <div className="h-5 w-40 rounded-lg bg-surface-container animate-pulse mb-3" />
              <div className="h-4 w-full rounded-lg bg-surface-container animate-pulse" />
              <div className="mt-2 h-4 w-10/12 rounded-lg bg-surface-container animate-pulse" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


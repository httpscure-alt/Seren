export default function Loading() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="seren-container pt-28 sm:pt-32 pb-24">
        <div className="mb-12 sm:mb-16 max-w-2xl space-y-5">
          <div className="h-10 w-56 rounded-xl bg-surface-container animate-pulse" />
          <div className="h-5 w-full rounded bg-surface-container animate-pulse" />
          <div className="h-5 w-10/12 rounded bg-surface-container animate-pulse" />
        </div>

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-7 space-y-6">
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-8 sm:p-10 space-y-4">
              <div className="h-6 w-64 rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-surface-container animate-pulse" />
              <div className="h-12 w-48 rounded-full bg-surface-container animate-pulse" />
            </div>
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-8 sm:p-10 space-y-4">
              <div className="h-6 w-56 rounded bg-surface-container animate-pulse" />
              <div className="h-16 w-full rounded-2xl bg-surface-container animate-pulse" />
            </div>
          </section>
          <aside className="col-span-12 lg:col-span-5 space-y-6">
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-8 sm:p-10 space-y-4">
              <div className="h-6 w-44 rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-10/12 rounded bg-surface-container animate-pulse" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


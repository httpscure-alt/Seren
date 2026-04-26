export default function Loading() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="seren-container pt-28 sm:pt-32 pb-24">
        <section className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="col-span-12 lg:col-span-7">
            <div className="relative w-full rounded-[2.75rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center p-10">
                <div className="w-full max-w-md rounded-3xl bg-surface/70 border border-outline-variant/12 p-8">
                  <div className="h-6 w-48 rounded-lg bg-surface-container animate-pulse mx-auto" />
                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
                    <div className="h-4 w-11/12 rounded bg-surface-container animate-pulse" />
                  </div>
                  <div className="mt-6 h-3 w-56 rounded bg-surface-container animate-pulse mx-auto" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="h-4 w-56 rounded bg-surface-container animate-pulse" />
            <div className="rounded-[2rem] bg-surface-container-lowest border border-outline-variant/10 p-8 space-y-4">
              <div className="h-6 w-52 rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-full rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-10/12 rounded bg-surface-container animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-surface-container animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


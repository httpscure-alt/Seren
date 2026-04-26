import { BrandMark } from "@/components/BrandMark";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getDictionary } from "@/i18n/getDictionary";
import Link from "next/link";

export default async function MockUiV2ProfilePage() {
  const { lang, dict } = await getDictionary();

  const isId = lang === "id";
  const copy = {
    nav: {
      start: dict.nav.startConsultation,
      philosophy: dict.nav.philosophy,
      profile: isId ? "Profil" : "Profile",
      back: isId ? "Kembali" : "Back",
    },
    hero: {
      pill: isId ? "Akun" : "Account",
      titleA: isId ? "Profil" : "Profile",
      titleB: isId ? "dan perjalanan kulit" : "and skin journey",
      body: isId
        ? "Simpan asesmen, lihat riwayat konsultasi, dan kelola rutinitasmu—dalam satu tempat."
        : "Save assessments, view consultation history, and manage your routine—in one place.",
    },
    cards: {
      overview: isId ? "Ringkasan akun" : "Account overview",
      history: isId ? "Riwayat konsultasi" : "Consultation history",
      settings: isId ? "Pengaturan" : "Settings",
    },
    labels: {
      plan: isId ? "Paket" : "Plan",
      status: isId ? "Status" : "Status",
      next: isId ? "Langkah berikutnya" : "Next step",
      email: isId ? "Email" : "Email",
    },
    values: {
      plan: isId ? "Perjalanan kulit 30 hari" : "30-day skin journey",
      status: isId ? "Aktif" : "Active",
      next: isId ? "Lanjutkan konsultasi" : "Continue consultation",
    },
    actions: {
      start: dict.nav.startConsultation,
      openResults: isId ? "Buka hasil" : "Open results",
      openReport: isId ? "Buka laporan" : "Open report",
      security: isId ? "Keamanan & privasi" : "Security & privacy",
      notifications: isId ? "Notifikasi" : "Notifications",
      language: isId ? "Bahasa" : "Language",
      signOut: isId ? "Keluar" : "Sign out",
    },
    helper: {
      security: isId
        ? "Data medis dienkripsi dan disimpan dengan aman."
        : "Medical data is encrypted and stored securely.",
      notif: isId
        ? "Dapatkan update saat laporanmu selesai direview."
        : "Get updates when your report is reviewed.",
    },
  } as const;

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-surface/70 backdrop-blur-2xl">
        <div className="seren-container py-5 flex items-center justify-between gap-4">
          <BrandMark href="/mock/ui-v2" />

          <nav className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.18em] uppercase text-on-surface/60">
            <Link href="/mock/ui-v2" className="hover:text-primary transition-colors">
              {dict.nav.startConsultation}
            </Link>
            <Link
              href="/mock/ui-v2/philosophy"
              className="hover:text-primary transition-colors"
            >
              {copy.nav.philosophy}
            </Link>
            <Link
              href="/mock/ui-v2/profile"
              className="text-primary border-b-2 border-primary/20 pb-1"
            >
              {copy.nav.profile}
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <LanguageToggle current={lang} />
            <Link
              href="/consult/intake"
              className="rounded-full bg-primary text-on-primary px-5 py-2.5 text-sm font-medium tracking-wide shadow-sm"
            >
              {copy.actions.start}
            </Link>
          </div>
        </div>
      </header>

      <main className="seren-container pt-10 sm:pt-14 pb-16 sm:pb-20">
        <div className="grid grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="col-span-12 lg:col-span-5">
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-2 text-[10px] uppercase tracking-[0.22em]">
              {copy.hero.pill}
            </span>

            <h1 className="mt-8 font-headline tracking-[-0.03em] leading-[0.95] text-[2.4rem] sm:text-[3.1rem] lg:text-[3.4rem]">
              {copy.hero.titleA}
              <br />
              <span className="italic font-light">{copy.hero.titleB}</span>
            </h1>

            <p className="mt-7 text-on-surface-variant leading-[1.75] max-w-[56ch]">
              {copy.hero.body}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/results"
                className="rounded-full bg-primary text-on-primary px-7 py-3 text-sm font-medium tracking-wide shadow-sm text-center"
              >
                {copy.actions.openResults}
              </Link>
              <Link
                href="/mock/ui-v2"
                className="rounded-full bg-surface-container-low text-on-surface px-7 py-3 text-sm font-medium tracking-wide text-center hover:bg-surface-container transition-colors"
              >
                {copy.nav.back}
              </Link>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-6">
            <section className="rounded-[2.5rem] bg-surface-container-lowest shadow-[0_22px_70px_-46px_rgba(47,51,48,0.20)] p-7 sm:p-9">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-headline tracking-tight text-base">
                    {copy.cards.overview}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                    {copy.helper.security}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/15" />
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-3xl bg-surface-container-low p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    {copy.labels.plan}
                  </p>
                  <p className="mt-2 font-headline tracking-tight">
                    {copy.values.plan}
                  </p>
                </div>
                <div className="rounded-3xl bg-surface-container-low p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    {copy.labels.status}
                  </p>
                  <p className="mt-2 font-headline tracking-tight">
                    {copy.values.status}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-surface-container-low p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
                    {copy.labels.next}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {copy.values.next}
                  </p>
                </div>
                <Link
                  href="/consult/intake"
                  className="rounded-full bg-primary text-on-primary px-6 py-3 text-sm font-medium tracking-wide shadow-sm shrink-0"
                >
                  {copy.actions.start}
                </Link>
              </div>
            </section>

            <section className="rounded-[2.5rem] bg-surface-container-lowest shadow-[0_22px_70px_-46px_rgba(47,51,48,0.20)] p-7 sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <p className="font-headline tracking-tight text-base">
                  {copy.cards.history}
                </p>
                <Link
                  href="/report/srn-8821"
                  className="text-primary text-sm font-medium underline underline-offset-8"
                >
                  {copy.actions.openReport}
                </Link>
              </div>

              <div className="mt-6 space-y-4 text-sm text-on-surface-variant">
                {[
                  isId
                    ? "Barrier repair phase II — 12 Sept 2024"
                    : "Barrier repair phase II — Sept 12, 2024",
                  isId
                    ? "Initial skin analysis — 02 Juli 2024"
                    : "Initial skin analysis — July 02, 2024",
                ].map((row) => (
                  <div
                    key={row}
                    className="p-6 bg-surface-container-low rounded-3xl"
                  >
                    {row}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2.5rem] bg-surface-container-lowest shadow-[0_22px_70px_-46px_rgba(47,51,48,0.20)] p-7 sm:p-9">
              <p className="font-headline tracking-tight text-base">
                {copy.cards.settings}
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-surface-container-low p-6">
                  <p className="font-headline tracking-tight text-sm">
                    {copy.actions.security}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                    {copy.helper.security}
                  </p>
                </div>

                <div className="rounded-3xl bg-surface-container-low p-6">
                  <p className="font-headline tracking-tight text-sm">
                    {copy.actions.notifications}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                    {copy.helper.notif}
                  </p>
                </div>

                <div className="rounded-3xl bg-surface-container-low p-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-headline tracking-tight text-sm">
                      {copy.actions.language}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                      {copy.labels.email}: demo@seren.app
                    </p>
                  </div>
                  <LanguageToggle current={lang} />
                </div>

                <button
                  type="button"
                  className="w-full rounded-full border border-outline-variant/25 text-on-surface-variant px-7 py-3 text-sm font-medium tracking-wide hover:bg-surface-container transition-colors"
                >
                  {copy.actions.signOut}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}


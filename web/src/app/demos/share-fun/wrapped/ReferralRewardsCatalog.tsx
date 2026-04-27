import Link from "next/link";
import {
  CATEGORY_SECTION,
  categoryLabel,
  rewardsGrouped,
  type ReferralRewardRow,
  type RewardCategory,
} from "./rewardsMock";

const SECTION_ANCHOR: Record<RewardCategory, string> = {
  SUBSCRIPTION: "redeem-subscription",
  CASH: "redeem-cash",
  TREATMENT: "redeem-clinic",
};

function SectionIcon({ category }: { category: RewardCategory }) {
  const common = "h-6 w-6 text-primary";
  if (category === "SUBSCRIPTION") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M8 4h8v4H8V4Zm0 8h8v8H8v-8Zm8-4h4v4h-4V8Z"
        />
      </svg>
    );
  }
  if (category === "CASH") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <path
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16M7 8h6a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20V9l8-5 8 5v11M9 20v-6h6v6"
      />
    </svg>
  );
}

function RewardCard({ row }: { row: ReferralRewardRow }) {
  return (
    <article
      className={[
        "flex h-full flex-col rounded-[1.75rem] border border-outline-variant/15 bg-surface-container-lowest p-6 sm:p-7",
        "shadow-[0_14px_44px_-18px_rgba(47,51,48,0.1)] transition-shadow hover:shadow-[0_20px_50px_-22px_rgba(61,99,116,0.12)]",
      ].join(" ")}
    >
      <h4 className="font-headline text-lg tracking-tight text-on-surface sm:text-xl">{row.name}</h4>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-on-surface-variant">{row.youGet}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant/12 pt-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Points
          </p>
          <p className="mt-1 font-headline text-2xl tabular-nums tracking-tight text-primary sm:text-[1.75rem]">
            {row.pointsCost.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-right sm:text-left">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Worth ~ (mock)
          </p>
          <p className="mt-1 font-headline text-lg tabular-nums tracking-tight text-on-surface">
            {row.approxValueIdr != null ? (
              <>Rp {row.approxValueIdr.toLocaleString("id-ID")}</>
            ) : (
              <span className="text-base font-normal text-on-surface/40">Not a fixed IDR item</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-surface-container-low/80 px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-on-surface/45">
          Good to know
        </p>
        <p className="mt-2 text-xs leading-relaxed text-on-surface/65">{row.goodToKnow}</p>
      </div>
    </article>
  );
}

/**
 * Card-based catalog: three sections, grid of reward cards — matches Seren surfaces & typography.
 */
export function ReferralRewardsCatalog() {
  const groups = rewardsGrouped();

  return (
    <div className="space-y-12">
      <div className="seren-card p-6 sm:p-8 lg:p-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
          Seren Points (mock)
        </p>
        <h2 className="mt-3 font-headline text-2xl tracking-[-0.02em] text-on-surface sm:text-3xl">
          Earn, then choose a reward
        </h2>
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-on-surface-variant">
          Refer friends with your link. When their subscription is attributed to you, you collect
          points. Redeem in any of the three areas below—each uses the same point balance.
        </p>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Earn",
              body: "Friend subscribes via your referral link; points credit after the sale clears (rules TBD).",
            },
            {
              step: "2",
              title: "Balance",
              body: "Points sit in your Seren account until you spend them (expiry policy TBD).",
            },
            {
              step: "3",
              title: "Redeem",
              body: "Pick clinic treatment, subscription perks, or cash from the cards under each section.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-4 rounded-2xl border border-outline-variant/12 bg-surface/90 p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 font-headline text-sm font-semibold text-primary">
                {item.step}
              </span>
              <div>
                <p className="font-headline text-sm font-medium tracking-tight text-on-surface">
                  {item.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-xs leading-relaxed text-on-surface/45">
          “Worth ~” is a rough IDR anchor to compare rewards—not the resale value of your points.
        </p>

        <nav
          className="mt-8 flex flex-wrap items-center gap-2 border-t border-outline-variant/10 pt-8"
          aria-label="Jump to sections"
        >
          <span className="mr-2 text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
            Jump to
          </span>
          {groups.map(({ category, rows }) =>
            rows.length ? (
              <Link
                key={category}
                href={`#${SECTION_ANCHOR[category]}`}
                className="rounded-full border border-outline-variant/20 bg-surface px-4 py-2 text-xs font-medium text-on-surface transition hover:border-primary/25 hover:bg-primary/5"
              >
                {categoryLabel(category)}
              </Link>
            ) : null,
          )}
        </nav>
      </div>

      <div className="space-y-14">
        {groups.map(({ category, rows }) => {
          if (!rows.length) return null;
          const section = CATEGORY_SECTION[category];
          const anchor = SECTION_ANCHOR[category];

          return (
            <section key={category} id={anchor} className="scroll-mt-28">
              <div className="seren-card overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-outline-variant/10 bg-surface-container-low/50 px-6 py-7 sm:flex-row sm:items-start sm:gap-6 sm:px-8 sm:py-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-outline-variant/12 bg-surface-container-lowest shadow-sm">
                    <SectionIcon category={category} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface/45">
                      {categoryLabel(category)}
                    </p>
                    <h3 className="mt-2 font-headline text-2xl tracking-[-0.02em] text-on-surface sm:text-[1.75rem]">
                      {section.title}
                    </h3>
                    <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-on-surface-variant">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-7 lg:grid-cols-2 xl:gap-6">
                  {rows.map((row) => (
                    <RewardCard key={row.id} row={row} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-center text-xs leading-relaxed text-on-surface/45">
        Figures are placeholders for product, legal, and finance review.
      </p>
    </div>
  );
}

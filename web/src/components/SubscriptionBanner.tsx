import Link from "next/link";

export function SubscriptionBanner({
  expiresAtIso,
}: {
  expiresAtIso: string;
}) {
  const expiresAt = new Date(expiresAtIso);
  const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  const label = daysLeft <= 1 ? "Expires today" : `Expires in ${daysLeft} days`;

  return (
    <div className="w-full border-b border-outline-variant/10 bg-primary/5">
      <div className="seren-container py-3 flex items-center justify-between gap-4">
        <p className="text-xs text-on-surface-variant">
          <span className="text-on-surface font-medium">{label}.</span>{" "}
          Renew to keep access to your reports.
        </p>
        <Link
          href="/paywall"
          className="text-xs uppercase tracking-[0.22em] text-primary underline underline-offset-4 shrink-0"
        >
          Renew
        </Link>
      </div>
    </div>
  );
}


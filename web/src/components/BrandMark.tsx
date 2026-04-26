import Link from "next/link";

export function BrandMark({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "text-xl font-headline font-medium tracking-tight text-on-surface shrink-0",
        className,
      ].join(" ")}
    >
      Seren
    </Link>
  );
}


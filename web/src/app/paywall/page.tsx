import { PaywallContent, type PaywallSearchInput } from "./PaywallContent";

export default async function PaywallPage({
  searchParams,
}: {
  searchParams?: Promise<PaywallSearchInput>;
}) {
  return <PaywallContent searchParams={searchParams} />;
}

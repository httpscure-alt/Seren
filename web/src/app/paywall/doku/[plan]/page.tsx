import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PaywallCheckoutClient } from "../../checkout/PaywallCheckoutClient";

type P = { params: Promise<{ plan: string }> };

export default async function PaywallDokuPlanCheckoutPage({ params }: P) {
  const plan = (await params).plan;
  if (plan !== "single" && plan !== "journey") notFound();

  return (
    <Suspense fallback={null}>
      <PaywallCheckoutClient
        preset={{
          plan,
          provider: "DOKU",
          next: "/results",
          backHref: "/paywall/doku",
        }}
      />
    </Suspense>
  );
}

import { Suspense } from "react";
import { PaywallCheckoutClient } from "./PaywallCheckoutClient";

export default function PaywallCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <PaywallCheckoutClient />
    </Suspense>
  );
}


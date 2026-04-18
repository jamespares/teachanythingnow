import Stripe from "stripe";

export function stripe(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: "2025-01-27.acacia" as any,
    typescript: true,
  });
}

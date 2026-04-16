import Stripe from "stripe";

export function stripe(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: "2023-10-16" as any,
    typescript: true,
  });
}

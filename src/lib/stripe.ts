import Stripe from "stripe";

/** Stripe API version for Managed Payments checkout. */
export const MANAGED_PAYMENTS_API_VERSION = "2026-02-25.preview";

export function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env (see .env.example)."
    );
  }
  return key;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not set. Add it to .env or use the Stripe CLI listener."
    );
  }
  return secret;
}

export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

let stripeClient: Stripe | null = null;
let managedPaymentsStripeClient: Stripe | null = null;

/** Default Stripe client (SDK default API version). */
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey());
  }
  return stripeClient;
}

/** Stripe client for Managed Payments checkout sessions. */
export function getManagedPaymentsStripeClient(): Stripe {
  if (!managedPaymentsStripeClient) {
    managedPaymentsStripeClient = new Stripe(getStripeSecretKey(), {
      // @ts-expect-error preview API version for Managed Payments
      apiVersion: MANAGED_PAYMENTS_API_VERSION,
    });
  }
  return managedPaymentsStripeClient;
}

import { readJsonFile, writeJsonFile } from "@/lib/local-data-store";
import type Stripe from "stripe";

const ORDERS_FILENAME = "completed-checkouts.json";

export type CompletedCheckoutRecord = {
  checkoutSessionId: string;
  customerId: string | null;
  paymentIntentId: string | null;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  completedAt: string;
};

export async function isCompletedCheckout(sessionId: string): Promise<boolean> {
  const orders = await listCompletedCheckouts();
  return orders.some((o) => o.checkoutSessionId === sessionId);
}

export async function listCompletedCheckouts(): Promise<CompletedCheckoutRecord[]> {
  return (await readJsonFile<CompletedCheckoutRecord[]>(ORDERS_FILENAME)) ?? [];
}

export async function recordCompletedCheckout(
  session: Stripe.Checkout.Session
): Promise<CompletedCheckoutRecord> {
  const record: CompletedCheckoutRecord = {
    checkoutSessionId: session.id,
    customerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    amountTotal: session.amount_total,
    currency: session.currency,
    customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
    completedAt: new Date().toISOString(),
  };

  const existing = await listCompletedCheckouts();
  const withoutDuplicate = existing.filter(
    (r) => r.checkoutSessionId !== record.checkoutSessionId
  );
  withoutDuplicate.push(record);

  await writeJsonFile(ORDERS_FILENAME, withoutDuplicate);

  return record;
}

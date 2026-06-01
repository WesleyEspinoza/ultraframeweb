import fs from "fs/promises";
import path from "path";
import type Stripe from "stripe";

export type CompletedCheckoutRecord = {
  checkoutSessionId: string;
  customerId: string | null;
  paymentIntentId: string | null;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  completedAt: string;
};

const ORDERS_PATH = path.join(process.cwd(), "data", "completed-checkouts.json");

export async function isCompletedCheckout(sessionId: string): Promise<boolean> {
  const orders = await listCompletedCheckouts();
  return orders.some((o) => o.checkoutSessionId === sessionId);
}

export async function listCompletedCheckouts(): Promise<CompletedCheckoutRecord[]> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf8");
    return JSON.parse(raw) as CompletedCheckoutRecord[];
  } catch {
    return [];
  }
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

  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  await fs.writeFile(
    ORDERS_PATH,
    JSON.stringify(withoutDuplicate, null, 2),
    "utf8"
  );

  return record;
}

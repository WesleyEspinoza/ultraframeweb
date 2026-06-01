import { isCheckoutSaleActive } from "@/lib/catalog-pricing";
import { getSalePricing } from "@/lib/sale";
import { resolveSaleCouponId } from "@/lib/stripe-sale";
import { getAppUrl, getManagedPaymentsStripeClient } from "@/lib/stripe";
import { resolveStripeCatalog } from "@/lib/stripe-catalog";
import type Stripe from "stripe";

export type CheckoutSessionResult = {
  sessionId: string;
  url: string;
};

export async function createManagedPaymentsCheckoutSession(): Promise<CheckoutSessionResult> {
  const catalog = await resolveStripeCatalog();
  const priceId = catalog.priceId;

  const appUrl = getAppUrl();
  const stripe = getManagedPaymentsStripeClient();

  const params = {
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    managed_payments: { enabled: true },
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
  } as Stripe.Checkout.SessionCreateParams;

  if (isCheckoutSaleActive(catalog) && catalog.unitAmount != null) {
    const sale = getSalePricing(catalog.unitAmount);
    if (sale) {
      const couponId = await resolveSaleCouponId(sale.discountPercent);
      params.discounts = [{ coupon: couponId }];
    }
  }

  const session = await stripe.checkout.sessions.create(params);

  if (!session.url) {
    throw new Error("Checkout session was created without a redirect URL.");
  }

  return { sessionId: session.id, url: session.url };
}

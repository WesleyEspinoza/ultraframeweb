import { getStripeClient } from "@/lib/stripe";

const COUPON_NAME_PREFIX = "UltraFrame sale";

/** Stripe coupon ID applied at checkout when sale.json sale is active. */
export async function resolveSaleCouponId(discountPercent: number): Promise<string> {
  const fromEnv = process.env.STRIPE_SALE_COUPON_ID?.trim();
  if (fromEnv) return fromEnv;

  const stripe = getStripeClient();
  const existing = await findCouponByPercent(discountPercent);
  if (existing) return existing.id;

  const coupon = await stripe.coupons.create({
    percent_off: discountPercent,
    duration: "once",
    name: `${COUPON_NAME_PREFIX} ${discountPercent}%`,
  });

  return coupon.id;
}

async function findCouponByPercent(discountPercent: number) {
  const stripe = getStripeClient();
  let startingAfter: string | undefined;

  for (let page = 0; page < 5; page++) {
    const list = await stripe.coupons.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    const match = list.data.find(
      (c) =>
        c.valid &&
        c.percent_off === discountPercent &&
        c.name?.startsWith(COUPON_NAME_PREFIX)
    );
    if (match) return match;

    if (!list.has_more || list.data.length === 0) break;
    startingAfter = list.data[list.data.length - 1]?.id;
  }

  return null;
}

import { getStripeClient } from "@/lib/stripe";
import { readStripeCatalog, writeStripeCatalog, type StripeCatalog } from "@/lib/stripe-catalog";

const COUPON_NAME_PREFIX = "UltraFrame sale";

/** Stripe coupon ID applied at checkout when sale.json sale is active. */
export async function resolveSaleCouponId(discountPercent: number): Promise<string> {
  const fromEnv = process.env.STRIPE_SALE_COUPON_ID?.trim();
  if (fromEnv) return fromEnv;

  const catalog = await readStripeCatalog();
  if (
    catalog?.saleCouponId &&
    catalog.saleDiscountPercent === discountPercent
  ) {
    return catalog.saleCouponId;
  }

  const stripe = getStripeClient();
  const existing = await findCouponByPercent(discountPercent);
  const coupon =
    existing ??
    (await stripe.coupons.create({
      percent_off: discountPercent,
      duration: "once",
      name: `${COUPON_NAME_PREFIX} ${discountPercent}%`,
    }));

  if (catalog) {
    await writeStripeCatalog({
      ...catalog,
      saleCouponId: coupon.id,
      saleDiscountPercent: discountPercent,
    });
  }

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

export async function attachSaleCouponToCatalog(
  catalog: StripeCatalog,
  discountPercent: number
): Promise<StripeCatalog> {
  const saleCouponId = await resolveSaleCouponId(discountPercent);
  const updated: StripeCatalog = {
    ...catalog,
    saleCouponId,
    saleDiscountPercent: discountPercent,
  };
  await writeStripeCatalog(updated);
  return updated;
}

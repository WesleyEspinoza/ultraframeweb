import type Stripe from "stripe";

export function applyCouponToUnitAmountCents(
  unitAmountCents: number,
  coupon: Pick<Stripe.Coupon, "percent_off" | "amount_off" | "currency">
): { discountedCents: number; savingsCents: number } {
  if (coupon.percent_off != null) {
    const discountedCents = Math.round(
      unitAmountCents * (1 - coupon.percent_off / 100)
    );
    return {
      discountedCents,
      savingsCents: unitAmountCents - discountedCents,
    };
  }

  if (coupon.amount_off != null) {
    const discountedCents = Math.max(0, unitAmountCents - coupon.amount_off);
    return {
      discountedCents,
      savingsCents: unitAmountCents - discountedCents,
    };
  }

  return { discountedCents: unitAmountCents, savingsCents: 0 };
}

export function formatPromoPrice(amount: number | null | undefined): string {
  if (amount == null) return "—";
  if (amount <= 0) return "Free";
  return `$${amount.toFixed(2)}`;
}

export function describeCouponDiscount(
  coupon: Pick<Stripe.Coupon, "percent_off" | "amount_off" | "name">
): string {
  if (coupon.percent_off != null) {
    if (coupon.percent_off >= 100) return "Free";
    return `${coupon.percent_off}% off`;
  }
  if (coupon.amount_off != null) {
    return `$${(coupon.amount_off / 100).toFixed(2)} off`;
  }
  return coupon.name ?? "Discount applied";
}

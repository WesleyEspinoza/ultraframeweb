import {
  applyCouponToUnitAmountCents,
  describeCouponDiscount,
} from "@/lib/promo-pricing";
import { getStripeClient } from "@/lib/stripe";
import type Stripe from "stripe";

export type ResolvedPromotionCode = {
  promotionCodeId: string;
  code: string;
  coupon: Stripe.Coupon;
  discountLabel: string;
};

export type PromoPricePreview = {
  compareAtCents: number;
  displayCents: number;
  compareAtPrice: number;
  displayPrice: number;
  savings: number;
  discountLabel: string;
};

export async function resolvePromotionCodeByCustomerCode(
  customerCode: string
): Promise<ResolvedPromotionCode | null> {
  const code = customerCode.trim();
  if (!code) return null;

  const stripe = getStripeClient();
  const list = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
  });

  const listed = list.data[0];
  if (!listed?.code) return null;

  const promo = await stripe.promotionCodes.retrieve(listed.id, {
    expand: ["coupon"],
  });

  if (promo.expires_at != null && promo.expires_at * 1000 < Date.now()) {
    return null;
  }

  if (
    promo.max_redemptions != null &&
    promo.times_redeemed != null &&
    promo.times_redeemed >= promo.max_redemptions
  ) {
    return null;
  }

  const coupon = getExpandedCoupon(promo);
  if (!coupon || coupon.valid === false) {
    return null;
  }

  return {
    promotionCodeId: promo.id,
    code: promo.code,
    coupon,
    discountLabel: describeCouponDiscount(coupon),
  };
}

function getExpandedCoupon(
  promo: Stripe.PromotionCode
): Stripe.Coupon | null {
  const raw = (promo as Stripe.PromotionCode & { coupon?: Stripe.Coupon | string })
    .coupon;
  if (!raw || typeof raw === "string") return null;
  return raw;
}

export function buildPromoPricePreview(
  unitAmountCents: number,
  resolved: ResolvedPromotionCode
): PromoPricePreview {
  const { discountedCents, savingsCents } = applyCouponToUnitAmountCents(
    unitAmountCents,
    resolved.coupon
  );

  return {
    compareAtCents: unitAmountCents,
    displayCents: discountedCents,
    compareAtPrice: unitAmountCents / 100,
    displayPrice: discountedCents / 100,
    savings: savingsCents / 100,
    discountLabel: resolved.discountLabel,
  };
}

export function promotionCodeErrorMessage(customerCode: string): string {
  return `Promotion code "${customerCode.trim()}" is invalid, expired, or no longer available.`;
}

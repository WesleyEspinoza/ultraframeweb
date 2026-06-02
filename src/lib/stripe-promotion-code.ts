import {
  applyCouponToUnitAmountCents,
  describeCouponDiscount,
} from "@/lib/promo-pricing";
import { UserErrors } from "@/lib/user-errors";
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

type ResolveResult =
  | { ok: true; data: ResolvedPromotionCode }
  | { ok: false; message: string };

export async function resolvePromotionCodeByCustomerCode(
  input: string
): Promise<ResolvedPromotionCode | null> {
  const result = await resolvePromotionCode(input);
  return result.ok ? result.data : null;
}

export async function resolvePromotionCode(input: string): Promise<ResolveResult> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, message: UserErrors.promoEnter };
  }

  const stripe = getStripeClient();
  const listed = await findPromotionCode(stripe, trimmed);

  if (!listed) {
    return {
      ok: false,
      message: UserErrors.promoInvalid(trimmed),
    };
  }

  if (!listed.active) {
    return {
      ok: false,
      message: UserErrors.promoUnavailable,
    };
  }

  const promo = await stripe.promotionCodes.retrieve(listed.id, {
    expand: ["coupon"],
  });

  if (promo.expires_at != null && promo.expires_at * 1000 < Date.now()) {
    return {
      ok: false,
      message: UserErrors.promoExpired,
    };
  }

  if (
    promo.max_redemptions != null &&
    promo.times_redeemed != null &&
    promo.times_redeemed >= promo.max_redemptions
  ) {
    return {
      ok: false,
      message: UserErrors.promoUnavailable,
    };
  }

  const coupon = await loadCouponForPromotion(stripe, promo);
  if (!coupon || coupon.valid === false) {
    return {
      ok: false,
      message: UserErrors.promoUnavailable,
    };
  }

  return {
    ok: true,
    data: {
      promotionCodeId: promo.id,
      code: promo.code,
      coupon,
      discountLabel: describeCouponDiscount(coupon),
    },
  };
}

async function findPromotionCode(
  stripe: Stripe,
  input: string
): Promise<Stripe.PromotionCode | null> {
  if (input.startsWith("promo_")) {
    try {
      return await stripe.promotionCodes.retrieve(input);
    } catch (error) {
      if (isStripeResourceMissing(error)) return null;
      throw error;
    }
  }

  const variants = [input, input.toLowerCase(), input.toUpperCase()];
  const seen = new Set<string>();

  for (const code of variants) {
    if (seen.has(code)) continue;
    seen.add(code);

    const list = await stripe.promotionCodes.list({ code, limit: 1 });
    if (list.data[0]) return list.data[0];
  }

  const target = input.toLowerCase();
  let startingAfter: string | undefined;

  for (let page = 0; page < 5; page++) {
    const list = await stripe.promotionCodes.list({
      limit: 100,
      starting_after: startingAfter,
    });

    const match = list.data.find((p) => p.code?.toLowerCase() === target);
    if (match) return match;

    if (!list.has_more || list.data.length === 0) break;
    startingAfter = list.data[list.data.length - 1]?.id;
  }

  return null;
}

async function loadCouponForPromotion(
  stripe: Stripe,
  promo: Stripe.PromotionCode
): Promise<Stripe.Coupon | null> {
  const expanded = (promo as Stripe.PromotionCode & { coupon?: Stripe.Coupon | string })
    .coupon;

  if (expanded && typeof expanded !== "string") {
    return expanded;
  }

  const couponId =
    typeof expanded === "string"
      ? expanded
      : (promo as Stripe.PromotionCode & { promotion?: { coupon?: string } }).promotion
          ?.coupon;

  if (!couponId) return null;

  try {
    return await stripe.coupons.retrieve(couponId);
  } catch (error) {
    if (isStripeResourceMissing(error)) return null;
    throw error;
  }
}

function isStripeResourceMissing(error: unknown): boolean {
  return (
    error != null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "resource_missing"
  );
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
  return UserErrors.promoInvalid(customerCode);
}

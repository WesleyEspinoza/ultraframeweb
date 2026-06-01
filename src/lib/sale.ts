import saleConfig from "@/config/sale.json";

export type SalePricing = {
  active: true;
  title: string;
  discountPercent: number;
  compareAtCents: number;
  salePriceCents: number;
  savingsCents: number;
  compareAtPrice: number;
  displayPrice: number;
  savings: number;
};

export function isSaleActive(): boolean {
  return (
    saleConfig.enabled &&
    saleConfig.discountPercent > 0 &&
    saleConfig.discountPercent < 100
  );
}

export function getSaleTitle(): string {
  return saleConfig.title;
}

/** Apply sale.json discount to a Stripe unit amount (cents). */
export function getSalePricing(unitAmountCents: number): SalePricing | null {
  if (!isSaleActive() || unitAmountCents <= 0) return null;

  const compareAtCents = unitAmountCents;
  const salePriceCents = Math.round(
    compareAtCents * (1 - saleConfig.discountPercent / 100)
  );
  const savingsCents = compareAtCents - salePriceCents;

  return {
    active: true,
    title: saleConfig.title,
    discountPercent: saleConfig.discountPercent,
    compareAtCents,
    salePriceCents,
    savingsCents,
    compareAtPrice: compareAtCents / 100,
    displayPrice: salePriceCents / 100,
    savings: savingsCents / 100,
  };
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

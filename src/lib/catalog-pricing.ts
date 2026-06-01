import { getSalePricing, isSaleActive, type SalePricing } from "@/lib/sale";
import type { StripeCatalog } from "@/lib/stripe-catalog";

export type CatalogPricing = {
  productName: string;
  currency: string;
  unitAmount: number | null;
  compareAtPrice: number | null;
  displayPrice: number | null;
  savings: number | null;
  sale: SalePricing | null;
};

export function buildCatalogPricing(catalog: StripeCatalog): CatalogPricing {
  const unitAmount = catalog.unitAmount;
  const sale =
    unitAmount != null ? getSalePricing(unitAmount) : null;

  const compareAtPrice =
    sale?.compareAtPrice ??
    (unitAmount != null ? unitAmount / 100 : null);
  const displayPrice =
    sale?.displayPrice ??
    (unitAmount != null ? unitAmount / 100 : null);
  const savings = sale?.savings ?? null;

  return {
    productName: catalog.productName,
    currency: catalog.currency,
    unitAmount,
    compareAtPrice,
    displayPrice,
    savings,
    sale,
  };
}

export function isCheckoutSaleActive(catalog: StripeCatalog): boolean {
  return isSaleActive() && catalog.unitAmount != null;
}

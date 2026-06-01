import { getStripeClient } from "@/lib/stripe";
import { readJsonFile, writeJsonFile } from "@/lib/local-data-store";

const CATALOG_FILENAME = "stripe-catalog.json";

export type StripeCatalog = {
  productId: string;
  priceId: string;
  productName: string;
  unitAmount: number | null;
  currency: string;
  updatedAt: string;
  saleCouponId?: string;
  saleDiscountPercent?: number;
};

export async function readStripeCatalog(): Promise<StripeCatalog | null> {
  return readJsonFile<StripeCatalog>(CATALOG_FILENAME);
}

export async function writeStripeCatalog(catalog: StripeCatalog): Promise<void> {
  await writeJsonFile(CATALOG_FILENAME, catalog);
}

function catalogFromEnv(): Pick<StripeCatalog, "productId" | "priceId"> | null {
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  const productId = process.env.STRIPE_PRODUCT_ID?.trim();
  if (!priceId) return null;
  return { priceId, productId: productId ?? "" };
}

export async function fetchCatalogFromStripe(
  priceId: string,
  productIdHint?: string
): Promise<StripeCatalog> {
  const stripe = getStripeClient();
  const price = await stripe.prices.retrieve(priceId);
  const productId =
    productIdHint ||
    (typeof price.product === "string" ? price.product : price.product.id);

  const product = await stripe.products.retrieve(productId);

  return {
    productId,
    priceId: price.id,
    productName: product.name,
    unitAmount: price.unit_amount,
    currency: price.currency,
    updatedAt: new Date().toISOString(),
  };
}

/** Resolve catalog from env (production) or optional local cache (dev). */
export async function resolveStripeCatalog(): Promise<StripeCatalog> {
  const env = catalogFromEnv();
  if (env) {
    const catalog = await fetchCatalogFromStripe(env.priceId, env.productId || undefined);
    await writeStripeCatalog(catalog);
    return catalog;
  }

  const onDisk = await readStripeCatalog();
  if (onDisk?.priceId) {
    try {
      const catalog = await fetchCatalogFromStripe(onDisk.priceId, onDisk.productId);
      await writeStripeCatalog(catalog);
      return catalog;
    } catch {
      return onDisk;
    }
  }

  throw new Error(
    "Stripe catalog not configured. Set STRIPE_PRICE_ID (and optionally STRIPE_PRODUCT_ID) in your hosting environment."
  );
}

export async function resolvePriceId(): Promise<string> {
  const catalog = await resolveStripeCatalog();
  return catalog.priceId;
}

export function formatCatalogPrice(catalog: StripeCatalog): string {
  if (catalog.unitAmount == null) return "";
  const amount = catalog.unitAmount / 100;
  const currency = catalog.currency.toUpperCase();
  if (currency === "USD") return `$${amount.toFixed(2)}`;
  return `${amount.toFixed(2)} ${currency}`;
}

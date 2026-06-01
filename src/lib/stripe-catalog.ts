import { getStripeClient } from "@/lib/stripe";
import fs from "fs/promises";
import path from "path";

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

const CATALOG_PATH = path.join(process.cwd(), "data", "stripe-catalog.json");

export async function readStripeCatalog(): Promise<StripeCatalog | null> {
  try {
    const raw = await fs.readFile(CATALOG_PATH, "utf8");
    return JSON.parse(raw) as StripeCatalog;
  } catch {
    return null;
  }
}

export async function writeStripeCatalog(catalog: StripeCatalog): Promise<void> {
  await fs.mkdir(path.dirname(CATALOG_PATH), { recursive: true });
  await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf8");
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

/** Resolve live catalog: env IDs → Stripe API → local data file. */
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
    "Stripe catalog not configured. Set STRIPE_PRICE_ID (and optionally STRIPE_PRODUCT_ID) in .env."
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

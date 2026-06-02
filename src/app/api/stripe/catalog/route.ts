import { buildCatalogPricing } from "@/lib/catalog-pricing";
import { resolveStripeCatalog } from "@/lib/stripe-catalog";
import { UserErrors } from "@/lib/user-errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const catalog = await resolveStripeCatalog();
    const pricing = buildCatalogPricing(catalog);

    return NextResponse.json({
      productId: catalog.productId,
      priceId: catalog.priceId,
      productName: pricing.productName,
      unitAmount: pricing.unitAmount,
      currency: pricing.currency,
      compareAtPrice: pricing.compareAtPrice,
      displayPrice: pricing.displayPrice,
      savings: pricing.savings,
      sale: pricing.sale
        ? {
            active: true,
            title: pricing.sale.title,
            discountPercent: pricing.sale.discountPercent,
            compareAtPrice: pricing.sale.compareAtPrice,
            displayPrice: pricing.sale.displayPrice,
            savings: pricing.sale.savings,
          }
        : null,
    });
  } catch (error) {
    console.error("[catalog] failed:", error);
    return NextResponse.json({ error: UserErrors.pricing }, { status: 503 });
  }
}

import { buildCatalogPricing } from "@/lib/catalog-pricing";
import {
  buildPromoPricePreview,
  resolvePromotionCode,
} from "@/lib/stripe-promotion-code";
import { resolveStripeCatalog } from "@/lib/stripe-catalog";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const code =
    body && typeof body === "object" && "code" in body && typeof body.code === "string"
      ? body.code.trim()
      : "";

  if (!code) {
    return NextResponse.json({ error: "Enter a promotion code." }, { status: 400 });
  }

  try {
    const catalog = await resolveStripeCatalog();
    const pricing = buildCatalogPricing(catalog);

    if (pricing.unitAmount == null || pricing.unitAmount <= 0) {
      return NextResponse.json(
        { error: "Pricing is not available. Try again shortly." },
        { status: 503 }
      );
    }

    const resolved = await resolvePromotionCode(code);
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.message }, { status: 404 });
    }

    const preview = buildPromoPricePreview(pricing.unitAmount, resolved.data);

    return NextResponse.json({
      valid: true,
      code: resolved.data.code,
      promotionCodeId: resolved.data.promotionCodeId,
      discountLabel: preview.discountLabel,
      compareAtPrice: preview.compareAtPrice,
      displayPrice: preview.displayPrice,
      savings: preview.savings,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to validate promotion code.";
    const status =
      message.includes("STRIPE_SECRET_KEY") || message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

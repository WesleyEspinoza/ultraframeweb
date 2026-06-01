import CheckoutClient from "@/components/CheckoutClient";
import { buildCatalogPricing } from "@/lib/catalog-pricing";
import { formatUsd } from "@/lib/sale";
import { resolveStripeCatalog } from "@/lib/stripe-catalog";
import Link from "next/link";

export const metadata = {
  title: "Checkout | UltraFrame",
  description: "Purchase UltraFrame Optimizer — one-time payment, instant download.",
};

export default async function CheckoutPage() {
  let productName = "UltraFrame Optimizer";
  let priceBlock: React.ReactNode = null;

  try {
    const catalog = await resolveStripeCatalog();
    const pricing = buildCatalogPricing(catalog);
    productName = pricing.productName;

    if (pricing.displayPrice != null) {
      priceBlock = (
        <div className="mb-6">
          {pricing.sale && pricing.compareAtPrice != null && (
            <p className="text-slate-500 text-sm font-mono mb-1">
              <span className="line-through">{formatUsd(pricing.compareAtPrice)}</span>
              <span className="ml-2 text-emerald-400">
                {pricing.sale.title} — {pricing.sale.discountPercent}% off
              </span>
            </p>
          )}
          <p className="text-2xl font-display font-black" style={{ color: "var(--neon-cyan, #00f5ff)" }}>
            {formatUsd(pricing.displayPrice)}{" "}
            <span className="text-sm font-mono text-slate-500 font-normal">one-time</span>
          </p>
          {pricing.savings != null && pricing.savings > 0 && (
            <p className="text-xs font-mono mt-1 text-emerald-400">
              You save {formatUsd(pricing.savings)}
            </p>
          )}
        </div>
      );
    }
  } catch {
    // Client surfaces pricing errors via /api/stripe/catalog
  }

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16">
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-mono tracking-widest uppercase mb-4 text-cyan-400">
          Checkout
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">{productName}</h1>
        {priceBlock}
        <p className="text-slate-400 mb-8 leading-relaxed">
          One license activates on up to 3 Windows PCs. Includes lifetime updates for as long as
          UltraFrame is supported. After payment, you&apos;ll return here to download the installer.
        </p>

        <CheckoutClient />

        <p className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}

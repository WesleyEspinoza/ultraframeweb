"use client";

import { useEffect, useState } from "react";

type CatalogResponse = {
  productName: string;
  compareAtPrice: number | null;
  displayPrice: number | null;
  savings: number | null;
  sale: {
    active: boolean;
    title: string;
    discountPercent: number;
  } | null;
};

export default function CheckoutClient() {
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stripe/catalog");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load pricing.");
        if (!cancelled) {
          setCatalog({
            productName: data.productName,
            compareAtPrice: data.compareAtPrice,
            displayPrice: data.displayPrice,
            savings: data.savings,
            sale: data.sale,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unable to load pricing.");
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unable to start checkout.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start checkout.");
      setLoading(false);
    }
  }

  const hasSale = catalog?.sale?.active && catalog.compareAtPrice != null;
  const priceLabel =
    catalog?.displayPrice != null ? `$${catalog.displayPrice.toFixed(2)}` : "—";

  return (
    <div className="space-y-4">
      {catalogLoading && (
        <p className="text-sm text-slate-500 font-mono">Loading pricing…</p>
      )}

      {hasSale && catalog.compareAtPrice != null && (
        <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm">
          <p className="font-mono text-cyan-400 text-xs uppercase tracking-wider mb-1">
            {catalog.sale?.title} — {catalog.sale?.discountPercent}% off
          </p>
          <p className="text-slate-400">
            <span className="line-through">${catalog.compareAtPrice.toFixed(2)}</span>
            {" → "}
            <span className="text-white font-semibold">{priceLabel}</span>
            {catalog.savings != null && catalog.savings > 0 && (
              <span className="text-emerald-400 ml-2">
                (save ${catalog.savings.toFixed(2)})
              </span>
            )}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 border border-red-400/30 rounded-lg px-4 py-3" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || catalogLoading || !!error}
        className="w-full py-3.5 px-6 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black disabled:opacity-50"
        style={{ background: "var(--neon-cyan, #00f5ff)" }}
      >
        {loading ? "Redirecting to checkout…" : `Continue to checkout — ${priceLabel}`}
      </button>

      <p className="text-xs text-slate-600 text-center leading-relaxed">
        Secure payment by Stripe. Instant download after purchase.
      </p>
    </div>
  );
}

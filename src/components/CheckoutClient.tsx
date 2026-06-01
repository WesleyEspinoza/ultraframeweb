"use client";

import { ClarityEvents } from "@/lib/clarity-events";
import { setClarityTag, trackClarityEvent } from "@/lib/clarity";
import { formatPromoPrice } from "@/lib/promo-pricing";
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

type AppliedPromo = {
  code: string;
  discountLabel: string;
  compareAtPrice: number;
  displayPrice: number;
  savings: number;
};

export default function CheckoutClient() {
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

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
          trackClarityEvent(ClarityEvents.CHECKOUT_CATALOG_VIEW);
          if (data.displayPrice != null) {
            setClarityTag("checkout_display_price", String(data.displayPrice));
          }
          if (data.sale?.active) setClarityTag("checkout_sale", "true");
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

  async function applyPromoCode() {
    const code = promoInput.trim();
    if (!code) {
      setPromoError("Enter a code.");
      return;
    }

    setPromoLoading(true);
    setPromoError(null);

    try {
      const res = await fetch("/api/stripe/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Invalid promotion code.");
      }

      setAppliedPromo({
        code: data.code,
        discountLabel: data.discountLabel,
        compareAtPrice: data.compareAtPrice,
        displayPrice: data.displayPrice,
        savings: data.savings,
      });
      setPromoOpen(false);
      trackClarityEvent(ClarityEvents.PROMO_CODE_APPLIED);
      setClarityTag("checkout_promo_code", data.code);
    } catch (e) {
      setAppliedPromo(null);
      setPromoError(e instanceof Error ? e.message : "Invalid promotion code.");
    } finally {
      setPromoLoading(false);
    }
  }

  function clearPromoCode() {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
    setPromoOpen(false);
  }

  async function startCheckout() {
    setLoading(true);
    setError(null);
    trackClarityEvent(ClarityEvents.CHECKOUT_BEGIN);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promotionCode: appliedPromo?.code ?? (promoInput.trim() || undefined),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unable to start checkout.");
      window.location.href = data.url;
    } catch (e) {
      trackClarityEvent(ClarityEvents.CHECKOUT_ERROR);
      setError(e instanceof Error ? e.message : "Unable to start checkout.");
      setLoading(false);
    }
  }

  const hasSale = catalog?.sale?.active && catalog.compareAtPrice != null && !appliedPromo;

  const displayPrice = appliedPromo
    ? appliedPromo.displayPrice
    : catalog?.displayPrice ?? null;

  const savings = appliedPromo ? appliedPromo.savings : catalog?.savings ?? null;

  const priceLabel = formatPromoPrice(displayPrice);

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
            <span className="line-through">{formatPromoPrice(catalog.compareAtPrice)}</span>
            {" → "}
            <span className="text-white font-semibold">{priceLabel}</span>
            {savings != null && savings > 0 && (
              <span className="text-emerald-400 ml-2">(save ${savings.toFixed(2)})</span>
            )}
          </p>
        </div>
      )}

      {appliedPromo && (
        <p className="text-xs text-slate-500 font-mono text-center">
          <span className="text-slate-400">{appliedPromo.code}</span>
          {" · "}
          <span className="text-emerald-400/90">{appliedPromo.discountLabel}</span>
          {" · "}
          <span className="text-slate-300">{priceLabel}</span>
          {" · "}
          <button
            type="button"
            onClick={clearPromoCode}
            className="text-slate-600 hover:text-slate-400 underline underline-offset-2"
          >
            remove
          </button>
        </p>
      )}

      {!appliedPromo && (
        <div className="text-center">
          {!promoOpen ? (
            <button
              type="button"
              onClick={() => setPromoOpen(true)}
              className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors"
            >
              Have a promo code?
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 max-w-sm mx-auto">
                <input
                  id="promo-code"
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyPromoCode();
                    }
                  }}
                  disabled={promoLoading}
                  placeholder="Promo code"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 min-w-0 px-3 py-1.5 rounded-md bg-transparent border border-slate-800 text-slate-400 text-xs font-mono placeholder:text-slate-700 focus:outline-none focus-visible:border-slate-600 focus-visible:text-slate-300"
                />
                <button
                  type="button"
                  onClick={applyPromoCode}
                  disabled={promoLoading || catalogLoading || !promoInput.trim()}
                  className="text-xs font-mono text-slate-500 hover:text-slate-300 disabled:opacity-40 shrink-0"
                >
                  {promoLoading ? "…" : "Apply"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPromoOpen(false);
                    setPromoError(null);
                  }}
                  className="text-xs font-mono text-slate-700 hover:text-slate-500 shrink-0"
                  aria-label="Close promo code"
                >
                  ✕
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-red-400/90 font-mono max-w-sm mx-auto" role="alert">
                  {promoError}
                </p>
              )}
            </div>
          )}
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

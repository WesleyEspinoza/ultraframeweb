"use client";

import { ClarityEvents } from "@/lib/clarity-events";
import { setClarityTag, trackClarityEvent } from "@/lib/clarity";
import { Tag, X } from "lucide-react";
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
      setPromoError("Enter a promotion code.");
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
          promotionCode: appliedPromo?.code ?? undefined,
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

  const compareAtPrice = appliedPromo
    ? appliedPromo.compareAtPrice
    : catalog?.compareAtPrice ?? null;

  const displayPrice = appliedPromo
    ? appliedPromo.displayPrice
    : catalog?.displayPrice ?? null;

  const savings = appliedPromo ? appliedPromo.savings : catalog?.savings ?? null;

  const priceLabel =
    displayPrice != null ? `$${displayPrice.toFixed(2)}` : "—";

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
            {savings != null && savings > 0 && (
              <span className="text-emerald-400 ml-2">
                (save ${savings.toFixed(2)})
              </span>
            )}
          </p>
        </div>
      )}

      {appliedPromo && (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-sm flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-emerald-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              {appliedPromo.code} — {appliedPromo.discountLabel}
            </p>
            <p className="text-slate-400">
              <span className="line-through">${appliedPromo.compareAtPrice.toFixed(2)}</span>
              {" → "}
              <span className="text-white font-semibold">{priceLabel}</span>
              {appliedPromo.savings > 0 && (
                <span className="text-emerald-400 ml-2">
                  (save ${appliedPromo.savings.toFixed(2)})
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={clearPromoCode}
            className="text-slate-500 hover:text-white p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Remove promotion code"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <label htmlFor="promo-code" className="block text-xs font-mono text-slate-500 uppercase tracking-wider">
          Promotion code
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="promo-code"
            type="text"
            value={promoInput}
            onChange={(e) => {
              setPromoInput(e.target.value.toUpperCase());
              setPromoError(null);
            }}
            disabled={!!appliedPromo || promoLoading}
            placeholder="e.g. LAUNCH20"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm font-mono uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
          />
          {appliedPromo ? (
            <button
              type="button"
              onClick={clearPromoCode}
              className="px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 text-xs font-display font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
            >
              Change
            </button>
          ) : (
            <button
              type="button"
              onClick={applyPromoCode}
              disabled={promoLoading || catalogLoading || !promoInput.trim()}
              className="px-4 py-2.5 rounded-lg border border-cyan-400/40 text-cyan-300 text-xs font-display font-bold tracking-widest uppercase hover:bg-cyan-400/5 transition-colors disabled:opacity-50"
            >
              {promoLoading ? "Checking…" : "Apply"}
            </button>
          )}
        </div>
        {promoError && (
          <p className="text-xs text-red-400" role="alert">
            {promoError}
          </p>
        )}
        {!appliedPromo && hasSale && (
          <p className="text-xs text-slate-600 font-mono leading-relaxed">
            Applying a code replaces the site-wide sale for this checkout.
          </p>
        )}
        {!appliedPromo && !hasSale && (
          <p className="text-xs text-slate-600 font-mono leading-relaxed">
            You can also enter a code on the Stripe checkout page if you skip this field.
          </p>
        )}
      </div>

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

"use client";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import BetaBanner from "@/components/BetaBanner";
import saleConfig from "@/config/sale.json";
import { ClarityEvents } from "@/lib/clarity-events";
import { trackClarityEvent } from "@/lib/clarity";

const SINGLE_PLAN = {
  name: "UltraFrame",
  price: 19.99,
  tagline: "One key, up to 3 computers. No subscription.",
  accent: "var(--neon-cyan)",
  cta: "Download UltraFrame",
  features: [
    "3 PC Activations",
    "Lifetime Updates",
    "AI Assistant Included",
    "One-Time Payment",
    "Priority Support",
    "Restore & Rollback System",
    "Future Optimization Updates",
  ],
};

function formatPrice(value: number) {
  return value.toFixed(2);
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export default function Pricing() {
  const hasSale = saleConfig.enabled && saleConfig.discountPercent > 0 && saleConfig.discountPercent < 100;
  const compareAtPrice = SINGLE_PLAN.price;
  const currentPrice = hasSale
    ? roundCurrency(compareAtPrice * (1 - saleConfig.discountPercent / 100))
    : compareAtPrice;

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, var(--neon-blue) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-cyan)" }}
            aria-hidden="true"
          >
            {hasSale ? `// ${saleConfig.title} - ${saleConfig.discountPercent}% OFF` : "// Pricing"}
          </motion.p>
          <motion.h2
            id="pricing-heading"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-4"
          >
            One-Time Price.{" "}
            <span className="shimmer-text">Lifetime Gains.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-slate-500 text-lg max-w-xl mx-auto"
          >
            {hasSale
              ? "Release pricing available for a limited time."
              : "One-time payment. One key for up to 3 computers. Lifetime updates for as long as UltraFrame is supported."}
          </motion.p>
        </div>

        <motion.div
          role="list"
          aria-label="Pricing plan"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div
            role="listitem"
            className="relative rounded-2xl border border-cyan-400/40 overflow-hidden transition-all duration-500 flex flex-col"
            style={{
              background: "linear-gradient(135deg, rgba(0,102,255,0.08) 0%, rgba(0,245,255,0.05) 100%)",
              boxShadow: "0 0 60px rgba(0,245,255,0.12), 0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <p
              className="absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-display font-bold tracking-widest"
              style={{ background: "var(--neon-cyan)", color: "#000" }}
            >
              {hasSale ? `${saleConfig.title} — Save ${saleConfig.discountPercent}%` : "Pricing"}
            </p>

            <div className="p-8 pt-12 flex flex-col flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5" style={{ color: SINGLE_PLAN.accent }} aria-hidden="true" />
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">
                  {SINGLE_PLAN.name}
                </h3>
              </div>

              <div className="mb-2">
                {hasSale ? (
                  <>
                    <p className="text-slate-500 text-sm font-mono mb-2">
                      Regular Price:{" "}
                      <span className="line-through">${formatPrice(compareAtPrice)}</span>
                    </p>
                    <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-1">
                      Release Sale
                    </p>
                    <span className="font-display text-5xl font-black" style={{ color: "var(--neon-cyan)" }}>
                      <span aria-label={`$${formatPrice(currentPrice)} one-time`}>${formatPrice(currentPrice)}</span>
                    </span>
                    <p className="text-sm font-display font-bold mt-2" style={{ color: "var(--neon-green)" }}>
                      Save {saleConfig.discountPercent}%
                    </p>
                  </>
                ) : (
                  <span className="font-display text-5xl font-black" style={{ color: "var(--neon-cyan)" }}>
                    <span aria-label={`$${formatPrice(currentPrice)} one-time`}>${formatPrice(currentPrice)}</span>
                  </span>
                )}
                <span className="sr-only"> — one-time payment</span>
              </div>
              <p className="text-slate-600 text-xs font-mono mb-6">{SINGLE_PLAN.tagline}</p>

              <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden="true" />

              <ul className="space-y-3 mb-8 flex-1 list-none p-0" aria-label={`${SINGLE_PLAN.name} plan features`}>
                {SINGLE_PLAN.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: SINGLE_PLAN.accent }} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="/checkout"
                onClick={() => trackClarityEvent(ClarityEvents.CTA_GET_NOW)}
                className="block text-center py-3.5 px-6 rounded-lg font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 text-black"
                style={{ background: "var(--neon-cyan)", boxShadow: "0 0 30px rgba(0,245,255,0.3)" }}
                aria-label={`${SINGLE_PLAN.cta} — $${formatPrice(currentPrice)} one-time`}
              >
                {SINGLE_PLAN.cta}
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="max-w-2xl mx-auto mt-10"
        >
          <BetaBanner compact />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-700 text-sm font-mono mt-6"
        >
          Secure checkout · One key for up to 3 computers · Updates included during active development
        </motion.p>
      </div>
    </section>
  );
}

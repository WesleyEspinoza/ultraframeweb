"use client";
import { motion } from "framer-motion";
import BetaBanner from "@/components/BetaBanner";
import { ChevronDown, Zap, Check } from "lucide-react";
import saleConfig from "@/config/sale.json";
import { ClarityEvents } from "@/lib/clarity-events";
import { trackClarityEvent } from "@/lib/clarity";

const TRUST_BADGES = [
  "Windows 10 & 11",
  "One-Time Purchase",
  "Fully Reversible",
  "Lifetime Updates",
  "Anti-Cheat Safe",
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(0,102,255,0.4) 0%, rgba(0,245,255,0.1) 40%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(ellipse, rgba(0,245,255,0.5) 0%, transparent 70%)", animationDelay: "1s" }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute left-0 right-0 h-px opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.6), transparent)", animation: "scanLine 6s linear infinite" }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24 flex flex-col items-center">
        {saleConfig.enabled && saleConfig.discountPercent > 0 && saleConfig.discountPercent < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 px-6 py-2 rounded-xl font-display text-base font-bold tracking-widest uppercase border-2 border-yellow-400 bg-yellow-100/80 text-yellow-900 shadow-lg"
            style={{ letterSpacing: 2, maxWidth: "100%" }}
            role="status"
            aria-label={saleConfig.title}
          >
            <span className="block text-lg font-black">{saleConfig.title} — {saleConfig.discountPercent}% OFF</span>
            <span className="block text-xs font-normal mt-1">{saleConfig.body}</span>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-2xl mb-4"
        >
          <BetaBanner />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-6"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 blur-2xl opacity-40 rounded-full scale-110"
            style={{ background: "radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)" }}
          />
          <Zap
            className="relative w-14 h-14 md:w-16 md:h-16 mx-auto fill-current"
            style={{ color: "var(--neon-cyan)", filter: "drop-shadow(0 0 32px rgba(0,245,255,0.45))" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-display text-xs font-bold tracking-[0.3em] uppercase text-slate-500 mb-4"
        >
          UltraFrame Optimizer
        </motion.p>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight mb-6 max-w-4xl"
        >
          <span className="block text-white">More FPS. Less Input Lag.</span>
          <span className="block shimmer-text mt-2">Stop Losing Performance to Windows.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Unlock smoother gameplay, lower latency, better 1% lows, and more consistent frame rates
          in minutes. UltraFrame applies 50+ gaming optimizations automatically and safely restores
          everything with a single click if needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-10"
        >
          <a
            href="/checkout"
            onClick={() => trackClarityEvent(ClarityEvents.CTA_GET_NOW)}
            className="group relative px-10 py-4 font-display text-sm font-bold tracking-widest uppercase text-black rounded transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
            style={{ background: "var(--neon-cyan)", boxShadow: "0 0 40px rgba(0,245,255,0.4), 0 4px 20px rgba(0,0,0,0.4)" }}
          >
            <span className="relative z-10">Download UltraFrame</span>
            <div className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300" style={{ background: "var(--neon-green)" }} aria-hidden="true" />
          </a>
          <a
            href="#performance-results"
            className="px-10 py-4 font-display text-sm font-bold tracking-widest uppercase text-slate-300 rounded border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
          >
            View Performance Results
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          aria-label="Product trust badges"
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-16 list-none p-0 m-0"
        >
          {TRUST_BADGES.map((badge) => (
            <li key={badge} className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--neon-green)" }} aria-hidden="true" />
              {badge}
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="relative w-full flex justify-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-hidden="true"
          className="z-20 flex justify-center w-fit bg-black/60 rounded-full p-2 shadow-lg mt-4 mb-2 md:mb-0"
          style={{ position: "relative", top: 0 }}
        >
          <ChevronDown className="w-8 h-8 md:w-6 md:h-6" />
        </motion.div>
      </div>
    </section>
  );
}

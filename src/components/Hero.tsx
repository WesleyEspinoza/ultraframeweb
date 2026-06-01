"use client";
import { motion } from "framer-motion";
import BetaBanner from "@/components/BetaBanner";
import { ChevronDown, Zap } from "lucide-react";
import saleConfig from "@/config/sale.json";
import { ClarityEvents } from "@/lib/clarity-events";
import { trackClarityEvent } from "@/lib/clarity";

const STATS = [
  { value: "Easy Install", label: "Guided setup" },
  { value: "50+", label: "personalized Optimizations" },
  { value: "Zero", label: "Reinstalls needed" },
  { value: "AI Powered", label: "AI Assistant (local, private)" }
];

export default function Hero() {
  return (
    <section
      id="main-content"
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg"
    >
      {/* Decorative backgrounds — hidden from AT */}
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

      {/* Scan line — decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute left-0 right-0 h-px opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.6), transparent)", animation: "scanLine 6s linear infinite" }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24 flex flex-col items-center">
        {/* Sale Banner above Badge */}
        {saleConfig.enabled && saleConfig.discountPercent > 0 && saleConfig.discountPercent < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 px-6 py-2 rounded-xl font-display text-base font-bold tracking-widest uppercase border-2 border-yellow-400 bg-yellow-100/80 text-yellow-900 shadow-lg"
            style={{ letterSpacing: 2, maxWidth: '100%' }}
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
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-xs font-mono tracking-widest uppercase"
          style={{ borderColor: "rgba(0,245,255,0.3)", background: "rgba(0,245,255,0.05)", color: "var(--neon-cyan)" }}
        >
          <Zap className="w-3 h-3 fill-current" aria-hidden="true" />
          Windows 10 &amp; 11 Optimizer · Now with AI Assistant
          <Zap className="w-3 h-3 fill-current" aria-hidden="true" />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="relative mb-8"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 blur-2xl opacity-40 rounded-full scale-110"
            style={{ background: "radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)" }}
          />
          <Zap
            className="relative w-20 h-20 md:w-24 md:h-24 mx-auto fill-current"
            style={{ color: "var(--neon-cyan)", filter: "drop-shadow(0 0 32px rgba(0,245,255,0.45))" }}
          />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-6"
        >
          <span className="block text-white">Ultra</span>
          <span className="block shimmer-text">Frame</span>
          <span className="block text-white text-3xl md:text-4xl lg:text-5xl mt-2 font-semibold tracking-widest">
            Optimizer
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-4 font-light"
        >
          Get all the important settings right{" "}
          <strong style={{ color: "var(--neon-cyan)" }} className="font-semibold">the first time.</strong>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-12"
        >
          Your PC — refreshed. A cleaner, faster feel without reinstalling a single app.
          50+ targeted optimizations tuned specifically for gaming performance — plus a built-in AI assistant that runs locally and explains your system in plain English.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-20"
        >
          <a
            href="/checkout"
            onClick={() => trackClarityEvent(ClarityEvents.CTA_GET_NOW)}
            className="group relative px-10 py-4 font-display text-sm font-bold tracking-widest uppercase text-black rounded transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
            style={{ background: "var(--neon-cyan)", boxShadow: "0 0 40px rgba(0,245,255,0.4), 0 4px 20px rgba(0,0,0,0.4)" }}
          >
            <span className="relative z-10">Get UltraFrame</span>
            <div className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300" style={{ background: "var(--neon-green)" }} aria-hidden="true" />
          </a>
          <a
            href="/license/manage"
            onClick={() => trackClarityEvent(ClarityEvents.CTA_MANAGE_DEVICES)}
            className="px-10 py-4 font-display text-sm font-bold tracking-widest uppercase text-slate-300 rounded border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
          >
            Manage Devices
          </a>
          <a
            href="#how-it-works"
            className="px-10 py-4 font-display text-sm font-bold tracking-widest uppercase text-slate-300 rounded border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.dl
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          aria-label="UltraFrame key statistics"
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden border border-cyan-500/10"
          style={{ background: "rgba(0,245,255,0.05)" }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="py-6 px-4 text-center glass-light">
              <dt className="text-xs text-slate-500 font-mono tracking-widest uppercase order-2">{s.label}</dt>
              <dd className="font-display text-2xl md:text-3xl font-extrabold mb-1 order-1" style={{ color: "var(--neon-cyan)" }}>
                {s.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll cue - always visually separated, never overlaps */}
      <div className="relative w-full flex justify-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-hidden="true"
          className="z-20 flex justify-center w-fit bg-black/60 rounded-full p-2 shadow-lg mt-12 mb-2 md:mb-0"
          style={{ position: 'relative', top: 0 }}
        >
          <ChevronDown className="w-8 h-8 md:w-6 md:h-6" />
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function FinalCTA() {
  return (
    <section aria-labelledby="cta-heading" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,102,255,0.2) 0%, rgba(0,245,255,0.05) 40%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), rgba(0,102,255,0.4), transparent)" }} aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          aria-hidden="true"
          className="inline-flex items-center justify-center w-16 h-16 rounded-full border mb-8"
          style={{ borderColor: "rgba(0,245,255,0.4)", background: "rgba(0,245,255,0.07)", boxShadow: "0 0 40px rgba(0,245,255,0.2)" }}
        >
          <Zap className="w-7 h-7 fill-current" style={{ color: "var(--neon-cyan)" }} />
        </motion.div>

        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-tight mb-6"
        >
          Your PC Has More{" "}
          <span className="shimmer-text">In It.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-12"
        >
          Stop leaving frames on the table. Get the right settings dialed in from day one — no reinstall, no guesswork, no wasted hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="#pricing"
            className="group relative inline-block px-12 py-5 font-display text-sm font-extrabold tracking-widest uppercase text-black rounded-xl transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400"
            style={{ background: "var(--neon-cyan)", boxShadow: "0 0 60px rgba(0,245,255,0.5), 0 8px 30px rgba(0,0,0,0.5)" }}
          >
            <span className="relative z-10">Start Optimizing Now</span>
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-cyan))" }} aria-hidden="true" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="mt-8 text-xs font-mono text-slate-700 tracking-widest"
        >
          INSTANT DOWNLOAD · NO SUBSCRIPTION · ONE-TIME PAYMENT
        </motion.p>
      </div>
    </section>
  );
}

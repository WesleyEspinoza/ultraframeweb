"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";



function StarRating({ count, name }: { count: number; name: string }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars — rating from ${name}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-current" style={{ color: "#fbbf24" }} aria-hidden="true" />
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section aria-labelledby="reviews-heading" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "var(--neon-green)" }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-green)" }}
            aria-hidden="true"
          >
            // From Real Gamers
          </motion.p>
          <motion.h2
            id="reviews-heading"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight"
          >
            Real Gamers,{" "}
            <span style={{ color: "var(--neon-green)" }} className="glow-green">Real Results</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-8 shadow-lg text-neutral-200 text-lg text-center mx-auto max-w-2xl"
        >
          UltraFrame is crafted by gamers for gamers—and for anyone who wants to truly understand and optimize their PC. Every feature is built to give you real control, clear insights, and a smoother experience, whether you’re chasing frames or simply want your system to run its best.
        </motion.div>
      </div>
    </section>
  );
}

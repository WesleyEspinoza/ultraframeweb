"use client";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, Lock, LifeBuoy, Download } from "lucide-react";

const TRUST = [
  { icon: ShieldCheck, label: "Restore-First", sub: "System restore point created before changes" },
  { icon: RefreshCw, label: "Reversible", sub: "Restore point lets you undo changes" },
  { icon: Lock, label: "No Subscription", sub: "Pay once, own it forever" },
  { icon: LifeBuoy, label: "Support Included", sub: "Reach us any time after purchase" },
  { icon: Download, label: "Instant Access", sub: "Download immediately" },
];

export default function TrustBar() {
  return (
    <div className="relative py-10 px-6 border-y border-slate-900" aria-label="Trust signals">
      <div className="max-w-7xl mx-auto">
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-6 list-none p-0 m-0">
          {TRUST.map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <t.icon className="w-5 h-5" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
              <span className="text-white text-xs font-semibold">{t.label}</span>
              <span className="text-slate-600 text-xs font-mono">{t.sub}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

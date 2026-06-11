"use client";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type CellValue = "win" | "lose" | "neutral" | string;

type ComparisonRow = {
  feature: string;
  ultraframe: CellValue;
  manual: CellValue;
};

const ROWS: ComparisonRow[] = [
  { feature: "Time Required", ultraframe: "~5 minutes", manual: "2–8+ hours" },
  { feature: "Risk of Mistakes", ultraframe: "win", manual: "lose" },
  { feature: "Requires Technical Knowledge", ultraframe: "win", manual: "lose" },
  { feature: "Undo Changes Easily", ultraframe: "win", manual: "lose" },
  { feature: "AI Assistance", ultraframe: "win", manual: "lose" },
  { feature: "Windows Updates Compatibility", ultraframe: "win", manual: "neutral" },
  { feature: "Optimization Coverage", ultraframe: "50+ tweaks", manual: "Varies widely" },
  { feature: "Support Included", ultraframe: "win", manual: "lose" },
];

function CellContent({ value }: { value: CellValue }) {
  if (value === "win") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "rgba(0,255,136,0.15)" }}>
        <Check className="w-4 h-4" style={{ color: "var(--neon-green)" }} aria-label="Yes" />
      </span>
    );
  }
  if (value === "lose") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "rgba(239,68,68,0.1)" }}>
        <X className="w-4 h-4 text-red-400" aria-label="No" />
      </span>
    );
  }
  if (value === "neutral") {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800">
        <Minus className="w-4 h-4 text-slate-500" aria-label="Partial" />
      </span>
    );
  }
  return <span className="text-sm font-mono">{value}</span>;
}

export default function Comparison() {
  return (
    <section
      id="comparison"
      aria-labelledby="comparison-heading"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-cyan)" }}
            aria-hidden="true"
          >
            // Why Not DIY?
          </motion.p>
          <motion.h2
            id="comparison-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight"
          >
            UltraFrame vs{" "}
            <span className="shimmer-text">Manual Optimization</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg mt-4 max-w-xl mx-auto"
          >
            You could spend hours tweaking registry keys — or let UltraFrame do it safely in minutes.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-800 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,102,255,0.05) 0%, rgba(0,245,255,0.03) 100%)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-6 py-5 text-xs font-mono tracking-widest uppercase text-slate-500 font-normal">
                    Feature
                  </th>
                  <th
                    className="px-6 py-5 text-center text-xs font-display font-bold tracking-widest uppercase"
                    style={{ color: "var(--neon-cyan)" }}
                  >
                    UltraFrame
                  </th>
                  <th className="px-6 py-5 text-center text-xs font-mono tracking-widest uppercase text-slate-500 font-normal">
                    Manual
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-slate-800/60 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                  >
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <CellContent value={row.ultraframe} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <CellContent value={row.manual} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

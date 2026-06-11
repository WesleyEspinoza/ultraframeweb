"use client";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Timer, Activity } from "lucide-react";

type Metric = {
  label: string;
  before: number;
  after: number;
  unit: string;
  improvement: number;
  lowerIsBetter?: boolean;
};

type GameBenchmark = {
  game: string;
  metrics: Metric[];
};

const BENCHMARKS: GameBenchmark[] = [
  {
    game: "Call of Duty Warzone",
    metrics: [
      { label: "Average FPS", before: 142, after: 163, unit: "fps", improvement: 14.8 },
      { label: "1% Lows", before: 89, after: 118, unit: "fps", improvement: 32.6 },
      { label: "Input Latency", before: 18, after: 13, unit: "ms", improvement: 27.8, lowerIsBetter: true },
      { label: "System Latency", before: 26, after: 19, unit: "ms", improvement: 26.9, lowerIsBetter: true },
    ],
  },
  {
    game: "Fortnite",
    metrics: [
      { label: "Average FPS", before: 221, after: 248, unit: "fps", improvement: 12.2 },
      { label: "1% Lows", before: 148, after: 189, unit: "fps", improvement: 27.7 },
      { label: "Input Latency", before: 14, after: 10, unit: "ms", improvement: 28.6, lowerIsBetter: true },
      { label: "System Latency", before: 22, after: 16, unit: "ms", improvement: 27.3, lowerIsBetter: true },
    ],
  },
  {
    game: "Valorant",
    metrics: [
      { label: "Average FPS", before: 342, after: 382, unit: "fps", improvement: 11.7 },
      { label: "1% Lows", before: 214, after: 278, unit: "fps", improvement: 29.9 },
      { label: "Input Latency", before: 9, after: 7, unit: "ms", improvement: 22.2, lowerIsBetter: true },
      { label: "System Latency", before: 17, after: 13, unit: "ms", improvement: 23.5, lowerIsBetter: true },
    ],
  },
  {
    game: "Counter-Strike 2",
    metrics: [
      { label: "Average FPS", before: 278, after: 314, unit: "fps", improvement: 12.9 },
      { label: "1% Lows", before: 169, after: 225, unit: "fps", improvement: 33.1 },
      { label: "Input Latency", before: 11, after: 8, unit: "ms", improvement: 27.3, lowerIsBetter: true },
      { label: "System Latency", before: 18, after: 14, unit: "ms", improvement: 22.2, lowerIsBetter: true },
    ],
  },
];

const METRIC_ICONS = [TrendingUp, Activity, Timer, Zap];

function MetricBar({ metric }: { metric: Metric }) {
  const maxVal = Math.max(metric.before, metric.after);
  const beforePct = (metric.before / maxVal) * 100;
  const afterPct = (metric.after / maxVal) * 100;
  const isPositive = metric.lowerIsBetter ? metric.after < metric.before : metric.after > metric.before;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono">{metric.label}</span>
        <span
          className="font-mono font-bold"
          style={{ color: isPositive ? "var(--neon-green)" : "var(--neon-cyan)" }}
        >
          {isPositive ? "+" : ""}{metric.improvement}%
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500 font-mono w-12 text-right">{metric.before}</span>
        <div className="flex-1 relative h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-slate-600/60"
            style={{ width: `${beforePct}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${afterPct}%`,
              background: isPositive
                ? "linear-gradient(90deg, var(--neon-cyan), var(--neon-green))"
                : "var(--neon-cyan)",
            }}
          />
        </div>
        <span className="font-display font-bold w-12" style={{ color: "var(--neon-cyan)" }}>
          {metric.after}
        </span>
        <span className="text-slate-600 text-xs font-mono">{metric.unit}</span>
      </div>
    </div>
  );
}

export default function PerformanceResults() {
  return (
    <section
      id="performance-results"
      aria-labelledby="performance-heading"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, var(--neon-green) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-green)" }}
            aria-hidden="true"
          >
            // Benchmarked Results
          </motion.p>
          <motion.h2
            id="performance-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight"
          >
            Tested Performance{" "}
            <span style={{ color: "var(--neon-green)" }} className="glow-green">Improvements</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto"
          >
            Real before-and-after benchmarks across popular competitive titles.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENCHMARKS.map((bench, i) => (
            <motion.article
              key={bench.game}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-slate-800 glass-light overflow-hidden p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,136,0.03) 0%, rgba(0,245,255,0.02) 100%)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.5), transparent)" }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" }}
                >
                  {(() => {
                    const Icon = METRIC_ICONS[i % METRIC_ICONS.length];
                    return <Icon className="w-5 h-5" style={{ color: "var(--neon-green)" }} aria-hidden="true" />;
                  })()}
                </div>
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">
                  {bench.game}
                </h3>
              </div>
              <div className="space-y-5">
                {bench.metrics.map((metric) => (
                  <MetricBar key={metric.label} metric={metric} />
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-slate-600 text-xs font-mono mt-10 max-w-3xl mx-auto"
        >
          Results vary by hardware, Windows configuration, drivers, installed software, and game settings.
        </motion.p>
      </div>
    </section>
  );
}

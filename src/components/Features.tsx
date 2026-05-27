"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Cpu, Gamepad2, Trash2, Zap, Monitor, Settings2, BarChart3, MemoryStick, Network, Bot } from "lucide-react";

const FEATURES = [
  {
    icon: Gamepad2, title: "Game Mode Mastery",
    desc: "Activates and fully configures Windows Game Mode, HPET, and scheduler priority so every CPU cycle goes to your game — not background noise.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: Cpu, title: "CPU Unshackled",
    desc: "Disables CPU throttling, enables High Performance power plan, and configures processor parking — targeting maximum sustained CPU performance for gaming workloads.",
    accent: "var(--neon-blue)",
  },
  {
    icon: MemoryStick, title: "RAM & VRAM Freed",
    desc: "Flushes standby memory, optimizes paging files, and eliminates memory-hogging services so your game gets the full pool.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: Network, title: "Network Latency Killed",
    desc: "Nagle's Algorithm disabled, TCP/IP stack tuned, DNS prefetched. May help reduce ping and packet loss for a smoother online experience.",
    accent: "var(--neon-green)",
  },
  {
    icon: Trash2, title: "Startup Cleaner",
    desc: "Identifies and disables non-essential startup programs, services, and scheduled tasks dragging your boot — and your game — down.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: Monitor, title: "Display Optimized",
    desc: "Sets correct refresh rate, disables VSync overhead, configures DWM and hardware-accelerated GPU scheduling for tear-free, low-latency frames.",
    accent: "var(--neon-blue)",
  },
  {
    icon: Zap, title: "Safe & Reversible",
    desc: "Every change is logged to a restore point before it's applied. One click rolls everything back. Zero risk, maximum reward.",
    accent: "var(--neon-green)",
  },
  {
    icon: Settings2, title: "50+ Tweaks Applied",
    desc: "Registry fixes, services disabled, visual effects stripped — all the deep Windows settings enthusiasts spend hours hunting down, done automatically.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: BarChart3, title: "Before & After Report",
    desc: "UltraFrame benchmarks your system before and after, generating a clear report showing exactly what changed and the performance delta.",
    accent: "var(--neon-blue)",
  },
  {
    icon: Bot, title: "AI Tech Assistant",
    desc: "A local AI assistant built into the app. Ask it anything about your PC — what a setting does, why something changed, or what to try next. Runs entirely on your machine. No data leaves your PC.",
    accent: "var(--neon-cyan)",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" aria-labelledby="features-heading" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-cyan)" }}
            aria-hidden="true"
          >
            // What We Optimize
          </motion.p>
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight"
          >
            Every Layer.{" "}
            <span className="shimmer-text">Every Setting.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto"
          >
            UltraFrame attacks performance at the OS level — the same tweaks pro esports technicians apply by hand, delivered in one guided workflow.
          </motion.p>
        </div>

        <motion.ul
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
          aria-label="List of optimizations"
        >
          {FEATURES.map((f, i) => (
            <motion.li
              key={i}
              variants={item}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative p-6 rounded-xl border border-slate-800 glass-light overflow-hidden transition-all duration-300"
            >
              {/* Hover glow — decorative */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${f.accent}08 0%, transparent 70%)` }}
                aria-hidden="true"
              />
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.accent}60, transparent)` }}
                aria-hidden="true"
              />
              <f.icon
                className="w-7 h-7 mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ color: f.accent }}
                aria-hidden="true"
              />
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white mb-2">
                {f.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

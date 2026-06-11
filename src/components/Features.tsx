"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Cpu, Gamepad2, Trash2, Zap, Monitor, Settings2, MemoryStick, Network, Bot } from "lucide-react";

const FEATURES = [
  {
    icon: Gamepad2, title: "Maximize In-Game Frame Rates",
    desc: "Windows Game Mode, scheduler priority, and GPU scheduling tuned so every CPU cycle and GPU frame goes to your game — not background noise.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: Cpu, title: "Get More Performance From Your Existing Hardware",
    desc: "Unlock sustained CPU and GPU performance without buying new parts. Power plans, throttling limits, and processor parking configured for gaming workloads.",
    accent: "var(--neon-blue)",
  },
  {
    icon: MemoryStick, title: "Reduce Stutters During Intense Gameplay",
    desc: "Free up RAM and VRAM before you queue up. Standby memory flushed, paging optimized, and memory-hogging services cleared for smoother 1% lows.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: Network, title: "Lower Ping & Faster Online Response Times",
    desc: "Network stack tuned for competitive play — reduced latency, faster packet delivery, and more consistent online response in every match.",
    accent: "var(--neon-green)",
  },
  {
    icon: Trash2, title: "Remove Hidden Performance Drains",
    desc: "Kill the startup programs, services, and background tasks silently eating your FPS. Boot faster, play smoother, stay focused on the game.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: Monitor, title: "Tear-Free, Low-Latency Display",
    desc: "Correct refresh rate, reduced display overhead, and hardware-accelerated GPU scheduling for frames that feel instant on every click.",
    accent: "var(--neon-blue)",
  },
  {
    icon: Zap, title: "Safe & Fully Reversible",
    desc: "Every change backed by a restore point before it's applied. One click rolls everything back — zero risk, maximum performance gains.",
    accent: "var(--neon-green)",
  },
  {
    icon: Settings2, title: "50+ Optimizations, One Click",
    desc: "All the deep Windows tweaks enthusiasts spend hours hunting down — registry fixes, service tuning, visual overhead stripped — applied automatically.",
    accent: "var(--neon-cyan)",
  },
  {
    icon: Bot, title: "Your Personal Performance Technician",
    desc: "Ask about FPS drops, stutters, upgrades, or bottlenecks. Local AI runs on your machine — no subscriptions, no cloud, no data collection.",
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
            // What You Get
          </motion.p>
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight"
          >
            Real Gaming{" "}
            <span className="shimmer-text">Outcomes.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto"
          >
            Higher FPS, lower input lag, smoother 1% lows — the same results pro esports technicians deliver by hand, applied automatically in minutes.
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

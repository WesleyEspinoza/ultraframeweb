"use client";

import { motion, useInView } from "framer-motion";
import {
  Bot,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";

type SpecRow = {
  label: string;
  minimum: string;
  recommended?: string;
};

const OPTIMIZER_SPECS: SpecRow[] = [
  {
    label: "Operating system",
    minimum: "Windows 10 (build 1903+) or Windows 11, 64-bit",
  },
  {
    label: "Processor",
    minimum: "64-bit dual-core CPU",
    recommended: "4+ cores (Intel 6th gen / AMD Ryzen 2000 or newer)",
  },
  {
    label: "Memory (RAM)",
    minimum: "8 GB",
    recommended: "16 GB for gaming + background apps",
  },
  {
    label: "Graphics",
    minimum: "DirectX 12–compatible GPU with current drivers",
  },
  {
    label: "Storage",
    minimum: "2 GB free for UltraFrame",
    recommended: "SSD with 15+ GB free if using the AI assistant",
  },
];

const AI_SPECS: SpecRow[] = [
  {
    label: "Model",
    minimum: "Qwen3 8B (bundled / downloaded on first use)",
  },
  {
    label: "System RAM",
    minimum: "12 GB",
    recommended: "16 GB+ (Windows + model offload headroom)",
  },
  {
    label: "Graphics (GPU)",
    minimum: "NVIDIA GeForce GTX 1060 (6 GB VRAM) or equivalent",
    recommended: "8 GB+ VRAM (e.g. RTX 3060, RTX 4060) for faster replies",
  },
  {
    label: "Processor",
    minimum: "4-core CPU with AVX2",
    recommended: "6+ cores if running mostly on CPU",
  },
  {
    label: "Free disk space",
    minimum: "~10 GB for quantized model files",
    recommended: "15 GB+ on an SSD",
  },
  {
    label: "Privacy",
    minimum: "Runs locally — chats are not sent to our servers",
  },
];

const NOTES = [
  "The optimizer itself is lighter than the AI stack. You can use UltraFrame tweaks on modest PCs even if you skip or disable the assistant.",
  "Qwen3 8B is typically run in a compressed (quantized) format on consumer GPUs. More VRAM means higher quality settings and faster token generation.",
  "Laptops with only integrated graphics may run the assistant on CPU only; expect slower responses and higher RAM use — 16 GB RAM is strongly advised.",
  "Close heavy background apps (browsers, capture software, extra game clients) before long AI sessions to avoid out-of-memory slowdowns.",
];

function SpecTable({
  title,
  subtitle,
  icon: Icon,
  rows,
}: {
  title: string;
  subtitle: string;
  icon: typeof Bot;
  rows: SpecRow[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div
        className="px-5 py-4 border-b border-white/10 flex items-start gap-3"
        style={{ background: "rgba(0,245,255,0.04)" }}
      >
        <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            {title}
          </h3>
          <p className="text-slate-500 text-xs font-mono mt-1 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      <dl className="divide-y divide-white/5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 sm:grid-cols-[minmax(7rem,9rem)_1fr] gap-1 sm:gap-4 px-5 py-3.5"
          >
            <dt className="text-xs font-mono uppercase tracking-wider text-slate-500">{row.label}</dt>
            <dd className="text-sm text-slate-300 leading-relaxed">
              <span className="text-white">{row.minimum}</span>
              {row.recommended && (
                <span className="block text-slate-500 text-xs mt-1 font-mono">
                  Recommended: {row.recommended}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function SystemRequirements() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="requirements"
      aria-labelledby="requirements-heading"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div
        className="absolute right-0 top-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "var(--neon-blue)" }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative max-w-5xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-cyan)" }}
          >
            // System requirements
          </motion.p>
          <motion.h2
            id="requirements-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 }}
            className="font-display text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight mb-4"
          >
            Minimum specs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            UltraFrame optimizes Windows for gaming on a wide range of PCs. The built-in{" "}
            <strong className="text-slate-300 font-normal">local AI assistant</strong> (Qwen3 8B)
            needs more headroom — plan for the AI requirements below if you want to use chat on your
            machine.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="grid gap-6 md:grid-cols-2 mb-10"
        >
          <SpecTable
            icon={Monitor}
            title="UltraFrame optimizer"
            subtitle="Gaming performance optimizations"
            rows={OPTIMIZER_SPECS}
          />
          <SpecTable
            icon={Bot}
            title="AI assistant (Qwen3 8B)"
            subtitle="Local, private — runs on your GPU/CPU"
            rows={AI_SPECS}
          />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="space-y-3 list-none p-0 m-0"
          aria-label="Additional requirements notes"
        >
          {NOTES.map((note) => (
            <li
              key={note}
              className="flex gap-3 text-xs text-slate-500 font-mono leading-relaxed"
            >
              <Sparkles
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
                style={{ color: "var(--neon-cyan)" }}
                aria-hidden="true"
              />
              {note}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-center"
          aria-hidden="true"
        >
          {[
            { icon: MemoryStick, label: "12 GB RAM min (AI)" },
            { icon: Cpu, label: "AVX2 CPU" },
            { icon: HardDrive, label: "SSD recommended" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 opacity-60">
              <Icon className="w-4 h-4" style={{ color: "var(--neon-cyan)" }} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

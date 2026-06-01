"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Play, BarChart3, Rocket } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Download,
    title: "Download & Install",
    desc: "One lightweight installer, no bloatware, no subscriptions required to run. Works on Windows 10 (1903+) and all Windows 11 versions.",
  },
  {
    num: "02",
    icon: Play,
    title: "Run the Optimizer",
    desc: "Launch UltraFrame and click Optimize. It scans your system, creates a restore point, then applies all 50+ targeted tweaks automatically.",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "View Your Report",
    desc: "See exactly what changed. UltraFrame generates a clear before/after performance report with benchmark deltas you can share or save.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Game at Full Power",
    desc: "Restart and experience the changes. Many users report faster load times, smoother frames, and lower latency — with the feel of a freshly configured system.",
  },
];

function StepNumber({ num }: { num: string }) {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center font-display font-extrabold text-sm border-2 shrink-0"
      style={{
        borderColor: "var(--neon-cyan)",
        background: "var(--dark-900)",
        color: "var(--neon-cyan)",
        boxShadow: "0 0 30px rgba(0,245,255,0.3)",
      }}
    >
      {num}
    </div>
  );
}

function StepIcon({ icon: Icon }: { icon: typeof Download }) {
  return (
    <div
      className="inline-flex p-4 rounded-xl border shrink-0"
      style={{ borderColor: "rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.05)" }}
    >
      <Icon className="w-7 h-7" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
    </div>
  );
}

function StepContent({
  step,
  align,
}: {
  step: (typeof STEPS)[number];
  align: "left" | "right";
}) {
  const textAlign = align === "left" ? "md:text-right" : "md:text-left";
  const items = align === "left" ? "md:items-end" : "md:items-start";

  return (
    <>
      <div className={`hidden md:inline-flex ${items}`}>
        <StepIcon icon={step.icon} />
      </div>
      <h3
        className={`font-display text-lg font-bold uppercase tracking-widest text-white ${textAlign}`}
      >
        {step.title}
      </h3>
      <p className={`text-slate-500 text-sm leading-relaxed max-w-xs ${textAlign}`}>
        {step.desc}
      </p>
    </>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "var(--neon-blue)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-cyan)" }}
            aria-hidden="true"
          >
            // How It Works
          </motion.p>
          <motion.h2
            id="how-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight"
          >
            Four Steps to a Faster PC
          </motion.h2>
        </div>

        <div className="relative">
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(0,245,255,0.3), transparent)",
              transform: "translateX(-50%)",
            }}
          />

          {/* Mobile: vertical timeline — number, icon, title, description */}
          <ol
            ref={ref}
            className="flex flex-col gap-12 list-none p-0 m-0 md:hidden"
            aria-label="How UltraFrame works"
          >
            {STEPS.map((step, i) => (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-5 px-2"
              >
                <StepNumber num={step.num} />
                <StepIcon icon={step.icon} />
                <h3 className="font-display text-base font-bold uppercase tracking-widest text-white">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                  {step.desc}
                </p>
              </motion.li>
            ))}
          </ol>

          {/* Desktop: alternating timeline */}
          <ol
            className="hidden md:block space-y-0 list-none p-0 m-0"
            aria-label="How UltraFrame works"
          >
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li
                  key={step.num}
                  className="relative min-h-[180px] grid grid-cols-3 items-center"
                >
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -40 : 0 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className={`col-start-1 col-end-2 flex flex-col gap-4 pr-12 ${
                      isLeft ? "items-end" : "invisible pointer-events-none"
                    }`}
                  >
                    {isLeft && <StepContent step={step} align="left" />}
                  </motion.div>

                  <div className="col-start-2 col-end-3 flex justify-center z-10">
                    <StepNumber num={step.num} />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 0 : 40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className={`col-start-3 col-end-4 flex flex-col gap-4 pl-12 ${
                      isLeft ? "invisible pointer-events-none" : "items-start"
                    }`}
                  >
                    {!isLeft && <StepContent step={step} align="right" />}
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

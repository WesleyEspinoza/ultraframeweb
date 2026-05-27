"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Play, BarChart3, Rocket } from "lucide-react";

const STEPS = [
  {
    num: "01", icon: Download, title: "Download & Install",
    desc: "One lightweight installer, no bloatware, no subscriptions required to run. Works on Windows 10 (1903+) and all Windows 11 versions.",
  },
  {
    num: "02", icon: Play, title: "Run the Optimizer",
    desc: "Launch UltraFrame and click Optimize. It scans your system, creates a restore point, then applies all 50+ targeted tweaks automatically.",
  },
  {
    num: "03", icon: BarChart3, title: "View Your Report",
    desc: "See exactly what changed. UltraFrame generates a clear before/after performance report with benchmark deltas you can share or save.",
  },
  {
    num: "04", icon: Rocket, title: "Game at Full Power",
    desc: "Restart and experience the changes. Many users report faster load times, smoother frames, and lower latency — with the feel of a freshly configured system.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "var(--neon-blue)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="relative">
          {/* Center vertical line for desktop */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block" aria-hidden="true"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(0,245,255,0.3), transparent)", transform: "translateX(-50%)" }} />

          <ol ref={ref} className="space-y-20 md:space-y-0 list-none p-0 m-0">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={i} className="relative min-h-[160px] md:grid md:grid-cols-3 md:items-center">
                  {/* Left side (content) */}
                  <div className={`md:col-start-1 md:col-end-2 flex flex-col items-end pr-0 md:pr-12 ${isLeft ? '' : 'md:invisible md:block'}`}>
                    {isLeft && (
                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.15, duration: 0.6 }}
                        className="max-w-xs w-full text-right md:text-right text-center md:text-right mt-12"
                      >
                        <div className="inline-block p-5 rounded-xl border mb-4"
                          style={{ borderColor: "rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.05)" }}>
                          <step.icon className="w-6 h-6" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
                        </div>
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest text-white mb-3">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mx-auto">{step.desc}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Center number circle, always centered */}
                  <div className="md:col-start-2 md:col-end-3 flex flex-col items-center z-10">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-extrabold text-sm border-2 animate-glow-pulse bg-black"
                        style={{ borderColor: "var(--neon-cyan)", background: "var(--dark-900)", color: "var(--neon-cyan)", boxShadow: "0 0 30px rgba(0,245,255,0.3)" }}>
                        {step.num}
                      </div>
                    </div>
                  </div>

                  {/* Right side (content) */}
                  <div className={`md:col-start-3 md:col-end-4 flex flex-col items-start pl-0 md:pl-12 ${isLeft ? 'md:invisible md:block' : ''}`}>
                    {!isLeft && (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.15, duration: 0.6 }}
                        className="max-w-xs w-full text-left md:text-left text-center md:text-left mt-12"
                      >
                        <div className="inline-block p-5 rounded-xl border mb-4"
                          style={{ borderColor: "rgba(0,245,255,0.2)", background: "rgba(0,245,255,0.05)" }}>
                          <step.icon className="w-6 h-6" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
                        </div>
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest text-white mb-3">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mx-auto">{step.desc}</p>
                      </motion.div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "Will UltraFrame mess up my PC or lose my files?", a: "No. Before applying any changes, UltraFrame automatically creates a Windows System Restore Point. Every single modification is logged. You can reverse everything in one click from within the app. Your files, games, and software are never touched." },
  { q: "Do I need to reinstall Windows to use this?", a: "That's the whole point — you don't. UltraFrame is designed to give your PC a cleaner, more responsive feel without the hours of reinstalling, downloading, and reconfiguring. Your personal files, games, and installed apps are not modified by UltraFrame." },
  { q: "Does it work on Windows 10 and Windows 11?", a: "Yes. UltraFrame supports Windows 10 (build 1903 and later) and all versions of Windows 11. It detects your exact OS version and applies version-specific optimizations intelligently." },
  { q: "What if I don't see a performance improvement?", a: "Results depend on your system's hardware and existing configuration. UltraFrame applies targeted Windows settings changes — some systems will see more noticeable improvements than others. Check our Terms of Sale for purchase details." },
  { q: "Is this a subscription? Are there hidden fees?", a: "No subscription and no hidden fees. UltraFrame is a one-time purchase. See current pricing on the checkout page — limited-time discounts may apply." },
  { q: "Is this safe — will it trip antivirus software?", a: "UltraFrame is code-signed with a trusted certificate. Because it modifies registry settings (the same way Windows' own tools do), some antivirus heuristics may flag it. You can whitelist it — and we publish all changes transparently in our changelog so you always know exactly what's happening." },
  { q: "How is this different from free tools like MSConfig or game boosters?", a: "Those tools scratch the surface. UltraFrame applies 50+ targeted system changes across the CPU scheduler, network stack, power management, VRAM, startup services, GPU settings, and more — sequenced in the correct order with safety checks and a full report. It's hours of expert manual work packaged into a guided workflow." },
  { q: "Can I use this on more than one PC?", a: "Yes. One UltraFrame key can be used on up to 3 computers." },
  { q: "How long do updates last?", a: "Your purchase includes lifetime updates for as long as UltraFrame is actively supported." },
  { q: "What is the AI Tech Assistant and does it send my data anywhere?", a: "The AI Tech Assistant is a conversational assistant built directly into UltraFrame. You can ask it questions like \"What did this optimization change?\", \"What does this setting do?\", or \"My game still stutters — what should I check?\" and get plain-English answers. It runs entirely on your computer — no data, logs, or queries are ever sent to an external server. Your system information stays private." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--neon-cyan)" }}
            aria-hidden="true"
          >
            // FAQ
          </motion.p>
          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight"
          >
            Got Questions?
          </motion.h2>
        </div>

        {/* Using a dl (description list) is valid for Q&A; using divs with proper button roles is equally valid and more animatable */}
        <div className="space-y-3" role="list" aria-label="Frequently asked questions">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            const answerId = `faq-answer-${i}`;
            return (
              <motion.div
                key={i}
                role="listitem"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-slate-800 rounded-xl overflow-hidden"
                style={isOpen ? { borderColor: "rgba(0,245,255,0.2)" } : {}}
              >
                <h3>
                  <button
                    className="w-full flex items-center justify-between p-5 text-left transition-colors duration-200 hover:bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span className="text-sm font-semibold text-slate-200 pr-4">{faq.q}</span>
                    {isOpen
                      ? <Minus className="w-4 h-4 flex-shrink-0" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
                      : <Plus className="w-4 h-4 flex-shrink-0 text-slate-600" aria-hidden="true" />
                    }
                  </button>
                </h3>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-label={faq.q}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-800/50">
                        <p className="pt-4">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import { Bot, MessageSquare, Shield, Cpu } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Why is my FPS dropping in Warzone?",
  "What should I upgrade next?",
  "Why am I stuttering in Fortnite?",
  "How can I lower my latency?",
  "Is my CPU bottlenecking my GPU?",
];

const CHAT_MESSAGES = [
  { role: "user" as const, text: "Why is my FPS dropping in Warzone?" },
  {
    role: "assistant" as const,
    text: "Background apps are using 2.1 GB RAM and Windows Game DVR is still active — both common causes of FPS drops in Warzone. I can apply 3 targeted fixes right now.",
  },
  { role: "user" as const, text: "Apply the fixes." },
  {
    role: "assistant" as const,
    text: "Done. Game DVR disabled, 4 startup services stopped, and standby memory flushed. Expect smoother frame pacing in your next match.",
  },
];

export default function AIAssistant() {
  return (
    <section
      id="ai-assistant"
      aria-labelledby="ai-heading"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, var(--neon-blue) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-mono tracking-widest uppercase mb-4"
              style={{ color: "var(--neon-cyan)" }}
              aria-hidden="true"
            >
              // Built-In AI Assistant
            </motion.p>
            <motion.h2
              id="ai-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight leading-tight mb-6"
            >
              Meet Your Personal{" "}
              <span className="shimmer-text">PC Performance Technician</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg leading-relaxed mb-8"
            >
              Ask questions about FPS drops, stuttering, hardware upgrades, Windows performance,
              game settings, or system bottlenecks. UltraFrame AI runs locally on your computer
              with no subscriptions, no cloud dependency, and no data collection.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-3 mb-8 list-none p-0"
              aria-label="Example questions you can ask"
            >
              {EXAMPLE_PROMPTS.map((prompt) => (
                <li
                  key={prompt}
                  className="flex items-start gap-3 text-sm text-slate-400 border border-slate-800 rounded-lg px-4 py-3 glass-light"
                >
                  <MessageSquare
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "var(--neon-cyan)" }}
                    aria-hidden="true"
                  />
                  {prompt}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Shield, label: "No data collection" },
                { icon: Cpu, label: "Runs on your PC" },
                { icon: Bot, label: "No subscription" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 px-3 py-1.5 rounded-full border border-slate-800"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative"
            aria-label="AI assistant chat preview"
          >
            <div
              className="rounded-2xl border border-cyan-500/20 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(9,24,36,0.9) 0%, rgba(5,13,20,0.95) 100%)",
                boxShadow: "0 0 60px rgba(0,245,255,0.1), 0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="flex items-center gap-3 px-5 py-4 border-b border-slate-800"
                style={{ background: "rgba(0,245,255,0.03)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(0,245,255,0.1)" }}
                >
                  <Bot className="w-4 h-4" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-white tracking-wide">UltraFrame AI</p>
                  <p className="text-xs text-slate-500 font-mono">Local · Private · Always available</p>
                </div>
                <span
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ background: "var(--neon-green)", boxShadow: "0 0 8px var(--neon-green)" }}
                  aria-hidden="true"
                />
              </div>

              <div className="p-5 space-y-4 min-h-[320px]">
                {CHAT_MESSAGES.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "text-black font-medium"
                          : "text-slate-300 border border-slate-800"
                      }`}
                      style={
                        msg.role === "user"
                          ? { background: "var(--neon-cyan)" }
                          : { background: "rgba(255,255,255,0.03)" }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-center gap-3 rounded-xl border border-slate-800 px-4 py-3 glass-light">
                  <span className="text-slate-600 text-sm font-mono flex-1">Ask about your system...</span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--neon-cyan)" }}
                    aria-hidden="true"
                  >
                    <MessageSquare className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

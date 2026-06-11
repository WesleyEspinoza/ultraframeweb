"use client";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function MoneyBackGuarantee() {
  return (
    <section
      id="guarantee"
      aria-labelledby="guarantee-heading"
      className="relative py-16 md:py-20 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-slate-800 overflow-hidden p-8 md:p-12 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,136,0.04) 0%, rgba(0,245,255,0.03) 100%)",
            boxShadow: "0 0 40px rgba(0,255,136,0.06)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent)" }}
            aria-hidden="true"
          />

          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.25)",
              boxShadow: "0 0 30px rgba(0,255,136,0.15)",
            }}
            aria-hidden="true"
          >
            <ShieldCheck className="w-8 h-8" style={{ color: "var(--neon-green)" }} />
          </div>

          <h2
            id="guarantee-heading"
            className="font-display text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight mb-4"
          >
            30-Day Money-Back Guarantee
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            Refunds are available within 30 days of purchase only if you have not successfully run
            the optimizer. Once optimizations are applied to your system, your license is considered
            delivered and the purchase becomes final.
          </p>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
            If you run UltraFrame, see performance changes, and later request a refund, that request
            will not be approved. Refunds after successful use — including cases where you simply
            change your mind — are not eligible. For technical problems preventing use, contact
            support first. We will work with you to resolve the issue before any refund is considered.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

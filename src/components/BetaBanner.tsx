import betaConfig from "@/config/beta.json";
import { FlaskConical } from "lucide-react";

type BetaBannerProps = {
  compact?: boolean;
  className?: string;
};

export default function BetaBanner({ compact = false, className = "" }: BetaBannerProps) {
  if (!betaConfig.enabled) return null;

  if (compact) {
    return (
      <p
        className={`text-xs text-violet-300/90 font-mono leading-relaxed border border-violet-400/20 rounded-lg px-4 py-3 bg-violet-500/5 ${className}`}
        role="status"
      >
        <span className="font-semibold text-violet-200">{betaConfig.badge}.</span>{" "}
        {betaConfig.purchaseNote}
      </p>
    );
  }

  return (
    <div
      className={`rounded-xl border border-violet-400/30 bg-violet-500/10 px-5 py-4 text-left ${className}`}
      role="status"
      aria-label={betaConfig.headline}
    >
      <div className="flex gap-3">
        <FlaskConical
          className="w-5 h-5 text-violet-300 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-violet-200 mb-1">
            {betaConfig.badge} — {betaConfig.headline}
          </p>
          <p className="text-sm text-violet-200/80 leading-relaxed">{betaConfig.description}</p>
        </div>
      </div>
    </div>
  );
}

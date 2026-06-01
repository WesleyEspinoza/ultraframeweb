import betaConfig from "@/config/beta.json";

type BetaBadgeProps = {
  className?: string;
};

export default function BetaBadge({ className = "" }: BetaBadgeProps) {
  if (!betaConfig.enabled) return null;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded font-display text-[10px] font-bold tracking-widest uppercase border border-violet-400/50 text-violet-300 bg-violet-500/10 ${className}`}
      aria-label={betaConfig.badge}
    >
      {betaConfig.badge}
    </span>
  );
}

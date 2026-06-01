export default function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8" role="status" aria-live="polite">
      <div
        className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-500 font-mono">{label}…</p>
    </div>
  );
}

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan-400/30 text-xs font-mono uppercase tracking-wider text-cyan-300 hover:bg-cyan-400/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  );
}

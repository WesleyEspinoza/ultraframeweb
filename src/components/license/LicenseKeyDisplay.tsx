"use client";

import type { RevealedLicense } from "@/lib/license-api";
import { AlertTriangle } from "lucide-react";
import CopyButton from "./CopyButton";
import LicenseActionButtons from "./LicenseActionButtons";

export default function LicenseKeyDisplay({
  license,
  sessionId,
}: {
  license: RevealedLicense;
  sessionId: string | null;
}) {
  return (
    <div className="space-y-6 text-left">
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-100/90">
          <strong className="font-semibold">This key is only shown once.</strong> Save it now before
          leaving this page.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="font-display text-xl font-bold text-white text-center">Thank you</h2>

        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            License key
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <code className="flex-1 block px-4 py-3 rounded-lg bg-black/40 border border-cyan-400/20 text-cyan-300 font-mono text-sm break-all">
              {license.key}
            </code>
            <CopyButton value={license.key} label="Copy key" />
          </div>
        </div>

        <dl className="grid gap-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
            <dt className="text-slate-500">Email</dt>
            <dd className="text-slate-200 text-right break-all">{license.email}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
            <dt className="text-slate-500">Product</dt>
            <dd className="text-slate-200 text-right">{license.product}</dd>
          </div>
        </dl>
      </div>

      <LicenseActionButtons sessionId={sessionId} />
    </div>
  );
}

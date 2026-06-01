"use client";

import { useLicenseManage } from "@/hooks/useLicenseManage";
import { Loader2, Monitor, Trash2 } from "lucide-react";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import Spinner from "./Spinner";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function LicenseManagePanel() {
  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [machineId, setMachineId] = useState("");
  const [loaded, setLoaded] = useState(false);

  const {
    devices,
    loading,
    actionLoading,
    error,
    deviceLimitReached,
    loadDevices,
    activateDevice,
    removeDevice,
    clearError,
  } = useLicenseManage(email, licenseKey);

  async function handleLoad(e: React.FormEvent) {
    e.preventDefault();
    setLoaded(true);
    await loadDevices();
  }

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    const ok = await activateDevice(machineId);
    if (ok) setMachineId("");
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleLoad}
        className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4"
      >
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white">
          License lookup
        </h2>
        <div>
          <label htmlFor="manage-email" className="block text-xs font-mono text-slate-500 mb-1.5">
            Email
          </label>
          <input
            id="manage-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="manage-key" className="block text-xs font-mono text-slate-500 mb-1.5">
            License key
          </label>
          <input
            id="manage-key"
            type="text"
            required
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            placeholder="UF-XXXX-XXXX-XXXX-XXXX"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black disabled:opacity-50"
          style={{ background: "var(--neon-cyan, #00f5ff)" }}
        >
          {loading ? "Loading…" : "Load devices"}
        </button>
      </form>

      {error && <ErrorAlert message={error} />}

      {deviceLimitReached && (
        <p className="text-sm text-amber-300/90 font-mono">
          Maximum of 3 active devices per license. Remove a device to register another.
        </p>
      )}

      {loaded && !loading && (
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            Active devices ({devices.length}/3)
          </h2>

          {devices.length === 0 ? (
            <p className="text-sm text-slate-500">No active devices registered yet.</p>
          ) : (
            <ul className="space-y-3 list-none p-0">
              {devices.map((device) => (
                <li
                  key={device.machineId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-white/5 bg-black/20"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-slate-500 mb-1">Machine ID</p>
                    <p className="text-sm text-slate-200 font-mono break-all">{device.machineId}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Activated {formatDate(device.activatedAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => removeDevice(device.machineId)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-red-400/30 text-red-300 text-xs font-mono uppercase tracking-wider hover:bg-red-400/10 disabled:opacity-50 shrink-0"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {loaded && (
        <form
          onSubmit={handleActivate}
          className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Activate device
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter the machine ID shown in UltraFrame on the PC you want to register.
          </p>
          <div>
            <label htmlFor="machine-id" className="block text-xs font-mono text-slate-500 mb-1.5">
              Machine ID
            </label>
            <input
              id="machine-id"
              type="text"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-slate-200 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              placeholder="abc123-fingerprint"
            />
          </div>
          <button
            type="submit"
            disabled={actionLoading || !email.trim() || !licenseKey.trim()}
            className="w-full py-3 rounded-lg border border-cyan-400/40 text-cyan-300 font-display text-xs font-bold tracking-widest uppercase hover:bg-cyan-400/5 disabled:opacity-50"
          >
            {actionLoading ? "Processing…" : "Activate device"}
          </button>
        </form>
      )}

      {loading && loaded && <Spinner label="Loading devices" />}
    </div>
  );
}

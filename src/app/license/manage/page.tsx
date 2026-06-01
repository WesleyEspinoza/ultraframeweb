import LicenseManagePanel from "@/components/license/LicenseManagePanel";
import {
  INSTALLER_DOWNLOAD_URL,
  INSTALLER_FILENAME,
} from "@/lib/installer-download";
import { Download } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Manage license | UltraFrame",
  description: "View and manage UltraFrame license devices.",
};

export default function LicenseManagePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16">
      <div className="max-w-xl mx-auto w-full">
        <p className="text-xs font-mono tracking-widest uppercase mb-4 text-cyan-400">
          License management
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Manage license</h1>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Enter the email and license key from your purchase to view active devices, register a new
          PC, or remove an old one. Each license supports up to 3 devices.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-widest text-white mb-1">
              Installer
            </p>
            <p className="text-sm text-slate-500">
              Download or reinstall {INSTALLER_FILENAME} on a Windows PC.
            </p>
          </div>
          <a
            href={INSTALLER_DOWNLOAD_URL}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black shrink-0"
            style={{ background: "var(--neon-cyan, #00f5ff)" }}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Download app
          </a>
        </div>

        <LicenseManagePanel />

        <p className="mt-10 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">
            ← Return to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}

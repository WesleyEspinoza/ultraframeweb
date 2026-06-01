import LicenseManagePanel from "@/components/license/LicenseManagePanel";
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
        <p className="text-slate-400 mb-8 leading-relaxed">
          Enter the email and license key from your purchase to view active devices, register a new
          PC, or remove an old one. Each license supports up to 3 devices.
        </p>

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

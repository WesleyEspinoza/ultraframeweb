import BackLink from "@/components/BackLink";
import LicenseManagePanel from "@/components/license/LicenseManagePanel";

export const metadata = {
  title: "Manage license | UltraFrame",
  description: "View and manage UltraFrame license devices.",
};

export default function LicenseManagePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16">
      <div className="max-w-xl mx-auto w-full">
        <BackLink className="mb-8" />
        <p className="text-xs font-mono tracking-widest uppercase mb-4 text-cyan-400">
          License management
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Manage license</h1>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Enter the email and license key from your purchase to view active devices, register a new
          PC, or remove an old one. Each license supports up to 3 devices.
        </p>

        <LicenseManagePanel />

        <div className="mt-10 flex justify-center">
          <BackLink />
        </div>
      </div>
    </main>
  );
}

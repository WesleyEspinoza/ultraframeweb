import BackLink from "@/components/BackLink";
import LicenseRevealFlow from "@/components/license/LicenseRevealFlow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "View your UltraFrame license and download the installer after purchase.",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16">
      <div className="max-w-lg mx-auto w-full">
        <BackLink className="mb-8" />
        <p className="text-xs font-mono tracking-widest uppercase mb-4 text-cyan-400 text-center">
          Order confirmed
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-8 text-center">
          Your license
        </h1>
        <LicenseRevealFlow sessionId={sessionId ?? null} />
        <div className="mt-10 flex justify-center">
          <BackLink />
        </div>
      </div>
    </main>
  );
}

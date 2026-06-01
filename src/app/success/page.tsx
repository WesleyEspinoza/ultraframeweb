import LicenseRevealFlow from "@/components/license/LicenseRevealFlow";
import Link from "next/link";

export const metadata = {
  title: "Order confirmed | UltraFrame",
  description: "Reveal your UltraFrame license key after purchase.",
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16">
      <div className="max-w-lg mx-auto w-full">
        <p className="text-xs font-mono tracking-widest uppercase mb-4 text-cyan-400 text-center">
          Order confirmed
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-8 text-center">
          Your license
        </h1>
        <LicenseRevealFlow sessionId={sessionId ?? null} />
        <p className="mt-10 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors">
            ← Return to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}

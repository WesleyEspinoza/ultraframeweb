import BackLink from "@/components/BackLink";
import HelpForm from "@/components/HelpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & support",
  description:
    "Contact UltraFrame support for help with licenses, installation, billing, and Windows gaming optimization.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help & support | UltraFrame",
    description: "Get help with UltraFrame licenses, installation, and billing.",
    url: "/help",
  },
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16">
      <div className="max-w-xl mx-auto w-full">
        <BackLink className="mb-8" />
        <p className="text-xs font-mono tracking-widest uppercase mb-4 text-cyan-400">
          Support
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Get help</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Questions about your license, install, or purchase? Send us a message and we will get back
          to you at the email you provide.
        </p>

        <HelpForm />

        <div className="mt-10 flex justify-center">
          <BackLink />
        </div>
      </div>
    </main>
  );
}

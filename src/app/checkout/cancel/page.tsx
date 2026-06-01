import BackLink from "@/components/BackLink";
import Link from "next/link";

export const metadata = {
  title: "Checkout canceled | UltraFrame",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16">
      <div className="max-w-lg mx-auto">
        <BackLink className="mb-10" />
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-white mb-4">Checkout canceled</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            No charge was made. When you&apos;re ready, you can complete your purchase and download
            UltraFrame in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/checkout"
              className="inline-block py-3 px-6 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black"
              style={{ background: "var(--neon-cyan, #00f5ff)" }}
            >
              Return to checkout
            </Link>
            <BackLink />
          </div>
        </div>
      </div>
    </main>
  );
}

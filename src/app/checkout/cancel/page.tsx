import Link from "next/link";

export const metadata = {
  title: "Checkout canceled | UltraFrame",
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-200 px-6 py-16 flex items-center justify-center">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold text-white mb-4">Checkout canceled</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          No charge was made. When you&apos;re ready, you can complete your purchase and download
          UltraFrame in minutes.
        </p>
        <Link
          href="/checkout"
          className="inline-block py-3 px-6 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-black mr-4"
          style={{ background: "var(--neon-cyan, #00f5ff)" }}
        >
          Return to checkout
        </Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-cyan-400">
          Homepage
        </Link>
      </div>
    </main>
  );
}

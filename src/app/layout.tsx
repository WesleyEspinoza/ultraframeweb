import ClarityAnalytics from "@/components/ClarityAnalytics";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UltraFrame Optimizer (Public Beta) | Windows 10/11 Gaming Performance",
  description: "Public beta: guided Windows 10/11 gaming optimizations with planned updates and new features. Get important settings dialed in without a reinstall.",
  keywords: ["Windows optimizer", "gaming performance", "game optimization", "Windows 11 optimization", "PC optimizer", "gaming PC"],
  openGraph: {
    title: "UltraFrame Optimizer",
    description: "A guided way to optimize Windows gaming settings without reinstalling.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-body">
        {/* Skip-to-content link for keyboard/screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded focus:text-black focus:text-sm focus:font-semibold"
          style={{ background: "var(--neon-cyan)" }}
        >
          Skip to main content
        </a>
        <ClarityAnalytics />
        {children}
      </body>
    </html>
  );
}

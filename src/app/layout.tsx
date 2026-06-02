import ClarityAnalytics from "@/components/ClarityAnalytics";
import type { Metadata } from "next";
import {
  defaultDescription,
  defaultKeywords,
  defaultTitle,
  getSiteUrl,
  siteName,
} from "@/lib/site-metadata";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: "SoftwareRefresh", url: "https://softwarerefresh.com" }],
  creator: "SoftwareRefresh",
  publisher: "SoftwareRefresh",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-body">
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

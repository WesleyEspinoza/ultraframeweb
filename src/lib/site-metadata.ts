const DEFAULT_SITE_URL = "https://ultraframeoptimizer.netlify.app";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_SITE_URL;
  return url.replace(/\/$/, "");
}

export const siteName = "UltraFrame";

export const defaultTitle =
  "UltraFrame Optimizer | Windows 10/11 Gaming Performance Tool";

export const defaultDescription =
  "UltraFrame is a guided Windows 10 and Windows 11 gaming optimizer with 50+ targeted tweaks, local AI assistant, and one-time pricing. No reinstall required.";

export const defaultKeywords = [
  "Windows optimizer",
  "Windows 11 gaming",
  "Windows 10 gaming",
  "PC game optimizer",
  "gaming performance",
  "UltraFrame",
  "game optimization",
  "local AI assistant",
  "Qwen3 8B",
];

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/checkout", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/help", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/license/manage", changeFrequency: "monthly" as const, priority: 0.5 },
];

export function buildSoftwareApplicationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "UltraFrame Optimizer",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows 10, Windows 11",
    description: defaultDescription,
    url: siteUrl,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/checkout`,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: "SoftwareRefresh",
      url: "https://softwarerefresh.com",
    },
  };
}

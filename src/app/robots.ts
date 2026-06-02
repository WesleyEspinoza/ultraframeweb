import { getSiteUrl } from "@/lib/site-metadata";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/success", "/checkout/success"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}

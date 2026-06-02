import { getSiteUrl, publicRoutes } from "@/lib/site-metadata";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

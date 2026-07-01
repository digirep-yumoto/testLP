import type { MetadataRoute } from "next";
import { company } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.url.replace(/\/$/, "");
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/tokushoho`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

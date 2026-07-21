import type { MetadataRoute } from "next";
import { company } from "@/lib/site-data";
import { posts } from "@/lib/blog-data";
import { lps } from "@/lib/lp-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.url.replace(/\/$/, "");
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/service`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/company`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/media/toilet`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/media/laundry`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...lps.map((l) => ({
      url: `${base}/lp/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updated || p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/tokushoho`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

import type { MetadataRoute } from "next";
import { company } from "@/lib/site-data";

export default function robots(): MetadataRoute.Robots {
  const base = company.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/apply-form.html"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

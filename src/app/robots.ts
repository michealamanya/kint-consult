import type { MetadataRoute } from "next";
import { company } from "@/data/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.SITE_ENV === "staging"
        ? { userAgent: "*", disallow: "/" }
        : { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url,
  };
}

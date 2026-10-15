import type { MetadataRoute } from "next";
import { company, industries, solutions, intelligenceAreas } from "@/data/site";
import { getPublishedInsights } from "@/data/insights";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.SITE_ENV === "staging") return [];
  const articles = getPublishedInsights();
  const articleDates = new Map(
    articles.map((item) => [
      `/insights/${item.slug}`,
      item.updatedAt || item.publishedAt,
    ]),
  );
  const routes = [
    "/",
    "/about",
    "/industries",
    "/solutions",
    "/intelligence",
    "/insights",
    "/contact",
    "/privacy",
    "/partners",
    "/careers",
    "/projects",
    "/cookies",
    "/terms",
    "/accessibility",
    ...industries.map((item) => `/industries/${item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...intelligenceAreas.map((item) => `/intelligence/${item.slug}`),
    ...articles.map((item) => `/insights/${item.slug}`),
  ];
  return routes.map((route) => ({
    url: `${company.url}${route}`,
    changeFrequency: route.startsWith("/insights/") ? "yearly" : "monthly",
    priority: route === "/" ? 1 : route.split("/").length === 2 ? 0.8 : 0.6,
    ...(articleDates.has(route)
      ? { lastModified: articleDates.get(route) }
      : {}),
  }));
}

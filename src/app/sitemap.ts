import type { MetadataRoute } from "next";
import { company, industries, solutions, intelligenceAreas } from "@/data/site";
import { insights } from "@/data/insights";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/industries",
    "/solutions",
    "/intelligence",
    "/insights",
    "/contact",
    "/privacy",
    ...industries.map((item) => `/industries/${item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...intelligenceAreas.map((item) => `/intelligence/${item.slug}`),
    ...insights.map((item) => `/insights/${item.slug}`),
  ];
  return routes.map((route) => ({
    url: `${company.url}${route}`,
    changeFrequency: route.startsWith("/insights/") ? "yearly" : "monthly",
    priority: route === "/" ? 1 : route.split("/").length === 2 ? 0.8 : 0.6,
  }));
}

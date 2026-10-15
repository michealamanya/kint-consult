import content from "../../content/insights.json";
import { publishedEntries } from "@/lib/content-filter.mjs";
export type Insight = (typeof content.entries)[number] & {
  image?: string;
  imageAlt?: string;
};
export function getPublishedInsights(): Insight[] {
  return publishedEntries(content.entries);
}
// Compatibility for static consumers; request-time routes use the function.
export const insights = getPublishedInsights();

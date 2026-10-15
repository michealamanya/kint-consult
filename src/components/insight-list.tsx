import Link from "next/link";
import Image from "next/image";
import { getPublishedInsights } from "@/data/insights";
import { Arrow } from "./ui";
import { BrandVisual } from "./brand-visual";

export function InsightList({
  query = "",
  category = "",
  tag = "",
}: {
  query?: string;
  category?: string;
  tag?: string;
}) {
  const insights = getPublishedInsights().filter(
    (item) =>
      (!category || item.category === category) &&
      (!tag || item.tags.includes(tag)) &&
      (!query ||
        [
          item.title,
          item.description,
          item.category,
          ...item.tags,
          ...item.sections.flatMap((section) => [
            section.heading,
            ...section.paragraphs,
          ]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  return (
    <div className="insight-grid">
      {!insights.length && (
        <p role="status">
          No insights match these filters. Try a different search.
        </p>
      )}
      {insights.map((item) => (
        <Link
          href={`/insights/${item.slug}`}
          className="insight-item"
          key={item.slug}
        >
          <div className="insight-art" aria-hidden="true">
            {item.image?.startsWith("/images/uploads/") ? (
              <Image
                src={item.image}
                alt={item.imageAlt || ""}
                width={960}
                height={640}
                sizes="(max-width: 700px) 100vw, 33vw"
              />
            ) : (
              <BrandVisual
                kind={
                  item.slug === "operational-visibility-reporting"
                    ? "digital-transformation"
                    : item.slug === "data-foundations-industrial-intelligence"
                      ? "intelligence-insight"
                      : "erp-insight"
                }
              />
            )}
          </div>
          <div className="insight-meta">
            <span>{item.category}</span>
            <span>{item.readTime}</span>
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <span className="text-link">
            Read perspective
            <Arrow diagonal />
          </span>
        </Link>
      ))}
    </div>
  );
}

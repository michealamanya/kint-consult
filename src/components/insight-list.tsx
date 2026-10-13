import Link from "next/link";
import { insights } from "@/data/insights";
import { Arrow } from "./ui";
import { BrandVisual } from "./brand-visual";

export function InsightList() {
  return (
    <div className="insight-grid">
      {insights.map((item, index) => (
        <Link
          href={`/insights/${item.slug}`}
          className="insight-item"
          key={item.slug}
        >
          <div className="insight-art" aria-hidden="true">
            <BrandVisual
              kind={index === 0 ? "ai" : index === 1 ? "erp" : "reporting"}
            />
            <span className="art-caption">KINT / PERSPECTIVES</span>
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

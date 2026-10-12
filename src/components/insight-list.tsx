import Link from "next/link";
import { insights } from "@/data/insights";
import { Arrow } from "./ui";

export function InsightList() {
  return (
    <div className="insight-grid">
      {insights.map((item, index) => (
        <Link
          href={`/insights/${item.slug}`}
          className="insight-item"
          key={item.slug}
        >
          <div
            className={`insight-art insight-art-${item.image}`}
            aria-hidden="true"
          >
            {index === 0 ? (
              <>
                <span>DATA</span>
                <i />
                <span>CONTEXT</span>
                <i />
                <span>INTELLIGENCE</span>
              </>
            ) : index === 1 ? (
              <div className="art-process">
                <span>01</span>
                <i />
                <span>02</span>
                <i />
                <span>03</span>
              </div>
            ) : (
              <div className="art-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            )}
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

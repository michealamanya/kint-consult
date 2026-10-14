import Link from "next/link";
import { solutions } from "@/data/site";
import { BrandVisual, type VisualKind } from "@/components/brand-visual";
import {
  Arrow,
  ContactCta,
  Container,
  Eyebrow,
  JsonLd,
  PageIntro,
} from "@/components/ui";
import { pageMetadata, pageSchema } from "@/lib/seo";
const description =
  "ERP and Odoo, AI and data, custom software, cloud infrastructure, automation and information governance for business and industrial organisations.";
const serviceVisuals: Record<string, VisualKind> = {
  "ai-data": "ai",
  "erp-odoo": "odoo",
  "software-platforms": "digital-transformation",
  "cloud-infrastructure": "cloud",
  "automation-reporting": "reporting",
  "cybersecurity-governance": "security",
};
export const metadata = pageMetadata(
  "Enterprise Technology Solutions",
  description,
  "/solutions",
);
export default function SolutionsPage() {
  return (
    <>
      <PageIntro
        label="Solutions / Current services"
        title="Digital systems with a clear business purpose."
        description={description}
        crumbs={[{ label: "Solutions", href: "/solutions" }]}
      />
      <section className="content-section">
        <Container className="topic-list">
          {solutions
            .filter((item) => item.slug !== "industrial-intelligence")
            .map((item) => (
              <Link
                href={`/solutions/${item.slug}`}
                className="topic-link"
                key={item.slug}
              >
                <span>{item.label} / CURRENT SERVICE</span>
                <BrandVisual kind={serviceVisuals[item.slug]} />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Arrow diagonal />
              </Link>
            ))}
        </Container>
      </section>
      <section className="feature-band">
        <Container>
          <div>
            <Eyebrow>A separate development direction</Eyebrow>
            <h2>KINT Intelligence</h2>
          </div>
          <div>
            <p>
              Our industrial intelligence products are under development.
              Explore the direction, research areas and intended approach.
            </p>
            <Link href="/intelligence" className="text-link">
              Explore KINT Intelligence
              <Arrow diagonal />
            </Link>
          </div>
        </Container>
      </section>
      <ContactCta />
      <JsonLd data={pageSchema("Solutions", "/solutions", description)} />
    </>
  );
}

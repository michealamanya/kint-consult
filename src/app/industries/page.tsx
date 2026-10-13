import Link from "next/link";
import { industries } from "@/data/site";
import { BrandVisual, type VisualKind } from "@/components/brand-visual";
import {
  Arrow,
  ContactCta,
  Container,
  JsonLd,
  PageIntro,
} from "@/components/ui";
import { pageMetadata, pageSchema } from "@/lib/seo";
const description =
  "Enterprise technology and a developing intelligence direction for petroleum, energy, minerals and petrochemicals in Uganda and the wider African economy.";
export const metadata = pageMetadata("Industries", description, "/industries");
export default function IndustriesPage() {
  return (
    <>
      <PageIntro
        label="Industries"
        title="A connected view of the industrial economy."
        description={description}
        crumbs={[{ label: "Industries", href: "/industries" }]}
      />
      <section className="content-section">
        <Container className="topic-list">
          {industries.map((item) => (
            <Link
              href={`/industries/${item.slug}`}
              className="topic-link"
              key={item.slug}
            >
              <span>{item.label}</span>
              <BrandVisual kind={item.slug as VisualKind} />
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <Arrow diagonal />
            </Link>
          ))}
        </Container>
      </section>
      <section className="feature-band">
        <Container>
          <h2>
            An industrial focus.
            <br />
            <em>A shared digital foundation.</em>
          </h2>
          <p>
            Each sector has distinct operational requirements. Reliable business
            systems, well-managed data and clearer reporting provide a common
            starting point. Petroleum is KINT’s initial strategic focus.
          </p>
        </Container>
      </section>
      <ContactCta />
      <JsonLd data={pageSchema("Industries", "/industries", description)} />
    </>
  );
}

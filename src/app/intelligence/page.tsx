import Link from "next/link";
import { intelligenceAreas } from "@/data/site";
import {
  Arrow,
  Button,
  Container,
  Eyebrow,
  JsonLd,
  PageIntro,
} from "@/components/ui";
import { DataFlow } from "@/components/data-flow";
import { pageMetadata, pageSchema } from "@/lib/seo";
const description =
  "KINT Intelligence is a developing industrial data and AI-assisted research platform direction, starting with petroleum and extending to related sectors.";
export const metadata = pageMetadata(
  "KINT Intelligence — In Development",
  description,
  "/intelligence",
);
export default function IntelligencePage() {
  return (
    <>
      <PageIntro
        label="KINT Intelligence / Development programme"
        title="Connecting information. Developing intelligence."
        description={description}
        crumbs={[{ label: "KINT Intelligence", href: "/intelligence" }]}
      />
      <section className="content-section">
        <Container>
          <div className="editorial-split">
            <div>
              <Eyebrow>Our platform direction</Eyebrow>
              <h2>
                A clearer view of the
                <br />
                <em>industrial economy.</em>
              </h2>
            </div>
            <div className="editorial-body">
              <p>
                Industrial decisions often depend on information scattered
                across organisations, documents and public sources.
              </p>
              <p>
                We are exploring how structured datasets, explicit knowledge
                relationships and AI-assisted research can make that information
                easier to find, assess and use.
              </p>
              <p>
                Petroleum is our starting sector. Energy, minerals and
                petrochemicals form the wider direction.
              </p>
              <div className="development-banner">
                <span className="status-tag">
                  <span />
                  In development
                </span>
                <p>
                  The areas below describe intended capabilities. There is no
                  commercially available intelligence platform or product
                  subscription at this stage.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="feature-band">
        <Container>
          <h2>Evidence before answers.</h2>
          <p>
            Traceable sources, clear dates, documented limitations and human
            review are central to the intended approach. AI should support
            research, with its outputs subject to verification.
          </p>
        </Container>
      </section>
      <section className="content-section">
        <Container>
          <Eyebrow>Intelligence areas / All in development</Eyebrow>
          <div className="topic-list">
            {intelligenceAreas.map((item, index) => (
              <Link
                href={`/intelligence/${item.slug}`}
                className="topic-link"
                key={item.slug}
              >
                <span>0{index + 1} / IN DEVELOPMENT</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Arrow diagonal />
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <section className="data-section">
        <Container>
          <Eyebrow>A connected foundation</Eyebrow>
          <h2>From data to decisions.</h2>
          <DataFlow />
        </Container>
      </section>
      <section className="contact-cta">
        <Container>
          <div>
            <Eyebrow light>Industrial research & collaboration</Eyebrow>
            <h2>
              Help shape the
              <br />
              <em>questions worth answering.</em>
            </h2>
          </div>
          <div className="cta-side">
            <p>
              Discuss sector information needs,
              <br />
              research priorities or potential collaboration.
            </p>
            <Button
              href="/contact?area=Industrial%20intelligence"
              variant="light"
            >
              Discuss the direction
            </Button>
          </div>
        </Container>
      </section>
      <JsonLd
        data={pageSchema("KINT Intelligence", "/intelligence", description)}
      />
    </>
  );
}

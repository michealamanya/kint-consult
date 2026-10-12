import { notFound } from "next/navigation";
import { industries } from "@/data/site";
import {
  Button,
  ContactCta,
  Container,
  Eyebrow,
  JsonLd,
  PageIntro,
} from "@/components/ui";
import { pageMetadata, pageSchema } from "@/lib/seo";
export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = industries.find((item) => item.slug === slug);
  return item
    ? pageMetadata(
        `${item.title} Technology & Intelligence`,
        item.description,
        `/industries/${slug}`,
      )
    : {};
}
export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = industries.find((item) => item.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageIntro
        label={item.label}
        title={`${item.title}. Connected by better information.`}
        description={item.description}
        crumbs={[
          { label: "Industries", href: "/industries" },
          { label: item.title, href: `/industries/${slug}` },
        ]}
      />
      <section className="content-section">
        <Container className="editorial-split">
          <div>
            <Eyebrow>Sector perspective</Eyebrow>
            <h2>
              Technology with
              <br />
              <em>operational context.</em>
            </h2>
          </div>
          <div className="editorial-body">
            <p>{item.intro}</p>
            <h3>Areas of relevance</h3>
            <ol className="priority-list">
              {item.priorities.map((priority, index) => (
                <li key={priority}>
                  <span>0{index + 1}</span>
                  {priority}
                </li>
              ))}
            </ol>
            <p className="development-note">
              Sector intelligence products are in development. Current
              engagements focus on scoped enterprise technology, data and
              digital transformation needs.
            </p>
          </div>
        </Container>
      </section>
      <section className="feature-band">
        <Container>
          <p>
            Explore the business systems, software, cloud infrastructure and
            data capabilities that can support your organisation.
          </p>
          <Button href="/solutions" variant="secondary">
            Explore solutions
          </Button>
        </Container>
      </section>
      <ContactCta />
      <JsonLd
        data={pageSchema(item.title, `/industries/${slug}`, item.description)}
      />
    </>
  );
}

import { notFound } from "next/navigation";
import { intelligenceAreas } from "@/data/site";
import { Button, Container, Eyebrow, JsonLd, PageIntro } from "@/components/ui";
import { pageMetadata, pageSchema } from "@/lib/seo";
export function generateStaticParams() {
  return intelligenceAreas.map((item) => ({ slug: item.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = intelligenceAreas.find((item) => item.slug === slug);
  return item
    ? pageMetadata(
        `${item.title} — In Development`,
        item.description,
        `/intelligence/${slug}`,
      )
    : {};
}
export default async function IntelligenceAreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = intelligenceAreas.find((item) => item.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageIntro
        label="KINT Intelligence / In development"
        title={item.title}
        description={item.description}
        crumbs={[
          { label: "KINT Intelligence", href: "/intelligence" },
          { label: item.title, href: `/intelligence/${slug}` },
        ]}
      />
      <section className="content-section">
        <Container className="editorial-split">
          <div>
            <Eyebrow>Research direction</Eyebrow>
            <h2>
              Start with a<br />
              <em>useful question.</em>
            </h2>
          </div>
          <div className="editorial-body">
            <p>
              {item.description} This is an intended area within KINT’s
              industrial intelligence development programme.
            </p>
            <h3>Questions this direction explores</h3>
            <ol className="priority-list">
              {item.questions.map((question, index) => (
                <li key={question}>
                  <span>0{index + 1}</span>
                  {question}
                </li>
              ))}
            </ol>
            <div className="development-banner">
              <span className="status-tag">
                <span />
                In development
              </span>
              <p>
                No commercial product, live dataset or subscription is available
                for this area. Features, coverage and delivery arrangements
                remain subject to development.
              </p>
            </div>
            <p>
              The intended foundation combines structured information, source
              attribution and human review. We welcome discussions about the
              sector questions and data requirements that would make this work
              useful.
            </p>
            <Button
              href="/contact?area=Industrial%20intelligence"
              variant="secondary"
            >
              Discuss a research need
            </Button>
          </div>
        </Container>
      </section>
      <JsonLd
        data={pageSchema(
          item.title,
          `/intelligence/${slug}`,
          `${item.description} In development.`,
        )}
      />
    </>
  );
}

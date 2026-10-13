import { notFound } from "next/navigation";
import { insights } from "@/data/insights";
import { company } from "@/data/site";
import {
  Breadcrumbs,
  Button,
  Container,
  Eyebrow,
  JsonLd,
} from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return insights.map((item) => ({ slug: item.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = insights.find((item) => item.slug === slug);
  if (!item) return {};
  const metadata = pageMetadata(
    item.title,
    item.description,
    `/insights/${slug}`,
  );
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" } };
}
export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = insights.find((item) => item.slug === slug);
  if (!item) notFound();
  return (
    <>
      <article>
        <header className="page-intro">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Insights", href: "/insights" },
                { label: item.title, href: `/insights/${slug}` },
              ]}
            />
            <div className="article-header">
              <Eyebrow>{item.category}</Eyebrow>
              <h1>{item.title}</h1>
              <p className="intro-description">{item.description}</p>
              <p className="article-meta">
                KINT perspectives · {item.readTime}
              </p>
            </div>
          </Container>
        </header>
        <div className="content-section">
          <Container>
            <div className="article-body">
              {item.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <div className="article-section-copy">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
              <div className="article-note">
                An explanatory perspective on KINT’s approach. This article
                describes general implementation principles, not a completed
                client engagement.
              </div>
              <div className="mt-8">
                <Button href="/insights" variant="secondary">
                  Back to insights
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.description,
          author: { "@id": `${company.url}/#organization` },
          publisher: { "@id": `${company.url}/#organization` },
          mainEntityOfPage: `${company.url}/insights/${slug}`,
          inLanguage: "en",
          articleSection: item.category,
        }}
      />
    </>
  );
}

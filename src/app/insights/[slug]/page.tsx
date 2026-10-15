import { notFound } from "next/navigation";
import { getPublishedInsights } from "@/data/insights";
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
  return getPublishedInsights().map((item) => ({ slug: item.slug }));
}
export const dynamicParams = true;
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPublishedInsights().find((item) => item.slug === slug);
  if (!item) return {};
  const metadata = pageMetadata(
    item.title,
    item.description,
    `/insights/${slug}`,
  );
  const image = item.image?.startsWith("/images/uploads/")
    ? item.image
    : "/opengraph-image";
  return {
    ...metadata,
    authors: [{ name: item.author }],
    keywords: item.tags,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: item.publishedAt,
      modifiedTime: item.updatedAt || item.publishedAt,
      authors: [item.author],
      section: item.category,
      tags: item.tags,
      images: [{ url: image, alt: item.imageAlt || item.title }],
    },
    twitter: {
      ...metadata.twitter,
      images: [{ url: image, alt: item.imageAlt || item.title }],
    },
  };
}
export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPublishedInsights().find((item) => item.slug === slug);
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
                {item.author} ·{" "}
                <time dateTime={item.publishedAt}>
                  {new Date(item.publishedAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>{" "}
                · {item.readTime}
              </p>
              {item.updatedAt && item.updatedAt !== item.publishedAt && (
                <p className="article-meta">
                  Updated{" "}
                  <time dateTime={item.updatedAt}>
                    {new Date(item.updatedAt).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                </p>
              )}
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
          datePublished: item.publishedAt,
          dateModified: item.updatedAt || item.publishedAt,
          keywords: item.tags.join(", "),
          description: item.description,
          image: new URL(
            item.image?.startsWith("/images/uploads/")
              ? item.image
              : "/opengraph-image",
            company.url,
          ).href,
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

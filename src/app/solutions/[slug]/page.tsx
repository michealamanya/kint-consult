import { notFound } from "next/navigation";
import { company, solutions } from "@/data/site";
import { BrandVisual, type VisualKind } from "@/components/brand-visual";
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
  return solutions.map((item) => ({ slug: item.slug }));
}
export const dynamicParams = false;
const solutionVisuals: Record<string, VisualKind> = {
  "industrial-intelligence": "intelligence",
  "ai-data": "ai",
  "erp-odoo": "odoo",
  "software-platforms": "digital-transformation",
  "cloud-infrastructure": "cloud",
  "automation-reporting": "reporting",
  "cybersecurity-governance": "security",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = solutions.find((item) => item.slug === slug);
  return item
    ? pageMetadata(item.title, item.description, `/solutions/${slug}`)
    : {};
}
export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = solutions.find((item) => item.slug === slug);
  if (!item) notFound();
  const developing = slug === "industrial-intelligence";
  return (
    <>
      <PageIntro
        label={
          developing
            ? "In development / Industrial intelligence"
            : "Solutions / Current service"
        }
        title={item.title}
        description={item.description}
        crumbs={[
          { label: "Solutions", href: "/solutions" },
          { label: item.title, href: `/solutions/${slug}` },
        ]}
      />
      <section className="content-section">
        <Container className="editorial-split">
          <div>
            <Eyebrow>{developing ? "Our direction" : "Our approach"}</Eyebrow>
            <h2>
              {developing
                ? "A connected industrial view."
                : "Start with the business need."}
            </h2>
            <BrandVisual kind={solutionVisuals[slug]} />
          </div>
          <div className="editorial-body">
            <p>{item.intro}</p>
            <h3>{developing ? "Development areas" : "Engagement areas"}</h3>
            <ol className="priority-list">
              {item.priorities.map((priority, index) => (
                <li key={priority}>
                  <span>0{index + 1}</span>
                  {priority}
                </li>
              ))}
            </ol>
            <h3>
              {developing ? "Follow the direction" : "Define a useful scope"}
            </h3>
            <p>
              {developing
                ? "Explore the intended research areas and the principles behind KINT Intelligence."
                : "Every engagement starts with a discussion of requirements, existing systems and the intended outcome. Specific deliverables and support arrangements are agreed as part of the scope."}
            </p>
            <Button
              href={
                developing
                  ? "/intelligence"
                  : `/contact?area=${encodeURIComponent(slug === "erp-odoo" ? "ERP / Odoo" : slug === "ai-data" ? "AI & data" : slug === "cloud-infrastructure" ? "Cloud infrastructure" : slug === "software-platforms" ? "Software development" : slug === "automation-reporting" ? "Automation & reporting" : "Cybersecurity & governance")}`
              }
              variant="secondary"
            >
              {developing
                ? "Explore the direction"
                : "Discuss your requirements"}
            </Button>
          </div>
        </Container>
      </section>
      <ContactCta />
      <JsonLd
        data={pageSchema(item.title, `/solutions/${slug}`, item.description)}
      />
      {!developing && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: item.title,
            description: item.description,
            url: `${company.url}/solutions/${slug}`,
            provider: { "@id": `${company.url}/#organization` },
          }}
        />
      )}
    </>
  );
}

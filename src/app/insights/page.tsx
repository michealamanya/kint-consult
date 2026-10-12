import { Container, JsonLd, PageIntro } from "@/components/ui";
import { InsightList } from "@/components/insight-list";
import { pageMetadata, pageSchema } from "@/lib/seo";
const description =
  "KINT perspectives on industrial data, enterprise systems and practical digital transformation.";
export const metadata = pageMetadata(
  "Insights & Perspectives",
  description,
  "/insights",
);
export default function InsightsPage() {
  return (
    <>
      <PageIntro
        label="Insights"
        title="Thinking grounded in the work."
        description="Perspectives on the systems, information and decisions that shape industrial businesses."
        crumbs={[{ label: "Insights", href: "/insights" }]}
      />
      <section className="content-section">
        <Container>
          <InsightList />
        </Container>
      </section>
      <JsonLd
        data={pageSchema(
          "Insights",
          "/insights",
          description,
          "CollectionPage",
        )}
      />
    </>
  );
}

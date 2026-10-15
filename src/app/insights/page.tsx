import { getPublishedInsights } from "@/data/insights";
import { Container, JsonLd, PageIntro } from "@/components/ui";
import { InsightList } from "@/components/insight-list";
import { pageMetadata, pageSchema } from "@/lib/seo";
const description =
  "KINT perspectives on industrial data, enterprise systems and practical digital transformation.";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const filtered = [params.q, params.category, params.tag].some(
    (value) => typeof value === "string" && value.trim(),
  );
  return {
    ...pageMetadata("Insights & Perspectives", description, "/insights"),
    robots: {
      index: process.env.SITE_ENV !== "staging" && !filtered,
      follow: process.env.SITE_ENV !== "staging",
    },
  };
}
export const dynamic = "force-dynamic";
export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.slice(0, 150) : "";
  const category = typeof params.category === "string" ? params.category : "";
  const tag = typeof params.tag === "string" ? params.tag : "";
  const entries = getPublishedInsights();
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
          <form className="insight-filters" action="/insights" role="search">
            <div>
              <label htmlFor="insight-query">Search insights</label>
              <input
                id="insight-query"
                name="q"
                type="search"
                defaultValue={query}
                maxLength={150}
                placeholder="Topic or keyword"
              />
            </div>
            <div>
              <label htmlFor="insight-category">Category</label>
              <select
                id="insight-category"
                name="category"
                defaultValue={category}
              >
                <option value="">All categories</option>
                {[...new Set(entries.map((item) => item.category))].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label htmlFor="insight-tag">Tag</label>
              <select id="insight-tag" name="tag" defaultValue={tag}>
                <option value="">All tags</option>
                {[...new Set(entries.flatMap((item) => item.tags))]
                  .sort()
                  .map((value) => (
                    <option key={value}>{value}</option>
                  ))}
              </select>
            </div>
            <button className="button button-secondary" type="submit">
              Apply filters
            </button>
            <a href="/insights">Clear filters</a>
          </form>
          <InsightList query={query} category={category} tag={tag} />
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

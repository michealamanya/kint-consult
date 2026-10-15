import { Button, Container, PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Website terms",
  "These terms cover the public KINT Consult Limited corporate website.",
  "/terms",
);
export default function Page() {
  return (
    <>
      <PageIntro
        label="Website terms"
        title="Use this website with context."
        description="These terms cover the public KINT Consult Limited corporate website."
        crumbs={[{ label: "Website terms", href: "/terms" }]}
      />
      <section className="content-section">
        <Container>
          <div className="prose">
            <section>
              <h2>Information and services</h2>
              <p>
                Website material provides general information. It is not legal,
                investment or other regulated professional advice. Project
                scope, fees and deliverables require a separate written
                agreement.
              </p>
            </section>
            <section>
              <h2>Research and availability</h2>
              <p>
                We aim to keep information accurate, but sources and
                circumstances change. Verify decision-critical information with
                the relevant official source or qualified adviser. Products
                marked in development are not offered as live commercial
                services.
              </p>
            </section>
            <section>
              <h2>Content and third parties</h2>
              <p>
                Respect intellectual property and do not misuse the site or
                attempt unauthorised access. External sites are controlled by
                their owners. Ask us before reusing KINT materials beyond
                permissions provided by applicable law.
              </p>
            </section>
            <section>
              <h2>Contact and rights</h2>
              <p>
                Contact admin@kintconsult.com about these terms. Nothing in
                these terms removes rights that cannot lawfully be excluded.
                Contract-specific terms will be agreed for any engagement.
              </p>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}

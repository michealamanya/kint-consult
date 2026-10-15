import { Button, Container, PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Projects",
  "Public project profiles will be added when client approval and supporting evidence are available.",
  "/projects",
);
export default function Page() {
  return (
    <>
      <PageIntro
        label="Projects"
        title="Work with a clear purpose."
        description="Public project profiles will be added when client approval and supporting evidence are available."
        crumbs={[{ label: "Projects", href: "/projects" }]}
      />
      <section className="content-section">
        <Container>
          <div className="prose">
            <section>
              <h2>What a project profile will show</h2>
              <p>
                The challenge, agreed scope, approach and evidenced outcomes,
                with confidential information removed.
              </p>
            </section>
            <section>
              <h2>Discuss your project</h2>
              <p>
                We can scope research, advisory, data and digital delivery
                around a specific business need. Contact us to explore a
                suitable starting point.
              </p>
            </section>
            <Button
              href={"/contact?area=" + encodeURIComponent("General enquiry")}
            >
              Discuss a project
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

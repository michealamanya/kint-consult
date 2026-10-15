import { Button, Container, PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Accessibility",
  "We aim to make KINT usable with keyboards, assistive technology and different screen sizes.",
  "/accessibility",
);
export default function Page() {
  return (
    <>
      <PageIntro
        label="Accessibility"
        title="A website more people can use."
        description="We aim to make KINT usable with keyboards, assistive technology and different screen sizes."
        crumbs={[{ label: "Accessibility", href: "/accessibility" }]}
      />
      <section className="content-section">
        <Container>
          <div className="prose">
            <section>
              <h2>Using the site</h2>
              <p>
                Use the skip link to reach page content, keyboard navigation to
                move between links, and browser zoom to enlarge text. The
                background network animation pauses offscreen and respects
                reduced-motion preferences.
              </p>
            </section>
            <section>
              <h2>Our approach</h2>
              <p>
                We use semantic headings, labelled form controls, visible focus
                and text alternatives for meaningful images. We continue to
                review accessibility; this statement does not claim an
                independent certification.
              </p>
            </section>
            <section>
              <h2>Report a barrier</h2>
              <p>
                Email admin@kintconsult.com or call 0740470116. Tell us which
                page and task caused difficulty and, if helpful, which device or
                assistive technology you use. We can discuss an alternative way
                to provide the information.
              </p>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}

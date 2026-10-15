import { Button, Container, PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Careers",
  "There are no advertised vacancies at present. You can express interest in future research, advisory and digital delivery work.",
  "/careers",
);
export default function Page() {
  return (
    <>
      <PageIntro
        label="Careers"
        title="Bring your perspective."
        description="There are no advertised vacancies at present. You can express interest in future research, advisory and digital delivery work."
        crumbs={[{ label: "Careers", href: "/careers" }]}
      />
      <section className="content-section">
        <Container>
          <div className="prose">
            <section>
              <h2>Expressions of interest</h2>
              <p>
                Tell us about your skills, relevant experience and the type of
                work that interests you. An expression of interest is not an
                application to an advertised role or a promise of employment.
              </p>
            </section>
            <section>
              <h2>Your information</h2>
              <p>
                Use the enquiry form for an introduction. Avoid identity
                documents, bank details and sensitive personal information. We
                will request a CV only if needed and explain how it will be
                handled. See our privacy notice for information requests.
              </p>
            </section>
            <Button
              href={
                "/contact?area=" +
                encodeURIComponent("Careers / expression of interest")
              }
            >
              Express your interest
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

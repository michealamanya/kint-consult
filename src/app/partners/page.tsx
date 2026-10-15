import { Button, Container, PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Partners",
  "We welcome conversations with research organisations, technology teams, industry associations and specialist advisers.",
  "/partners",
);
export default function Page() {
  return (
    <>
      <PageIntro
        label="Partners"
        title="Build useful connections."
        description="We welcome conversations with research organisations, technology teams, industry associations and specialist advisers."
        crumbs={[{ label: "Partners", href: "/partners" }]}
      />
      <section className="content-section">
        <Container>
          <div className="prose">
            <section>
              <h2>Ways to collaborate</h2>
              <p>
                Discuss joint research, complementary delivery expertise,
                knowledge exchange or a clearly scoped industrial initiative.
              </p>
            </section>
            <section>
              <h2>Start with alignment</h2>
              <p>
                Share your organisation, capabilities and the collaboration you
                have in mind. We agree responsibilities, confidentiality and any
                public use of names before starting work.
              </p>
            </section>
            <Button href={"/contact?area=" + encodeURIComponent("Partnership")}>
              Discuss a partnership
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

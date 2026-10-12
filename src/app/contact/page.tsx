import { company } from "@/data/site";
import { ContactForm } from "@/components/contact-form";
import { Container, Eyebrow, JsonLd, PageIntro } from "@/components/ui";
import { pageMetadata, pageSchema } from "@/lib/seo";
import { contactDeliveryReady } from "@/lib/contact";
export const dynamic = "force-dynamic";
const description =
  "Discuss enterprise systems, Odoo, AI and data, cloud infrastructure, software or industrial intelligence research with KINT Consult.";
export const metadata = pageMetadata("Contact KINT", description, "/contact");
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  return (
    <>
      <PageIntro
        label="Contact KINT"
        title="Let’s understand what you need."
        description="Tell us about your organisation, the challenge you are working on and the outcome you want to achieve."
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <section className="content-section">
        <Container className="contact-layout">
          <aside className="contact-aside">
            <Eyebrow>A focused conversation</Eyebrow>
            <h2>
              Start with the
              <br />
              <em>business question.</em>
            </h2>
            <p>
              Whether you need a connected business system, clearer reporting or
              a discussion about industrial research, share a little context so
              the conversation can begin in the right place.
            </p>
            {company.email && (
              <a href={`mailto:${company.email}`}>{company.email}</a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>
                {company.phone}
              </a>
            )}
            {company.address && <p>{company.address}</p>}
            <p className="aside-note">
              KINT Intelligence products are under development. Enquiries about
              this area are discussions of research needs and potential
              collaboration.
            </p>
          </aside>
          <ContactForm
            deliveryReady={contactDeliveryReady()}
            initialArea={typeof area === "string" ? area : ""}
          />
        </Container>
      </section>
      <JsonLd
        data={pageSchema(
          "Contact KINT",
          "/contact",
          description,
          "ContactPage",
        )}
      />
    </>
  );
}

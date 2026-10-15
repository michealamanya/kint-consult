import { company } from "@/data/site";
import { Container, PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Privacy Notice",
  "How the KINT corporate website handles enquiry information and local drafts.",
  "/privacy",
);
export const dynamic = "force-dynamic";
export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        label="Privacy"
        title="A clear approach to your information."
        description="How KINT Consult Limited uses information from this corporate website."
        crumbs={[{ label: "Privacy", href: "/privacy" }]}
      />
      <section className="content-section">
        <Container>
          <div className="prose">
            <h2>Enquiry drafts</h2>
            <p>
              When the form offers “Save enquiry draft”, the information you
              enter is used in your browser to create a text file on your
              device. It is not submitted to KINT. The website does not store
              that draft in browser storage.
            </p>
            <h2>When live delivery is available</h2>
            <p>
              A submitted enquiry includes your name, email address, optional
              phone number, organisation if supplied, area of interest, message,
              privacy acknowledgement, submission reference and submission time.
              KINT uses this information to assess and respond to the enquiry.
            </p>
            <p>
              Enquiries are routed to KINT administration. When Microsoft 365
              delivery is enabled, Microsoft processes the message for KINT. An
              alternative delivery provider may be used only after this notice
              is updated to identify it. Access is limited to people handling
              the enquiry and relevant service providers.
            </p>
            <h2>Spam protection</h2>
            <p>
              Live enquiries use Cloudflare Turnstile. When enabled, its
              verification widget communicates with Cloudflare to assess whether
              a submission is legitimate. See{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Cloudflare’s privacy policy
              </a>{" "}
              for its handling of verification data.
            </p>
            <h2>Website operation</h2>
            <p>
              Hosting and security infrastructure may process IP addresses,
              request times and technical details to serve the website, diagnose
              faults and prevent abuse. Please do not include confidential
              project information in enquiry messages.
            </p>
            <h2>Retention and your choices</h2>
            <p>
              We keep enquiry information for as long as needed to respond,
              manage any resulting business relationship and meet applicable
              record-keeping obligations. You can ask us about retention for
              your enquiry or request access, correction or deletion. Some
              records may need to be retained to meet legal obligations.
            </p>
            <h2>Optional audience measurement</h2>
            <p>
              When configured, Plausible Analytics measures page views and
              accepted enquiries only after you allow measurement through the{" "}
              <a href="/cookies">cookie preferences page</a>. We do not send
              names, email addresses, phone numbers or message contents as
              analytics event properties. You can withdraw permission there at
              any time. Measurement is disabled by default.
            </p>
            <h2>Careers and partnerships</h2>
            <p>
              We use introductions to assess the enquiry and contact you about
              it. We do not automatically enrol you in marketing or promise to
              keep your details for future roles. We will explain any additional
              information we request.
            </p>
            <h2>Service providers and questions</h2>
            <p>
              Some service providers may process information outside Uganda.
              Contact KINT to ask about the providers and safeguards relevant to
              your enquiry, or to raise a concern about information handling.
            </p>
            <h2>Questions about your information</h2>
            <p>
              {company.email ? (
                <>
                  Contact{" "}
                  <a href={`mailto:${company.email}`}>{company.email}</a> with
                  questions about an enquiry or your information.
                </>
              ) : (
                "A verified corporate contact for privacy enquiries will be added before public launch."
              )}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

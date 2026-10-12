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
        description="This notice describes the website’s enquiry workflow. It will be updated when live contact delivery is configured."
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
              A submitted enquiry includes your name, email address,
              organisation if supplied, area of interest, message, privacy
              acknowledgement and submission time. KINT uses this information to
              assess and respond to the enquiry.
            </p>
            <p>
              Live delivery requires a configured receiver and spam protection.
              The receiver’s provider, retention period and relevant contact
              details must be confirmed in this notice before that workflow is
              launched.
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
              This implementation includes no advertising trackers or analytics
              scripts. Hosting infrastructure may process technical request
              information needed to serve and secure the website. The deployment
              operator should confirm any server logging and retention
              arrangements before public launch.
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

import { AnalyticsPreferences } from "@/components/analytics";
import { Container, PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Cookie notice",
  "This website uses no advertising cookies.",
  "/cookies",
);
export default function Page() {
  return (
    <>
      <PageIntro
        label="Cookie notice"
        title="Understand your browser preferences."
        description="This website uses no advertising cookies."
        crumbs={[{ label: "Cookie notice", href: "/cookies" }]}
      />
      <section className="content-section">
        <Container>
          <div className="prose">
            <section>
              <h2>Core website</h2>
              <p>
                The public website does not use cookies to remember enquiry
                drafts. Saving a draft creates a file on your device. Essential
                hosting or security services may use technical storage to
                protect requests.
              </p>
            </section>
            <section>
              <h2>Enquiry security</h2>
              <p>
                When live enquiries are enabled, Cloudflare Turnstile checks
                requests for spam. Its processing is described in the privacy
                notice and Cloudflare’s privacy policy.
              </p>
            </section>
            <section>
              <h2>Editorial access</h2>
              <p>
                The separate editorial system uses authentication storage for
                signed-in staff. It is not required to browse the public
                website.
              </p>
            </section>
            <section>
              <h2>Optional measurement</h2>
              <p>
                Optional audience measurement is disabled unless explicitly
                configured by the operator. The privacy notice must identify any
                enabled provider. You can manage cookies through your browser
                settings.
              </p>
            </section>
            <AnalyticsPreferences />
          </div>
        </Container>
      </section>
    </>
  );
}

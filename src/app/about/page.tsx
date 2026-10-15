import purpose from "../../../content/company.json";
import {
  Button,
  ContactCta,
  Container,
  Eyebrow,
  JsonLd,
  PageIntro,
} from "@/components/ui";
import { pageMetadata, pageSchema } from "@/lib/seo";

const description =
  "KINT Consult connects enterprise technology, data solutions and a developing industrial intelligence direction, with a focus on Uganda and Africa.";
export const metadata = pageMetadata("About KINT", description, "/about");
export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="About KINT"
        title="Industrial understanding. Digital capability."
        description={description}
        crumbs={[{ label: "About", href: "/about" }]}
      />
      <section className="content-section">
        <Container className="editorial-split">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2>
              An advisory and technology company
              <br />
              with an <em>industrial outlook.</em>
            </h2>
          </div>
          <div className="editorial-body">
            <p>
              KINT Consult Limited is developing at the intersection of
              enterprise technology, industrial data and decision support.
            </p>
            <p>
              Our work spans industrial advisory, market and opportunity
              research, business readiness and digital delivery. We help
              organisations organise evidence, plan practical next steps and
              build the systems that support them.
            </p>
            <p>
              Our strategic direction extends beyond implementation. Through
              KINT Intelligence, we are developing a longer-term approach to
              structured industrial information and AI-assisted research.
            </p>
          </div>
        </Container>
      </section>
      <section className="feature-band">
        <Container>
          <h2>
            Practical today.
            <br />
            <em>Purposeful about tomorrow.</em>
          </h2>
          <p>
            Current services support business operations. The intelligence
            programme is a separate development direction, starting with
            petroleum and extending into energy, minerals and petrochemicals.
          </p>
        </Container>
      </section>
      <section className="content-section">
        <Container className="editorial-split">
          <div>
            <Eyebrow>Our direction</Eyebrow>
            <h2>
              Build the systems.
              <br />
              Connect the information.
            </h2>
          </div>
          <div className="editorial-body">
            <p>
              Industrial businesses need reliable systems and a clearer view of
              the environment they operate in.
            </p>
            <p>
              We see these as related needs. Business systems organise internal
              operations; industrial intelligence can help make external
              company, supplier, project and market information more useful.
            </p>
            <p>
              Our direction includes structured datasets, knowledge
              relationships, semantic search and carefully evaluated AI tools.
              These are development ambitions, not a claim that a complete
              platform is available today.
            </p>
            <Button href="/intelligence" variant="secondary">
              Our intelligence direction
            </Button>
          </div>
        </Container>
      </section>
      <section className="content-section">
        <Container className="editorial-split">
          <div>
            <Eyebrow>Our purpose</Eyebrow>
            <h2>Clarity for the next decision.</h2>
          </div>
          <div className="editorial-body">
            <h3>Our mission</h3>
            <p>{purpose.mission}</p>
            <h3>Our vision</h3>
            <p>{purpose.vision}</p>
            <h3>Our values</h3>
            <ul>
              {purpose.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
            <p>
              Our focus starts in Uganda and extends to the wider region. We
              work through discovery, an agreed scope, delivery and review.
            </p>
            <Button href="/partners" variant="secondary">
              Partner with KINT
            </Button>
          </div>
        </Container>
      </section>
      <ContactCta />
      <JsonLd
        data={pageSchema("About KINT", "/about", description, "AboutPage")}
      />
    </>
  );
}

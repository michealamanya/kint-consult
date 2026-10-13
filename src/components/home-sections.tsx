import Image from "next/image";
import Link from "next/link";
import { industries, solutions, intelligenceAreas } from "@/data/site";
import { Arrow, Button, Container, Eyebrow } from "./ui";
import { DataFlow } from "./data-flow";
import { InsightList } from "./insight-list";
import { BrandVisual, ConnectionVisual } from "./brand-visual";

export function Hero() {
  return (
    <section className="hero">
      <Container>
        <div className="hero-layout">
          <div className="hero-copy">
            <Eyebrow>KINT Consult Limited</Eyebrow>
            <h1>
              <span>Industrial intelligence.</span>
              <em>Digital transformation.</em>
            </h1>
            <p>Connected systems. Clearer data. Better industrial decisions.</p>
            <div className="hero-actions">
              <Button href="#what-we-do">Explore KINT</Button>
              <Link href="/contact" className="text-link">
                Work with us
                <Arrow diagonal />
              </Link>
            </div>
            <nav
              className="hero-specialisms"
              aria-label="Explore current solutions"
            >
              <Link href="/solutions/erp-odoo">ERP Systems</Link>
              <Link href="/solutions/ai-data">AI & data</Link>
              <Link href="/solutions/cloud-infrastructure">Cloud systems</Link>
            </nav>
            <div className="hero-footnote">
              <span className="small-cross" aria-hidden="true">
                +
              </span>
              <span>
                Enterprise technology today.
                <br />
                KINT Intelligence is in development.
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <Image
                src="/images/industrial-plant.jpg"
                alt="Pipes, steel structures and processing infrastructure at an industrial facility"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 52vw"
              />
              <div className="image-shade" />
              <div className="image-overline">
                <span>KINT / INDUSTRIAL OUTLOOK</span>
                <span aria-hidden="true">↗</span>
              </div>
              <div className="image-title">
                <span>CONNECTED SYSTEMS.</span>
                <strong>Informed industry.</strong>
              </div>
            </div>
            <div className="image-caption">
              <span>Illustrative industry photography</span>
              <span>Industrial outlook</span>
            </div>
            <div className="visual-coordinate" aria-hidden="true">
              01 — A CONNECTED INDUSTRIAL ECONOMY
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Positioning() {
  return (
    <section className="positioning">
      <Container>
        <div className="positioning-grid">
          <div>
            <Eyebrow>Uganda & the wider African economy</Eyebrow>
            <h2>
              Industry meets
              <br />
              <em>digital capability.</em>
            </h2>
            <p className="positioning-summary">
              We bring your systems and information together.
            </p>
            <Link href="/about" className="text-link">
              Meet KINT
              <Arrow diagonal />
            </Link>
          </div>
          <ConnectionVisual />
        </div>
      </Container>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section className="industries-section">
      <Container>
        <div className="section-heading">
          <div>
            <Eyebrow>Our industrial focus</Eyebrow>
            <h2>
              Built around the
              <br />
              real economy.
            </h2>
          </div>
          <Link href="/industries" className="text-link">
            Explore our sectors
            <Arrow diagonal />
          </Link>
        </div>
        <div className="sector-index">
          {industries.map((item, index) => (
            <Link
              className="sector-item"
              href={`/industries/${item.slug}`}
              key={item.slug}
            >
              <span className="sector-number">0{index + 1}</span>
              <BrandVisual
                kind={
                  item.slug as
                    | "petroleum"
                    | "energy"
                    | "minerals-mining"
                    | "petrochemicals"
                }
              />
              <div>
                <h3>{item.shortTitle || item.title}</h3>
                <p>
                  {
                    [
                      "Operations & supply chains",
                      "Assets & infrastructure",
                      "Resources & logistics",
                      "Processes & materials",
                    ][index]
                  }
                </p>
              </div>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
        <p className="section-note">
          Starting with petroleum. Expanding into connected sectors.
        </p>
      </Container>
    </section>
  );
}

export function SolutionsSection() {
  return (
    <section className="solutions-section" id="what-we-do">
      <Container>
        <div className="solutions-layout">
          <div className="solutions-intro">
            <Eyebrow>What we do / Current services</Eyebrow>
            <h2>
              The systems behind
              <br />
              <em>better operations.</em>
            </h2>
            <p>Technology that fits the way you work.</p>
            <Button href="/solutions" variant="secondary">
              Explore our solutions
            </Button>
            <div className="capability-note">
              <span>IMPLEMENTATION & INTEGRATION</span>
              <p>
                Odoo · Microsoft 365 · Cloud systems
                <br />
                Business automation · Data reporting
              </p>
            </div>
          </div>
          <div className="solution-index">
            {solutions
              .filter((item) => item.slug !== "industrial-intelligence")
              .map((item) => (
                <Link
                  href={`/solutions/${item.slug}`}
                  className="solution-row"
                  key={item.slug}
                >
                  <span>{item.label}</span>
                  <div>
                    <h3>{item.title}</h3>
                  </div>
                  <Arrow diagonal />
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function IntelligenceSection() {
  return (
    <section className="intelligence-section">
      <Container>
        <div className="intelligence-heading">
          <Eyebrow light>The next chapter / KINT Intelligence</Eyebrow>
          <span className="status-tag">
            <span />
            In development
          </span>
        </div>
        <div className="intelligence-layout">
          <div>
            <h2>
              From information
              <br />
              to <em>industrial intelligence.</em>
            </h2>
            <p>
              Companies. Suppliers. Projects. Markets.
              <br />A connected view of the industrial economy.
            </p>
            <Button href="/intelligence" variant="light">
              Explore KINT Intelligence
            </Button>
          </div>
          <div className="intelligence-detail">
            <p>
              Structured industry data. AI-assisted research. Human judgement.
            </p>
            <div className="intelligence-topics">
              {intelligenceAreas.map((area) => (
                <Link href={`/intelligence/${area.slug}`} key={area.slug}>
                  {area.title}
                  <Arrow diagonal />
                </Link>
              ))}
            </div>
            <p className="development-note">
              In development. Not yet commercially available.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function DataSection() {
  return (
    <section className="data-section">
      <Container>
        <div className="section-heading">
          <div>
            <Eyebrow>Our approach</Eyebrow>
            <h2>From data to decisions.</h2>
          </div>
          <p className="heading-description">
            A clear path from source to action.
          </p>
        </div>
        <DataFlow />
        <p className="section-note">
          Our development framework. Traceable sources. Human judgement.
        </p>
      </Container>
    </section>
  );
}

export function CapabilitySection() {
  return (
    <section className="capability-section">
      <Container>
        <div className="section-heading">
          <div>
            <Eyebrow>Digital transformation in practice</Eyebrow>
            <h2>
              Connect the daily work.
              <br />
              Build a clearer view.
            </h2>
          </div>
          <p className="heading-description">Built around your team.</p>
        </div>
        <div className="capability-grid">
          <article>
            <span className="index-label">01 / CONNECT</span>
            <BrandVisual kind="erp" />
            <h3>One connected business.</h3>
            <p>Finance, procurement and inventory in sync.</p>
            <Link href="/solutions/erp-odoo" className="text-link">
              ERP & Odoo
              <Arrow diagonal />
            </Link>
          </article>
          <article>
            <span className="index-label">02 / SEE</span>
            <BrandVisual kind="reporting" />
            <h3>See what matters.</h3>
            <p>Clear dashboards. Less manual reporting.</p>
            <Link href="/solutions/automation-reporting" className="text-link">
              Automation & reporting
              <Arrow diagonal />
            </Link>
          </article>
          <article>
            <span className="index-label">03 / BUILD</span>
            <BrandVisual kind="cloud" />
            <h3>A dependable foundation.</h3>
            <p>Cloud, Microsoft 365 and secure access.</p>
            <Link href="/solutions/cloud-infrastructure" className="text-link">
              Cloud & infrastructure
              <Arrow diagonal />
            </Link>
          </article>
        </div>
      </Container>
    </section>
  );
}

export function InsightsSection() {
  return (
    <section className="insights-section">
      <Container>
        <div className="section-heading">
          <div>
            <Eyebrow>Perspectives from KINT</Eyebrow>
            <h2>
              Ideas with an
              <br />
              <em>operational perspective.</em>
            </h2>
          </div>
          <Link href="/insights" className="text-link">
            All insights
            <Arrow diagonal />
          </Link>
        </div>
        <InsightList />
      </Container>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { industries, solutions, intelligenceAreas } from "@/data/site";
import { Arrow, Button, Container, Eyebrow } from "./ui";
import { DataFlow } from "./data-flow";
import { InsightList } from "./insight-list";

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
            <p>
              We design enterprise systems, software and data solutions that
              improve how industrial businesses operate and make decisions.
            </p>
            <div className="hero-actions">
              <Button href="#what-we-do">Explore KINT</Button>
              <Link href="/contact" className="text-link">
                Work with us
                <Arrow diagonal />
              </Link>
            </div>
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
        <Eyebrow>Our perspective / Uganda & the wider African economy</Eyebrow>
        <div className="positioning-grid">
          <h2>
            Where industry meets
            <br />
            <em>digital capability.</em>
          </h2>
          <div>
            <p>
              Better operations start with dependable systems. Better decisions
              start with information you can use.
            </p>
            <p>
              KINT connects these foundations through enterprise technology,
              data and an industrial focus. We implement practical business
              systems today, while developing a longer-term approach to company,
              supplier, project and market intelligence.
            </p>
            <Link href="/about" className="text-link">
              Meet KINT
              <Arrow diagonal />
            </Link>
          </div>
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
              <div>
                <h3>{item.shortTitle || item.title}</h3>
                <p>{item.description}</p>
              </div>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
        <p className="section-note">
          Petroleum is our initial strategic focus, with energy, minerals and
          petrochemicals forming our wider direction.
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
            <p>
              Practical technology, designed around your business. From
              connected enterprise systems to the infrastructure and data that
              support them.
            </p>
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
                    <p>{item.description}</p>
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
              We are developing a foundation for structured industrial data,
              AI-assisted research and decision support—starting with petroleum
              and expanding into related sectors.
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
              A long-term product direction. These intelligence products are
              under development and are not yet commercially available.
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
            Good intelligence is built in layers.
            <br />
            Each one makes the next more useful.
          </p>
        </div>
        <DataFlow />
        <p className="section-note">
          A framework for our development direction, with traceable sources and
          human judgement at every stage.
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
          <p className="heading-description">
            Practical engagement areas, shaped around your organisation’s
            processes.
          </p>
        </div>
        <div className="capability-grid">
          <article>
            <span className="index-label">01 / CONNECT</span>
            <h3>ERP that follows your process.</h3>
            <p>
              Map finance, procurement and inventory workflows before
              configuring Odoo. Define the data, approvals and reporting each
              team needs.
            </p>
            <Link href="/solutions/erp-odoo" className="text-link">
              ERP & Odoo
              <Arrow diagonal />
            </Link>
          </article>
          <article>
            <span className="index-label">02 / SEE</span>
            <h3>Reporting that supports action.</h3>
            <p>
              Connect reliable data sources, agree on useful measures and make
              exceptions visible to the people responsible for acting on them.
            </p>
            <Link href="/solutions/automation-reporting" className="text-link">
              Automation & reporting
              <Arrow diagonal />
            </Link>
          </article>
          <article>
            <span className="index-label">03 / BUILD</span>
            <h3>Infrastructure teams can rely on.</h3>
            <p>
              Bring cloud systems and Microsoft 365 together with clear access
              controls, backup requirements and documented responsibilities.
            </p>
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

import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbSchema } from "@/lib/seo";
import { company } from "@/data/site";

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`arrow ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container ${className}`}>{children}</div>;
}
export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      {children}
      <Arrow />
    </Link>
  );
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link href="/">Home</Link>
        {items.map((item, index) => (
          <span key={item.href}>
            <span aria-hidden="true">/</span>
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </span>
        ))}
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
export function PageIntro({
  label,
  title,
  description,
  crumbs,
}: {
  label: string;
  title: string;
  description: string;
  crumbs: { label: string; href: string }[];
}) {
  return (
    <section className="page-intro">
      <Container>
        <Breadcrumbs items={crumbs} />
        <Eyebrow>{label}</Eyebrow>
        <h1>{title}</h1>
        <p className="intro-description">{description}</p>
      </Container>
    </section>
  );
}
export function ContactCta() {
  return (
    <section className="contact-cta">
      <Container>
        <div>
          <Eyebrow light>Discuss your next step</Eyebrow>
          <h2>
            A business question.
            <br />
            <em>A practical starting point.</em>
          </h2>
        </div>
        <div className="cta-side">
          <p>
            Tell us what needs to work better.
            <br />
            We’ll explore how technology and data can help.
          </p>
          <Button href="/contact" variant="light">
            Discuss your project
          </Button>
          <div className="cta-contact-links" aria-label="Direct contact">
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>
              {company.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

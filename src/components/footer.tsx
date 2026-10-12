import Link from "next/link";
import Image from "next/image";
import { company, navigation, industries } from "@/data/site";
import { Container, Arrow } from "./ui";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <div className="footer-brand">
            <Link
              href="/"
              className="footer-wordmark"
              aria-label="KINT Consult home"
            >
              <Image
                src="/images/kint-logo.jpg"
                alt="KINT"
                width={120}
                height={80}
                className="footer-logo"
              />
            </Link>
            <p>
              Industry. Technology.
              <br />
              Intelligence.
            </p>
            <span className="footer-focus">
              A focus on Uganda. A wider African outlook.
            </span>
          </div>
          <div>
            <h2>Explore KINT</h2>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Our sectors</h2>
            {industries.map((item) => (
              <Link key={item.slug} href={`/industries/${item.slug}`}>
                {item.title}
              </Link>
            ))}
          </div>
          <div className="footer-connect">
            <h2>Start a conversation</h2>
            <p>
              Enterprise systems, data
              <br />
              and your next stage of growth.
            </p>
            <Link href="/contact">
              Contact KINT
              <Arrow diagonal />
            </Link>
            {company.email && (
              <a href={`mailto:${company.email}`}>{company.email}</a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>
                {company.phone}
              </a>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} KINT Consult Limited</p>
          <span>Industrial intelligence. Digital transformation.</span>
          <Link href="/privacy">Privacy notice</Link>
        </div>
      </Container>
    </footer>
  );
}

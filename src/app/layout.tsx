import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/newsreader";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/ui";
import { company } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "KINT Consult | Industrial Intelligence & Digital Transformation",
    template: "%s | KINT Consult",
  },
  description: company.description,
  applicationName: "KINT Consult",
  // Next.js generates icon metadata from icon.tsx and apple-icon.tsx.
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${company.url}/#organization`,
                name: company.name,
                url: company.url,
                description: company.description,
                logo: `${company.url}/images/kint-logo.jpg`,
                ...(company.email ? { email: company.email } : {}),
                ...(company.phone ? { telephone: company.phone } : {}),
                ...(company.socialLinks.length
                  ? { sameAs: company.socialLinks.map((link) => link.url) }
                  : {}),
              },
              {
                "@type": "WebSite",
                "@id": `${company.url}/#website`,
                name: company.name,
                url: company.url,
                publisher: { "@id": `${company.url}/#organization` },
              },
            ],
          }}
        />
      </body>
    </html>
  );
}

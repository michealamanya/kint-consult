import type { Metadata } from "next";
import { company } from "@/data/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} | KINT Consult` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | KINT Consult`,
      description,
      url: path,
      type: "website",
      siteName: company.name,
      locale: "en_UG",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "KINT Consult — Industrial intelligence. Enterprise technology.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | KINT Consult`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function pageSchema(
  title: string,
  path: string,
  description: string,
  type = "WebPage",
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: `${company.url}${path}`,
    isPartOf: { "@id": `${company.url}/#website` },
    publisher: { "@id": `${company.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "Home", href: "/" }, ...items].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: `${company.url}${item.href}`,
      }),
    ),
  };
}

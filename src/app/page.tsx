import {
  Hero,
  Positioning,
  IndustriesSection,
  SolutionsSection,
  IntelligenceSection,
  DataSection,
  CapabilitySection,
  InsightsSection,
} from "@/components/home-sections";
import { ContactCta, JsonLd } from "@/components/ui";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata(
  "Industrial Intelligence & Digital Transformation",
  "KINT Consult combines enterprise systems, Odoo, AI and data solutions with a developing industrial intelligence direction for Uganda and Africa.",
  "/",
);
export default function Home() {
  return (
    <>
      <Hero />
      <Positioning />
      <IndustriesSection />
      <SolutionsSection />
      <CapabilitySection />
      <IntelligenceSection />
      <DataSection />
      <InsightsSection />
      <ContactCta />
      <JsonLd
        data={pageSchema(
          "KINT Consult",
          "/",
          "Industrial intelligence, enterprise technology and digital transformation.",
        )}
      />
    </>
  );
}

import serviceContent from "../../content/services.json";
export const company = {
  name: "KINT Consult Limited",
  shortName: "KINT",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kintconsult.com",
  description:
    "Industrial advisory, market research and digital solutions for Uganda and the wider African industrial economy.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@kintconsult.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "0740470116",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || null,
  hours: process.env.NEXT_PUBLIC_CONTACT_HOURS || null,
  responseTime: process.env.NEXT_PUBLIC_RESPONSE_TIME || null,
  // TODO: verified registered address, registration number, leadership and social URLs.
  socialLinks: [] as { label: string; url: string }[],
  platformUrl: null as string | null,
};

export const navigation = [
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Solutions", href: "/solutions" },
  { label: "KINT Intelligence", href: "/intelligence" },
  { label: "Insights", href: "/insights" },
];

export const companyNavigation = [
  { label: "Projects", href: "/projects" },
  { label: "Partners", href: "/partners" },
  { label: "Careers", href: "/careers" },
];

export type Topic = {
  slug: string;
  title: string;
  shortTitle?: string;
  label: string;
  description: string;
  intro: string;
  priorities: string[];
  featured?: boolean;
  problem?: string;
  response?: string;
  outcome?: string;
};

export const industries: Topic[] = [
  {
    slug: "petroleum",
    title: "Petroleum",
    label: "01 / Petroleum",
    description:
      "Digital systems and a developing intelligence direction for petroleum operations, suppliers and markets.",
    intro:
      "Petroleum brings together complex projects, regulated operations and extensive supplier networks. KINT’s approach connects practical enterprise technology with a longer-term ambition to make sector information more structured and useful.",
    priorities: [
      "Procurement and supplier information",
      "Project records and operational reporting",
      "Document control and information governance",
      "Developing petroleum market and opportunity intelligence",
    ],
  },
  {
    slug: "energy",
    title: "Energy",
    label: "02 / Energy",
    description:
      "Technology and data foundations for a changing energy economy.",
    intro:
      "Energy organisations need dependable systems to manage assets, coordinate teams and understand performance. KINT brings enterprise systems, reporting and digital infrastructure to these needs, with energy intelligence forming part of our development direction.",
    priorities: [
      "Asset and maintenance information",
      "Business systems and workflow automation",
      "Operational data and management reporting",
      "Developing energy project and market intelligence",
    ],
  },
  {
    slug: "minerals-mining",
    title: "Minerals & mining",
    shortTitle: "Minerals",
    label: "03 / Minerals & mining",
    description:
      "Better connected information across mineral operations and their supply chains.",
    intro:
      "Mineral businesses work across exploration, production, logistics and commercial relationships. Reliable records and connected workflows provide the foundation for better visibility across that value chain.",
    priorities: [
      "Inventory and procurement workflows",
      "Operational records and reporting",
      "Supplier and logistics information",
      "Developing mineral and commodity intelligence",
    ],
  },
  {
    slug: "petrochemicals",
    title: "Petrochemicals",
    label: "04 / Petrochemicals",
    description:
      "Enterprise technology for interconnected industrial processes and supply chains.",
    intro:
      "Petrochemical operations depend on coordinated material flows, disciplined information management and clear commercial visibility. KINT’s technology direction focuses on the systems and data that support those requirements.",
    priorities: [
      "Material and inventory visibility",
      "Enterprise process integration",
      "Reporting and information governance",
      "Developing supply-chain and market intelligence",
    ],
  },
];

export const solutions: Topic[] = serviceContent.entries;

export const intelligenceAreas = [
  {
    slug: "supplier",
    title: "Supplier intelligence",
    description:
      "A structured view of industrial suppliers, their capabilities and relationships.",
    questions: [
      "Which suppliers are relevant to a defined requirement?",
      "What evidence supports a supplier’s stated capabilities?",
    ],
  },
  {
    slug: "opportunity",
    title: "Opportunity intelligence",
    description:
      "A direction for discovering and organising relevant tenders and commercial opportunities.",
    questions: [
      "Which opportunities fit a company’s capabilities?",
      "What deadlines, requirements and sources need to be tracked?",
    ],
  },
  {
    slug: "market",
    title: "Market intelligence",
    description:
      "Connected industrial information to support market research and commercial understanding.",
    questions: [
      "What developments are shaping a sector?",
      "How can evidence from different sources be compared?",
    ],
  },
  {
    slug: "project",
    title: "Project intelligence",
    description:
      "An approach to connecting projects, participants, milestones and supply-chain needs.",
    questions: [
      "Who is involved in an industrial project?",
      "What is the documented project stage and information source?",
    ],
  },
  {
    slug: "commodity",
    title: "Commodity intelligence",
    description:
      "A planned research direction for commodity information and industrial market context.",
    questions: [
      "Which commodity developments matter to a business?",
      "How can market observations be placed in their operational context?",
    ],
  },
  {
    slug: "regulatory",
    title: "Regulatory intelligence",
    description:
      "A planned way to organise regulatory sources and changes relevant to industrial businesses.",
    questions: [
      "Which official sources apply to a sector?",
      "What changes require qualified review and business attention?",
    ],
  },
];

export const enquiryAreas = [
  "Business & industrial advisory",
  "Market & opportunity intelligence",
  "Supplier & investor readiness",
  "Local content & compliance support",
  "Feasibility & research",
  "Data & registry services",
  "Partnership",
  "Careers / expression of interest",
  "Digital transformation",
  "ERP / Odoo",
  "AI & data",
  "Cloud infrastructure",
  "Software development",
  "Automation & reporting",
  "Cybersecurity & governance",
  "Industrial intelligence",
  "General enquiry",
];

// TODO: add verified case studies and approved vacancies before exposing routes.
export const caseStudies: never[] = [];
export const careers: never[] = [];

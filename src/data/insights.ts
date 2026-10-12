export const insights = [
  {
    slug: "data-foundations-industrial-intelligence",
    category: "Industrial intelligence",
    title: "Intelligence starts with the quality of the data.",
    description:
      "Why structured information, provenance and context come before industrial AI.",
    readTime: "4 min read",
    image: "diagram",
    sections: [
      {
        heading: "Start with an answerable question",
        paragraphs: [
          "Industrial information is scattered across company records, procurement documents, official notices and operational systems. Collecting more of it does not automatically improve a decision. The first step is to define the question: identify a supplier, understand a project, or compare developments in a market.",
          "A useful dataset has a purpose. Its fields, sources and update process should reflect the decision it is expected to support.",
        ],
      },
      {
        heading: "Structure provides context",
        paragraphs: [
          "Names vary, documents become outdated and the same organisation may appear in several sources. Consistent identifiers, explicit relationships and documented dates help distinguish a company from a project, a claim from evidence, and a current record from an old one.",
          "Provenance matters as much as completeness. Researchers should be able to trace an observation to its source and understand how confidently it can be used.",
        ],
      },
      {
        heading: "AI needs boundaries",
        paragraphs: [
          "Search and AI-assisted analysis can make structured information easier to navigate. Their outputs still need source attribution, evaluation and qualified human review. A convincing answer is not a substitute for verifiable evidence.",
          "This is the foundation behind KINT’s developing industrial intelligence direction: organise the information, preserve its context and build decision-support tools on top. The platform capabilities described on this website remain in development.",
        ],
      },
    ],
  },
  {
    slug: "erp-implementation-process-first",
    category: "Enterprise systems",
    title: "Before the ERP, understand the process.",
    description:
      "A practical starting point for Odoo and enterprise systems implementation.",
    readTime: "3 min read",
    image: "grid",
    sections: [
      {
        heading: "Map the work that actually happens",
        paragraphs: [
          "An ERP implementation affects how people purchase, sell, manage inventory and report. Start by understanding current responsibilities, handoffs and exceptions. A process diagram that reflects daily work is more useful than a list of desired software features.",
          "For an Odoo engagement, discovery should identify the required workflows, the data each team owns and the approvals that keep the business under control.",
        ],
      },
      {
        heading: "Treat migration as a business task",
        paragraphs: [
          "Existing records need to be reviewed before they are moved. Agree on ownership of customer, supplier, product and financial data. Define how duplicates, incomplete fields and historical balances will be handled.",
          "Reconcile migrated records with the source and test the transactions that matter. Technical import success alone does not establish that the new system represents the business correctly.",
        ],
      },
      {
        heading: "Plan for adoption",
        paragraphs: [
          "Training, a phased rollout and a clear support process make the implementation usable. Give teams enough time to practise representative tasks and report gaps before the system becomes their daily workspace.",
          "The goal is a dependable operating process supported by software. That requires explicit scope, accountable owners and acceptance criteria that the business can assess.",
        ],
      },
    ],
  },
  {
    slug: "operational-visibility-reporting",
    category: "Digital transformation",
    title: "A dashboard is only as useful as the decisions it supports.",
    description:
      "Connecting operational reporting to responsibility, action and reliable sources.",
    readTime: "3 min read",
    image: "lines",
    sections: [
      {
        heading: "Define the decision before the metric",
        paragraphs: [
          "Reporting often begins with available data. A better starting point is the decision: what needs attention, who can act and how frequently should the information be reviewed? These questions determine which measures belong on a dashboard.",
          "A procurement report, for example, may need to expose late approvals or missing documents. A total spend figure alone may not tell the responsible team what to do next.",
        ],
      },
      {
        heading: "Make definitions visible",
        paragraphs: [
          "Agree on how each measure is calculated, which source it uses and when it refreshes. Different definitions of the same term can create apparently contradictory reports and weaken confidence in the system.",
          "Show relevant time periods and data limitations. Users should be able to distinguish a current operational view from a historical or incomplete one.",
        ],
      },
      {
        heading: "Connect visibility to action",
        paragraphs: [
          "Reporting becomes valuable when someone is responsible for reviewing exceptions and following through. Build that ownership into the workflow, alongside the technical integration.",
          "Start with a small set of decision-relevant measures, establish their reliability and expand only when the next measure supports a clear business need.",
        ],
      },
    ],
  },
];

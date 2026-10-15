import { NextResponse } from "next/server";
import { company } from "@/data/site";

export const dynamic = "force-dynamic";
export async function GET() {
  const repo = process.env.CMS_GITHUB_REPO || "";
  let auth: URL;
  try {
    auth = new URL(process.env.CMS_AUTH_URL || "");
  } catch {
    return new NextResponse(null, { status: 503 });
  }
  if (
    !/^[\w.-]+\/[\w.-]+$/.test(repo) ||
    auth.protocol !== "https:" ||
    auth.username ||
    auth.password ||
    auth.search ||
    auth.hash
  )
    return new NextResponse(null, { status: 503 });
  const text = (name: string, label: string, extra = {}) => ({
    name,
    label,
    widget: "string",
    ...extra,
  });
  const articleFields = [
    text("slug", "URL slug", {
      pattern: [
        "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        "Use lowercase words separated by hyphens",
      ],
    }),
    text("title", "Title"),
    text("description", "Search and card description"),
    text("category", "Category"),
    { name: "tags", label: "Tags", widget: "list" },
    text("author", "Author", { default: "KINT Consult" }),
    {
      name: "status",
      label: "Publication state",
      widget: "select",
      options: ["draft", "scheduled", "published"],
      default: "draft",
      hint: "Draft hides an article. Scheduled articles appear after the publication time once their approved change has been deployed.",
    },
    {
      name: "publishedAt",
      label: "Publication time (UTC)",
      widget: "datetime",
      format: "YYYY-MM-DDTHH:mm:ss[Z]",
      picker_utc: true,
    },
    {
      name: "updatedAt",
      label: "Last substantive update (UTC)",
      widget: "datetime",
      format: "YYYY-MM-DDTHH:mm:ss[Z]",
      picker_utc: true,
    },
    text("readTime", "Reading time", { default: "3 min read" }),
    {
      name: "image",
      label: "Cover image",
      widget: "image",
      required: false,
      allow_multiple: false,
      hint: "JPEG, PNG, WebP or AVIF. Maximum 2 MB. Remove private metadata before upload.",
    },
    text("imageAlt", "Cover image description", {
      required: false,
      hint: "Required when a cover image is provided.",
    }),
    {
      name: "sections",
      label: "Article sections",
      widget: "list",
      fields: [
        text("heading", "Heading"),
        {
          name: "paragraphs",
          label: "Paragraphs",
          widget: "list",
          field: { name: "paragraph", label: "Paragraph", widget: "text" },
        },
      ],
    },
  ];
  return NextResponse.json(
    {
      load_config_file: false,
      backend: {
        name: "github",
        repo,
        branch: process.env.CMS_BRANCH || "main",
        base_url: auth.origin,
        auth_endpoint: auth.pathname.replace(/^\//, "") || "auth",
      },
      site_url: company.url,
      display_url: company.url,
      publish_mode: "editorial_workflow",
      media_folder: "public/images/uploads",
      public_folder: "/images/uploads",
      collections: [
        {
          name: "company",
          label: "Company purpose",
          files: [
            {
              name: "purpose",
              label: "Mission, vision and values",
              file: "content/company.json",
              fields: [
                { name: "mission", label: "Mission", widget: "text" },
                { name: "vision", label: "Vision", widget: "text" },
                { name: "values", label: "Values", widget: "list" },
              ],
            },
          ],
        },
        {
          name: "services",
          label: "Service catalogue",
          files: [
            {
              name: "catalogue",
              label: "Services",
              file: "content/services.json",
              fields: [
                {
                  name: "entries",
                  label: "Services",
                  widget: "list",
                  summary: "{{fields.title}}",
                  fields: [
                    text("slug", "URL slug", {
                      pattern: [
                        "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                        "Use lowercase words and hyphens",
                      ],
                      hint: "Keep existing slugs to preserve incoming links.",
                    }),
                    text("title", "Title"),
                    text("label", "Index label"),
                    {
                      name: "featured",
                      label: "Feature on homepage",
                      widget: "boolean",
                      default: false,
                      required: false,
                    },
                    ...[
                      "description",
                      "intro",
                      "problem",
                      "response",
                      "outcome",
                    ].map((name) => ({
                      name,
                      label: name[0].toUpperCase() + name.slice(1),
                      widget: "text",
                      required: !["problem", "response", "outcome"].includes(
                        name,
                      ),
                    })),
                    {
                      name: "priorities",
                      label: "Engagement areas",
                      widget: "list",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "insights",
          label: "Insights",
          files: [
            {
              name: "articles",
              label: "Articles",
              file: "content/insights.json",
              fields: [
                {
                  name: "entries",
                  label: "Articles",
                  widget: "list",
                  summary: "{{fields.title}} · {{fields.status}}",
                  fields: articleFields,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}

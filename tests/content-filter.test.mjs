import { test } from "node:test";
import assert from "node:assert/strict";
import { publishedEntries } from "../src/lib/content-filter.mjs";
test("public lists exclude drafts and future content and release scheduled articles at their time", () => {
  const entries = [
    { slug: "draft", status: "draft", publishedAt: "2026-01-01" },
    { slug: "live", status: "published", publishedAt: "2026-01-02" },
    { slug: "scheduled", status: "scheduled", publishedAt: "2026-11-01" },
    { slug: "future", status: "published", publishedAt: "2027-01-01" },
    { slug: "invalid", status: "published", publishedAt: "invalid" },
  ];
  assert.deepEqual(
    publishedEntries(entries, Date.parse("2026-10-15")).map((x) => x.slug),
    ["live"],
  );
  assert.deepEqual(
    publishedEntries(entries, Date.parse("2026-11-02")).map((x) => x.slug),
    ["scheduled", "live"],
  );
});

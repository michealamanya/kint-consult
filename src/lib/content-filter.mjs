/** Drafts and future-dated entries must never be exposed by public queries. */
export function publishedEntries(entries, now = Date.now()) {
  return entries
    .filter((entry) => {
      const date = Date.parse(entry.publishedAt);
      return (
        (entry.status === "published" || entry.status === "scheduled") &&
        Number.isFinite(date) &&
        date <= now
      );
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

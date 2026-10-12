import "server-only";

export function contactDeliveryReady() {
  try {
    const url = new URL(process.env.CONTACT_WEBHOOK_URL || "");
    return (
      url.protocol === "https:" &&
      Boolean(process.env.CONTACT_WEBHOOK_TOKEN) &&
      (process.env.NODE_ENV !== "production" ||
        Boolean(
          process.env.TURNSTILE_SECRET_KEY &&
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        ))
    );
  } catch {
    return false;
  }
}

// Per-process protection for a single-instance deployment. The reverse proxy
// must also apply a shared IP rate limit; see deploy/nginx.conf.example.
const buckets = new Map<string, { count: number; expires: number }>();
export function allowEnquiry(key: string, now = Date.now()) {
  for (const [key, value] of buckets) {
    if (value.expires <= now) buckets.delete(key);
  }
  const bucket = buckets.get(key);
  if (bucket && bucket.count >= 3) return false;
  if (!bucket && buckets.size >= 1000) return false;
  buckets.set(key, {
    count: (bucket?.count || 0) + 1,
    expires: bucket?.expires || now + 15 * 60 * 1000,
  });
  return true;
}

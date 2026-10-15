import type { NextConfig } from "next";

const config: NextConfig = {
  // Keep production rebuilds from replacing a running dev server's output.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/admin", destination: "/admin/index.html", permanent: false },
    ];
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV === "development";
    let cmsAuthOrigin = "";
    try {
      const url = new URL(process.env.CMS_AUTH_URL || "");
      if (url.protocol === "https:") cmsAuthOrigin = url.origin;
    } catch {}
    let analyticsOrigin = "";
    try {
      const url = new URL(process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL || "");
      if (url.protocol === "https:") analyticsOrigin = url.origin;
    } catch {}
    const contentSecurityPolicy = [
      "default-src 'self'",
      // React's development debugger needs eval; never allow it in production.
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com ${analyticsOrigin}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      // WebSocket connections support local hot module replacement.
      `connect-src 'self'${isDevelopment ? " ws: wss:" : ""} https://challenges.cloudflare.com ${analyticsOrigin}`,
      "frame-src https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
    return [
      {
        source: "/(.*)",
        headers: [
          ...(process.env.SITE_ENV === "staging"
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
              `connect-src 'self' https://api.github.com https://raw.githubusercontent.com ${cmsAuthOrigin}`,
              "font-src 'self' data:",
              "frame-src 'self' blob:",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
export default config;

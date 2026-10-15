# KINT Consult website

First implementation of KINT’s corporate website: Next.js App Router, TypeScript, Tailwind CSS, self-hosted Manrope and Newsreader fonts, and a restrained editorial design. The repository was initially empty; see [the audit and plan](docs/IMPLEMENTATION.md).

## Local development

Node 20.9+ (Node 22 LTS recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. On Windows, use `Copy-Item .env.example .env.local` and `npm.cmd` if PowerShell blocks npm scripts.

## Validation

```sh
npm test
npm run typecheck
npm run build
npm start
npm run test:browser
```

Browser tests use installed Chrome by default, or `QA_BROWSER=msedge`. They expect a production server at localhost:3000 and draft contact mode. Set `QA_BASE_URL` to change the address. Screenshots and failure traces are written to ignored `.qa/`. Browser coverage includes mobile navigation, accessibility with axe, narrow-screen overflow, contact drafts, all sitemap routes and contact API rejection paths. Run Lighthouse against a production build separately; no scores are assumed.

## Content and configuration

- `src/data/site.ts`: company configuration, navigation, industries, services, intelligence areas, enquiry topics and deferred content collections.
- `src/data/insights.ts`: original explanatory perspectives; approve editorial copy before publication.
- `src/components`: shared layout, homepage sections, diagram and form.
- `src/app`: core pages, generated topic routes, SEO and server contact endpoint.
- `src/app/globals.css`: shared typography, spacing, responsive layouts and Tailwind utilities.
- `src/app/clay.css`: the site-wide claymorphism theme, loaded after the foundation. Logo-led gold, warm ivory and charcoal surfaces, inset and raised shadows, sculpted navigation, panels and controls apply across the core and detail pages. Reduced-motion settings also remove hover movement.
- `src/components/neural-background.tsx` and `src/app/hero-motion.css`: the live canvas network, CSS gradient fallback and rounded translucent navigation. Rendering is capped at 30fps with bounded resolution/node counts; it loops while visible, pauses offscreen/in hidden tabs and respects reduced-motion preferences. There is no visible animation control. A blurred ivory header panel keeps navigation readable. The hero follows its content height rather than filling the screen.
- `src/components/brand-visual.tsx` and `src/app/visuals.css`: user-supplied sector photos and lightweight SVG service icons, shared across the homepage and listing pages. Sector WebPs and dimensions are in `public/images/sectors/` and `src/data/sector-images.ts`. No AI-generated image assets remain.
- `src/app/responsive.css`: fluid presentation for large and ultrawide screens. Shared containers use the available viewport width; spacing, typography and graphics scale above 1440px. Mobile/tablet breakpoints still reflow the navigation and grids, with fluid, two-column article sections that stack on mobile.
- `src/app/typography.css`: readable type scale loaded after the clay theme. Ordinary copy is 18px desktop / 17px mobile at the default browser root size; navigation and controls use 16px, substantive supporting labels use 14px or larger, and reading weight is 450. The menu collapses at 1100px rather than shrinking its text; narrow content stacks for comfortable reading.

The current contact details supplied by KINT are `admin@kintconsult.com` and `0740470116`. Public environment settings can override them. Addresses, leadership, social URLs, clients, case studies and vacancies remain unpopulated until confirmed. The website and contact email use `kintconsult.com`. The geographic copy describes strategic focus; it does not assert a registered office or delivered client work. Shared header/footer branding uses the supplied logo retained in `public/images/kint-logo.jpg`. Browser and Apple touch icons render the actual gold symbol from that source image, preserving its appearance and cropping away the small wordmark for legibility.

Current services and developing intelligence products are explicitly distinguished. No authenticated application, live intelligence dataset or subscription is implied. A future platform URL is reserved in company config but is not linked before a real destination exists. Projects and careers have safe empty states; partners has a dedicated invitation page. Leadership profiles remain withheld until verified details and permissions are supplied.

## Enquiry delivery

Default mode creates a local text draft and does not transmit personal information. Configure Microsoft 365 Graph credentials (or a server-only HTTPS `CONTACT_WEBHOOK_URL` and bearer `CONTACT_WEBHOOK_TOKEN`) to enable delivery. See [activation and operations](deploy/OPERATIONS.md). Production also requires both Turnstile keys. The receiver must durably accept the JSON enquiry before replying with 2xx. Do not use a webhook that acknowledges before queuing or saving the request.

The server checks origin, content type, payload size, field lengths, allowed topics, privacy acknowledgement, honeypot, an in-memory per-email throttle and production Turnstile verification. It times out upstream calls and does not log enquiry content or credentials. Configure a reverse-proxy IP throttle as well. Multiple application replicas need shared rate-limit storage. Review receiver access, retention, privacy wording and real delivery end-to-end before enabling the form publicly. Receiver timeouts can mean delivery is uncertain; the interface reports uncertainty and retains the form.

Public environment variables are compiled into the browser bundle; set them before building and rebuild when changed. Secrets stay server-only and must be supplied at runtime. Never commit `.env.local`.

## Linux / Hetzner deployment

Follow [the Nginx hosting guide](deploy/HOSTING.md). Use your existing Nginx installation to proxy HTTPS requests to the standalone Node application on `127.0.0.1:3000`. The supplied `deploy/kint-consult.service` runs it under systemd with automatic restart and boot startup.

Upload the source to the server, configure `.env.production`, then run `npm ci` and `npm run build` there. Install the service unit, adapt the domain's Nginx configuration, validate with `nginx -t` and reload Nginx. Docker Compose is available as an alternative application runner.

Set the final public URL before building. The website can run with email/telephone contact and local draft enquiries; live form delivery needs a configured mail transport and Turnstile settings described above.

## Public launch review

See [the Phase 1 requirements review](docs/REQUIREMENTS-REVIEW.md) for the supplied Version 1.0 brief. The application now includes advisory services, required supporting pages, editable insights/services/company purpose, filtering, Microsoft 365 transport, references, analytics preferences and operational checks. Mail credentials, editorial authentication/permissions, company policy approval and real server acceptance still need configuration and evidence. A successful build or hosting configuration does not establish launch acceptance.

Confirm corporate details, brand treatment, article approval, photograph rights/suitability and privacy/retention arrangements. Validate canonical domain, sitemap, HTTPS, receiver delivery, mobile layouts, keyboard navigation and deployed performance. The source includes security headers; CSP permits Next.js inline bootstrap scripts and the optional Turnstile widget. Consider a nonce-based policy if stricter CSP is required. Docker and Nginx examples are deployment foundations, not a claim of a verified live deployment.

## Staff publishing and existing-host activation

Use `/admin` for the configured Decap editor. Without a repository and OAuth endpoint it explains that setup is pending. Run `npm run content:check` before every release. Draft/scheduled visibility is evaluated by the public site. See [the operations guide](deploy/OPERATIONS.md) for editorial review, Microsoft 365, privacy preferences, staging, monitoring, backups and handover. GitHub Actions verifies changes and can package a Linux standalone release; it does not automatically upload to your existing server.

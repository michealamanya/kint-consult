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
- `src/app/globals.css`: colour, typography, spacing and responsive design system with Tailwind utilities.

The current contact details supplied by KINT are `admin@kintconsult.com` and `0740470116`. Public environment settings can override them. Addresses, leadership, social URLs, clients, case studies and vacancies remain unpopulated until confirmed. The email domain is independent of the website domain specified in the original brief (`kintconsults.com`). The geographic copy describes strategic focus; it does not assert a registered office or delivered client work. Shared header/footer branding uses the supplied `icon.jpg`, copied unchanged into `public/images/kint-logo.jpg`. Browser and Apple touch icons render the actual gold symbol from that source image, preserving its appearance and cropping away the small wordmark for legibility.

Current services and developing intelligence products are explicitly distinguished. No authenticated application, live intelligence dataset or subscription is implied. A future platform URL is reserved in company config but is not linked before a real destination exists. Projects, careers and leadership routes should be added when approved content is available.

## Enquiry delivery

Default mode creates a local text draft and does not transmit personal information. Configure a server-only HTTPS `CONTACT_WEBHOOK_URL` and bearer `CONTACT_WEBHOOK_TOKEN` to enable delivery. Production also requires both Turnstile keys. The receiver must durably accept the JSON enquiry before replying with 2xx. Do not use a webhook that acknowledges before queuing or saving the request.

The server checks origin, content type, payload size, field lengths, allowed topics, privacy acknowledgement, honeypot, an in-memory per-email throttle and production Turnstile verification. It times out upstream calls and does not log enquiry content or credentials. Configure a reverse-proxy IP throttle as well. Multiple application replicas need shared rate-limit storage. Review receiver access, retention, privacy wording and real delivery end-to-end before enabling the form publicly. Receiver timeouts can mean delivery is uncertain; the interface reports uncertainty and retains the form.

Public environment variables are compiled into the browser bundle; set them before building and rebuild when changed. Secrets stay server-only and must be supplied at runtime. Never commit `.env.local`.

## Linux / Hetzner deployment

The application produces Next.js standalone output. Serve it behind an HTTPS reverse proxy. A Dockerfile and Nginx example are included; adapt domain, certificates and operational controls to your server.

```sh
docker build -t kint-consult .
docker run -d --name kint-consult --restart unless-stopped \
  -p 127.0.0.1:3000:3000 --env-file .env.production kint-consult
```

Supply verified public settings as Docker build arguments. Supply only server settings at runtime; keep secret env files on the deployment host, outside the repository. Alternatively, copy `.next/standalone`, `.next/static` and `public` to the server and run `node server.js` under a process manager.

## Public launch review

Confirm corporate details, brand treatment, article approval, photograph rights/suitability and privacy/retention arrangements. Validate canonical domain, sitemap, HTTPS, receiver delivery, mobile layouts, keyboard navigation and deployed performance. The source includes security headers; CSP permits Next.js inline bootstrap scripts and the optional Turnstile widget. Consider a nonce-based policy if stricter CSP is required. Docker and Nginx examples are deployment foundations, not a claim of a verified live deployment.

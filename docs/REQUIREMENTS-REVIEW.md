# Phase 1 requirements review

Updated 15 October 2026 against the supplied KINT CONSULT LIMITED Website Requirements Document, Proposed Version 1.0.

The user confirms the website is already hosted. This workspace contains application updates for that existing deployment. It has not connected to, modified or verified the production server. Overall acceptance remains partial until external setup and owner checks are evidenced.

## Application coverage

| Requirement | Implemented in this workspace | Remaining activation or acceptance |
| --- | --- | --- |
| Home / About / Services | Advisory and market intelligence positioning, six advisory/readiness/research/data offerings, existing digital services, challenge/response/outcome sections, mission/vision/values and project/partnership links. Existing brand and responsive design preserved. | Owner confirmation of purpose/service wording; verified company details and approved leadership information. |
| Projects / Partners / Careers | Dedicated routes with safe project/vacancy empty states and partnership/expression-of-interest enquiry paths. | Publish actual projects, names, logos or jobs only with evidence and permission. |
| Contact / legal | Actual supplied email and phone, optional address/hours/response settings; privacy, cookies/preferences, terms and accessibility routes. | Confirm address, hours, response ownership/target, retention/provider details and legal wording. No legal-compliance certification is implied. |
| FR-01?04 | Navigation/footer, responsive pages, visible focus, next actions, branded 404 and supporting routes. | Real device/browser acceptance remains. |
| FR-05 | Name, email, optional phone/organisation, enquiry type/message and privacy acknowledgement with shared server validation. | Approve data collection scope and public wording. |
| FR-06 | Server-side Microsoft Graph application transport to the configured Microsoft 365 mailbox, plus existing HTTPS webhook alternative. | Tenant/app credentials, scoped send permission, Turnstile keys and actual receipt/reply-to evidence. No test email has been sent. |
| FR-07 | UUID submission reference, timeouts, honeypot, field/body/origin checks, rate limiting, Turnstile integration and uncertainty feedback. | Host-level rate limit and end-to-end mail/spam/failure checks. Graph acceptance is not final mailbox delivery. |
| FR-08 | Server-only transport credentials; no enquiry database or credential exposure by design. | Runtime secrets/access audit on the host. |
| FR-09 | Decap editor configuration for insights, service catalogue and company purpose; editorial drafts/review, content preview, schedule/publish/hide states. Public insights filter drafts/future dates. | GitHub repository/OAuth service and deployed editorial exercise. Exact design previews need staging. Unpublish/edit changes require a build/deploy; already deployed future entries release at their UTC time. Other fixed page copy still uses source files. |
| FR-10 | Repository-based administrator/editor/reviewer responsibilities documented. | Strict three-role in-CMS access is not implemented by Decap GitHub backend: readers review in GitHub, editors need push permission. Choose/configure an identity/provider solution if a read-only CMS role is mandatory. |
| FR-11 | Source-controlled content, editorial pull requests, Git revision/revert procedure. | Configure protected branches, reviewers and MFA; demonstrate audit and restore. |
| FR-12 | CMS cover image/alt fields, Next image optimisation, validation of metadata, safe paths, unique slugs, upload format/signature and size. | Owner image-rights review, pre-upload metadata stripping/compression and real upload exercise. No automatic stripping or malware-scanning service is claimed. |
| FR-13 | Public keyword search, category and tag filters, clear/reset and empty results. | Launch content review. |
| FR-14 | Existing SEO/canonical/sharing metadata retained; article publication/update dates, tags and ownership added. | Verify deployed metadata and approved article dates. Migration dates identify the initial editorial baseline. |
| FR-15 | Optional Plausible loader, device preference controls and successful-enquiry event without form properties; disabled by default and until visitor opt-in. | Provider URL/terms, approved policy and live dashboard/conversion checks. |
| FR-16 | Sitemap includes new routes and only visible articles; robots excludes API/admin; search verification setting; staging noindex headers/metadata/robots. | Configure verification and staging access restrictions, submit production sitemap. |

## Security and operation

Production CSP stays separate from admin-only editor origins. No production unsafe-eval is introduced. At the user's request, the homepage network loops continuously while visible, pauses offscreen/in hidden tabs and honours reduced-motion preferences. There is no visible animation control. Continuous motion should be included in the outstanding manual accessibility review; automated scans do not certify that interaction.

GitHub Actions now verifies builds/content/tests/browser flows, offers a manual Linux release package and schedules dependency updates. Automatic server deployment is not connected. The existing Nginx/systemd/Docker hosting foundation is retained. `/api/health` checks application availability without exposing secrets.

[OPERATIONS.md](../deploy/OPERATIONS.md) provides mailbox/CMS activation, permissions, staging, release/rollback, incident response, monitoring and backup/restore procedures with weekly/monthly/quarterly/annual responsibilities. Named owners, credentials, encrypted backup storage/keys, actual restore drills, host logs/patching, monitoring alerts, DNS/TLS/Cloudflare controls and production uptime evidence require the server operator. Documentation is not evidence those controls are running.

## Acceptance gates

| Gate | Status |
| --- | --- |
| AC-01 Pages and content | Implemented public structure; owner content and corporate detail approval pending. |
| AC-02 Links/forms/browser usability | Local unit/browser/build verification is recorded in VERIFICATION.md; external integrations require live tests. |
| AC-03 Delivered enquiries | Pending Microsoft 365 configuration and receipt evidence. |
| AC-04 HTTPS/DNS/Cloudflare | Existing hosting confirmed by user; configuration not independently verified. |
| AC-05 Sensitive/development content | No confidential registry, paid portal or published fabricated client data; deployed-origin and asset review pending. |
| AC-06 Admin/MFA/backups/monitoring | Setup and procedures supplied; activation, strict CMS-role decision and recovery evidence pending. |
| AC-07 Accessibility | Automated checks supplement manual keyboard, zoom, assistive-technology and device review; no certification claim. |
| AC-08 SEO/sharing | Local audit passed for all 40 canonical pages; mobile Lighthouse SEO 100. Production Search Console verification/submission pending. |
| AC-09 Performance | Local simulated-mobile Lighthouse 88 after animation optimization; deployed-host measurement remains required. |
| AC-10 Handover | Activation/editorial/operational guidance supplied; owner assignment, training and live restoration exercise pending. |

The confidential registry, client portal, subscriptions and commercial AI platform remain deferred as required. This report distinguishes implemented code from configured services and accepted production evidence.

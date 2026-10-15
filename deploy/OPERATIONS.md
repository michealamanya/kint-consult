# Existing Nginx host: activation and operation

The site is already hosted. These changes update its application; they do not
change DNS or deploy to the server automatically. Use the existing release process
in [HOSTING.md](HOSTING.md), test the new build on a temporary loopback port, then
restart the configured service. Keep the previous release for rollback. Do not run
a second service on the current application's port.

GitHub Actions includes pull-request/build/browser checks and a manually triggered
`Package Nginx release` workflow. Configure its `production` environment with
required reviewers and the public build variables listed in `.env.example`.
It builds a Linux standalone archive containing `server.js`, public assets and
Next static files. Keep server-only secrets out of the build environment. Start
that archive with `node server.js` in its extracted release directory, supplying
the protected runtime environment. The existing source-based systemd unit instead
uses `scripts/start.mjs`; do not point that unit at this standalone archive without
updating its working directory and start command. An archive upload is not a live
deployment: no server SSH credentials or deployment target were supplied.

## Enquiries

1. In Microsoft Entra, register a server application and configure Microsoft Graph
   application `Mail.Send`, with tenant administrator consent. Restrict its mailbox
   access to the sending mailbox using your Exchange administrator's approved
   application access controls. Do not grant directory or mailbox read permissions
   just to send enquiries.
2. Set `M365_TENANT_ID`, `M365_CLIENT_ID`, `M365_CLIENT_SECRET`,
   `M365_SENDER=admin@kintconsult.com` and
   `CONTACT_RECIPIENT=admin@kintconsult.com` in the server's protected environment
   file. Confirm that this mailbox actually exists and is monitored. A public
   contact address does not establish that a Microsoft 365 tenant is configured.
3. Set both Turnstile keys, restrict the widget to the canonical hostname, and
   rebuild with the public site key. Keep the Nginx enquiry rate limit. Leave the
   webhook blank when using Graph. An existing HTTPS webhook remains supported,
   but its receiver must durably accept submissions and its provider must be
   disclosed in the privacy notice.
4. Send an authorised test enquiry through the deployed form. Check its unique
   reference in the recipient mailbox and Sent Items; verify reply-to reaches the
   visitor. Test invalid input, a failed verification and provider downtime.
   The UI says accepted for processing: Graph's 202 response does not establish
   final delivery. No automatic retries are made after an uncertain send, to avoid
   duplicate messages. A reference is an enquiry identifier, not an idempotency key.
5. Administration owns the inbox. Agree escalation and a response target before
   setting `NEXT_PUBLIC_CONTACT_HOURS` and `NEXT_PUBLIC_RESPONSE_TIME`. Confirm
   retention and provider arrangements with the company privacy owner; review the
   public policy wording before enabling collection. Do not log message bodies,
   tokens or credentials. No enquiry database is created by this application.

Integration references: [Graph sendMail](https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0)
and [client credentials](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow).

## Staff publishing

The `/admin` editor uses pinned Decap CMS 3.17.1 and GitHub. Content lives in
`content/insights.json`; the service catalogue and company purpose are also editable
through `content/services.json` and `content/company.json`. Edits become Git commits
and editorial pull requests.
It has no embedded password, public write endpoint or shared administrator login.

1. Set `CMS_GITHUB_REPO=owner/repository`, `CMS_BRANCH` and `CMS_AUTH_URL` to the
   HTTPS `/auth` endpoint of a Decap-compatible GitHub OAuth service. Configure that
   service's OAuth app, callback and allowed site origin separately. Keep its client
   secret on that service. This repo does not provision an OAuth provider. Rebuild
   when changing the auth hostname because the admin CSP allows that origin only.
2. Protect the production branch with required `verify` checks, reviewed pull
   requests and no force-pushes. Require MFA for staff. Do not expose a local Decap
   proxy on the public server. The editor needs GitHub push permission; its buttons
   do not override repository permissions or branch protections.
3. Administrator: repository/settings management and deployment approval. Editor:
   content branches and pull requests. Reviewer/viewer: review pull requests with
   read access in GitHub. Decap's GitHub backend requires push access to sign in,
   so it is **not a separate read-only CMS role**. Strict three-role in-CMS access
   remains an identity/provider decision; do not call it implemented by this setup.
4. At `/admin`, edit the article list, save an editorial draft and use Preview to
   inspect the entry. Submit for review. A reviewer approves copy, source accuracy,
   image rights, alternative text and dates. Publish/merge only when checks pass.
   The default preview is a content preview, not a deployed copy of the website.
   An exact design preview needs a separate staging build.
5. `draft` hides an article; `published` displays it after its publication time;
   `scheduled` also waits until that UTC time. Deploy approved scheduled entries
   **before** their time. Insights routes evaluate visibility per request; the home
   list refreshes within its 60-second cache interval. Unpublishing means setting
   `draft`, approving, rebuilding and deploying. Server clocks must be correct.
   The existing three articles have the initial editorial migration date of
   15 October 2026; confirm or correct that date before publication.
6. Git history and pull-request review preserve revisions and reviewers. Undo an
   error with a reviewed revert and deploy; do not rewrite production history.
   A GitHub merge does not update a manually hosted server on its own. Use your
   existing deployment automation or the manual release steps in HOSTING.md.
7. Upload JPEG/PNG/WebP/AVIF under 2 MB with descriptive alt text. Remove EXIF/private
   metadata and compress before upload. `npm run content:check` rejects unsafe paths,
   duplicate slugs, missing metadata, unsupported formats and oversized media.
   Next.js optimises displayed covers. No metadata stripping service or antivirus
   pipeline is claimed. No SVG/HTML editorial uploads are accepted by the checks.

See [GitHub backend](https://decapcms.org/docs/github-backend/) and
[editorial workflow](https://decapcms.org/docs/editorial-workflows/).

## Measurement and search

Optional Plausible is off by default and requires visitor opt-in on `/cookies`.
Set `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` to the dashboard's personalised HTTPS script
URL, review provider/processing terms and rebuild. Use the standard unproxied
Plausible endpoint on the same origin as the script; if you proxy ingestion,
adjust the tracker options and CSP deliberately. Create the `Enquiry accepted`
custom event goal. Successful API acceptance emits this event without form values
or reference IDs; downloads of unsent drafts do not count as conversions. Verify
page views, a successful enquiry and withdrawal on the deployed site before
reporting measurements. Public search/filtering does not send search text in event
properties. No performance or traffic figures are fabricated.

Set `GOOGLE_SITE_VERIFICATION` if using Search Console. Submit `/sitemap.xml` after
deployment. Stage separately with `SITE_ENV=staging` and a staging public URL at
build and runtime. Staging emits noindex metadata/headers and disallow robots;
also protect staging with authentication or an IP allowlist. Noindex is not an
access control. Test production DNS, canonical redirects and TLS independently.

References: [Plausible script](https://plausible.io/docs/plausible-script),
[events](https://plausible.io/docs/custom-event-goals).

## Operations ownership and evidence

Assign named application, hosting, privacy and editorial owners outside this repo.

| Cadence    | Action and evidence                                                                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Continuous | External HTTPS checks of `/api/health` and a representative page, with an owner receiving alerts. Track monthly uptime against 99.5%; the health route confirms the app process, not mail or external dependencies.                        |
| Daily      | Encrypted off-host backups of deployment configuration and approved content; Microsoft 365 retention/backup handled separately. Keep encryption keys away from backup storage and restrict reads. Alert on failed backups.                 |
| Weekly     | Review service restarts, failed requests, certificate expiry, mailbox handling and backup success. Never collect enquiry bodies in application/access logs.                                                                                |
| Monthly    | Review Dependabot changes, `npm audit --omit=dev`, Node/OS updates and account access. Test dependency fixes before production. Confirm server and security log retention; a suggested 30-day operational window needs owner approval.     |
| Quarterly  | Restore a backup to an isolated staging host, verify content and settings, record recovery time and missing data. Run device/browser, keyboard, zoom and accessibility checks. Review links, content, analytics and information retention. |
| Annually   | Renew domain/certification responsibilities, review policies and service claims, and rehearse incident response.                                                                                                                           |

Before release, export server configuration to protected encrypted storage and
record the current Git commit and previous build path. A backup is not verified
until it has been restored. The existing production Nginx configuration, DNS,
Cloudflare Full (strict), origin reachability rules, SSH keys, firewall, unattended
patches, TLS renewal, encrypted backups and alert destinations require server access;
they have not been changed or verified from this workspace.

Incident process: notify the assigned owner, restrict the affected endpoint or
revoke the compromised credential, preserve access-controlled evidence, assess
personal-data impact with the privacy owner, follow applicable reporting duties,
restore a known-good release and rotate affected secrets. Document cause, recovery
and preventive action. Never paste secrets or enquiry contents into public issues.

## Acceptance still required

This is an application implementation, not a declaration of complete Phase 1
acceptance. Confirm official address/registration details, leadership permissions,
mission/vision wording, service scope, policy approval and any client examples.
Record actual production delivery, CMS login/edit/review/rollback, three-role access
decision, deploy/restore exercises and external host checks. Measure mobile
Lighthouse against the brief's target on the real host; automated accessibility
checks supplement manual WCAG review and do not certify conformance.

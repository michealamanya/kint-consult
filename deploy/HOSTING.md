# Hosting KINT Consult

The application is a Node/Next.js server. Use the included Docker image behind Nginx on a Linux host; uploading `public/` alone will not run the site.

## Configure and start

1. Point the domain's DNS records at the server. The current canonical URL is `https://kintconsults.com`; change `NEXT_PUBLIC_SITE_URL` and the Nginx domain/certificate settings if your final domain differs.
2. From the repository root on the server, create the production environment file:

   ```sh
   cp .env.example .env.production
   chmod 600 .env.production
   ```

   The supplied email and telephone are already configured. Public settings are build-time values; rebuild when changing them. Keep this file out of Git.

3. Start the website with Docker Engine and the Compose plugin installed:

   ```sh
   docker compose --env-file .env.production -f deploy/compose.yaml up -d --build
   docker compose --env-file .env.production -f deploy/compose.yaml ps
   curl -I http://127.0.0.1:3000
   ```

   The application port binds only to loopback. Compose adds automatic restart, a health check and bounded container logs.

## HTTPS proxy

Install Nginx and obtain a TLS certificate covering both the apex domain and `www`. Complete certificate issuance before enabling the HTTPS configuration. Copy `deploy/nginx.conf.example` to your Nginx site configuration, then validate and reload:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

The `limit_req_zone` directive belongs in the Nginx `http` context (a conventional `sites-enabled` include is inside that context). The example redirects HTTP and HTTPS `www` traffic to the canonical domain and rate-limits enquiries. Allow public ports 80/443; keep the application port private.

## Verify after deployment

Check the homepage, an insight article, all sector photos, `/icon`, `/sitemap.xml` and `/robots.txt` over HTTPS. Resize from mobile to a large monitor. Confirm the email/telephone links and inspect browser errors. Confirm generated canonical URLs use the deployed domain.

Enquiries currently use **draft mode**: visitors can save a local enquiry draft or use the email/telephone links. To enable submission, configure `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, rebuild, and verify real delivery through your receiver. The site does not claim to send enquiries while those settings are missing.

## Updates and rollback

Keep a copy of the previous working image before rebuilding:

```sh
docker image tag kint-consult:latest kint-consult:previous
docker compose --env-file .env.production -f deploy/compose.yaml up -d --build
docker compose --env-file .env.production -f deploy/compose.yaml logs --tail=100 website
```

If an update fails, restore the previous image and recreate without building:

```sh
docker image tag kint-consult:previous kint-consult:latest
docker compose --env-file .env.production -f deploy/compose.yaml up -d --no-build --force-recreate
```

Local verification covers the standalone production server and browser behavior. Docker Engine, Nginx, DNS and issued TLS certificates must be validated on the deployment host.

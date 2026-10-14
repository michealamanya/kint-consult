# Hosting KINT Consult

Use your existing Nginx server as the HTTPS reverse proxy. KINT is a Node/Next.js application, managed by systemd and listening on `127.0.0.1:3000`. Nginx forwards requests to it. Uploading `public/` alone will not run this site.

These instructions assume a Linux server with systemd and Node/npm installed. The included Docker configuration remains an alternative.

## Build and run behind your existing Nginx

1. Upload the repository to `/var/www/kintconsult`, excluding `.git`, `node_modules`, `.next` and local secret files. Build on the Linux server rather than copying Windows dependencies.
2. Create a dedicated service account if it does not already exist, and grant it ownership of this application directory:

   ```sh
   sudo useradd --system --user-group --home-dir /var/www/kintconsult --shell /usr/sbin/nologin kint
   sudo chown -R kint:kint /var/www/kintconsult
   ```

3. Create `.env.production` from `.env.example`, set the final `NEXT_PUBLIC_SITE_URL`, then secure and build the application:

   ```sh
   cd /var/www/kintconsult
   sudo -u kint cp .env.example .env.production
   sudo chmod 600 .env.production
   sudo -u kint npm ci
   sudo -u kint npm run build
   ```

   The existing email and telephone defaults are included. Next.js reads `.env.production` during the production build. Rebuild when public settings change.

4. Check `command -v node`. The unit uses `/usr/bin/node`; adjust its `ExecStart` if your Node binary is elsewhere. The application directory, service account and environment-file path must agree with your installation.
5. Install and start the supplied unit:

   ```sh
   sudo cp deploy/kint-consult.service /etc/systemd/system/kint-consult.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now kint-consult
   sudo systemctl status kint-consult --no-pager
   curl -I http://127.0.0.1:3000
   ```

   The service starts on boot, restarts if it exits and keeps the application port private. If port 3000 is already occupied, choose a free port in the unit's `PORT` setting and both Nginx `proxy_pass` directives, then restart the service.

## HTTPS proxy

Use the existing Nginx installation and TLS certificates. The example currently targets `kintconsult.com` and `www.kintconsult.com`; update its hostnames and certificate paths to your final domain.

Add a dedicated KINT site or merge the example into the matching domain configuration. Keep other sites and your working TLS settings intact. Define `kint_enquiries` only once in the Nginx `http` context. If certificates are not issued yet, complete issuance before enabling the HTTPS blocks. Validate and reload:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

The `limit_req_zone` directive belongs in the Nginx `http` context (a conventional `sites-enabled` include is inside that context). The example redirects HTTP and HTTPS `www` traffic to the canonical domain and rate-limits enquiries. Allow public ports 80/443; keep the application port private.

## Verify after deployment

Check the homepage, an insight article, all sector photos, `/icon`, `/sitemap.xml` and `/robots.txt` over HTTPS. Resize from mobile to a large monitor. Confirm the email/telephone links and inspect browser errors. Confirm generated canonical URLs use the deployed domain.

Enquiries currently use **draft mode**: visitors can save a local enquiry draft or use the email/telephone links. To enable submission, configure `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, rebuild, and verify real delivery through your receiver. The site does not claim to send enquiries while those settings are missing.

## Updates and logs

Back up the current release and production environment file before an update. Stop only KINT while replacing its files or rebuilding, so other Nginx sites remain available:

```sh
sudo systemctl stop kint-consult
# Upload the new source files into /var/www/kintconsult.
cd /var/www/kintconsult
sudo -u kint npm ci
sudo -u kint npm run build
sudo systemctl start kint-consult
curl -I http://127.0.0.1:3000
sudo journalctl -u kint-consult -n 100 --no-pager
```

To roll back, restore the previous release and its matching environment file, rebuild it and restart `kint-consult`. Changing the service unit requires `sudo systemctl daemon-reload` before restarting.

## Docker alternative

If you prefer containers behind the same Nginx proxy, use Compose instead of the systemd unit:

```sh
docker compose --env-file .env.production -f deploy/compose.yaml up -d --build
```

Choose one application runner for the configured port. The Nginx configuration works with either runner.

Local verification covers the standalone production server and browser behavior. The service unit, Nginx configuration, DNS and TLS certificates must be validated on your actual hosting server.

References: [Nginx proxy configuration](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) and [systemd service documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html).

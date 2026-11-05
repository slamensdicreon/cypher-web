# cypher-web

The selection site for Cypher at Sitecore Symposium: *Ignorance is bliss.* One page, one form. A visitor puts their company forward with a work email and says how badly they want it. Twenty-five companies get selected. Selection closes Friday, November 13.

Built with Next.js 16 (App Router) and React 19. No CSS framework, no UI library, no client-side tracking. The page is prerendered; the only server code is the form endpoint and a CSV export.

The design matches the approved prototype pixel for pixel: at 1440 wide the production build and the prototype are identical, and at 390 they differ by 0.005% of pixels (font anti-aliasing).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # what Vercel runs
```

Node 20.9 or later. Without storage configured, submissions are written to the server log, so the whole flow works locally with no setup.

## Deploy on Vercel

1. In Vercel, **Add New → Project** and import `slamensdicreon/cypher-web`. The framework is detected as Next.js; no build settings need changing.
2. In the project, **Storage → Marketplace → Upstash for Redis**, create a database and connect it to the project. That sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. In **Settings → Environment Variables**, add `ADMIN_KEY` (any long random string) and, once the vanity domain is ready, `NEXT_PUBLIC_SITE_URL`.
4. In **Settings → Domains**, add the vanity domain. Then regenerate the postcard QR codes against it.
5. Redeploy so the variables take effect.

## Environment variables

| Name | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The public URL, used for share previews. |
| `NEXT_PUBLIC_SELECTION_CLOSES_AT` | When the form closes, ISO 8601 in UTC. Default `2026-11-14T04:59:59Z`, the end of November 13 Eastern. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis, set by the Vercel Marketplace. `UPSTASH_REDIS_REST_URL`/`_TOKEN` also work. |
| `SUBMISSION_WEBHOOK_URL` | Optional. Every submission is also posted here (Slack incoming webhook, Zapier, Make). |
| `ADMIN_KEY` | Required for the CSV export. |
| `BLOCK_VENDOR_DOMAINS` | Comma-separated domains to decline as vendors, added to the built-in list. |
| `BLOCK_PERSONAL_DOMAINS` | Comma-separated domains to decline as personal addresses. |
| `ALLOW_INDEXING` | Set to anything to let search engines index the site. Unset, it asks them not to. |

## Getting the submissions out

`https://<domain>/api/export?key=<ADMIN_KEY>` downloads every submission as CSV, keenest first: company, domain, email, interest level, which postcard they scanned (`card`, from the QR's `?c=` tag), and when. Each submission is also stored per domain, so a company's latest answer is always one lookup away.

## Where things live

| Path | What's there |
| --- | --- |
| `app/page.tsx` | All the page copy. |
| `app/globals.css` | All the styling, ported from the prototype. |
| `components/Eye.tsx` | The hero eye: blinks, glances, squints, widens, and reacts to the form. |
| `components/InterestForm.tsx` | The form, the interest dial, the replies and the confirmation. |
| `lib/rules.ts` | Who gets declined. Server-only: these lists never reach the browser. |
| `app/api/interest/route.ts` | The form endpoint: deadline, rules, honeypot, rate limit, storage. |
| `app/api/export/route.ts` | The CSV export. |

## Behaviour worth knowing

- Sitecore, vendor and personal addresses are declined on the server with their own replies. Nothing on the page says they will be.
- The company name is read from the email domain; the visitor never types it.
- A hidden honeypot field quietly accepts and discards bot submissions.
- With storage connected, each network can submit twenty times an hour.
- After the close date the form is replaced on the page and refused by the server.
- Everything respects reduced motion.

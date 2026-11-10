# cypher-web

The selection site for Cypher at Sitecore Symposium: *Ignorance is bliss.* One page, one form. A visitor puts their company forward with a work email and says how badly they want it. Twenty-five companies get selected. Selection closes Friday, November 13.

Built with Next.js 16 (App Router) and React 19. No CSS framework, no UI library, no client-side tracking. The page is prerendered; the only server code is the form endpoint and a CSV export. Submissions are stored in Neon Postgres and emailed through Resend.

The design matches the approved prototype pixel for pixel: at 1440 wide the production build and the prototype are identical, and at 390 they differ by 0.005% of pixels (font anti-aliasing).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # what Vercel runs
```

Node 20.9 or later. Without a database, submissions are written to the server log; without a Resend key, no email is sent. So the whole flow works locally with no setup.

## Deploy on Vercel

1. In Vercel, **Add New → Project** and import `slamensdicreon/cypher-web`. The framework is detected as Next.js; no build settings need changing.
2. In the project, **Storage → Marketplace → Neon**, create a database and connect it to the project. That sets `DATABASE_URL`. The `submissions` table is created on the first submission.
3. In Resend, verify the sending domain and create an API key.
4. In **Settings → Environment Variables**, add `RESEND_API_KEY`, `EMAIL_FROM` (a sender on the verified domain), `INTERNAL_EMAIL_TO` (the team), `ADMIN_KEY` (any long random string) and, once the vanity domain is ready, `NEXT_PUBLIC_SITE_URL`.
5. In **Settings → Domains**, add the vanity domain. Then regenerate the postcard QR codes against it.
6. Redeploy so the variables take effect.

## Environment variables

| Name | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The public URL, used for share previews. |
| `NEXT_PUBLIC_SELECTION_CLOSES_AT` | When the form closes, ISO 8601 in UTC. Default `2026-11-14T04:59:59Z`, the end of November 13 Eastern. |
| `DATABASE_URL` | Neon Postgres, set by the Vercel Marketplace. `POSTGRES_URL` also works. |
| `RESEND_API_KEY` | Resend (`RESEND_KEY` also works). Without it, submissions are still stored but no email is sent. |
| `EMAIL_FROM` | The sender, on a domain verified in Resend, e.g. `Cypher <cy@ignoranceisbliss.ai>`. |
| `INTERNAL_EMAIL_TO` | Who on the team is emailed for every company put forward. Comma-separated. |
| `EMAIL_REPLY_TO` | Where replies to the confirmation and the drip emails go. Production: `cy@ignoranceisbliss.ai`, the inbox the team reads. |
| `ADMIN_KEY` | Required for the CSV export. |
| `BLOCK_VENDOR_DOMAINS` | Comma-separated domains to decline as vendors, added to the built-in list. |
| `BLOCK_PERSONAL_DOMAINS` | Comma-separated domains to decline as personal addresses. |
| `ALLOW_INDEXING` | Set to anything to let search engines index the site. Unset, it asks them not to. |

## Getting the submissions out

Every submission lands in the `submissions` table in Postgres, declined ones included (`outcome` is `ok`, `vendor`, `sitecore` or `personal`), with whether each email went out and why not if it didn't. Visitor IP addresses are never stored, only a hash used for the rate limit.

`https://<domain>/api/export?key=<ADMIN_KEY>` downloads the companies put forward as CSV, keenest first: company, domain, email, interest level, which postcard they scanned (`card`, from the QR's `?c=` tag), when, and the email status. Add `&outcome=all` for every attempt, or `&outcome=vendor` to see which vendors tried.

## Email

Through Resend, for every company put forward:

- **The team** gets a notice with the company, email, interest level, postcard and a running count. Replying to it writes to the person directly.
- **The person** gets a confirmation in Cypher's voice: noted, and you'll hear again only if selected. One per address per 24 hours, so the form can't be used to flood someone else's inbox.

Declined submissions get no email; they're stored. Emails go out after the response, so a slow or failing Resend never holds up the form; failures are recorded on the row (`email_error`).

## Where things live

| Path | What's there |
| --- | --- |
| `app/page.tsx` | All the page copy. |
| `app/globals.css` | All the styling, ported from the prototype. |
| `components/Eye.tsx` | The hero eye: blinks, glances, squints, widens, and reacts to the form. |
| `components/InterestForm.tsx` | The form, the interest dial, the replies and the confirmation. |
| `lib/rules.ts` | Who gets declined, and who never is (Icreon). Server-only: these lists never reach the browser. |
| `lib/vendors.ts` | The vendor domains, from the Symposium sponsor attendee report. |
| `lib/store.ts` | Postgres: the table, saving, the rate limit, the export query. |
| `lib/email.ts` | The two emails and sending them through Resend. |
| `app/api/interest/route.ts` | The form endpoint: deadline, rules, honeypot, rate limit, storage, email. |
| `app/api/export/route.ts` | The CSV export. |
| `assets/deck/Cypher-Pitch-Deck.pptx` | The pitch deck. Signed-in admins download it from `/admin` (served by `app/api/admin/deck/route.ts`, never public). Keep it under 4.5 MB, Vercel's limit for a function response. |

## Behaviour worth knowing

- Sitecore, vendor and personal addresses are declined on the server with their own replies. Nothing on the page says they will be.
- The company name is read from the email domain; the visitor never types it.
- A hidden honeypot field quietly accepts and discards bot submissions.
- With the database connected, each network can submit twenty times an hour.
- After the close date the form is replaced on the page and refused by the server.
- Everything respects reduced motion.

# Cypher Admin: Build Plan

November 13, 2026. A plan to turn `/admin` into the one place Cypher's go-to-market runs: the CRM, email marketing, the website CMS, the marketing plan and calendar, and the analytics that say whether any of it works.

## 1. Summary

**What it is for.** One sign-in, five jobs:

| Module | The job | Replaces |
|---|---|---|
| **CRM** | Every lead from the site, every demo, every proposal, every deal, in one pipeline | Spreadsheets, inboxes, memory |
| **Email marketing** | Broadcasts, automated sequences triggered by what people do, segments, templates | The Symposium drip tool (it becomes the engine underneath) |
| **Website CMS** | Edit every word on the site, build campaign landing pages, publish with a preview and an undo | Code changes for copy |
| **Marketing plans** | The evergreen plan, goals, campaigns, a content calendar, the asset library, social publishing | The plan document and ad hoc posting |
| **Analytics** | Website, email, social and ads in one place, tied to the pipeline: what brought the lead, what it became, what it was worth | Six dashboards in six tools |

**A command center** sits on top: one screen that says what needs you today.

**Principles**

1. **Built on what exists.** The current admin already has first-party analytics, card tracking, a sign-up table, a drip engine with a live preview, and Resend. Nothing is thrown away; each becomes a module's foundation.
2. **Cypher's own design language.** The admin borrows the platform's two faces: **Bliss** (one sentence, at most three things that are yours, each with a recommended next step) and **Everything** (the full tables, metrics and logs). Same data, one switch.
3. **The pipeline is the spine.** Every module writes to and reads from the same contacts, companies and deals, so a LinkedIn post, an email click and a signed proposal are one story.
4. **Proper accounts before personal data.** The CRM holds people's details; real user accounts, roles and an audit log come first.
5. **No Icreon on the label.** The admin is internal, but anything it publishes (site, emails, landing pages, proposals) follows the brand guardrails, checked automatically.

**Build order** (section 10): Foundations → CRM → Command center and analytics → Email marketing → Demos and proposals → Website CMS → Marketing plans and social → Hardening. About **16 to 19 weeks** of build if done in sequence, with a usable CRM in about four.

## 2. Where we are today

**What the admin already does**

| Area | Today |
|---|---|
| Sign-in | One shared PIN for everyone; 12-hour signed cookie; lockout after five wrong tries |
| Analytics | First-party and cookieless: visits, page views, sources, devices, countries, card flips and approvals; postcard scans by QR code |
| Leads | Every form submission (accepted and declined) with site, outcomes wanted, "how badly", source; CSV export |
| Email | Sequences with dated or delayed steps, a branded template with live preview, contact import (the 545 Symposium registrants), enrollment, daily send run, test sends, Resend webhooks for delivered, opened and clicked, one-click unsubscribe |
| Campaign assets | The six-card print run (PDF downloads), trading-card sheet, social ads and ZIP; the pitch deck download |
| Data | Neon Postgres: `submissions`, `events`, `contacts`, `sequences`, `steps`, `enrollments`, `drip_sends`, `drip_events`, `admin_attempts` |
| Hosting | Vercel (the team is on Pro), one daily cron |

**What's missing**

- **People and permissions:** no individual users, roles or record of who changed what.
- **A pipeline:** a sign-up is a row, not a deal. No stages, owners, next steps, notes or tasks.
- **Connected data:** submissions and email contacts are separate tables; nothing ties a click to a deal.
- **Content control:** every word on the site lives in code.
- **Planning and social:** no calendar, no campaigns, no social accounts or social metrics.
- **Outcomes:** no funnel from visit to revenue, no goals, no weekly read-out.
- **Engineering hygiene:** tables are created ad hoc in code, there are no automated tests, and no seeded preview database.

## 3. Foundations

Everything else depends on these.

**Accounts, roles and sessions**

- Individual users invited by email; sign in with a **magic link** (sent through Resend) or **Google sign-in** if the team uses Google Workspace.
- Roles: **Owner** (everything, including billing-level settings and deleting data), **Marketing** (CMS, email, plans, analytics), **Sales** (CRM, proposals, analytics), **Viewer** (read-only).
- Sessions stored in the database so they can be revoked; the shared PIN retires.

**Audit log.** Every create, change, publish, send and delete records who, what, when and the before-and-after. Viewable per record and globally.

**The app shell**

- A left rail with the modules, a top bar with search (Ctrl/⌘+K across contacts, companies, deals, pages and campaigns), notifications and the Bliss/Everything switch.
- A shared component set (tables with filters and saved views, record pages with an activity timeline, kanban boards, calendars, forms, charts) built once on the site's tokens and type.
- Works on a phone for the essentials: today's tasks, a lead's record, the pipeline.

**Data model and migrations**

- Move from "create table if not exists" in code to **numbered SQL migrations** run on deploy, so the schema can grow safely.
- The core tables: `users`, `sessions`, `roles`, `audit_log`, `settings`, `companies`, `contacts`, `deals`, `deal_stages`, `activities`, `tasks`, `meetings`, `proposals`, `segments`, `campaigns`, `templates`, `content_pages`, `content_versions`, `media`, `plans`, `goals`, `marketing_campaigns`, `content_items`, `social_accounts`, `social_posts`, `metrics_daily`, `ad_spend`. Existing tables are migrated in, not replaced.

**Settings and integrations health.** One page for the sender name and postal address (the missing `DRIP_POSTAL_ADDRESS` becomes a field), reply-to, and every connection (Resend, LinkedIn, YouTube, X, calendar, ads) with its status and a "test" button.

**Storage.** A media store (Vercel Blob) for images, videos, PDFs and the brand kit.

**Quality**

- Automated tests: unit tests for the engines (pipeline rules, segments, sending, guardrails), end-to-end tests for the key flows (lead → deal, send a campaign, publish a page).
- Continuous checks on every push; every preview deployment gets its own seeded database branch (Neon branching), so changes are tested against realistic data without touching production.
- Error monitoring and a daily backup check.

## 4. Command center

The admin's home screen, in both faces.

**Bliss** (the default)

- One sentence from Cypher: *"Two leads are yours, one before noon. Contoso's demo is at 2:00. Everything else is on pace."*
- Up to three **Yours** cards, each with a recommended next step as the primary button: reply to a new lead, confirm a demo, chase a proposal that's been viewed twice but not signed, approve tomorrow's post.
- A **Handled** list: what moved on its own (sequences sent, posts published, stages advanced).

**Everything**

- KPI tiles: requests this week, qualified, demos booked and shown, proposals out, pipeline value, won this month.
- The funnel from visit to won, with conversion between each step.
- Today: tasks, meetings, scheduled emails and posts.
- Recent activity across every module.

**Notifications.** A new lead, a demo booked, a proposal viewed or accepted, a campaign finished: in the admin, by email, and optionally in Slack.

**The Monday digest.** An email each Monday with last week's numbers against the plan's targets, the top and bottom content, and the pipeline changes.

## 5. CRM

**The pipeline**

| Stage | Enters when | What happens automatically |
|---|---|---|
| **New lead** | The site form is submitted, a contact is imported, or someone adds one | Company and contact created or matched by domain; owner assigned by rule; lead scored; team notified |
| **Qualified** | Someone confirms fit (company size, platform, need) | Welcome sequence stops; the "book a demo" sequence starts |
| **Demo booked** | A meeting is booked (calendar link or by hand) | Reminders to both sides; the meeting appears on the record |
| **Demo shown** | The demo or the "See it on your site" preview is delivered | Follow-up task for the owner; the replay or preview link saved |
| **Proposal sent** | A proposal is generated and shared | Tracking on: viewed, how often, by whom |
| **Negotiating** | The prospect responds to the proposal | Reminder if nothing moves in a set number of days |
| **Won / Lost / Nurture** | The outcome | Won: handover checklist. Lost: reason required. Nurture: moves into a long-term sequence |

Stages, their order and the automation rules are editable in settings.

**Records**

- **Companies:** domain, name, size, industry, the platform they run (Sitecore, AEM, Optimizely, Contentful, Salesforce and so on), website, every contact and deal, every visit and email.
- **Contacts:** name, title, email, phone, LinkedIn, consent and subscription status, source and first touch, lead score, every activity.
- **Deals:** company, contacts and their roles, stage, value, expected close, owner, outcomes wanted (build, migrate, personalize, optimize), next step and its date, proposals, lost reason.

**Activity timeline.** Every record shows one timeline: site visits (from the first-party events, once the person is known), form submissions, emails sent, opened and clicked, meetings, notes, calls, tasks, stage changes, proposal views.

**Work management**

- Tasks with due dates, owners and reminders; "my tasks" and "overdue" views.
- Views: pipeline board (drag between stages), tables with filters and saved views, a forecast by expected close.
- Bulk actions: assign, change stage, add to a sequence, export.

**Lead scoring.** A simple, visible score from fit (company size, platform, title) and intent (the "how badly" dial, outcomes wanted, pages visited, emails clicked, return visits). Shown on every lead with the reasons.

**Getting data in**

- The site form creates or updates the company, contact and deal on every submission (the existing `submissions` history is backfilled).
- The 545 Symposium registrants and the existing contacts move in, de-duplicated by email and domain.
- CSV import with column mapping for everything else.

**Email from the CRM.** Write to a contact from their record using templates; the email sends through Resend from the owner's address and lands on the timeline. Replies go to the owner's inbox.

## 6. Email marketing

The current drip engine becomes the sending engine underneath; the module grows around it.

- **Contacts and consent:** one contact list shared with the CRM; subscription status, unsubscribe reason, bounce and complaint suppression, and a record of where consent came from.
- **Segments:** saved, live filters across contacts, companies, deals and behavior. For example: *"Qualified leads on AEM who clicked an email in the last 30 days"*, or *"Visited the pricing page twice, no deal yet."* Counts update as you build them.
- **Broadcasts:** one-off campaigns to a segment, scheduled or sent now, with an A/B subject-line test that sends the winner to the rest.
- **Automations:** sequences triggered by events: a form submitted, a stage reached, a proposal viewed, a page visited, a date. Steps can wait, branch on behavior (opened, clicked, replied, stage changed), and stop when a goal is met.
- **Templates:** a block editor (heading, text, image, button, card, divider, footer) on the existing branded layout, with the live preview, desktop and phone views, saved templates, and merge fields with fallbacks.
- **Guardrails before sending:** postal address present, unsubscribe link present, brand checks (section 7), spam-word warnings, link check, a test send required before the first live send.
- **Deliverability:** SPF, DKIM and DMARC on ignoranceisbliss.ai verified from the settings page; a warm-up schedule for new volume; Resend plan sized to volume.
- **Reporting:** per campaign and per step: delivered, opened, clicked (by link), replied, unsubscribed, bounced, and **deals influenced**.

## 7. Website CMS

**The approach.** Keep the site's bespoke design and animation; make the words, images and order of sections editable.

- **A content model** for every existing section: hero, Decisions cards, outcomes, the $512 proof and pillars, the proof close, credentials, the week, the join section and form copy (labels, the dial's levels and lines, every reply message), the footer, the Terms articles, metadata and share text.
- **Pages from a section library:** new campaign landing pages (for example `/personalize`, `/migrate-from-aem`) assembled from the existing sections, each with its own SEO fields and form tagging.
- **Editing:** a form for each section beside a live preview of the real page; desktop and phone preview; drafts saved automatically.
- **Publishing:** preview links to share before publishing; publish now or on a schedule; every publish is a version with a one-click rollback; the live site updates within seconds.
- **Media library:** upload, crop, alt text required, usage tracking (where each image is used).
- **SEO and redirects:** titles, descriptions, share images, sitemap, robots, redirect manager.
- **Postcards and cards:** the card catalog (today `lib/postcards.ts`) moves into the CMS; the print PDFs, trading sheets and social ads regenerate from it.
- **Brand guardrails, checked before publish:**
  - "$512" must sit with "the cost of the run, not the price".
  - Any market figure needs a source.
  - No Icreon branding.
  - Platform names only where approved.
  - Banned and watch words (for example competitor and agency names).
  - Reading-level and length warnings for headlines.

## 8. Marketing plans

**The plan, as a living object**

- The evergreen plan's goals and targets (requests, qualified, demos, followers, engagement) stored as **goals** with dates; analytics tracks progress against them automatically.
- **Campaigns:** name, goal, dates, channels, budget, audience, UTM tag, linked landing page, linked email campaign, and results.

**Content calendar**

- Every planned piece (post, video, email, landing page, live build) as a card with channel, format, copy, assets, owner, date and status: **idea → draft → in review → approved → scheduled → published → measured**.
- Calendar, board and list views; filters by channel, pillar, campaign and owner.
- Approval flow: Marketing drafts, the approver signs off, with comments on the card.
- A **link builder** that adds UTM tags automatically, so every click lands in analytics by channel and campaign.
- The six content pillars and recurring formats from the plan are templates, so a new "Replay" or "Cypher says" post starts pre-filled.

**Asset library.** The brand kit, the videos, the cards, the social images and the deck, searchable and tagged, with the right size for each channel.

**Social accounts and publishing**

- **Step 1, schedule and remind:** posts are scheduled in the calendar; at the time, the owner gets a notification with the copy and assets ready to paste; marking it published (with the post's link) starts metrics collection. Works on day one with no API approvals.
- **Step 2, publish directly:** LinkedIn company page (needs LinkedIn's Community Management API approval), X (paid API tier), YouTube (upload API). Each switches on as its access is granted.

## 9. Analytics and outcomes

**One metrics store.** A daily job writes every number into one table (date, source, metric, breakdown, value), so any chart can combine sources.

| Source | What we collect | How |
|---|---|---|
| Website | Visits, page views, sources, UTMs, devices, countries, events (form start, card flips), landing pages, return visitors | Already collected first-party; extended with page and campaign breakdowns |
| Leads and CRM | Requests, qualified, demos, proposals, won, value, time in stage, conversion between stages | From the CRM tables |
| Email | Sent, delivered, opened, clicked, replied, unsubscribed, bounced, per campaign | Resend webhooks (already flowing) |
| LinkedIn | Followers, impressions, engagement, clicks, video views, per post | LinkedIn APIs (needs approval) |
| YouTube | Views, watch time, subscribers, per video | YouTube Analytics API |
| X | Followers, impressions, engagement, per post | X API (paid tier) |
| Ads | Spend, impressions, clicks, leads, per campaign | LinkedIn Ads API; manual entry until connected |

**Dashboards**

- **Funnel:** visits → form starts → requests → qualified → demos → proposals → won, with rates between each step, by week and by channel.
- **Channels and campaigns:** which source and campaign brought visits, requests and revenue; cost per request and per qualified lead where there is spend.
- **Content:** top and bottom posts, videos and pages by reach and by requests they led to.
- **Email:** every campaign and sequence step side by side.
- **Goals:** progress against the plan's targets, on pace or behind.
- **Postcards:** the existing card scan table, kept.

**Attribution.** First touch and last touch on every deal (source, campaign, card or post), plus every touch on the timeline. Simple and visible, not a black box.

**Privacy.** The website analytics stay cookieless; a visitor's history is joined to a contact only after they submit the form, using a first-party identifier set at that moment and disclosed in the privacy notice.

## 10. The roadmap

Sizes: **S** about a day, **M** two or three days, **L** about a week. Weeks are build weeks; phases 3 to 6 can overlap if two people work in parallel.

### Phase 0: Foundations (about 2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| F1 | Numbered SQL migrations, run on deploy; move existing tables under it | M | — |
| F2 | Users, invites, magic-link and Google sign-in, sessions, roles and permission checks | L | F1 |
| F3 | Audit log and record history | M | F2 |
| F4 | App shell: rail, top bar, Bliss/Everything switch, Ctrl/⌘+K search, notifications tray, phone layout | L | F2 |
| F5 | Shared components: tables with saved views, record page with timeline, kanban, calendar, forms, charts | L | F4 |
| F6 | Settings and integrations health page (postal address, sender, reply-to, connection tests) | M | F2 |
| F7 | Media store (Vercel Blob) with upload and alt text | S | F1 |
| F8 | Tests, continuous checks, seeded preview databases, error monitoring | M | F1 |

**Done when:** each person signs in with their own account, the PIN is retired, and every change is in the audit log.

### Phase 1: CRM core (about 3 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| C1 | Companies, contacts, deals and stages tables; merge existing contacts and submissions, de-duplicated | L | F1 |
| C2 | Site form creates or updates company, contact and deal; backfill past submissions | M | C1 |
| C3 | Pipeline board, deal and company and contact record pages with timelines | L | C1, F5 |
| C4 | Activities, notes, tasks and reminders; "my tasks" and overdue views | M | C3 |
| C5 | Lead scoring with visible reasons | M | C2 |
| C6 | Owner assignment rules and new-lead notifications (admin, email, optional Slack) | S | C2 |
| C7 | Email a contact from their record, logged to the timeline | M | C3 |
| C8 | CSV import with column mapping; bulk actions; export | M | C1 |

**Done when:** a form submission appears as a new deal within seconds, the owner is notified, and it can be moved through every stage to Won or Lost with notes and tasks.

### Phase 2: Command center and analytics v1 (about 2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| A1 | Metrics store and daily jobs (website, CRM, email) | M | F1, C1 |
| A2 | Website analytics v2: pages, UTMs, landing pages, return visitors | M | A1 |
| A3 | Funnel and channels dashboards | M | A1 |
| A4 | Goals with targets; on-pace tracking | S | A1 |
| A5 | Command center, Bliss and Everything | L | C4, A3 |
| A6 | The Monday digest email | S | A3, A4 |

**Done when:** the home screen says what's yours today, and the funnel shows last week from visit to won.

### Phase 3: Email marketing v2 (about 3 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| E1 | One contact list with the CRM; consent records; suppression | M | C1 |
| E2 | Segment builder with live counts | L | E1 |
| E3 | Broadcasts with scheduling and A/B subject tests | M | E2 |
| E4 | Automations triggered by events, with waits, branches and goals | L | E2, C2 |
| E5 | Block template editor with desktop and phone preview | L | — |
| E6 | Pre-send guardrails, deliverability setup (SPF, DKIM, DMARC) and warm-up | M | F6 |
| E7 | Campaign and step reporting, including deals influenced | M | A1 |

**Done when:** a segment gets a broadcast, a stage change starts a sequence, and both report through to the pipeline.

### Phase 4: Demos and proposals (about 2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| P1 | Demo booking (calendar link) feeding meetings and the Demo booked stage | M | C3 |
| P2 | Demo records: the replay or "See it on your site" preview link, notes, outcome | S | P1 |
| P3 | Proposal builder: templates, scope by outcome, line items, terms, PDF | L | C3 |
| P4 | Tracked proposal links: viewed, how often, accept button | M | P3 |
| P5 | Electronic signature (provider) and Won handover checklist | M | P4 |

**Done when:** a demo is booked from an email, shown, and followed by a proposal whose views and acceptance land on the deal.

### Phase 5: Website CMS (about 3 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W1 | Content model for every existing section; move copy out of code | L | F1 |
| W2 | Editor beside a live preview; drafts | L | W1, F5 |
| W3 | Versions, scheduled publish, rollback, instant site update | M | W2 |
| W4 | Section library and new landing pages with their own SEO and form tags | L | W2 |
| W5 | Media library usage, SEO fields, sitemap and redirect manager | M | F7, W1 |
| W6 | Brand guardrail checks before publish | M | W2 |
| W7 | Card catalog into the CMS; print PDFs, sheets and ads regenerate from it | M | W1 |

**Done when:** anyone with the Marketing role can change any word on the site, preview it, publish it and undo it, without a code change.

### Phase 6: Marketing plans and social (about 3 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| M1 | Plans, goals and campaigns, linked to landing pages, emails and UTMs | M | A4 |
| M2 | Content calendar: calendar, board and list; statuses; pillar templates | L | F5 |
| M3 | Approvals and comments | M | M2 |
| M4 | Asset library (brand kit, videos, cards) | M | F7 |
| M5 | UTM link builder | S | M1 |
| M6 | Schedule-and-remind publishing; "mark published" with the post link | M | M2 |
| M7 | Social connections and metrics: LinkedIn, YouTube, X | L | A1, approvals |
| M8 | Direct publishing to LinkedIn and X as access is granted | L | M7 |

**Done when:** the month's posts are planned, approved and published from the calendar, and each post's reach and resulting requests show in analytics.

### Phase 7: Hardening (about 1 week)

| # | Task | Size | Depends on |
|---|---|---|---|
| H1 | Permission review per role; security review; rate limits | M | All |
| H2 | Privacy: data export and deletion on request; retention rules; privacy notice update | M | C1, E1 |
| H3 | Performance pass on large tables; backups and restore drill | S | All |
| H4 | A short guide for each role | S | All |

### The order, at a glance

| Weeks | 1–2 | 3–5 | 6–7 | 8–10 | 11–12 | 13–15 | 16–18 | 19 |
|---|---|---|---|---|---|---|---|---|
| Phase | Foundations | CRM | Command center, analytics | Email | Demos, proposals | CMS | Plans, social | Hardening |

**Two quick wins before Phase 0**, so nothing waits on the build: set the postal address so emails can send, and apply for LinkedIn's Community Management API now, because approval can take weeks.

## 11. Costs, risks and decisions needed

**Running costs** (approximate; confirm current pricing before committing)

| Item | Why | Rough cost |
|---|---|---|
| Vercel Pro | Already in place: hosting, more frequent scheduled jobs | Current plan |
| Neon Postgres (paid tier) | More storage, branching for previews, point-in-time restore | About $20 to $70 a month |
| Resend (paid tier) | Volume for broadcasts and sequences | About $20 a month and up |
| Vercel Blob | Media storage | Usage-based, small |
| X API | Posting and metrics on X | About $200 a month for the basic tier |
| LinkedIn and YouTube APIs | Publishing and metrics | No fee; needs approval |
| Calendar booking | Demo booking | Free tier available |
| Electronic signature | Proposal signing | About $20 to $50 a month |
| Error monitoring | Catch problems early | Free to about $30 a month |

**Risks**

- **Scope.** This is four to five months of build. Phasing keeps something useful shipping every two to three weeks; resist adding modules mid-phase.
- **Personal data.** The CRM holds names, emails and notes. Real accounts, roles, the audit log and the privacy work are not optional, and they come first.
- **API approvals.** LinkedIn access can take weeks and may be refused; the schedule-and-remind step works without it.
- **Deliverability.** Broadcasting to cold lists can damage the domain's reputation. Warm up, segment, and keep consent records.
- **Build versus buy.** Every module here exists as a product (HubSpot, Pipedrive, Sanity, Buffer). Building it in-house buys one connected system with our design and our data; it costs build time and upkeep.

**Decisions needed**

1. **Build order:** CRM first (recommended, because leads are arriving now), or the content calendar first because social is launching now?
2. **Sign-in:** Google sign-in (if the team is on Google Workspace) or magic links? And who gets which role?
3. **CRM:** fully in-house, or in-house with a sync to a CRM someone already uses?
4. **CMS:** in-house (recommended, it keeps the site's design and animation), or run the site on an enterprise DXP as a showcase for Cypher itself?
5. **Social publishing:** schedule-and-remind only, or pay for direct publishing on X and apply for LinkedIn access?
6. **Proposals:** which signature provider, and what does a standard proposal contain (scope by outcome, pricing model, terms)?
7. **Demo booking:** which calendar (Google, Microsoft or a booking tool)?
8. **Budget:** approve the running costs above.

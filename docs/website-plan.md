# Cypher: the marketing website, from one page to the product

*November 13, 2026. For ignoranceisbliss.ai. Companion to the evergreen marketing plan and `docs/admin-plan.md`. Revised with your decisions (section 11).*

## 1. Summary

Today the site is one page of attitude and proof: the line, the decision cards, the four outcomes, the $512 run, the week of builds and the form. It did its job for Symposium: curiosity. Evergreen buyers need the next step: **to see the product, understand how it works, and believe it works on their platform**, before they give us an hour.

The plan, in one sentence: **show the real product on every page, give each question a buyer asks its own page, and send everyone to one place: a demo.**

Three moves:

1. **Show, don't tell.** Real Cypher screens, the visual ones first (the Floor, the plan, the scorecard, the portfolio), short product loops and an interactive replay of a real build, captured automatically from the product so they never go stale.
2. **A page for every question.** How it works, what it does (by outcome), where it runs (any enterprise platform, with Sitecore, Optimizely and Contentful named), how a project runs, how it keeps your data, and the receipts.
3. **One action: Book a demo.** Every page ends on it. The demo is booked on our own scheduler, lands in the CRM at *Demo booked*, and the demo itself is the "see it on your site" moment.

About seven weeks of build, in six phases (section 10). Nothing bought: pages are built in the site's own code, the scheduler is ours, and content is kept as data the admin's CMS can take over later (admin plan, Phase 5).

**Progress (November 13):** Book a demo, the header and footer, and Privacy are live. Built next, from the product screens we already had: **How it works** (the product tour, one project start to finish), **Playbooks** (what's in one, the phases and gates, the playbooks by outcome) and an enterprise pass on Home (the product under the hero, a how-it-works preview, "Built for people who get audited"). The capture run (section 6.1) replaces these screens with fresh ones when the demo projects exist.

## 2. Who it's for and what they need to see

| Visitor | Arrives from | Their question | What convinces them | The page that answers |
|---|---|---|---|---|
| **The owner of the website** (VP/Director of Digital, Head of Web) | LinkedIn post, video, a colleague | "Is this real, and would it work on our site?" | Watching it work; their platform named; the decision card | Product tour, platform page, replay |
| **The budget holder** (CMO, CDO) | Forwarded link, a deck | "What does it change for us, and what's the catch?" | Outcomes in plain words, the cost of the run, who owns what | Outcomes, How a project runs, Proof |
| **The platform owner / architect** | Search, a platform community | "What does it actually do in my platform, and is it safe?" | Specifics: content models, components, parity checks, audit log | Platform page, Security, the team |
| **Procurement and security** | The buyer, late in the deal | "Where does our data go? Who can touch it?" | Clear answers, written down | Security, Terms, Privacy |

## 3. Principles

- **The app is Cypher.** Every screen, caption and line calls the product Cypher. Captures use the product's main screens, which already say Cypher; settings and setup screens that mention the platform underneath are left out.
- **Visual screens first.** Any screen can be public; we lead with the ones that show work happening: the Floor, the plan and its gates, the scorecard, the portfolio, the workbench with evidence, the decision inbox.
- **Captured by script, not by hand.** Screens and loops come from a repeatable capture run against the product's demo backend, so when the product changes, one command refreshes the site. No customer names or data on screen.
- **Any enterprise platform.** That's the claim. Sitecore, Optimizely and Contentful are named and each gets a page; outcome pages are written for every platform, not one playbook. Other platforms are welcome in the demo.
- **One primary action: Book a demo.** One secondary: *Watch a build*. No pricing anywhere; "how to buy" is a conversation.
- **Cypher stands on its own.** Icreon doesn't appear on the site.
- **Proof is signed off by you.** Results and quotes only after your sign-off; no logos from our projects.
- **Every number shows its source.** Market figures carry their source on screen; our own estimates say so; $512 is always the cost of the run, never the price.
- **Fast and accessible.** Every page under 2.5 s to its largest content on a phone, AA contrast, captions on every video, axe-clean.

## 4. The site map

```
/                         Home: the product first, then the proof, then the demo
/product                  How Cypher works: the guided tour
  /product/team           The Floor: the specialists and the mind that runs them
  /product/decisions      Three decisions: decision cards, Bliss and Everything
  /product/learning       It asks once: rules, lessons and the playbook that rewrites itself
  /product/receipts       Receipts: every action logged, any build replayed
/outcomes                 What it does
  /outcomes/build         Sites, portals, storefronts, intranets, design systems
  /outcomes/migrate       Old platform to new, nothing left behind
  /outcomes/personalize   The personalization you paid for, switched on
  /outcomes/optimize      Faster, accessible, findable, with the reports
/platforms                Any enterprise platform
  /platforms/sitecore
  /platforms/optimizely
  /platforms/contentful
/how-it-works             How a project runs: day 0 to handover, who owns what
/proof                    The receipts: the $512 run, build replays, "Point it at…" episodes
/security                 Where your data lives, who can touch it, what's logged
/about                    Why Cypher exists (no company name)
/demo                     Book a demo: pick a time, tell us about your site
/learned                  What Cypher learned this week (later; section 6.6)
/terms  /privacy          Legal (privacy is new and required: the site collects emails)
```

**Navigation:** Product · Outcomes · Platforms · Proof · How it works, with **Book a demo** as the one button. Product, Outcomes and Platforms open small menus with a line each. The footer repeats the whole map plus Security, About, Terms and Privacy.

## 5. Page by page

### 5.1 Home, reworked

The line stays. What changes is that the product appears in the first screen and every path leads to a demo.

1. **Hero:** "Ignorance is bliss." with the positioning line, and beside it a looping product clip: the Floor at work, specialists picking up tasks, a decision card arriving. Buttons: **Book a demo** and *Watch a build (42 s)*.
2. **The decision cards** (today's interactive), now drawn from real cards in the product.
3. **How it works in three steps:** Point it at your site → it plans, builds and checks → you make three decisions. Each step a short loop; links to the tour.
4. **The four outcomes**, each a card linking to its page.
5. **Bliss or Everything:** a toggle. One sentence from Cypher, or the full console, on the same project.
6. **The receipts:** $512, 225,000+ events, self-learning/healing/enhancing, linking to Proof.
7. **Any enterprise platform:** Sitecore, Optimizely, Contentful as text badges, "and yours", linking to Platforms.
8. **Your annual roadmap. In a week.** (kept)
9. **Book a demo:** "See it on your site. We'll show you." The scheduler inline.

### 5.2 Product: the tour (`/product`)

A single scrolling story, each section a real screen or loop with two or three lines, linking to the deeper page:

- **Meet Cypher.** The home screen: "What needs me today?" and its answer in one sentence.
- **The team.** The specialists by role, the mind that runs them, the Floor in motion.
- **The plan.** A brief becomes a phased plan with gates; the scorecard shows where it stands.
- **The portfolio.** Every project at a glance: what's moving, what's waiting on you.
- **The work.** The workbench: a task, its evidence, the check that passed.
- **Your three decisions.** The inbox: a card with Cypher's pick, a deadline, and "if you say nothing, it goes ahead."
- **It learns.** An answer becomes a rule; the next project never asks.
- **The receipts.** Every action in one log; replay any build.

### 5.3 The four product pages

| Page | The point | What's on it |
|---|---|---|
| **The team** (`/product/team`) | It isn't a chatbot; it's a crew with a lead | The roles (solution architect, content analyst, component engineer, content and media migrators, parity auditor, performance and accessibility QA, deployment engineer, handover writer and more), what each owns, how work is handed off; the Floor loop; "same crew every day" |
| **Three decisions** (`/product/decisions`) | You decide; it does the rest | Anatomy of a decision card (question, Cypher's pick, why, deadline, the silent default); Bliss vs Everything side by side; a live card to play with |
| **It asks once** (`/product/learning`) | It gets better every build | A real answer turning into a rule (before/after); lessons and procedures; what a new project starts with; a self-healing example from a real run |
| **Receipts** (`/product/receipts`) | Nothing happens off the record | The append-only log; a replay you can scrub; what a client takes with them at handover |

### 5.4 The four outcome pages

Written for every platform, not one playbook. Same shape for each, so they're easy to compare: **what you get**, **how Cypher does it** (the steps, a screen each), **what it checks** (the evidence), **what it hands over**, **typical timeline**, a short FAQ, and the demo with that outcome noted.

- **Build:** websites, customer and member portals, storefronts, intranets, design systems; persona journeys working end to end; marketers edit on day one; a component catalog.
- **Migrate:** any platform to any platform, or many sites into one; content parity (98%+), every redirect kept, visual parity at three breakpoints, the known-gaps report.
- **Personalize:** audiences, variants and A/B/n tests configured and verified in the platform you already pay for.
- **Optimize:** Lighthouse and axe on representative pages, SEO fields, sitemap, error pages, with the reports as evidence.

### 5.5 Platforms

- **Hub (`/platforms`):** "Any enterprise platform." Sitecore, Optimizely and Contentful with a line each, then "Running something else? Bring it to the demo." The demo form asks the platform, so we see demand by platform in the CRM.
- **Sitecore, Optimizely, Contentful pages:** what Cypher does in each platform's own terms (Sitecore: templates, renderings, the content tree, XM Cloud; Optimizely: content types, blocks, the SaaS CMS; Contentful: content models, entries, the delivery and preview APIs), the four outcomes on that platform, migrations into and out of it, screens from a run, and the demo with the platform noted. Platform names appear as text, never their logos.

### 5.6 How it works, Proof, Security, About, Demo

- **How a project runs (`/how-it-works`):** day 0 (the brief and access) → the plan → the build with decisions → checks → handover; what you own (code and hosting). No prices; "how to buy" ends on the demo.
- **Proof (`/proof`):** the $512 run told properly (what was built, the agency quote, the receipts); two or three replays; "Point it at…" episodes as they ship; results and quotes you've signed off; no logos from our projects.
- **Security (`/security`):** where it runs, what it can access and why, isolation between clients, every action through one gateway into an append-only log, retention and export, who can see what. Plain answers; no certifications we don't hold.
- **About (`/about`):** why Cypher exists and who it's for; "built by platform MVPs, 25 years of engineering written down" without naming the company.
- **Book a demo (`/demo`):** what the demo is ("we point Cypher at your site, on your platform, while you watch"), the scheduler, and what happens next.

## 6. Showing the product

This is the heart of the plan.

**6.1 The capture run.** A script that drives Cypher (against its demo backend, with seeded demo projects on Sitecore, Optimizely and Contentful) with Playwright and writes, for each scene: a still at 2× in light and dark, a 6–12 s silent loop (MP4 plus WebM, with a poster), and the scene's real text for captions. One command (`npm run capture`) refreshes every product image on the site. Scenes are listed in one file, so adding a screen is one line.

**6.2 What's captured, visual first.** The Floor in motion, the plan with its gates, the scorecard, the portfolio, the workbench with evidence, the decision inbox and a card, Cypher's home, a rule being made from an answer, the activity log, and Bliss vs Everything on the same screen. A check in the capture run fails on any company name outside the demo allow-list, so no customer ever appears.

**6.3 The interactive replay.** A light player that plays a real build's event stream as the Floor: specialists light up as they work, decisions arrive, checks pass, with a scrubber and a play speed. It uses the same event data the product records (sanitised), so it's true, and it runs on the page without a video file. This is the "watch it work" moment; it lives on Home, Product and Proof.

**6.4 The product frame.** One component for showing a screen: a quiet dark frame, an optional callout or two (numbered dots with a line of text), and the loop or still inside. Every product image uses it, so the site feels like one system.

**6.5 Videos.** The three hype videos appear where they fit: Under the hood on Home and Product, It asks once on the learning page, Waiting on you on decisions. All captioned, poster first, played on click, with licensed music only.

**6.6 What it learned this week (later).** A page that shows, live, how many rules, lessons and procedures are in force and what was added this week (titles only, no client detail), read through the admin's connection to the product. "It's smarter than it was this morning", with the evidence.

## 7. Booking demos (our own scheduler)

The main action needs a tool of its own, built rather than bought. It's the admin plan's demo booking (Phase 4, P1), brought forward:

- **On the site:** pick a 30-minute slot in the visitor's time zone, give a work email, company, site and platform, and the outcome they care about. Personal emails get a polite no, as the form does today.
- **In the admin:** set who demos and their availability (working hours, buffers, days off); see upcoming demos; reschedule or cancel.
- **What it sends:** a confirmation with a calendar invite (.ics) and a video link, a reminder the day before and an hour before, and a note to the demo owner with the CRM record.
- **Into the CRM:** the company, contact and deal are created or updated, the deal moves to *Demo booked*, and the page that sent them, the outcome and the platform go on the record. After the call, one click moves it to *Demo shown*.
- **Until it's live:** a "request a demo" form with preferred times creates the deal at *Demo booked* for a person to confirm.

## 8. Design, build, search

- **Components:** product frame, annotated screen, feature row (text beside media, alternating), outcome card, stat with source, step list, comparison ("the old way / with Cypher", never naming anyone), FAQ, quote, platform badge (text), demo band, video with captions, nav with small menus, full footer.
- **Built in the site's code** (Next.js, the existing styles and type). Page text lives in data files per page so the admin's CMS can take it over without rewriting pages.
- **Performance:** loops lazy-load below the first screen, posters first, AVIF/WebP stills, fonts preloaded; budgets checked in CI.
- **Accessibility:** captions and transcripts, a still instead of every loop for reduced motion, keyboard-operable replay and toggles, axe on every page in CI.
- **Search and sharing:** a title, description and social image per page; the sitemap; structured data for the organization, the product, FAQs and videos; pages written around what buyers search on each named platform ("Sitecore XM Cloud migration", "Optimizely SaaS CMS build", "Contentful migration", "website migration content parity", and so on); redirects kept forever.

## 9. Conversion and measurement

- **One action:** Book a demo, from every page, with the outcome and platform pre-filled from the page.
- **Into the CRM:** the landing page, outcome and platform go onto the deal; lead scoring adds points for a named platform, for arriving from a product or platform page, and for booking a slot (not just asking).
- **Measured in the admin:** visits, scroll depth, demo-button clicks, scheduler opens and demos booked **by page**, a "Top pages that convert" card on Home, replay and video plays, demo show rate. First-party and cookieless, as today.
- **North star:** qualified demos booked per month. Supporting: product-page reach, replay plays, scheduler completion rate, show rate, demo-to-proposal rate.

## 10. The roadmap

### Phase W0: Content and demo projects (about 1 week)

| # | Task | Size | Depends on |
|---|---|---|---|
| W0.1 | Demo projects for captures on Sitecore, Optimizely and Contentful, seeded in the demo backend | M | Platform session |
| W0.2 | Page copy for Product, the four outcomes, the three platforms and How it works, in the voice | M | — |
| W0.3 | Proof inventory for your sign-off: results, quotes, replays (no project logos) | S | You |

### Phase W1: Foundations and the demo path (1–2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W1.1 | Navigation with small menus, full footer, page template | M | — |
| W1.2 | Components: product frame, feature row, stat with source, steps, FAQ, demo band, video | L | W1.1 |
| W1.3 | Page content as data files (CMS-ready) | S | W1.1 |
| W1.4 | Privacy page; cookieless analytics per page and per button | S | — |
| W1.5 | Request a demo: form with preferred times, platform and outcome, into the CRM at *Demo booked* | M | — (built November 13) |

### Phase W2: Show the product (2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W2.1 | The capture run: scenes file, stills, loops, posters, captions, the name check | L | W0.1 |
| W2.2 | The interactive replay player (sanitised event stream) | L | W0.1 |
| W2.3 | Bliss / Everything toggle | S | W2.1 |
| W2.4 | Product tour page | M | W1.2, W2.1 |
| W2.5 | The four product pages | L | W2.4 |

### Phase W3: Outcomes and platforms (1–2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W3.1 | Outcomes hub and the four outcome pages | L | W1.2, W2.1 |
| W3.2 | Platforms hub | S | W1.2 |
| W3.3 | Sitecore, Optimizely and Contentful pages | L | W2.1, W0.2 |

### Phase W4: The scheduler, proof and trust (2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W4.1 | Our own scheduler: availability, time zones, .ics invite, confirmation and reminders, reschedule and cancel | L | W1.5 |
| W4.2 | Admin: demo owners, availability, upcoming demos; one-click *Demo shown* | M | W4.1 |
| W4.3 | Proof page: the $512 run, replays, episodes | M | W2.2, W0.3 |
| W4.4 | How a project runs | M | W0.2 |
| W4.5 | Security page | M | — |
| W4.6 | About; Book a demo page (and ad landing variants) | S | W4.1 |

### Phase W5: The new Home and launch (1 week)

| # | Task | Size | Depends on |
|---|---|---|---|
| W5.1 | Home reworked around the product (section 5.1) | M | W2–W4 |
| W5.2 | Search: metadata, social images, sitemap, structured data | S | All pages |
| W5.3 | Performance and accessibility pass on every page, budgets in CI | M | All pages |
| W5.4 | Admin: conversions by page on Home | S | W1.4, W1.5 |
| W5.5 | Launch: announce with the replay, update ads and profile links to Book a demo | S | W5.1 |

### Phase W6: Keep it alive (ongoing)

| # | Task | Size | Depends on |
|---|---|---|---|
| W6.1 | "What it learned this week", live from the product | M | Admin connection |
| W6.2 | "Point it at…" episode pages as they ship | S each | Marketing plan |
| W6.3 | Pages and copy move into the admin's CMS | M | Admin Phase 5 |
| W6.4 | Quarterly capture refresh (one command) and copy review | S | W2.1 |

**The order, at a glance:** foundations and the demo request → product → outcomes and platforms → scheduler, proof and trust → new Home and launch. Pages go live as they're finished, linked from the current Home, so value lands from week two.

## 11. Decisions (answered November 13)

1. **Platforms and scope:** any enterprise platform; name Sitecore, Optimizely and Contentful. Content isn't limited to one platform or playbook.
2. **Icreon:** doesn't appear.
3. **Pricing:** none on the site. The main action is a demo.
4. **The app:** called Cypher everywhere.
5. **Screens:** any can be public; the visual ones lead.
6. **Proof:** you sign off. No logos from our projects.

7. **Demos:** you run them for now; the scheduler supports more hosts from the start, for the people who join later.

Still open, small: your availability for demos and the video link to use (your meeting tool), both needed for the scheduler (W4).

## 12. Risks

- **Screens go stale as the product moves.** The capture run refreshes them with one command.
- **A customer's data on a public page.** Captures come only from demo projects; the capture run fails on any company name outside the allow-list.
- **A demo on a platform without a ready path.** Each named platform needs a demo project and a short demo script; the scheduler asks the platform up front so the right person runs it.
- **Video weight hurts speed.** Loops lazy-load, posters first, short loops instead of long videos, budgets in CI.
- **Proof debt.** The pages lean on replays and episodes; if those slip, the site slides back into claims. Protect the "Point it at…" schedule.
- **Music rights.** Licensed or library music only on the site.

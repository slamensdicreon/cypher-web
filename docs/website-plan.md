# Cypher: the marketing website, from one page to the product

*November 13, 2026. For ignoranceisbliss.ai. Companion to the evergreen marketing plan and `docs/admin-plan.md`.*

## 1. Summary

Today the site is one page of attitude and proof: the line, the decision cards, the four outcomes, the $512 run, the week of builds and the form. It did its job for Symposium: curiosity. Evergreen buyers need the next step: **to see the product, understand how it works, and believe it works on their platform**, before they hand over a URL.

The plan, in one sentence: **show the real product on every page, give each question a buyer asks its own page, and keep one action everywhere: *See it on your site.***

Three moves:

1. **Show, don't tell.** Real Cypher screens, short product loops and an interactive replay of a real build, captured automatically from the product so they never go stale.
2. **A page for every question.** How it works, what it does (by outcome), where it runs (by platform), what it costs to work with, how it keeps your data, and the receipts.
3. **One path to a conversation.** Every page ends on *See it on your site*; the form knows which page sent the visitor, and the CRM scores it.

About seven weeks of build after a one-week decision sprint, in six phases (section 10). Nothing here needs a bought tool: pages are built in the site's own code, content is kept as data the admin's CMS can take over later (admin plan, Phase 5).

## 2. Who it's for and what they need to see

| Visitor | Arrives from | Their question | What convinces them | The page that answers |
|---|---|---|---|---|
| **The owner of the website** (VP/Director of Digital, Head of Web) | LinkedIn post, video, a colleague | "Is this real, and would it work on our site?" | Watching it work; their platform named; the decision card | Product tour, platform page, replay |
| **The budget holder** (CMO, CDO) | Forwarded link, a deck | "What does it change for us, and what's the catch?" | Outcomes in plain words, the cost of the run, who owns what | Outcomes, How a project runs, Proof |
| **The platform owner / architect** | Search, a platform community | "What does it actually do in my CMS, and is it safe?" | Specifics: templates, components, parity checks, audit log | Platform page, Security, the Floor |
| **Procurement and security** | The buyer, late in the deal | "Where does our data go? Who can touch it?" | Clear answers, written down | Security, Terms, Privacy |

Each persona needs a different depth. The home page serves the first two in a minute; the internal pages serve the last two in ten.

## 3. Principles

- **Real product, real data, no customer names.** Every screen on the site is the actual product, captured from a demo project (fictional company, or Icreon's own site) so no customer appears on screen.
- **Captured by script, not by hand.** Screens and loops come from a repeatable capture run against the product's mock backend, so when the product changes, one command refreshes the site.
- **Mystery first, proof second, action last** (the voice rule) still holds on every page, but internal pages lean on proof.
- **One primary action:** *See it on your site.* One secondary: *Watch a build.* Nothing else competes.
- **Claims only where we deliver.** "Any enterprise platform" is the promise; a platform gets its own page only when its playbooks are in production (today SitecoreAI; Optimizely when it lands).
- **Every number shows its source.** Market figures carry their source on screen; our own estimates say so; $512 is always the cost of the run, never the price.
- **Fast and accessible.** Every page under 2.5 s to its largest content on a phone, AA contrast, captions on every video, axe-clean.

## 4. The site map

```
/                         Home: the product first, then the proof, then the offer
/product                  How Cypher works: the guided tour
  /product/team           The Floor: twenty-one specialists and the mind that runs them
  /product/decisions      Three decisions: decision cards, Bliss and Everything
  /product/learning       It asks once: rules, lessons and the playbook that rewrites itself
  /product/receipts       Receipts: every action logged, any build replayed
/outcomes                 What it does
  /outcomes/build         Sites, portals, storefronts, intranets, design systems
  /outcomes/migrate       Old platform to new, nothing left behind
  /outcomes/personalize   The personalization you paid for, switched on
  /outcomes/optimize      Faster, accessible, findable, with the reports
/platforms                Any enterprise platform (and which are live today)
  /platforms/sitecore     SitecoreAI: live
  /platforms/optimizely   Optimizely: when its playbooks are in production
/how-it-works             How a project runs: day 0 to handover, who owns what, how to buy
/proof                    The receipts: the $512 run, build replays, "Point it at…" episodes
/security                 Where your data lives, who can touch it, what's logged
/about                    Who's behind it (see decision 2)
/see-it                   The standing offer and the form (also the landing page for ads)
/learned                  What Cypher learned this week (later; section 6.6)
/terms  /privacy          Legal (privacy is new and required: the form collects emails)
```

**Navigation:** Product · Outcomes · Platforms · Proof · How it works, with *See it on your site* as the one button. Product and Outcomes open small menus with a line each. The footer repeats the whole map plus Security, About, Terms and Privacy.

## 5. Page by page

### 5.1 Home, reworked

The line stays. What changes is that the product appears in the first screen.

1. **Hero:** "Ignorance is bliss." with the positioning line, and beside it a looping product clip: the Floor at work, specialists picking up tasks, a decision card arriving. Buttons: *See it on your site* and *Watch a build (42 s)*.
2. **The decision cards** (today's interactive), now drawn from real cards in the product.
3. **How it works in three steps:** Point it at your site → it plans, builds and checks → you make three decisions. Each step a short loop; links to the tour.
4. **The four outcomes**, each a card linking to its page.
5. **Bliss or Everything:** a toggle. One sentence from Cypher, or the full console, on the same project.
6. **The receipts:** $512, 225,000+ events, self-learning/healing/enhancing, linking to Proof.
7. **Platforms strip:** "Any enterprise platform." SitecoreAI live, Optimizely next, "yours?" opens the form with the platform asked.
8. **Your annual roadmap. In a week.** (kept)
9. **See it on your site** (the form).

### 5.2 Product: the tour (`/product`)

A single scrolling story, each section a real screen or loop with two or three lines, linking to the deeper page:

- **Meet Cypher.** The home screen: "What needs me today?" and its answer in one sentence.
- **The team.** Twenty-one specialists by role, the mind that runs them, the Floor in motion.
- **The plan.** A brief becomes a phased plan with gates; the scorecard shows where it stands.
- **The work.** The workbench: a task, its evidence, the check that passed.
- **Your three decisions.** The inbox: a card with Cypher's pick, a deadline, and "if you say nothing, it goes ahead."
- **It learns.** An answer becomes a rule; the next project never asks.
- **The receipts.** Every action in one log; replay any build.

### 5.3 The four product pages

| Page | The point | What's on it |
|---|---|---|
| **The team** (`/product/team`) | It isn't a chatbot; it's a crew with a lead | The real roles from the playbooks (solution architect, content analyst, component engineer, content and media migrators, parity auditor, performance and accessibility QA, deployment engineer, handover writer and more), what each owns, how work is handed off; the Floor loop; "same crew every day" |
| **Three decisions** (`/product/decisions`) | You decide; it does the rest | Anatomy of a decision card (question, Cypher's pick, why, deadline, the silent default); Bliss vs Everything side by side; a live card to play with |
| **It asks once** (`/product/learning`) | It gets better every build | A real answer turning into a rule (before/after); lessons and procedures; "in force" for a new project; self-healing example from a real run |
| **Receipts** (`/product/receipts`) | Nothing happens off the record | The append-only log; a replay you can scrub; what a client can export at handover |

### 5.4 The four outcome pages

Same shape for each, so they're easy to compare: **what you get** (deliverables), **how Cypher does it** (the steps, with a screen each), **what it checks** (the evidence: parity, Lighthouse and axe, test configuration), **what it hands over**, **typical timeline**, a short FAQ, and the form with that outcome pre-selected.

- **Build:** persona journeys working end to end; marketers edit on day one; component catalog.
- **Migrate:** content parity (98%+), every redirect kept, visual parity at three breakpoints, the known-gaps report.
- **Personalize:** audiences, variants and A/B/n tests configured and verified in the platform.
- **Optimize:** Lighthouse and axe on representative pages, SEO fields, sitemap, error pages, with the reports as evidence.

### 5.5 Platforms

- **Hub (`/platforms`):** "Any enterprise platform." What's live, what's next, and a short "Your platform?" form that records demand by platform (it feeds the CRM and tells product where to go next).
- **Platform pages:** what Cypher does in that platform's own terms, the playbooks available on it, screens from a run on it, and the form with the platform pre-filled. Built only when the platform's playbooks are in production. Today's catalog: SitecoreAI has *Build a SitecoreAI website*, *Build a SitecoreAI customer portal* and the *SitecoreAI homepage demo*; Optimizely has *Build an Optimizely CMS (SaaS) website* (in progress).

### 5.6 How it works, Proof, Security, About, See it

- **How a project runs (`/how-it-works`):** day 0 (the brief and access) → the plan → the build with decisions → checks → handover; what you own (code and hosting); how engagements are priced (see decision 3).
- **Proof (`/proof`):** the $512 run told properly (what was built, the agency quote, the receipts); two or three replays; "Point it at…" episodes as they ship; quotes and logos only with written permission.
- **Security (`/security`):** where it runs, what it can access and why, isolation between clients, every action through one gateway into an append-only log, retention and export, who at our end can see what. Plain answers; no certifications we don't hold.
- **About (`/about`):** who built it and why (see decision 2), the MVPs, 25 years written down.
- **See it on your site (`/see-it`):** the standing offer in full: what you'll get and how fast (decision 1), the form, what happens next ("a named person replies within one business day").

## 6. Showing the product

This is the heart of the plan.

**6.1 The capture run.** A script that drives the product (the Control Center, against its mock backend with a seeded demo project) with Playwright and writes, for each scene: a still at 2× in light and dark, a 6–12 s silent loop (MP4 plus WebM, with a poster), and the scene's real text for captions. One command (`npm run capture`) refreshes every product image on the site. Scenes are listed in one file, so adding a screen is one line.

**6.2 What's captured.** Cypher's home, the team and the Floor, a plan with gates, the scorecard, the workbench with evidence, the inbox with a decision card, a rule being made from an answer, the activity log, and Bliss vs Everything on the same screen. No customer names, no real client URLs, nothing from a live project unless it's Icreon's own.

**6.3 The interactive replay.** A light player that plays a real build's event stream as the Floor: specialists light up as they work, decisions arrive, checks pass, with a scrubber and a play speed. It uses the same event data the product records (sanitised), so it's true, and it runs on the page without a video file. This is the "watch it work" moment; it lives on Home, Product and Proof.

**6.4 The product frame.** One component for showing a screen: a quiet dark frame, an optional callout or two (numbered dots with a line of text), and the loop or still inside. Every product image uses it, so the site feels like one system.

**6.5 Videos.** The three hype videos (Campaign assets) appear where they fit: Under the hood on Home and Product, It asks once on the learning page, Waiting on you on decisions. All captioned, poster first, played on click, with licensed music only.

**6.6 What it learned this week (later).** A page that shows, live, how many rules, lessons and procedures are in force and what was added this week (titles only, no client detail), read from Launchworks through the admin's console connection. "It's smarter than it was this morning", with the evidence.

## 7. Design and build

- **Components:** product frame, annotated screen, feature row (text beside media, alternating), outcome card, stat with source, step list, comparison ("the old way / with Cypher", never naming anyone), FAQ, quote, platform badge (text, trademark-safe), CTA band, video with captions, nav with small menus, full footer.
- **Built in the site's code** (Next.js, the existing styles and type). Page text lives in data files per page, so the admin's CMS (admin plan, Phase 5) can take it over without rewriting pages.
- **Light and dark bands** as today; the product frame is always dark so screens read the same everywhere.
- **Performance:** loops lazy-load below the first screen, posters first, AVIF/WebP stills, fonts preloaded; budgets checked in CI.
- **Accessibility:** captions and transcripts, reduced-motion versions of every loop (a still), keyboard-operable replay and toggles, axe on every page in CI.

## 8. Search and sharing

- A title, description and generated social image for every page (the site already makes OG images).
- Sitemap covering every page; structured data for the organization, the product, FAQs and videos.
- Pages written around what buyers search: "Sitecore XM Cloud migration", "XP to XM Cloud", "website migration content parity", "Sitecore personalization setup", and so on, but only for platforms we deliver.
- Redirects kept forever once a page exists.

## 9. Conversion and measurement

- **The form, everywhere:** the same form on every page, with the outcome and platform pre-filled from the page, and a new **platform** field (pick one, or "Other: tell us"). Each sign-up records the page it came from.
- **Into the CRM:** the landing page, outcome and platform go onto the deal; lead scoring adds a point for a platform we deliver and a point for arriving from a product or platform page (intent).
- **Measured in the admin:** visits, scroll depth, CTA clicks, form starts and sign-ups **by page**, a "Top pages that convert" card on Home, and replay/video plays. First-party and cookieless, as today.
- **North star:** qualified *See it on your site* requests per month. Supporting: product-page reach, replay plays, form start rate, request-to-reply time.

## 10. The roadmap

### Phase W0: Decisions and content (about 1 week)

| # | Task | Size | Depends on |
|---|---|---|---|
| W0.1 | Answer the decisions in section 11 | S | You |
| W0.2 | A demo project for captures: fictional company, seeded in the mock backend | M | Platform session |
| W0.3 | Page copy for Product, the four outcomes and How it works, in the voice | M | W0.1 |
| W0.4 | Proof inventory: what we can show, with which permissions | S | W0.1 |

### Phase W1: Foundations (1–2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W1.1 | Navigation with small menus, full footer, page template | M | — |
| W1.2 | Components: product frame, feature row, stat with source, steps, FAQ, CTA band, video | L | W1.1 |
| W1.3 | Page content as data files (CMS-ready) | S | W1.1 |
| W1.4 | Privacy page; cookieless analytics per page and per CTA | S | — |
| W1.5 | Form: platform field, page-aware prefill, landing page into the CRM and scoring | M | — |

### Phase W2: Show the product (2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W2.1 | The capture run: scenes file, stills, loops, posters, captions | L | W0.2 |
| W2.2 | The interactive replay player (sanitised event stream) | L | W0.2 |
| W2.3 | Bliss / Everything toggle | S | W2.1 |
| W2.4 | Product tour page | M | W1.2, W2.1 |
| W2.5 | The four product pages | L | W2.4 |

### Phase W3: Outcomes and platforms (1–2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W3.1 | Outcomes hub and the four outcome pages | L | W1.2, W2.1 |
| W3.2 | Platforms hub with "Your platform?" demand capture | S | W1.5 |
| W3.3 | SitecoreAI page | M | W2.1 |
| W3.4 | Optimizely page (when its playbooks are in production) | M | Platform |

### Phase W4: Proof, trust and the offer (1–2 weeks)

| # | Task | Size | Depends on |
|---|---|---|---|
| W4.1 | Proof page: the $512 run, replays, episodes | M | W2.2, W0.4 |
| W4.2 | How a project runs (and how to buy) | M | W0.1 |
| W4.3 | Security page | M | W0.1 |
| W4.4 | About | S | Decision 2 |
| W4.5 | See it on your site page (and ad landing variants) | S | Decision 1 |

### Phase W5: The new Home and launch (1 week)

| # | Task | Size | Depends on |
|---|---|---|---|
| W5.1 | Home reworked around the product (section 5.1) | M | W2–W4 |
| W5.2 | Search: metadata, social images, sitemap, structured data | S | All pages |
| W5.3 | Performance and accessibility pass on every page, budgets in CI | M | All pages |
| W5.4 | Admin: conversions by page on Home | S | W1.4, W1.5 |
| W5.5 | Launch: announce with the replay, update ads and profile links | S | W5.1 |

### Phase W6: Keep it alive (ongoing)

| # | Task | Size | Depends on |
|---|---|---|---|
| W6.1 | "What it learned this week", live from Launchworks | M | Admin console connection |
| W6.2 | "Point it at…" episode pages as they ship | S each | Marketing plan |
| W6.3 | Pages and copy move into the admin's CMS | M | Admin Phase 5 |
| W6.4 | Quarterly capture refresh (one command) and copy review | S | W2.1 |

**The order, at a glance:** decisions → foundations → product → outcomes and platforms → proof and trust → new Home and launch. Product pages can go live as they're finished, linked from the current Home, so value lands from week three.

## 11. Decisions we need from you

1. **The standing offer.** What *See it on your site* delivers (a recorded replay on their homepage, a live session, or a written readout) and how fast. The product already has a *SitecoreAI homepage demo* playbook, which looks made for this: their homepage, rebuilt, with the replay.
2. **Who's behind it.** Stay unbranded, a quiet "Built by Icreon" on About, or "Cypher by Icreon".
3. **How to buy.** Show pricing, show the engagement model without numbers, or "talk to us".
4. **What customers sign into.** The product calls itself Launchworks inside; on the site, is the app "Cypher", or "Cypher, on Launchworks"? Screens will be captured to match.
5. **Which screens can be public.** Anything in the product we'd rather competitors didn't see.
6. **Proof permissions.** Which results, quotes and logos we may use, and whose sign-off.
7. **Platforms to name.** SitecoreAI now; Optimizely on what date; any others to tease as "next".

## 12. Risks

- **Screens go stale as the product moves.** Answered by the capture run: refresh is one command.
- **A customer's data on a public page.** Captures come only from the demo project; a check in the capture run fails on any name outside an allow-list.
- **Claims ahead of delivery.** Platform pages only when playbooks are in production; the hub says plainly what's live.
- **Video weight hurts speed.** Loops lazy-load, posters first, short loops instead of long videos, budgets in CI.
- **Proof debt.** The pages lean on replays and episodes; if those slip, the site slides back into claims. Protect the "Point it at…" schedule.
- **Music rights.** Commercial reference tracks are fine for drafts, never on the site; licensed or library music only.

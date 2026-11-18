# Discovery content (SEO and AEO)

Added November 14, 2026. Every long page is data in `lib/content/` and renders through
`components/site/Article.tsx`, so each gets the same answer-first layout, questions, structured
data, sitemap entry and line in `/llms.txt`.

## What's live once pushed

- **Foundations:** descriptive titles; Organization, WebSite, SoftwareApplication and VideoObject
  data on Home; FAQPage data on How it works, Book a demo and every long page; `/llms.txt`;
  a sitemap of every page with review dates; optional Google and Bing verification tags
  (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`); AI answer engines as a visit source on
  the admin home.
- **Platforms:** `/platforms`, Sitecore, Optimizely, Contentful, Any platform, plus
  `/platforms/sitecore/migration`, `/platforms/optimizely/personalization`,
  `/platforms/contentful/migration`.
- **Playbooks:** one page each for the eight playbooks; the `/playbooks` cards link to them.
- **Answers:** `/answers` and twelve answers for marketers.
- **Glossary:** `/glossary`, 27 terms with their own anchors.
- **Checklists and templates:** `/resources`, a migration checklist, a redirect map template
  (with a CSV download) and a personalization readiness checklist.

## Signed off

All approved on November 17, 2026. No page adds a new number about Cypher; the proof points are the
ones the site already uses. These sentences were the new claims and platform facts reviewed.

**About what Cypher does**
- Sitecore FAQ: Cypher builds headless front ends and works with Sitecore's SaaS direction as well
  as older, self-hosted installations.
- Any platform: commerce platforms with content on top; sites with no CMS at all that need one.
- Website build FAQ: Cypher builds pixel for pixel from the designs you bring, or from the site you
  have today.
- Portals: connects to the sign-in systems you already run.
- Storefronts FAQ: Cypher builds the experience on your content platform and connects it to the
  commerce systems you already run.
- Optimization: improvements with no rebuild; accessibility checked against the standard you name,
  usually WCAG.
- Homepage rebuild: a demo runs on Cypher's picks.
- Migration FAQ: content parity defined as at least 98% of the old site's content present on the new
  one, checked page by page. Glossary: "Cypher's migration playbook delivers content parity of 98%
  or better."

**Platform facts**
- Sitecore (platform page, Sitecore migration page): personalization rules built for a self-hosted
  installation don't carry over to a headless or SaaS build by themselves; they're rebuilt.
- Optimizely: brings content management and experimentation together; tests and audiences are set
  up "in your Optimizely" (assumes the client licenses that side).
- Answers and glossary: Contentful was built headless from the start; Sitecore and Optimizely offer
  headless delivery alongside visual editing; Sitecore and Optimizely given as examples of a DXP.

**General guidance (no figures)**
- Run A/B tests for at least a full week; WCAG AA is the usual target; two or three well-defined
  audiences beat a long list nobody maintains.

## Search engines

Done November 17, 2026. Google Search Console verified the site automatically (URL prefix
`https://www.ignoranceisbliss.ai/`), the sitemap is submitted, and Bing Webmaster Tools imported the
site from Search Console. The verification code variables are no longer needed.

# Second round: proof, security, comparisons and playbook notes

Added November 17, 2026. Content is in `lib/content/trust.ts` (Security) and
`lib/content/compare.ts` (comparisons); playbook notes are written and published in the admin.

## What's new

- **Proof** (`/proof`): retired November 18, 2026; the address goes to the homepage, which keeps the
  $512 run and the Icreon quote.
- **Security** (`/security`): how a project is kept safe, from what the site already says and what
  the platform does today. No certification is claimed.
- **Compare** (`/compare`, plus `/compare/agency-build`, `/compare/in-house-team`,
  `/compare/ai-coding-tools`): kinds, never companies, and each says when the other way is better.
- **Playbook notes** (`/notes`): admin → Playbook notes lists Icreon's active lessons from the
  Launchworks knowledge base (never a customer's). A person rewrites one for the public and
  publishes it. Publishing is refused while the note names any organization on the platform, and
  the page stays out of search results until the first note is published.
- **IndexNow**: once a day, and right after a note is published, every page's main text is
  fingerprinted and only new, changed or removed pages are sent to Bing and the other engines that
  share IndexNow. Production only. The key is public by design, at `/indexnow.txt`.
- The footer gains Security and Compare (and Playbook notes once one is published). The menu's main
  links are Home, How it works, Playbooks and Platforms; Answers is in the footer.

## To sign off

**Security: platform facts stated publicly for the first time**
- Each client's work is kept apart and "access is checked on every request. One client never sees
  another's work."
- A customer's own rules and lessons apply to their projects only.
- Roles: Directors approve the plan, answer decisions and sign off launch; Watchers follow every
  step but change nothing.
- Expert support access is granted "for a set number of hours, up to three days", shows in the
  customer's list of people, and ends on its own.
- Every plan, decision, page and approval is logged and exportable; any build can be replayed.
- When an agreement ends: projects become read only, everything can be exported for 90 days, then
  projects, records and the customer's own rules and lessons are deleted, while the site keeps
  running and the code is kept for handover (icreon-claude PR 46). (This is what the platform does;
  legal may want it to match the contract wording.)

**Comparisons: general statements about the alternatives**
- Agency: pace "often over months"; "a testing phase, usually near the end"; ownership "depends on
  the contract"; editing "after handover and training"; "much of a traditional build's calendar
  goes to coordination."
- In-house: quality checks "as time allows"; what's learned "leaves when people leave."
- DIY AI tools: platform knowledge is "what the model knows in general"; the record is "your chat
  history"; a developer is needed throughout.
- The "when the other way is better" lists on each page.

## Still to come

- More detail for Icreon's story when you have it: the platform, what "ready to use" covered, and
  anything they're happy to add.

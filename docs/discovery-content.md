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

## To sign off

No page adds a new number about Cypher; the proof points are the ones the site already uses. These
sentences are new claims or platform facts a person should confirm.

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

## Still to do by hand

- Add the Google Search Console and Bing Webmaster Tools verification codes as environment
  variables in Vercel, redeploy, then submit `https://www.ignoranceisbliss.ai/sitemap.xml` in both.

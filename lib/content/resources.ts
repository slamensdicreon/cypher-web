import type { Resource } from '@/lib/content/types';

/** Free checklists and templates: usable as they are, no sign-up, the demo as the next step. */
export const RESOURCES: Resource[] = [
  {
    slug: 'website-migration-checklist',
    name: 'Website migration checklist',
    card: 'Every step of a platform move, from the first inventory to the weeks after launch.',
    h1: { light: 'The website migration checklist.', bold: 'Nothing left behind.' },
    metaTitle: 'Website migration checklist for marketers',
    description: 'A free, practical checklist for moving a website to a new platform: inventory, redirects, content, SEO, testing, launch and the weeks after. No sign-up needed.',
    answer: 'Use this checklist to move a website to a new platform without losing pages, traffic or trust. It covers the inventory before you start, the plan and the redirect map, moving and checking content, the checks before launch, the launch itself and what to watch in the weeks after.',
    groups: [
      {
        h: 'Before you start',
        items: [
          'Inventory every URL from a site crawl, your analytics and your XML sitemap.',
          'Note your top pages by traffic, conversions and links from other sites.',
          'Decide which pages to keep, merge or retire.',
          'Agree who owns each section of content.',
          'Record current rankings and traffic as a benchmark.',
          'List every integration: forms, search, CRM, analytics, sign-in, commerce.',
          'Agree what “done” means: content parity, accessibility, performance.',
          'Name one person who makes the decisions.',
        ],
      },
      {
        h: 'Plan and build',
        items: [
          'Write the plan: templates, components, content model and redirects.',
          'Get the plan approved before anyone builds.',
          'Build each template and component once, then reuse it.',
          'Map every old URL to its new URL in a redirect map.',
          'Carry over titles, meta descriptions, headings, alt text and structured data.',
          'Set up analytics and consent on the new site.',
          'Write the editor guide as you build, not after.',
        ],
      },
      {
        h: 'Move and check',
        items: [
          'Move content into the new templates.',
          'Compare old and new page by page for content parity.',
          'Check pages look right on phone, tablet and desktop.',
          'Test every form and integration end to end.',
          'Run accessibility and performance checks on every template.',
          'Fix broken links and missing images.',
          'List anything not done, and why.',
        ],
      },
      {
        h: 'Launch',
        items: [
          'Plan a content freeze, or a re-sync for anything published during the move.',
          'Deploy the redirects at the same moment as the new site.',
          'Remove staging settings: noindex tags and a robots.txt that blocks search engines.',
          'Submit the new XML sitemap to Google Search Console and Bing Webmaster Tools.',
          'Spot-check your top pages and their old URLs by hand.',
          'Confirm analytics is recording.',
          'Have a rollback plan, and someone watching.',
          'Get sign-off from the named owner.',
        ],
      },
      {
        h: 'The weeks after',
        items: [
          'Watch crawl errors and 404s, and add redirects for anything missed.',
          'Fix redirect chains and loops.',
          'Compare traffic and rankings with your benchmark, page by page.',
          'Keep the redirects in place permanently.',
          'Review the list of anything not done, and schedule the fixes.',
          'Retire the old platform only once nothing depends on it.',
        ],
      },
    ],
    blocks: [
      {
        h: 'How to use it',
        p: [
          'Work through the groups in order; they follow the life of a migration. Give every item an owner and a date, and treat an unchecked item in an earlier group as a reason to pause, not to push on.',
          'The checklist works for any enterprise platform: Sitecore, Optimizely, Contentful or anything else.',
        ],
      },
      {
        h: 'What usually goes wrong',
        list: [
          'Redirects missing for pages nobody remembered.',
          'Staging settings left on, hiding the new site from search.',
          'Content clean-up left until the last week.',
          'Integrations tested last, when there’s no time to fix them.',
        ],
      },
      {
        h: 'Let someone else run it',
        p: ['Cypher’s migration playbook runs these steps in order, logs each one, and hands you the evidence: content parity of 98% or better, every redirect kept, and visual parity at three breakpoints. You approve the plan and sign off the launch.'],
      },
    ],
    faq: [
      { q: 'Do we have to migrate every page?', a: 'No. Retiring outdated pages is often a good idea, as long as each retired URL redirects to the closest relevant page.' },
      { q: 'Who should own the checklist?', a: 'One person, usually the marketing project lead, with a named owner for each item.' },
      { q: 'Is there a template for the redirects?', a: 'Yes. The redirect map template is a free CSV with the columns you need.' },
    ],
    related: ['/resources/redirect-map-template', '/answers/how-to-keep-seo-rankings-during-a-migration', '/answers/how-long-does-a-cms-migration-take', '/playbooks/migration'],
    updated: '2026-11-14',
  },
  {
    slug: 'redirect-map-template',
    name: 'Redirect map template',
    card: 'A CSV for pairing every old URL with its new home, ready to fill in.',
    h1: { light: 'The redirect map template.', bold: 'Every old URL, accounted for.' },
    metaTitle: 'Redirect map template (CSV) for website migrations',
    description: 'A free CSV template for mapping old URLs to new ones before a website migration, with columns for status code, page type, owner, notes and checks. No sign-up needed.',
    answer: 'A redirect map pairs every URL on your current site with its destination on the new one, so visitors and search engines land in the right place after a migration. Download the CSV, list every old URL, fill in the new URL and status code, and check each redirect before launch.',
    download: { href: '/resources/redirect-map-template.csv', label: 'Download the redirect map (CSV)' },
    groups: [
      {
        h: 'Fill it in',
        items: [
          'Put every URL from a site crawl, your analytics and your sitemap in the old URL column.',
          'Remove duplicates and tracking parameters.',
          'Find the closest matching new page for each old URL.',
          'Use 301 for permanent moves, which is almost every row.',
          'Point retired pages at the most relevant live page, not the homepage.',
          'Mark each row’s type, so you can check page, category, media and document links as groups.',
          'Give each row an owner.',
        ],
      },
      {
        h: 'Check it',
        items: [
          'No redirect points at another redirect: one hop only.',
          'No loops.',
          'Every destination loads, rather than returning an error.',
          'Your top pages by traffic and links checked by hand.',
          'Old URLs with meaningful parameters handled.',
          'Links to images and PDFs included.',
        ],
      },
      {
        h: 'After launch',
        items: [
          'Test a sample of redirects on the live site.',
          'Watch for 404s and add any redirects you missed.',
          'Update links inside the site to point straight at the new URLs.',
          'Keep the redirects in place permanently.',
          'Keep the file as the record of what moved where.',
        ],
      },
    ],
    blocks: [
      {
        h: 'The columns',
        list: [
          'Old URL: the full address on the current site.',
          'New URL: where that page lives now.',
          'Status code: 301 for a permanent move; 302 only for a genuinely temporary one.',
          'Type: page, category, media or document.',
          'Owner: who confirms the destination is right.',
          'Notes: why the page moved, merged or retired.',
          'Checked: yes once the redirect is tested.',
        ],
      },
      {
        h: 'Why it matters',
        p: ['Without redirects, old links, bookmarks and search results lead to error pages, and the standing those pages earned in search can be lost. The map is also the record you’ll come back to when someone asks where a page went.'],
      },
      {
        h: 'How Cypher handles this',
        p: ['In Cypher’s migration playbook, every redirect kept is part of the definition of done. The redirect map is built from the inventory of every page and checked before you sign off the launch.'],
      },
    ],
    faq: [
      { q: 'Should retired pages redirect to the homepage?', a: 'Usually not. Send each one to the most relevant remaining page, and use the homepage only when nothing closer exists.' },
      { q: 'Do redirects slow the site down?', a: 'A single redirect adds a small delay for the visitor following an old link. Chains add more, so keep every redirect to one hop.' },
      { q: 'What about URLs with parameters?', a: 'Strip tracking parameters before mapping, and handle meaningful ones, such as product or search parameters, with rules.' },
    ],
    related: ['/resources/website-migration-checklist', '/answers/how-to-keep-seo-rankings-during-a-migration', '/glossary#redirect-map', '/playbooks/migration'],
    updated: '2026-11-14',
  },
  {
    slug: 'personalization-readiness-checklist',
    name: 'Personalization readiness checklist',
    card: 'Everything to have in place before you switch personalization on.',
    h1: { light: 'The personalization readiness checklist.', bold: 'Switch it on, finally.' },
    metaTitle: 'Personalization readiness checklist for marketers',
    description: 'A free checklist to see whether you’re ready to switch on website personalization: goals, audiences, data and consent, content variants, platform setup and measurement.',
    answer: 'Use this checklist to find what’s stopping your personalization from going live. It covers the goal, the audiences you can recognize, the data and consent behind them, the content variants you’ll show, the setup in your platform and how you’ll measure the result. The first unchecked item is your next step.',
    groups: [
      {
        h: 'Goals and audiences',
        items: [
          'One clear goal, such as sign-ups or demo requests.',
          'A success measure, and a baseline to compare against.',
          'One to three audiences you can already recognize.',
          'A reason each audience should see something different.',
          'A named owner for personalization.',
          'Agreement on what you won’t personalize.',
        ],
      },
      {
        h: 'Data and consent',
        items: [
          'You know which data identifies each audience.',
          'The data sources you need, such as analytics or CRM, are connected to your platform.',
          'Consent rules are followed for every data source.',
          'No sensitive categories are used for targeting.',
          'A default experience is ready for visitors you can’t identify.',
          'Your privacy policy describes what you do.',
        ],
      },
      {
        h: 'Content and templates',
        items: [
          'A variant is written for each audience on the chosen page.',
          'Images and offers are approved.',
          'Templates let the right parts of the page vary.',
          'Variants are checked on phone, tablet and desktop.',
          'Fallback content is in place.',
          'Editors know how to update the variants.',
        ],
      },
      {
        h: 'Setup and measurement',
        items: [
          'Audience rules are configured in your platform.',
          'Each variant is assigned to the right audience.',
          'A control group or an A/B test is set up to measure against.',
          'Analytics records which variant each visitor saw.',
          'Each variant is checked live before you announce it.',
          'A date is set to review the results.',
          'You know what you’ll personalize next.',
        ],
      },
    ],
    blocks: [
      {
        h: 'How to use it',
        p: ['Go through it with the people who own your website, your data and your brand. Each group depends on the one before it, so start with the first unchecked item rather than the easiest one.'],
      },
      {
        h: 'Start smaller than you think',
        p: ['One page, one audience, one goal. Prove it works, then add the next page or audience. Small, measured steps get personalization live; big plans tend to stall.'],
      },
      {
        h: 'How Cypher handles this',
        p: ['The personalization playbook sets up audiences and page variants, configures A/B/n tests in your platform and checks each one before you see it. You decide the audiences and the offer.'],
      },
    ],
    faq: [
      { q: 'What’s the easiest first audience?', a: 'Returning visitors compared with first-time visitors. Most platforms can tell them apart without any extra data.' },
      { q: 'Do we need a customer data platform first?', a: 'No. Start with audiences your platform already recognizes, and add a customer data platform when you need data from other systems.' },
      { q: 'How do we know it worked?', a: 'Compare the personalized experience with a control group on the goal you chose at the start.' },
    ],
    related: ['/answers/why-isnt-our-personalization-switched-on', '/answers/how-to-run-ab-tests-in-your-cms', '/playbooks/personalization', '/platforms/optimizely/personalization'],
    updated: '2026-11-14',
  },
];

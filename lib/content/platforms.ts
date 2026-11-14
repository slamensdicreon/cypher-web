import type { Combo, Platform } from '@/lib/content/types';

/** The checks every platform page ends on: the same evidence, whatever you run. */
const CHECKS = [
  'Content parity of 98% or better against the pages being replaced',
  'Visual parity at three breakpoints',
  'Accessibility and performance on every representative page',
  'Every old URL redirected to its new home, and tested',
  'Every personalization rule and test verified before a visitor sees it',
];

export const PLATFORMS: Platform[] = [
  {
    slug: 'sitecore',
    name: 'Sitecore',
    card: 'Builds, migrations and the personalization you already paid for, on Sitecore.',
    h1: { light: 'I build on Sitecore.', bold: 'Your marketers edit it on day one.' },
    metaTitle: 'Cypher on Sitecore: builds, migrations, personalization',
    description: 'Cypher builds, migrates and personalizes Sitecore sites: components your marketers can edit, every page checked, and a plan you approve once.',
    answer:
      'Cypher builds, migrates, personalizes and optimizes websites on Sitecore. Its team of twenty-one specialists inventories your current site, writes a plan you approve once, builds components your marketers edit in Sitecore on day one, and checks every page for content parity, visual parity and accessibility before you sign off the launch.',
    blocks: [
      {
        h: 'What I do on Sitecore',
        p: ['Most Sitecore projects stall in the same places: a component library nobody finishes, content that moves by hand, and personalization that was licensed and never switched on. I run all three as playbooks, with the same team every day.'],
        list: [
          'New sites and redesigns, built as components your editors can reuse',
          'Migrations onto Sitecore, or from an older Sitecore setup to a newer one',
          'Personalization and testing set up in the platform and checked before you see it',
          'Speed, accessibility and SEO work, with the reports as evidence',
        ],
      },
      {
        h: 'Built the way your editors work',
        p: [
          'Every component is built with the fields and variants your editors need, and written up in a component catalog. Pages are assembled from those components, so a marketer can change a headline, swap an image or add a section without a ticket.',
          'At handover you get an editor guide written for marketers, not developers.',
        ],
      },
      {
        h: 'Where Sitecore projects usually go wrong',
        list: [
          'Too many near-identical components. Three hero components that differ only in layout should be one component with a setting.',
          'Content in the wrong place. Copy hard-coded in templates can’t be edited, translated or personalized.',
          'Personalization tied to an older setup. Rules built for a self-hosted installation don’t carry over to a headless or SaaS build by themselves; they have to be rebuilt deliberately.',
          'Multisite and languages left until late. Shared components, site-specific settings and language versions belong in the plan, not in the launch week.',
          'Media without the details. Alt text, focal points and file sizes are checked page by page, not assumed.',
        ],
      },
      { h: 'What I check before you sign off', list: CHECKS },
      {
        h: 'What you own at the end',
        p: ['Your code in your repository, your Sitecore setup configured and documented, an editor guide, a component catalog, the evidence for every page, and a known-gaps report. No retainer to keep the lights on.'],
      },
    ],
    faq: [
      { q: 'Do you work with Sitecore’s headless and SaaS setups?', a: 'Yes. Cypher builds headless front ends and works with Sitecore’s SaaS direction as well as older, self-hosted installations. The plan records which setup you run before anyone builds.' },
      { q: 'Can you move us from an older Sitecore setup to a newer one?', a: 'That’s the migration playbook. Content, components and redirects are inventoried first, and personalization rules are rebuilt for the new setup rather than copied.' },
      { q: 'Will our marketers be able to edit the new site?', a: 'On day one. Every page is assembled from components with editable fields, and the handover includes an editor guide written for marketers.' },
      { q: 'Do we need Sitecore developers on our side?', a: 'No. You bring access and decisions; Cypher’s specialists build. People who know the platform stand behind every project.' },
    ],
    related: ['/platforms/sitecore/migration', '/playbooks/migration', '/playbooks/personalization', '/answers/why-isnt-our-personalization-switched-on', '/resources/website-migration-checklist'],
    updated: '2026-11-14',
  },
  {
    slug: 'optimizely',
    name: 'Optimizely',
    card: 'Content, blocks and experimentation, set up and checked on Optimizely.',
    h1: { light: 'I build on Optimizely.', bold: 'And I switch the testing on.' },
    metaTitle: 'Cypher on Optimizely: builds, migrations, testing',
    description: 'Cypher builds, migrates and optimizes Optimizely sites: reusable blocks your editors control, personalization by audience, and A/B tests checked before launch.',
    answer:
      'Cypher builds, migrates and optimizes websites on Optimizely. It plans content types and reusable blocks your editors control, sets up audience-based personalization and A/B tests in the platform, checks each one before a visitor sees it, and verifies every page for content parity, visual parity and accessibility before you sign off.',
    blocks: [
      {
        h: 'What I do on Optimizely',
        p: ['Optimizely brings content management and experimentation together, which is exactly why so many teams only use half of it. I build the site and switch on the other half: the audiences, the variants and the tests you bought it for.'],
        list: [
          'New sites and redesigns, built from reusable blocks',
          'Migrations onto Optimizely from another platform',
          'Personalization by audience, set up and verified',
          'A/B/n tests configured with one goal each',
          'Speed, accessibility and SEO work, with the evidence',
        ],
      },
      {
        h: 'Blocks your editors can reuse',
        p: ['Pages are built from blocks with the fields and options your team needs, so a marketer can put together a campaign page without a developer. Every block is written up in a component catalog, with where it’s used.'],
      },
      {
        h: 'Where Optimizely projects usually go wrong',
        list: [
          'Blocks copied instead of reused. Ten versions of the same promo block means ten places to fix; one block with settings is easier for everyone.',
          'Audiences nobody defined. Personalization needs agreed audiences first: who they are, how the site recognizes them, and what each should see.',
          'Tests without a goal. Every test needs one primary metric decided before it starts, or nobody can call the result.',
          'Flicker on page-level tests. Tests that change the page in the browser can flash the original first, so how each variant loads gets checked.',
          'Content structure carried over as is. A migration is the moment to fix content types that grew by accident.',
        ],
      },
      { h: 'What I check before you sign off', list: [...CHECKS.slice(0, 4), 'Each test’s goal, audience and traffic split, verified before it starts'] },
      {
        h: 'What you own at the end',
        p: ['Your code in your repository, your Optimizely setup documented, audiences and tests your team can run, an editor guide, a component catalog, the evidence for every page, and a known-gaps report.'],
      },
    ],
    faq: [
      { q: 'Can you set up our A/B tests in Optimizely?', a: 'Yes. Tests are configured in the platform with one goal each, checked before they start, and handed over with a note on how to read the results.' },
      { q: 'Do you build personalization for different audiences?', a: 'Yes. Audiences are agreed first, then the variants are built and each one is verified before a visitor sees it. Who sees what is one of the few decisions that’s yours.' },
      { q: 'Can you migrate us onto Optimizely?', a: 'That’s the migration playbook: every page inventoried, content moved and checked for parity, every old URL redirected, and visual parity checked at three breakpoints.' },
    ],
    related: ['/platforms/optimizely/personalization', '/playbooks/personalization', '/answers/how-to-run-ab-tests-in-your-cms', '/resources/personalization-readiness-checklist', '/playbooks/migration'],
    updated: '2026-11-14',
  },
  {
    slug: 'contentful',
    name: 'Contentful',
    card: 'Content models, front ends and migrations, on Contentful.',
    h1: { light: 'I build on Contentful.', bold: 'Content models your team can actually run.' },
    metaTitle: 'Cypher on Contentful: content models, builds, migration',
    description: 'Cypher builds and migrates Contentful sites: content models your team can run, a matching front end, working previews, and every page checked before launch.',
    answer:
      'Cypher builds and migrates websites on Contentful. It designs content models your team can run, builds the front end that renders them, sets up previews so editors see changes before publishing, moves existing content into the new model, and checks every page for content parity, visual parity and accessibility before launch.',
    blocks: [
      {
        h: 'What I do on Contentful',
        p: ['Contentful stores the content; your site decides how it looks. That split is its strength and the reason projects slip: the content model, the front end and the editing experience all have to be designed together. I run them as one project.'],
        list: [
          'Content models designed around how your team publishes',
          'A front end built to render them, pixel for pixel',
          'Preview set up so editors see a page before it goes live',
          'Migrations from another CMS into your new content model',
          'Localization, SEO fields and redirects planned up front',
        ],
      },
      {
        h: 'The content model comes first',
        p: ['A good content model mirrors how your marketers think: pages, sections, promos, products, people. A poor one mirrors a database. I write the model into the plan before anyone builds, with every content type, field and reference, so you approve the structure once.'],
      },
      {
        h: 'Where Contentful projects usually go wrong',
        list: [
          'Models that copy the old site’s pages. Every page becomes its own content type, and nothing can be reused.',
          'References nested too deep. Content that sits several references down is hard to find, hard to translate and slow to load.',
          'No preview. Editors publish to see what they changed. Preview is set up and tested before handover.',
          'Localization decided late. Which fields are translated, and who translates them, is a model decision, not a launch task.',
          'Rich text used for everything. Layout hidden inside rich text can’t be reused or checked; structured fields can.',
        ],
      },
      { h: 'What I check before you sign off', list: CHECKS },
      {
        h: 'What you own at the end',
        p: ['Your content model documented field by field, your front-end code in your repository, previews working, an editor guide written for marketers, the evidence for every page, and a known-gaps report.'],
      },
    ],
    faq: [
      { q: 'Do you build the front end too?', a: 'Yes. Contentful holds the content; Cypher builds the site that renders it and checks every page against the design and the content it replaces.' },
      { q: 'Can you migrate our content into Contentful?', a: 'Yes. Old pages are mapped to the new content types, content is moved and checked for parity of 98% or better, and every old URL is redirected.' },
      { q: 'Will editors be able to preview changes?', a: 'Preview is part of the build and tested before handover, so editors see a page as visitors will before they publish.' },
    ],
    related: ['/platforms/contentful/migration', '/answers/what-is-a-headless-cms', '/playbooks/website-build', '/playbooks/migration', '/glossary'],
    updated: '2026-11-14',
  },
  {
    slug: 'other-platforms',
    name: 'Any platform',
    card: 'Another enterprise platform, an open-source CMS, a headless platform, or none at all.',
    h1: { light: 'I build on whatever you run.', bold: 'Or whatever you’re moving to.' },
    metaTitle: 'Cypher on any CMS or enterprise platform',
    description: 'Not on Sitecore, Optimizely or Contentful? Cypher runs the same playbooks on other enterprise platforms, open-source and headless CMSs, and sites with no CMS.',
    answer:
      'Cypher works on any enterprise platform, not only Sitecore, Optimizely and Contentful. It starts by verifying access and recording what your platform can and can’t do, then runs the same playbooks: a plan you approve once, components your team edits, every page checked, and a handover your people can own.',
    blocks: [
      {
        h: 'Same playbooks, any platform',
        p: ['The method doesn’t change with the platform: discover, plan, build, check, hand over. What changes is the knowledge. Before anyone builds, I record the facts of your platform in the plan: how content is modeled, how pages are put together, how publishing and permissions work, and what it can’t do.'],
      },
      {
        h: 'What that covers',
        list: [
          'Other enterprise content and experience platforms',
          'Open-source CMSs',
          'Headless content platforms with a separate front end',
          'Commerce platforms with content on top',
          'Sites with no CMS at all that need one',
          'Moving from any of these to any other',
        ],
      },
      {
        h: 'How I learn a new platform',
        steps: [
          { t: 'Verify access', b: 'Credentials and environments are checked and recorded before work starts.' },
          { t: 'Inventory the site', b: 'Every page, component, route and asset is listed from the live site.' },
          { t: 'Write down the facts', b: 'What the platform supports, where its limits are, and how your team uses it today.' },
          { t: 'Plan around them', b: 'The plan says how each part will be built on this platform, and you approve it once.' },
        ],
      },
      { h: 'What I check before you sign off', list: CHECKS },
      {
        h: 'If you’re choosing a platform',
        p: ['If the real question is which platform to move to, that decision is yours. I’ll lay out what each option means for your content, your team and your timeline, and then run the migration on whichever you choose.'],
      },
    ],
    faq: [
      { q: 'Which platforms does Cypher work on?', a: 'Any enterprise platform. Sitecore, Optimizely and Contentful are home turf; others start with a discovery step that records how your platform works before anyone builds.' },
      { q: 'What if we don’t have a CMS?', a: 'Then the build includes one: a content model your team can run, an editing experience, and a handover your people can own.' },
      { q: 'Can you help us choose a new platform?', a: 'Cypher can lay out what each option means for your content and your team. The choice is yours; the migration runs the same way on whichever you pick.' },
    ],
    related: ['/playbooks/migration', '/answers/how-to-merge-several-websites-into-one', '/answers/what-is-a-headless-cms', '/how-it-works', '/resources/website-migration-checklist'],
    updated: '2026-11-14',
  },
];

export const COMBOS: Combo[] = [
  {
    platform: 'sitecore',
    slug: 'migration',
    name: 'Sitecore migration',
    card: 'Moving onto Sitecore, or to a newer Sitecore setup, with nothing left behind.',
    h1: { light: 'Migrating to Sitecore?', bold: 'Nothing gets left behind.' },
    metaTitle: 'Sitecore migration: content, components and redirects',
    description: 'How Cypher runs a Sitecore migration: every page inventoried, components rebuilt, content checked for parity and every old URL redirected before launch.',
    answer:
      'A Sitecore migration with Cypher moves your site onto Sitecore, or from an older Sitecore setup to a newer one, without losing content or URLs. Every page is inventoried first, components are rebuilt rather than copied, content is checked for parity of 98% or better, and every old URL is redirected before launch.',
    blocks: [
      {
        h: 'Two kinds of Sitecore migration',
        p: ['Some teams are moving onto Sitecore from another platform. Others are already on Sitecore and moving from an older, self-hosted setup toward headless delivery and SaaS. The playbook is the same; the inventory is different.'],
        list: [
          'Onto Sitecore: pages and content mapped into Sitecore templates and components',
          'Within Sitecore: components rebuilt for headless delivery, and anything tied to the old setup rebuilt deliberately',
        ],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Inventory', b: 'Every page, component, template, media item and URL on the current site, recorded before anyone builds.' },
          { t: 'The plan', b: 'Old pages mapped to new templates and components. You approve it once.' },
          { t: 'Rebuild, don’t copy', b: 'Near-duplicate components become one component with settings, so editors learn less and the site stays consistent.' },
          { t: 'Move the content', b: 'Content moves into the new structure and is checked against the original, page by page.' },
          { t: 'Redirects', b: 'Every old URL gets a redirect to its new home, tested before launch.' },
          { t: 'Sign-off', b: 'You approve the launch with the parity, accessibility and performance evidence in front of you.' },
        ],
      },
      {
        h: 'What usually gets missed',
        list: [
          'Personalization rules and goals tied to the old setup, which have to be rebuilt rather than moved',
          'Content hard-coded in templates that editors could never change',
          'Language versions and site-specific settings in multisite installations',
          'Media details: alt text, focal points and file sizes',
          'Forms and integrations that quietly post to old endpoints',
        ],
      },
      { h: 'The checks', list: CHECKS },
    ],
    faq: [
      { q: 'How long does a Sitecore migration take?', a: 'It depends on how many pages, components and languages you have. The inventory answers that early, and the plan you approve says what will be built and in what order.' },
      { q: 'Will our personalization carry over?', a: 'Rules built for an older setup usually have to be rebuilt for the new one. Cypher lists every rule in the inventory and rebuilds the ones you still want, verified before visitors see them.' },
      { q: 'What happens to our search rankings?', a: 'Every old URL is redirected to its new home, SEO fields move with the content, and redirects are tested before launch.' },
    ],
    related: ['/platforms/sitecore', '/playbooks/migration', '/answers/how-to-keep-seo-rankings-during-a-migration', '/resources/redirect-map-template', '/resources/website-migration-checklist'],
    updated: '2026-11-14',
  },
  {
    platform: 'optimizely',
    slug: 'personalization',
    name: 'Optimizely personalization',
    card: 'The audiences, variants and tests you bought Optimizely for, switched on.',
    h1: { light: 'Personalization on Optimizely.', bold: 'Switched on. Finally.' },
    metaTitle: 'Optimizely personalization and A/B testing, set up',
    description: 'How Cypher switches on personalization and testing in Optimizely: agreed audiences, a variant for each, A/B tests with one goal, and every one checked first.',
    answer:
      'Personalization on Optimizely with Cypher starts with agreeing the audiences, then building a variant for each and setting up A/B tests with one clear goal. Every audience, variant and test is checked before a visitor sees it, and you decide who sees what. It’s all configured in your Optimizely, so your team can run it after.',
    blocks: [
      {
        h: 'Why it’s still switched off',
        p: ['Most teams licensed personalization and testing and never got to it. Not because it’s hard to switch on, but because it needs decisions nobody had time to make: which audiences matter, what each should see, and how you’ll know it worked.'],
      },
      {
        h: 'How I switch it on',
        steps: [
          { t: 'Agree the audiences', b: 'Who they are, how the site recognizes them, and why they should see something different.' },
          { t: 'Build the variants', b: 'A version of each page or block for each audience, built from the components you already have.' },
          { t: 'Set up the tests', b: 'Each test gets one primary goal, a traffic split and a stopping point, decided before it starts.' },
          { t: 'Check everything', b: 'Every audience, variant and test is verified before a visitor sees it.' },
          { t: 'Hand it over', b: 'A note for each test on what it’s measuring and how to read the result.' },
        ],
      },
      {
        h: 'Decisions that are yours',
        p: ['Who sees the offer first. Which message leads. When a test is done. Each arrives with my pick, my reason and a deadline, and if you say nothing I go ahead with my pick.'],
      },
      {
        h: 'What usually goes wrong',
        list: [
          'Audiences defined so narrowly that almost nobody qualifies',
          'Tests with several goals, so no result is clear',
          'Variants that flash the original page before they load',
          'Personalization nobody can see in preview, so nobody trusts it',
          'Tests left running long after they answered the question',
        ],
      },
    ],
    faq: [
      { q: 'Do we need a developer to run tests after handover?', a: 'No. Tests and audiences are configured in Optimizely, where your team can run them, with a note on how each one works.' },
      { q: 'How many audiences should we start with?', a: 'Few. Two or three well-defined audiences with a clear reason to see something different beat a long list nobody maintains.' },
      { q: 'What is an A/B/n test?', a: 'A test that shows two or more versions of a page or block to different visitors and measures which does better against a single goal.' },
    ],
    related: ['/platforms/optimizely', '/playbooks/personalization', '/answers/why-isnt-our-personalization-switched-on', '/answers/how-to-run-ab-tests-in-your-cms', '/resources/personalization-readiness-checklist'],
    updated: '2026-11-14',
  },
  {
    platform: 'contentful',
    slug: 'migration',
    name: 'Contentful migration',
    card: 'From your current CMS into a Contentful content model your team can run.',
    h1: { light: 'Moving to Contentful?', bold: 'Start with the content model.' },
    metaTitle: 'Contentful migration: content model, content, redirects',
    description: 'How Cypher migrates a site to Contentful: pages mapped to a new content model, content moved and checked for parity, and every old URL redirected.',
    answer:
      'A Contentful migration with Cypher maps your current pages to a new content model, moves the content into it, builds the front end that renders it, and redirects every old URL. Content is checked for parity of 98% or better, pages for visual parity at three breakpoints, and editors get working previews before launch.',
    blocks: [
      {
        h: 'Why the model matters more than the move',
        p: ['Moving to a headless platform is a chance to fix how content is structured. Copy the old site page for page and you inherit its problems. Model the content around how your team publishes, and every future page gets easier.'],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Inventory', b: 'Every page, template, component, media item and URL on the current site.' },
          { t: 'Model', b: 'Content types, fields and references designed in the plan and approved once.' },
          { t: 'Map', b: 'Each old page type mapped to the new model, so nothing is left without a home.' },
          { t: 'Move and check', b: 'Content moved into Contentful and checked against the original, page by page.' },
          { t: 'Build the front end', b: 'The site that renders the new model, matched to the design at three breakpoints.' },
          { t: 'Redirect and launch', b: 'Every old URL redirected and tested; you sign off with the evidence in front of you.' },
        ],
      },
      {
        h: 'What usually gets missed',
        list: [
          'Content trapped in rich text or HTML that needs to become structured fields',
          'Locales, and which fields are translated',
          'Assets without alt text, or stored twice',
          'SEO fields and metadata that lived in the old templates',
          'Preview, so editors can see a page before publishing',
        ],
      },
      {
        h: 'What you own at the end',
        p: ['Your content model documented field by field, your front-end code in your repository, previews working, an editor guide, the evidence for every page, and a known-gaps report.'],
      },
    ],
    faq: [
      { q: 'Do we have to redesign when we move to Contentful?', a: 'No. Cypher can rebuild your current design pixel for pixel on the new model, or build a new one. Either way the content model is designed for how your team works.' },
      { q: 'Can old content be cleaned up during the move?', a: 'Yes. The inventory shows duplicates, orphaned pages and outdated content, and you decide what moves. Everything that moves is checked for parity.' },
      { q: 'How do we keep our search rankings?', a: 'Every old URL is redirected to its new home, SEO fields move with the content, and redirects are tested before launch.' },
    ],
    related: ['/platforms/contentful', '/answers/what-is-a-headless-cms', '/playbooks/migration', '/resources/website-migration-checklist', '/answers/what-is-content-parity'],
    updated: '2026-11-14',
  },
];

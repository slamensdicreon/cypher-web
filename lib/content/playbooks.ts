import type { Playbook } from '@/lib/content/types';

/**
 * Every playbook: the card on /playbooks and its own page at /playbooks/[slug]. The cards’ lines and
 * "what you get" match the live index; the pages say how each one runs, what it checks, what you
 * decide and what you own.
 */
export const PLAYBOOKS: Playbook[] = [
  {
    slug: 'homepage-rebuild',
    name: 'Homepage rebuild',
    demo: true,
    card: 'Your homepage, rebuilt on your platform, while you watch.',
    gets: ['Your real homepage, rebuilt', 'The replay of every step', 'What the rest would take'],
    h1: { light: 'Your homepage, rebuilt on your platform.', bold: 'While you watch.' },
    metaTitle: 'Homepage rebuild playbook | Cypher',
    description: 'See Cypher rebuild your real homepage on Sitecore, Optimizely, Contentful or your own platform, live in a demo, with a replay of every step it took.',
    answer: 'The homepage rebuild is the playbook Cypher runs in a demo. It points at your live homepage, breaks it into components and content, and rebuilds it on your platform, pixel for pixel, while you watch. You keep a replay of every step and a plain account of what the rest of your site would take.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'Your real homepage, rebuilt on your platform, not a mock-up',
          'The replay of every step: who did what, with which tool, and what happened',
          'What the rest would take: the pages, templates and components still to build, in writing',
          'A feel for the three decisions a full build would ask of you',
        ],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Tell it the site', b: 'You share your homepage and the platform you run. Cypher checks what it can see and writes down what it finds.' },
          { t: 'It reads the page', b: 'The specialists break the homepage into components and content, the same way a full build’s discovery does.' },
          { t: 'It builds, on your platform', b: 'Components first, then the page, each checked against your live homepage before it moves on.' },
          { t: 'You watch, and ask', b: 'You see the team at work on the Floor. Ask Cypher anything, in a sentence.' },
          { t: 'You keep the replay', b: 'Every action is on the record, so you can replay the build afterwards, step by step, and show anyone.' },
        ],
      },
      {
        h: 'What it checks',
        p: ['The same checks a full build uses, on one page:'],
        list: [
          'The rebuilt page against the live one, at phone, tablet and desktop widths',
          'Accessibility and speed on the rebuilt page',
          'That every component can be edited the way your team edits today',
        ],
      },
      {
        h: 'What you decide',
        p: ['Nothing, unless you want to: a demo runs on Cypher’s picks. In a full build, about three decisions are yours, each arriving with Cypher’s pick, its reason and a deadline.'],
      },
      {
        h: 'Which platforms',
        p: ['Sitecore, Optimizely and Contentful are home turf, and any enterprise platform works. Tell us what you run when you book.'],
      },
    ],
    faq: [
      { q: 'Is the rebuild real, or a mock-up?', a: 'Real. Cypher rebuilds your homepage on your platform, with components your team could edit. You watch it being built, not a slide about it.' },
      { q: 'What do you need from us?', a: 'Your homepage and the platform you run. Cypher asks for anything else it needs, and nothing it doesn’t.' },
      { q: 'How long is the demo?', a: 'Thirty minutes, on your site. No slides.' },
      { q: 'What happens after?', a: 'You keep the replay and an account of what the rest would take. If you like what you saw, we talk about the next playbook. If not, you’ve seen something new.' },
    ],
    related: ['/demo', '/playbooks/website-build', '/how-it-works', '/answers/how-does-an-ai-team-build-a-website'],
    updated: '2026-11-14',
  },
  {
    slug: 'website-build',
    name: 'Website build',
    card: 'A new site, pixel for pixel. Your team edits it on day one.',
    gets: ['Every page and template, in your brand', 'An editor guide and component catalog', 'Speed and accessibility reports'],
    h1: { light: 'A new site, pixel for pixel.', bold: 'Your team edits it on day one.' },
    metaTitle: 'Website build playbook: new sites, pixel perfect | Cypher',
    description: 'How Cypher builds a new website on your platform: every page and template in your brand, an editor guide and component catalog, and the reports to prove it.',
    answer: 'The website build playbook takes a new site from brief to launch on your platform. Cypher’s specialists build every component, template and page in your brand, check each one before it moves on, and hand over an editor guide and a component catalog so your team edits the site on day one.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'Every page and template, built in your brand',
          'Components your marketers can edit and reuse',
          'An editor guide, written for marketers',
          'A component catalog: every component, its fields and its variants',
          'Speed and accessibility reports, page by page',
          'A known-gaps report: anything not done, and why',
        ],
      },
      {
        h: 'How it runs',
        p: ['Ten phases, in the same order every time. Two of them end in a gate that waits for you.'],
        steps: [
          { t: 'Intake and discovery', b: 'Cypher checks access to your platform, reads the designs and the current site, and writes down what it finds.' },
          { t: 'The Blueprint, your first gate', b: 'Every component, template and page the team will build, and how. You approve it once; after that, nothing changes without you knowing.' },
          { t: 'Foundation, components, templates', b: 'The team sets up the project, builds each component, then the templates that use them. Every component is reviewed before it moves on.' },
          { t: 'Content and experience', b: 'Pages are assembled and the content goes in. Each page is checked for speed, accessibility and how it looks at phone, tablet and desktop widths.' },
          { t: 'Deployment and UAT, your second gate', b: 'The site deploys where you run things. You sign it off with the evidence in front of you.' },
        ],
      },
      {
        h: 'What it checks',
        list: [
          'Every component against the design, before it moves on',
          'Every page at phone, tablet and desktop widths',
          'Accessibility and speed on every representative page',
          'That marketers can edit each component the way the editor guide says',
        ],
      },
      {
        h: 'What you decide',
        p: ['About three things, the ones only you can answer: usually the plan itself, a trade-off in the design, and the launch. Each arrives with Cypher’s pick, its reason and a deadline. Say nothing and it goes ahead with its pick, except at the two gates, which wait for you.'],
      },
      {
        h: 'What you own at the end',
        p: ['Your code in your repository, deployed to your hosting, with your keys. The editor guide, the component catalog, the reports and the known-gaps report are yours too. No retainer to keep the lights on.'],
      },
      {
        h: 'Which platforms',
        p: ['Sitecore, Optimizely and Contentful are home turf, and any enterprise platform works. The playbook stays the same; the platform knowledge changes.'],
      },
    ],
    faq: [
      { q: 'Can our marketers really edit it on day one?', a: 'Yes. Every component is built to be edited in your platform, and the editor guide shows how, page by page.' },
      { q: 'Do you design the site too?', a: 'Cypher builds pixel for pixel from the designs you bring, or from the site you have today.' },
      { q: 'What if something isn’t finished?', a: 'It’s in the known-gaps report, in writing, with the reason. No surprises in month three.' },
      { q: 'Who stands behind the work?', a: 'Cypher’s specialists do the work, and people who know the platforms stand behind every project.' },
    ],
    related: ['/how-it-works', '/playbooks/migration', '/playbooks/design-systems', '/answers/what-should-a-website-launch-checklist-include', '/answers/how-to-check-accessibility-before-launch', '/platforms/sitecore'],
    updated: '2026-11-14',
  },
  {
    slug: 'migration',
    name: 'Migration',
    card: 'Move platforms, or merge six sites into one. Nothing left behind.',
    gets: ['Content parity of 98% or better', 'Every old URL redirected', 'Looks right on phone, tablet and desktop'],
    h1: { light: 'Move platforms, or merge six sites into one.', bold: 'Nothing left behind.' },
    metaTitle: 'Website migration playbook: no page left behind | Cypher',
    description: 'How Cypher migrates websites between platforms or merges several into one: content parity of 98% or better, every old URL redirected, every page checked.',
    answer: 'The migration playbook moves a site from one platform to another, or merges several sites into one. Cypher inventories every page, moves the content, redirects every old URL and checks each new page against its original, delivering content parity of 98% or better and visual parity at phone, tablet and desktop widths.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'Content parity of 98% or better, checked page by page',
          'Every old URL redirected to its new home',
          'Pages that look right on phone, tablet and desktop',
          'A redirect map and a parity report you keep',
          'A known-gaps report: anything not moved, and why',
        ],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Inventory everything', b: 'Cypher crawls the live site, or sites, and lists every page, template, component, media item and URL before anything moves.' },
          { t: 'The plan, your first gate', b: 'The Blueprint maps old to new: which templates become which, what merges and what retires. You approve it once.' },
          { t: 'Build the new home', b: 'Components and templates are built on the new platform, each one checked before it moves on.' },
          { t: 'Move the content', b: 'Content moves in batches. Each page is compared with its original, and any gap is fixed or written down.' },
          { t: 'Redirect and launch, your second gate', b: 'Every old URL gets a redirect. You sign off with the parity and redirect reports in front of you.' },
        ],
      },
      {
        h: 'What it checks',
        list: [
          'Every migrated page against its original, for content and layout',
          'Visual parity at phone, tablet and desktop widths',
          'Every redirect resolves, with no chains or loops',
          'SEO fields, metadata and the sitemap carried over',
        ],
      },
      {
        h: 'What you decide',
        p: ['About three things. In a migration they’re usually the source of truth where two systems disagree, what to retire rather than move, and when to switch over. Each arrives with Cypher’s pick and a deadline.'],
      },
      {
        h: 'Merging several sites',
        p: ['Six sites into one is the same playbook with one more question: which content wins where sites overlap. Cypher finds the overlaps during the inventory and brings you only the few that need a decision.'],
      },
      {
        h: 'What you own at the end',
        p: ['The new site, your code, your hosting and your keys, plus the redirect map, the parity report and the known-gaps report.'],
      },
    ],
    faq: [
      { q: 'What does content parity of 98% mean?', a: 'That at least 98% of the content on the old site is present on the new one, checked page by page. Anything missing is listed, with the reason.' },
      { q: 'Will we lose search rankings?', a: 'Every old URL is redirected, and SEO fields, metadata and the sitemap are carried over and checked. Those are the things that protect rankings in a migration.' },
      { q: 'Which platforms can you migrate between?', a: 'Sitecore, Optimizely and Contentful are home turf. For anything else, tell us what you run when you book a demo.' },
      { q: 'What about content nobody owns?', a: 'Cypher lists it during the inventory. You decide once whether it moves or retires, and your answer becomes a rule for everything like it.' },
    ],
    related: ['/platforms/sitecore/migration', '/platforms/contentful/migration', '/answers/how-long-does-a-cms-migration-take', '/answers/how-to-keep-seo-rankings-during-a-migration', '/answers/what-is-content-parity', '/resources/website-migration-checklist', '/resources/redirect-map-template'],
    updated: '2026-11-14',
  },
  {
    slug: 'portals',
    name: 'Customer and member portals',
    card: 'Log in, self-serve, done. The portal your customers keep asking for.',
    gets: ['Journeys working end to end, by persona', 'Sign-in and profiles wired to your systems', 'Tested on real accounts'],
    h1: { light: 'Log in, self-serve, done.', bold: 'The portal your customers keep asking for.' },
    metaTitle: 'Customer and member portal playbook | Cypher',
    description: 'How Cypher builds customer and member portals: journeys working end to end by persona, sign-in and profiles wired to your systems, tested on real accounts.',
    answer: 'The portals playbook builds the logged-in part of your site: sign-in, profiles and the self-service journeys your customers or members need. Cypher maps each journey by persona, connects it to the systems behind it, and tests it end to end on real accounts before you sign it off.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'Journeys working end to end, by persona',
          'Sign-in and profiles wired to your systems',
          'Content your team edits, inside and outside the login',
          'Every journey tested on real accounts',
        ],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Map the journeys', b: 'Cypher lists who logs in, what each persona needs to do, and which systems hold the answers.' },
          { t: 'The plan, your first gate', b: 'Every journey, page and connection in the Blueprint. You approve it once.' },
          { t: 'Build and connect', b: 'Components, templates and pages are built, and each journey is connected to the systems behind it.' },
          { t: 'Test on real accounts', b: 'Each journey runs end to end as each persona, on real accounts, before it moves on.' },
          { t: 'Launch, your second gate', b: 'You sign off with every journey’s results in front of you.' },
        ],
      },
      {
        h: 'What it checks',
        list: [
          'Every journey, end to end, for every persona',
          'What each persona can and can’t see',
          'Accessibility and speed on the pages people use most',
          'Error messages that tell people what to do next',
        ],
      },
      {
        h: 'What you decide',
        p: ['About three things: usually which journeys come first, which system is the source of truth for a customer record, and the launch. Each arrives with Cypher’s pick and a deadline.'],
      },
      {
        h: 'Which platforms',
        p: ['Sitecore, Optimizely and Contentful are home turf, and the systems behind sign-in and profiles are whichever ones you run. Tell us what they are when you book.'],
      },
    ],
    faq: [
      { q: 'Which sign-in systems do you work with?', a: 'The ones you already run. Cypher records what it finds in discovery and connects to it; the Blueprint says exactly how.' },
      { q: 'Can marketers edit content inside the portal?', a: 'Yes. Content inside and outside the login is built in your platform, so your team edits it the same way.' },
      { q: 'How is it tested?', a: 'Every journey runs end to end as each persona on real accounts, before it moves on. You see the results at sign-off.' },
    ],
    related: ['/how-it-works', '/playbooks/website-build', '/playbooks/personalization', '/answers/what-does-a-marketer-decide-in-a-website-build', '/platforms/other-platforms'],
    updated: '2026-11-14',
  },
  {
    slug: 'personalization',
    name: 'Personalization',
    card: 'The personalization you paid for and never switched on.',
    gets: ['Audiences and page variants', 'A/B/n tests set up in your platform', 'Each one checked before you see it'],
    h1: { light: 'The personalization you paid for.', bold: 'Switched on.' },
    metaTitle: 'Personalization playbook: switched on, checked | Cypher',
    description: 'How Cypher switches on the personalization you already paid for: audiences, page variants and A/B/n tests set up in your platform and checked before launch.',
    answer: 'The personalization playbook switches on the personalization most platforms already include and most teams never get to. Cypher defines the audiences, builds the page variants, sets up A/B/n tests in your platform and checks every one before you see it, so your team can run and change them without a developer.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'Audiences defined in your platform',
          'Page variants built for each audience',
          'A/B/n tests set up and ready to run',
          'Each one checked before you see it',
          'A guide your team uses to change them',
        ],
      },
      {
        h: 'Why it never got switched on',
        p: ['It usually isn’t the software. Personalization needs audiences someone agreed, content for every variant, and an engineer to wire it up, all at the same time. That’s three teams’ calendars, so it waits for next quarter. Cypher does the wiring and the variants, and brings you only the calls that are yours.'],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Read what you have', b: 'Cypher checks what your platform can do, what data feeds it, and which pages matter most.' },
          { t: 'The plan, your first gate', b: 'Audiences, variants and tests in the Blueprint. You approve it once.' },
          { t: 'Build the variants', b: 'Each variant is built as content your team can edit, on the pages the plan names.' },
          { t: 'Set up the tests', b: 'Audiences and A/B/n tests are configured in your platform, with what each test measures written down.' },
          { t: 'Check, then launch: your second gate', b: 'Every audience and variant is checked to show the right content to the right people. You sign off before anything goes live.' },
        ],
      },
      {
        h: 'What you decide',
        p: ['About three things: usually which audiences matter, which offer leads for each, and when the tests go live. Each arrives with Cypher’s pick and a deadline.'],
      },
      {
        h: 'Which platforms',
        p: ['Sitecore, Optimizely and Contentful each have their own way to personalize and test, and Cypher works in the one you have. Other platforms work too: tell us what you run.'],
      },
    ],
    faq: [
      { q: 'Do we need new software?', a: 'Usually not. Enterprise platforms tend to include personalization and testing already; Cypher sets up what you have.' },
      { q: 'Who decides the audiences?', a: 'You do, once. Cypher brings a pick and its reason, and your answer becomes a rule for everything like it.' },
      { q: 'Can our team change variants later?', a: 'Yes. Variants are content in your platform, and the guide shows how to change them and start new tests.' },
      { q: 'How do we know the right people see the right variant?', a: 'Every audience and variant is checked before you see it, and the checks are on the record.' },
    ],
    related: ['/platforms/optimizely/personalization', '/answers/why-isnt-our-personalization-switched-on', '/answers/how-to-run-ab-tests-in-your-cms', '/resources/personalization-readiness-checklist', '/playbooks/optimization'],
    updated: '2026-11-14',
  },
  {
    slug: 'optimization',
    name: 'Optimization',
    card: 'Faster, accessible, easier to find, with the reports to prove it.',
    gets: ['Speed and accessibility on every key page', 'SEO fields, sitemap and redirects', 'Error pages that help'],
    h1: { light: 'Faster, accessible, easier to find.', bold: 'With the reports to prove it.' },
    metaTitle: 'Website optimization playbook: speed, SEO, access | Cypher',
    description: 'How Cypher makes your site faster, accessible and easier to find: speed and accessibility checked on every key page, SEO fields, sitemap and redirects done.',
    answer: 'The optimization playbook improves the site you already have, with no rebuild. Cypher measures speed and accessibility on every key page, fixes what it finds in your components, completes SEO fields, the sitemap and redirects, makes error pages helpful, and hands you before-and-after reports as evidence.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'Speed and accessibility measured on every key page, before and after',
          'Fixes made in your platform, component by component',
          'SEO fields, the sitemap and redirects completed',
          'Error pages that help people find their way',
          'The reports, page by page, as evidence',
        ],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Measure', b: 'Cypher runs Lighthouse and axe on every representative page and lists what fails, by component.' },
          { t: 'The plan, your first gate', b: 'What to fix, in what order, and why. You approve it once.' },
          { t: 'Fix', b: 'Fixes go into the components, so every page that uses them improves at once. Each fix is checked before it moves on.' },
          { t: 'Get found', b: 'SEO titles, descriptions, structured fields, the sitemap and redirects are completed and checked.' },
          { t: 'Prove it, your second gate', b: 'The same checks run again. You sign off with the before-and-after reports in front of you.' },
        ],
      },
      {
        h: 'What it checks',
        list: [
          'Speed, with Lighthouse, on every representative page',
          'Accessibility, with axe, against the standard you name',
          'Every redirect resolves, with no chains or loops',
          'SEO fields present and unique on every page',
        ],
      },
      {
        h: 'What you decide',
        p: ['About three things: usually which pages matter most, the accessibility standard you hold yourselves to, and any trade-off between a design choice and speed.'],
      },
    ],
    faq: [
      { q: 'Do we need to rebuild the site?', a: 'No. The optimization playbook works on the site you have, in your platform, component by component.' },
      { q: 'Which accessibility standard do you check against?', a: 'The one you name, usually WCAG. Cypher checks every key page against it with axe and reports the results page by page.' },
      { q: 'Will this help search?', a: 'Speed, accessibility, complete SEO fields, a clean sitemap and working redirects are the basics search engines look for. The playbook does all of them and shows you the evidence.' },
    ],
    related: ['/answers/how-to-check-accessibility-before-launch', '/answers/how-to-keep-seo-rankings-during-a-migration', '/playbooks/personalization', '/playbooks/website-build', '/glossary'],
    updated: '2026-11-14',
  },
  {
    slug: 'design-systems',
    name: 'Design systems and brand sites',
    card: 'Thirty brand sites on one design system. Yes, thirty.',
    gets: ['One component library, every brand', 'A theme per brand, rules for all', 'New sites from the system, not from scratch'],
    h1: { light: 'Thirty brand sites on one design system.', bold: 'Yes, thirty.' },
    metaTitle: 'Design system and brand sites playbook | Cypher',
    description: 'How Cypher builds one component library for every brand you run: a theme per brand, rules for all, and new brand sites made from the system, not from scratch.',
    answer: 'The design systems playbook builds one component library that every brand site shares. Each brand gets its own theme, every site follows the same rules, and new brand sites are assembled from the system instead of built from scratch, so a portfolio of sites stays consistent and quick to extend.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'One component library, shared by every brand',
          'A theme per brand: colors, type and imagery',
          'Rules for all: what each component is for and how it’s used',
          'New brand sites made from the system, not from scratch',
          'A component catalog every brand team can use',
        ],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Inventory the brands', b: 'Cypher lists every brand site, its components and where they differ, to find what can be shared.' },
          { t: 'The plan, your first gate', b: 'The shared library, what each theme controls, and the order brands move across. You approve it once.' },
          { t: 'Build the system', b: 'Shared components first, then the themes, each checked against every brand that will use it.' },
          { t: 'Move the brands', b: 'Brand sites are rebuilt on the system one at a time, each checked against its original.' },
          { t: 'Launch, your second gate', b: 'You sign off each brand, or the whole set, with the evidence in front of you.' },
        ],
      },
      {
        h: 'What it checks',
        list: [
          'Every shared component in every theme',
          'Each brand site against its original, at phone, tablet and desktop widths',
          'Accessibility in every theme, not just the first',
        ],
      },
      {
        h: 'What you decide',
        p: ['About three things: usually where brands may differ and where they must not, which brand moves first, and the launch.'],
      },
      {
        h: 'What you own at the end',
        p: ['The library, the themes, the rules and the catalog, in your repository. Your teams make the next brand site from the system.'],
      },
    ],
    faq: [
      { q: 'Can each brand still look different?', a: 'Yes. Each brand has its own theme for colors, type and imagery. What they share is how components work, not how they look.' },
      { q: 'Do all brands have to move at once?', a: 'No. Brands move across one at a time, in the order the plan sets, and each is checked against its original.' },
      { q: 'Who looks after the system after launch?', a: 'Your team. The rules and the catalog are yours, and new components follow the same playbook.' },
    ],
    related: ['/answers/one-design-system-for-many-brand-sites', '/playbooks/website-build', '/playbooks/migration', '/glossary'],
    updated: '2026-11-14',
  },
  {
    slug: 'storefronts-intranets',
    name: 'Storefronts and intranets',
    card: 'The two projects that always slip a quarter. They won’t.',
    gets: ['Shopping or employee journeys end to end', 'Content models your teams can run', 'A handover your people can own'],
    h1: { light: 'The two projects that always slip a quarter.', bold: 'They won’t.' },
    metaTitle: 'Storefront and intranet playbook | Cypher',
    description: 'How Cypher builds storefronts and intranets: shopping or employee journeys working end to end, content models your teams can run, a handover they can own.',
    answer: 'The storefronts and intranets playbook builds the two projects that tend to slip: the shop your customers buy from and the intranet your employees work in. Cypher maps every journey, builds content models your teams can run, tests each journey end to end, and hands over a site your people own.',
    blocks: [
      {
        h: 'What you get',
        list: [
          'Shopping or employee journeys working end to end',
          'Content models your teams can run without a developer',
          'Connections to the systems behind them',
          'A handover your people can own',
        ],
      },
      {
        h: 'Why they slip',
        p: ['Both depend on systems other teams own: product data and checkout for a storefront, directories and permissions for an intranet. The work waits on those teams. Cypher maps the dependencies in discovery, so the few questions that need another team arrive early, with a pick and a deadline.'],
      },
      {
        h: 'How it runs',
        steps: [
          { t: 'Map the journeys and systems', b: 'Every journey, and every system it touches, written down before anyone builds.' },
          { t: 'The plan, your first gate', b: 'Journeys, content models and connections in the Blueprint. You approve it once.' },
          { t: 'Build and connect', b: 'Components, templates and pages, connected to the systems behind them and checked before they move on.' },
          { t: 'Test end to end', b: 'Each journey runs from start to finish, the way a customer or an employee would use it.' },
          { t: 'Launch, your second gate', b: 'You sign off with every journey’s results in front of you.' },
        ],
      },
      {
        h: 'What you decide',
        p: ['About three things: usually which journeys come first, which system owns a record when two disagree, and the launch.'],
      },
      {
        h: 'Which platforms',
        p: ['Sitecore, Optimizely and Contentful are home turf, alongside whichever commerce, directory or sign-in systems you run.'],
      },
    ],
    faq: [
      { q: 'Do you replace our commerce platform?', a: 'No. Cypher builds the experience on your content platform and connects it to the commerce systems you already run.' },
      { q: 'Can employees edit the intranet themselves?', a: 'Yes. Content models are built for the teams who run them, with an editor guide written for those teams.' },
      { q: 'Why won’t it slip?', a: 'Because dependencies are found in discovery, not at launch, and the few decisions that need you arrive with a pick and a deadline.' },
    ],
    related: ['/playbooks/portals', '/playbooks/website-build', '/answers/what-does-a-marketer-decide-in-a-website-build', '/platforms/other-platforms'],
    updated: '2026-11-14',
  },
];

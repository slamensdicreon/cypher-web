import type { Answer } from '@/lib/content/types';

/**
 * Answers to the questions marketers actually ask. Each page answers first, in a paragraph that
 * stands on its own, then goes deeper. Cypher appears only where it’s natural, usually last.
 */
export const ANSWERS: Answer[] = [
  {
    slug: 'how-long-does-a-cms-migration-take',
    name: 'How long a migration takes',
    topic: 'Migration',
    h1: { light: '', bold: 'How long does a CMS migration take?' },
    metaTitle: 'How long does a CMS migration take?',
    description: 'What really sets the length of a CMS migration: content volume and quality, templates, integrations, redirects and sign-off. Plus how to shorten it safely.',
    answer: 'It depends less on the platform than on four things: how much content you have and how clean it is, how many templates and components must be rebuilt, how many systems connect to the site, and how quickly decisions get made. In many migrations, more calendar time goes to content clean-up and approvals than to building.',
    blocks: [
      {
        h: 'What drives the timeline',
        list: [
          'Content volume and quality: duplicate, outdated and orphaned pages all have to be found and dealt with.',
          'Templates and components: every distinct page layout and building block has to be rebuilt on the new platform.',
          'Integrations: forms, search, CRM, commerce, sign-in and analytics each need connecting and testing.',
          'Sites and languages: every extra site or language multiplies the content work.',
          'Redirects and SEO: every old URL needs a new home before launch.',
          'Decisions and sign-off: a question that waits a week for an answer adds a week.',
        ],
      },
      {
        h: 'Where the time goes',
        steps: [
          { t: 'Inventory', b: 'Find every page, template, component, file and integration on the current site.' },
          { t: 'Plan', b: 'Decide what moves, what merges and what retires, and how the new site will be built.' },
          { t: 'Build', b: 'Rebuild templates and components on the new platform, once, so they can be reused.' },
          { t: 'Move content', b: 'Carry pages, media and metadata into the new templates.' },
          { t: 'Check', b: 'Compare old and new page by page, and test accessibility, performance and every integration.' },
          { t: 'Launch', b: 'Switch over with redirects in place, then watch closely for the following weeks.' },
        ],
      },
      {
        h: 'How to shorten it without cutting corners',
        list: [
          'Retire outdated pages before you move them, not after.',
          'Decide early which system is the source of truth for each kind of content.',
          'Agree what “done” means before anyone starts: content parity, accessibility, performance.',
          'Give one person the authority to make decisions, with a deadline on each question.',
          'Check as you go instead of saving every check for the end.',
          'Plan a short content freeze, or a re-sync, for the final move.',
        ],
      },
      {
        h: 'How Cypher handles this',
        p: [
          'Cypher runs a migration from a playbook. It inventories every page before anyone builds, writes the plan you approve once, then moves and checks content page by page as it goes. You make about three decisions; everything else is settled and logged.',
          'Content parity of 98% or better and every redirect kept are part of what “done” means, and anything not done is listed in writing at handover.',
        ],
      },
    ],
    faq: [
      { q: 'Should we redesign and migrate at the same time?', a: 'You can, but it adds decisions and risk. Some teams move content and structure first and redesign once the new platform is stable; others combine them when the old design can’t be rebuilt anyway.' },
      { q: 'What slows migrations down most?', a: 'Unclear content ownership and late decisions. Once the plan is agreed, the technical work is often not the slowest part.' },
      { q: 'Can we keep publishing during a migration?', a: 'Yes. Plan a short content freeze for the final move, or re-sync anything published after the first content move.' },
      { q: 'Does the platform we’re moving to change the timeline?', a: 'Less than you’d expect. The amount and state of your content, and the number of integrations, matter more than which enterprise platform you choose.' },
    ],
    related: ['/playbooks/migration', '/resources/website-migration-checklist', '/answers/how-to-keep-seo-rankings-during-a-migration', '/answers/what-is-content-parity'],
    updated: '2026-11-14',
  },
  {
    slug: 'how-to-keep-seo-rankings-during-a-migration',
    name: 'SEO during a migration',
    topic: 'Migration',
    h1: { light: '', bold: 'How do you keep SEO rankings during a website migration?' },
    metaTitle: 'How to keep SEO rankings during a website migration',
    description: 'The steps that protect search traffic when you change platforms or URLs: a complete redirect map, matching content and metadata, and checks before and after launch.',
    answer: 'Map every old URL to its new home with a permanent (301) redirect, keep the content and metadata that ranks, and check both before launch and in the weeks after. Lost traffic usually traces back to missing redirects, dropped pages or changed titles, so a complete inventory of what you have today comes first.',
    blocks: [
      {
        h: 'Before launch',
        steps: [
          { t: 'Inventory every URL', b: 'Combine a site crawl, your analytics, your XML sitemap and the pages other sites link to.' },
          { t: 'Decide each page’s fate', b: 'Keep, merge or retire. Retired pages still need somewhere sensible to send visitors.' },
          { t: 'Build the redirect map', b: 'One 301 redirect per old URL, pointing straight at the final destination, with no chains.' },
          { t: 'Carry the signals across', b: 'Titles, meta descriptions, headings, body text, alt text and structured data should arrive intact.' },
          { t: 'Fix internal links', b: 'Point links inside the site at the new URLs directly instead of relying on redirects.' },
          { t: 'Record a benchmark', b: 'Note rankings and traffic for your top pages so you can compare after launch.' },
        ],
      },
      {
        h: 'On launch day',
        list: [
          'Deploy the redirects at the same moment as the new site.',
          'Remove staging settings: noindex tags and a robots.txt that blocks search engines are common leftovers.',
          'Check canonical tags point at the new URLs.',
          'Submit the new XML sitemap in Google Search Console and Bing Webmaster Tools.',
          'Spot-check your top pages and their old URLs by hand.',
        ],
      },
      {
        h: 'In the weeks after',
        list: [
          'Watch crawl errors and 404s, and add redirects for anything missed.',
          'Fix redirect chains and loops as soon as you find them.',
          'Compare traffic and rankings with your benchmark, page by page.',
          'Keep the redirects in place permanently; old links keep arriving for years.',
        ],
      },
      {
        h: 'How Cypher handles this',
        p: ['Every redirect kept is part of the migration playbook’s definition of done. Cypher inventories every page before it builds, carries SEO fields across, and checks pages and redirects against the original before you sign off launch.'],
      },
    ],
    faq: [
      { q: 'Will rankings drop after a migration?', a: 'Some movement is normal while search engines recrawl the site. A well-mapped migration usually settles; a large, lasting drop points to missing redirects, removed content or blocked pages.' },
      { q: 'How long should redirects stay in place?', a: 'Treat them as permanent. Bookmarks and links from other sites keep sending visitors to old URLs long after launch.' },
      { q: 'Should we change our URLs at all?', a: 'Only for a good reason, such as a clearer structure. Every changed URL needs a redirect and some time to be recrawled.' },
      { q: '301 or 302?', a: 'Use a 301 when the move is permanent, which is almost always the case in a migration. A 302 tells search engines the move is temporary.' },
    ],
    related: ['/resources/redirect-map-template', '/resources/website-migration-checklist', '/playbooks/migration', '/answers/how-long-does-a-cms-migration-take'],
    updated: '2026-11-14',
  },
  {
    slug: 'how-to-merge-several-websites-into-one',
    name: 'Merging websites',
    topic: 'Migration',
    h1: { light: '', bold: 'How do you merge several websites into one?' },
    metaTitle: 'How to merge several websites into one',
    description: 'A plain guide to consolidating several sites into one: choosing the structure, sorting the content, mapping redirects and governing a site that serves many brands.',
    answer: 'Start with one inventory of every page across every site, decide the target structure, then sort each page into keep, merge or retire. Rebuild shared templates once, move content into them, and redirect every old URL. The hardest part is usually agreeing who owns what, not the build itself.',
    blocks: [
      {
        h: 'Decide the structure first',
        p: ['Before moving anything, agree how the combined site will be organized. The choice shapes every URL, redirect and navigation menu that follows.'],
        list: [
          'One site with sections for each brand, region or product line.',
          'One platform running several sites that share components and a content model.',
          'A main site, with smaller sites folded in as sections and the rest retired.',
        ],
      },
      {
        h: 'Sort the content',
        steps: [
          { t: 'Combine the inventories', b: 'List every page from every site in one place, with its traffic and inbound links.' },
          { t: 'Find the overlaps', b: 'Spot pages that cover the same thing on different sites.' },
          { t: 'Pick the best version', b: 'Keep the clearest, most current and best-performing page, and fold useful parts of the others into it.' },
          { t: 'Mark every page', b: 'Keep, merge or retire, with an owner for each decision.' },
          { t: 'Map the redirects', b: 'Send every merged or retired URL to the closest matching page on the new site.' },
        ],
      },
      {
        h: 'Build once, use everywhere',
        list: [
          'One component library, so a fix or improvement lands on every section at once.',
          'Themes for brands that need to look different, instead of separate builds.',
          'One content model, so the same kinds of content are structured the same way.',
        ],
      },
      {
        h: 'Govern the result',
        list: [
          'An owner for each section, with clear publishing rights.',
          'Rules for when a new page, section or component is allowed.',
          'A regular review to retire content before it piles up again.',
        ],
      },
      {
        h: 'How Cypher handles this',
        p: ['The migration playbook covers six sites into one: every page inventoried, every redirect kept and content parity checked page by page. Where brands share a platform, the design systems playbook builds one component library with a theme per brand.'],
      },
    ],
    faq: [
      { q: 'Will merging sites hurt our SEO?', a: 'Not if every old URL redirects to its closest match and the best content survives. Combining pages that competed with each other can make the remaining page stronger.' },
      { q: 'Should every brand keep its own domain?', a: 'It depends on how distinct the brands are to customers. Strong, separate brands often keep their domains on a shared platform; closely related ones usually do better as sections of one site.' },
      { q: 'How do we handle several languages?', a: 'Plan languages into the content model and URL structure from the start, and map redirects for each language version separately.' },
    ],
    related: ['/playbooks/migration', '/playbooks/design-systems', '/answers/one-design-system-for-many-brand-sites', '/resources/redirect-map-template'],
    updated: '2026-11-14',
  },
  {
    slug: 'what-is-content-parity',
    name: 'Content parity',
    topic: 'Migration',
    h1: { light: '', bold: 'What is content parity?' },
    metaTitle: 'What is content parity in a website migration?',
    description: 'Content parity means a migrated site carries the same content as the old one. What gets compared, how it’s measured, and how it differs from visual parity.',
    answer: 'Content parity is how closely a migrated site matches the content of the original: the same pages, text, images, links and metadata, in the right places. It’s measured by comparing the old and new sites page by page, and it’s the clearest evidence that nothing was lost when you changed platforms.',
    blocks: [
      {
        h: 'What gets compared',
        list: [
          'Pages: every page that should exist on the new site does.',
          'Text: body copy and headings match.',
          'Images and media, including alt text.',
          'Links and downloads, including files such as PDFs.',
          'Metadata: page titles and meta descriptions.',
          'Structured data and forms.',
        ],
      },
      {
        h: 'How it’s measured',
        steps: [
          { t: 'Inventory the old site', b: 'Capture every page and what’s on it before the move.' },
          { t: 'Map old to new', b: 'Pair each old page with its new home, or mark it as retired on purpose.' },
          { t: 'Compare automatically', b: 'Use a tool to compare text, media, links and metadata on every pair.' },
          { t: 'Review the differences', b: 'A person decides which differences are intended and which are mistakes.' },
          { t: 'Report', b: 'Record the result and fix or list what doesn’t match.' },
        ],
      },
      {
        h: 'Content parity and visual parity',
        p: ['Content parity is about what’s on the page. Visual parity is about how the page looks at each screen size. A migration that also redesigns the site changes the look on purpose, but it should still keep content parity, except for content retired deliberately.'],
      },
      {
        h: 'How Cypher handles this',
        p: ['Content parity of 98% or better is part of the migration playbook’s definition of done, checked page by page, alongside visual parity at three breakpoints. Anything that doesn’t match is listed in the known-gaps report, in writing.'],
      },
    ],
    faq: [
      { q: 'Why not aim for 100%?', a: 'Some differences are intended: retired pages, rewritten copy and removed duplicates. A good report shows which differences were deliberate and which need fixing.' },
      { q: 'Who checks content parity?', a: 'Ideally an automated comparison of every page, then a person reviewing the differences it finds.' },
      { q: 'Does content parity matter for SEO?', a: 'Yes. Missing pages and missing text are common causes of lost rankings after a migration.' },
    ],
    related: ['/glossary#content-parity', '/playbooks/migration', '/answers/how-to-keep-seo-rankings-during-a-migration', '/resources/website-migration-checklist'],
    updated: '2026-11-14',
  },
  {
    slug: 'why-isnt-our-personalization-switched-on',
    name: 'Switching on personalization',
    topic: 'Personalization and testing',
    h1: { light: '', bold: 'Why isn’t our personalization switched on?' },
    metaTitle: 'Why isn’t our website personalization switched on?',
    description: 'Many teams own personalization features they never turned on. The usual blockers, from audiences and data to content variants, and how to start small and get it live.',
    answer: 'Usually because it needs more than a switch: agreed audiences, the data to recognize them, content written for each audience, someone to set it up in the platform and a way to measure the result. When any one of those is missing, the personalization you paid for sits unused.',
    blocks: [
      {
        h: 'The usual blockers',
        list: [
          'No agreement on which audiences matter or why they should see something different.',
          'The data that would recognize them isn’t connected, or consent hasn’t been worked out.',
          'Nobody has written the content variants.',
          'Templates weren’t built so the right parts of a page can vary.',
          'No one owns personalization once the site is live.',
          'No plan for measuring whether it worked.',
        ],
      },
      {
        h: 'Start small',
        steps: [
          { t: 'Pick one goal', b: 'Sign-ups, demo requests, store visits: one measure you already track.' },
          { t: 'Pick one or two audiences', b: 'Start with ones you can recognize today, such as returning visitors, a region or a campaign source.' },
          { t: 'Write one variant', b: 'Change one high-traffic page for one audience: the headline, hero or offer.' },
          { t: 'Set it up in your platform', b: 'Create the audience rule and assign the variant.' },
          { t: 'Measure against a control', b: 'Compare the personalized version with what everyone else sees.' },
          { t: 'Expand', b: 'Keep what works, then add the next page or audience.' },
        ],
      },
      {
        h: 'What your platform needs',
        p: ['Enterprise platforms such as Sitecore, Optimizely and Contentful support audiences and variants in different ways, some built in and some through connected tools. Check what your license includes before planning anything ambitious.'],
      },
      {
        h: 'How Cypher handles this',
        p: ['The personalization playbook sets up audiences and page variants, configures A/B/n tests in your platform, and checks each one before you see it. You decide the audiences and the offer; the setup is Cypher’s job.'],
      },
    ],
    faq: [
      { q: 'Do we need a customer data platform?', a: 'Not to start. Simple audiences, such as returning visitors or region, work with what most platforms already have. A customer data platform helps once you want to use data from other systems.' },
      { q: 'Is personalization worth it for a small team?', a: 'Start with one page and one audience. If it moves your goal, expand; if not, you’ve learned something cheaply.' },
      { q: 'How do we stay on the right side of privacy rules?', a: 'Use only data your visitors have consented to, follow your consent settings, avoid sensitive categories, and say what you do in your privacy policy.' },
    ],
    related: ['/playbooks/personalization', '/resources/personalization-readiness-checklist', '/answers/how-to-run-ab-tests-in-your-cms', '/platforms/optimizely/personalization'],
    updated: '2026-11-14',
  },
  {
    slug: 'how-to-run-ab-tests-in-your-cms',
    name: 'A/B tests in your CMS',
    topic: 'Personalization and testing',
    h1: { light: '', bold: 'How do you run A/B tests in your CMS?' },
    metaTitle: 'How to run A/B tests in your CMS',
    description: 'A practical guide to A/B and A/B/n testing on an enterprise CMS: choosing what to test, building variants, splitting traffic, reading results and avoiding mistakes.',
    answer: 'Pick one page and one change, write down what you expect to happen and why, build the variant in your CMS or testing tool, and split traffic between the original and the variant. Run it until enough visitors have seen both to trust the result, then keep the winner and test the next thing.',
    blocks: [
      {
        h: 'Step by step',
        steps: [
          { t: 'Choose the goal', b: 'One measure, such as clicks on a call to action or completed forms.' },
          { t: 'Write the hypothesis', b: '“Changing this, for these visitors, will improve that, because…”' },
          { t: 'Build the variant', b: 'Create the alternative version in your CMS or testing tool.' },
          { t: 'Split the traffic', b: 'Usually evenly between the original and each variant.' },
          { t: 'Check every variant', b: 'On phone, tablet and desktop, before any visitor sees it.' },
          { t: 'Run it long enough', b: 'Until you reach the number of visitors you planned for, across at least a full week.' },
          { t: 'Decide and roll out', b: 'Keep the winner, record what you learned, and plan the next test.' },
        ],
      },
      {
        h: 'A/B or A/B/n?',
        p: ['An A/B test compares two versions. An A/B/n test compares three or more. More versions need more traffic before the result is reliable, so A/B/n suits busy pages.'],
      },
      {
        h: 'Common mistakes',
        list: [
          'Stopping the test as soon as one version pulls ahead.',
          'Changing several things at once, so you can’t tell what made the difference.',
          'Testing tiny changes on pages with little traffic.',
          'Not checking variants on mobile.',
          'Counting your own team’s visits.',
          'Ignoring flicker or slow loading caused by the test itself.',
        ],
      },
      {
        h: 'How Cypher handles this',
        p: ['The personalization playbook configures A/B/n tests in your platform and checks each variant before you see it. When a choice between versions is genuinely yours, it arrives as a decision with Cypher’s pick, the reason and a deadline.'],
      },
    ],
    faq: [
      { q: 'How long should a test run?', a: 'Until it reaches the sample size you planned, and for at least a full week so weekday and weekend behavior are both included.' },
      { q: 'Can we test without a separate tool?', a: 'Many enterprise platforms include testing; others connect to a dedicated testing tool. Check what your license includes.' },
      { q: 'What should we test first?', a: 'Busy pages and changes with a clear reason behind them: headlines, calls to action, hero images and form length.' },
    ],
    related: ['/playbooks/personalization', '/answers/why-isnt-our-personalization-switched-on', '/glossary#a-b-n-test', '/platforms/optimizely/personalization'],
    updated: '2026-11-14',
  },
  {
    slug: 'what-should-a-website-launch-checklist-include',
    name: 'Launch checklist',
    topic: 'Launch',
    h1: { light: '', bold: 'What should a website launch checklist include?' },
    metaTitle: 'What a website launch checklist should include',
    description: 'The checks that matter before a website goes live: content, search, redirects, accessibility, performance, analytics, forms, legal pages and who signs it off.',
    answer: 'A launch checklist should prove five things: the content is complete and correct, search engines can find it, every old URL redirects, the site is accessible and fast on real devices, and tracking, forms and integrations work. It should end with one named person signing off, and a plan to roll back.',
    blocks: [
      {
        h: 'Content and search',
        list: [
          'Every page is present, with working links and images.',
          'Images have alt text; legal pages and contact details are current.',
          'Every page has a title and meta description.',
          'The XML sitemap is ready and robots.txt allows search engines.',
          'No stray noindex tags left over from staging.',
          'Canonical tags and redirects point at the right URLs.',
        ],
      },
      {
        h: 'Quality',
        list: [
          'Accessibility checked against WCAG, with AA as the usual target.',
          'Performance checked on a mid-range phone, not just a fast laptop.',
          'Tested in the browsers and devices your visitors use.',
          'Helpful 404 and error pages in place.',
        ],
      },
      {
        h: 'Tracking and integrations',
        list: [
          'Analytics is recording, with internal traffic excluded.',
          'The consent banner works and respects visitors’ choices.',
          'Every form delivers to the right place.',
          'CRM, search, sign-in and commerce connections work end to end.',
        ],
      },
      {
        h: 'Sign-off and rollback',
        list: [
          'One named owner signs off the launch.',
          'A rollback plan exists and someone knows how to use it.',
          'The launch happens when the team is around to fix things.',
          'Someone watches errors, traffic and forms for the first days.',
        ],
      },
      {
        h: 'How Cypher handles this',
        p: ['Every Cypher build ends in UAT, the second of your two gates: parity, accessibility and performance reports page by page, and a known-gaps report in writing. Nothing ships past that gate without your sign-off.'],
      },
    ],
    faq: [
      { q: 'Who should sign off a launch?', a: 'One named owner, usually the marketing lead for the site, with input from IT and legal where needed.' },
      { q: 'When is the best time to launch?', a: 'Early in the week and early in the day, when the team can respond. Avoid launching just before a holiday or a major campaign.' },
      { q: 'What’s the most common launch mistake?', a: 'Leaving staging settings in place, such as a noindex tag or a robots.txt that blocks search engines, which hides the new site from search.' },
    ],
    related: ['/resources/website-migration-checklist', '/answers/how-to-check-accessibility-before-launch', '/answers/how-to-keep-seo-rankings-during-a-migration', '/glossary#uat'],
    updated: '2026-11-14',
  },
  {
    slug: 'how-to-check-accessibility-before-launch',
    name: 'Accessibility before launch',
    topic: 'Launch',
    h1: { light: '', bold: 'How do you check accessibility before launch?' },
    metaTitle: 'How to check website accessibility before launch',
    description: 'Automated scans, keyboard and screen reader checks, and content reviews that catch accessibility problems before a site goes live, measured against WCAG.',
    answer: 'Combine automated scans with checks a person does. Run a tool such as axe or Lighthouse on every template, then use the site with a keyboard alone, try a screen reader, check color contrast and zoom, and review alt text and headings. Automated tools find only some problems, so the manual checks matter.',
    blocks: [
      {
        h: 'Know the target',
        p: ['Most organizations aim for the Web Content Accessibility Guidelines (WCAG) at level AA. WCAG has three levels, A, AA and AAA, and each version adds to the last. Legal requirements differ by country and sector, so confirm which apply to you.'],
      },
      {
        h: 'Automated checks',
        list: [
          'Run axe or Lighthouse on every template and component, not just the homepage.',
          'Fix problems in the component, so the fix reaches every page that uses it.',
          'Re-run the checks after every significant change.',
        ],
      },
      {
        h: 'Checks a person does',
        steps: [
          { t: 'Keyboard only', b: 'Reach and use every link, button, menu and form without a mouse, with a visible focus outline.' },
          { t: 'Screen reader', b: 'Listen to key pages and check they make sense in order.' },
          { t: 'Zoom', b: 'Enlarge text to 200% and check nothing breaks or disappears.' },
          { t: 'Contrast', b: 'Check text and controls stand out from their background.' },
          { t: 'Forms', b: 'Every field has a label, and errors say what went wrong and how to fix it.' },
          { t: 'Motion and media', b: 'Moving content can be paused, and video has captions.' },
        ],
      },
      {
        h: 'Content checks',
        list: [
          'Images have alt text that describes their purpose.',
          'Headings run in order and describe the section below them.',
          'Link text makes sense on its own: no “click here”.',
          'Documents such as PDFs are accessible too, or offered another way.',
        ],
      },
      {
        h: 'How Cypher handles this',
        p: ['The optimization playbook runs Lighthouse and axe on every representative page, and accessibility is part of the definition of done for every build. The reports come with the handover, page by page.'],
      },
    ],
    faq: [
      { q: 'Is an automated score of 100 enough?', a: 'No. It means the automated rules passed. Problems such as confusing focus order or unhelpful alt text need a person to find them.' },
      { q: 'Who should test with a screen reader?', a: 'Ideally people who use one every day. If that isn’t possible, a team member who has learned the basics can still catch many problems.' },
      { q: 'Do PDFs and documents count?', a: 'Yes. If they’re part of the site, they need to be accessible or available in an accessible format.' },
    ],
    related: ['/playbooks/optimization', '/glossary#accessibility', '/glossary#axe', '/answers/what-should-a-website-launch-checklist-include'],
    updated: '2026-11-14',
  },
  {
    slug: 'what-is-a-headless-cms',
    name: 'Headless CMS',
    topic: 'Platforms',
    h1: { light: '', bold: 'What is a headless CMS?' },
    metaTitle: 'What is a headless CMS? A guide for marketers',
    description: 'A headless CMS stores content separately from how it’s displayed, so one source can feed a website, an app and more. What changes for marketers, and what to ask for.',
    answer: 'A headless CMS stores and manages content but doesn’t decide how it looks. Developers build the website or app separately and pull content in through an API. Marketers still write and publish in the CMS; the difference is that the same content can feed several channels, and the front end can change without moving the content.',
    blocks: [
      {
        h: 'Headless and traditional, side by side',
        p: [
          'A traditional CMS keeps content and page templates in one system, so previews and page editing come built in.',
          'A headless CMS keeps only the content. The website, app or other channel is built separately and asks the CMS for content when it needs it.',
        ],
      },
      {
        h: 'What changes for marketers',
        list: [
          'Previews and visual editing have to be set up; they don’t come for free.',
          'What you can build depends on the components developers make available.',
          'One piece of content can appear on the website, in an app and elsewhere.',
          'A clear content model matters more, because content is reused in many places.',
          'The site can be very fast, if it’s built well.',
        ],
      },
      {
        h: 'What to ask for',
        list: [
          'Visual preview and editing, so you can see a page before it’s published.',
          'Components you can arrange into pages without a developer.',
          'A content model your team understands.',
          'An editor guide, and roles and workflow that fit how you approve content.',
        ],
      },
      {
        h: 'Where the big platforms fit',
        p: ['Contentful was built headless from the start. Sitecore and Optimizely offer headless delivery alongside visual editing. The right choice depends on how many channels you publish to and how much control your team wants over page building.'],
      },
      {
        h: 'How Cypher handles this',
        p: ['Cypher builds on whatever you run, headless or not. Every build ends with an editor guide and a component catalog, so your team can edit every page on day one.'],
      },
    ],
    faq: [
      { q: 'Is headless better?', a: 'Not by itself. It suits teams publishing to several channels or wanting a custom front end; a traditional setup can be simpler for a single website.' },
      { q: 'What does composable mean?', a: 'An approach where the CMS, search, commerce and other tools are separate services connected through APIs, each chosen on its own merits.' },
      { q: 'Will our marketers lose visual editing?', a: 'Not necessarily. Many headless platforms now offer visual editing and preview, but it has to be set up as part of the build.' },
    ],
    related: ['/glossary#headless-cms', '/glossary#composable', '/platforms/contentful', '/platforms/sitecore'],
    updated: '2026-11-14',
  },
  {
    slug: 'one-design-system-for-many-brand-sites',
    name: 'Design system for brand sites',
    topic: 'Platforms',
    h1: { light: '', bold: 'Can one design system run many brand sites?' },
    metaTitle: 'One design system for many brand sites',
    description: 'How one design system and component library can power many brand sites: a theme per brand, shared rules, fixes that land everywhere, and new sites built from the system.',
    answer: 'Yes. Build one library of components, give each brand its own theme of colors, type and imagery, and let every site draw from the same library. Fixes and improvements land everywhere at once, new sites start from the system instead of from scratch, and brands stay distinct without separate codebases.',
    blocks: [
      {
        h: 'How it works',
        steps: [
          { t: 'Shared components', b: 'Heroes, cards, forms and navigation are built once and tested once.' },
          { t: 'A theme per brand', b: 'Colors, type, spacing and imagery are set as design tokens for each brand.' },
          { t: 'A shared content model', b: 'The same kinds of content are structured the same way on every site.' },
          { t: 'A site template', b: 'A new brand site starts from a working template, not a blank page.' },
          { t: 'Rules for all', b: 'Agreed governance decides what’s shared and how brands ask for changes.' },
        ],
      },
      {
        h: 'What stays shared, and what varies',
        list: [
          'Shared: components, accessibility, performance, analytics and the publishing workflow.',
          'Varies by brand: colors, type, imagery, tone of voice and navigation.',
          'Sometimes varies: a few components only one brand needs.',
        ],
      },
      {
        h: 'Keeping it healthy',
        list: [
          'A named owner who approves new components.',
          'A simple way for brands to request changes.',
          'Versions, so brands can adopt improvements on their own schedule.',
          'A component catalog that shows what exists and how to use it.',
        ],
      },
      {
        h: 'How Cypher handles this',
        p: ['The design systems and brand sites playbook builds one component library for every brand, a theme per brand with rules for all, and new sites from the system, not from scratch. Thirty brand sites on one design system. Yes, thirty.'],
      },
    ],
    faq: [
      { q: 'Won’t every site look the same?', a: 'Not if the themes are strong. Shared components can look very different with different colors, type, imagery and copy.' },
      { q: 'When doesn’t a shared system fit?', a: 'When brands need fundamentally different experiences, or run on different platforms that can’t share components.' },
      { q: 'How do we add a new brand?', a: 'Create its theme, set up a site from the template, and add its content. The components are already built and tested.' },
    ],
    related: ['/playbooks/design-systems', '/answers/how-to-merge-several-websites-into-one', '/glossary#design-system', '/glossary#component-catalog'],
    updated: '2026-11-14',
  },
  {
    slug: 'what-does-a-marketer-decide-in-a-website-build',
    name: 'What a marketer decides',
    topic: 'Working with Cypher',
    h1: { light: '', bold: 'What does a marketer need to decide in a website build?' },
    metaTitle: 'What a marketer needs to decide in a website build',
    description: 'The decisions that belong to marketing in a website build: goals, audiences, brand, the plan, the trade-offs visitors notice and the launch. The rest can be delegated.',
    answer: 'The decisions that should stay with marketing are about the brand and the customer: the goals, the audiences, the plan, the trade-offs that change what visitors see, and when to launch. Technical choices, task order and day-to-day checks can be delegated, as long as you can always see what was decided and why.',
    blocks: [
      {
        h: 'Decisions that are yours',
        list: [
          'The goals and how success will be measured.',
          'The audiences and which matter most.',
          'Brand voice and visual direction.',
          'The plan: what will be built, approved once.',
          'Trade-offs visitors will notice, such as which offer leads or which content retires.',
          'When the site is ready to launch.',
        ],
      },
      {
        h: 'Decisions you can delegate',
        list: [
          'How components and templates are structured.',
          'The order work is done in.',
          'Hosting and deployment setup.',
          'Testing tools and routine quality checks.',
          'Redirects, with a review of the most important ones.',
        ],
      },
      {
        h: 'How to keep your decisions few',
        steps: [
          { t: 'Agree the plan up front', b: 'Most later questions are answered by a plan everyone approved.' },
          { t: 'Set defaults', b: 'Decide routine choices once so they don’t come back.' },
          { t: 'Ask for a recommendation', b: 'Every question should arrive with a suggested answer and the reason.' },
          { t: 'Put a deadline on it', b: 'If no one answers in time, the recommendation goes ahead.' },
          { t: 'Read a log, skip the meeting', b: 'A written record of what happened replaces most status meetings.' },
        ],
      },
      {
        h: 'How Cypher handles this',
        p: ['You make about three decisions a build. Two are gates: approving the Blueprint and signing off UAT. The rest arrive as cards with Cypher’s pick, the reason and a deadline; say nothing and it goes ahead with its pick. Everything else is settled by the leads and logged.'],
      },
    ],
    faq: [
      { q: 'Should marketing approve every page design?', a: 'Approve the design direction, components and templates. Reviewing every page slows the build without adding much.' },
      { q: 'What if we disagree with a default?', a: 'Say so early and make it a rule, so it applies to everything similar from then on.' },
      { q: 'Who should own the decisions?', a: 'One named person with the authority to decide, usually the marketing lead for the site.' },
    ],
    related: ['/how-it-works', '/glossary#gate', '/glossary#blueprint', '/answers/how-does-an-ai-team-build-a-website'],
    updated: '2026-11-14',
  },
  {
    slug: 'how-does-an-ai-team-build-a-website',
    name: 'How an AI team builds',
    topic: 'Working with Cypher',
    h1: { light: '', bold: 'How does an AI team build a website?' },
    metaTitle: 'How an AI team builds a website',
    description: 'How a team of AI agents plans, builds, checks and launches a website: specialist roles, a written plan, checks on every step and people at the gates.',
    answer: 'An AI team works like a well-run project team. Specialist agents for discovery, engineering, content and quality each take part of the work, hand it on and check each other’s output, following a written plan. People stay in charge of the decisions that matter, and every action is logged so the work can be reviewed.',
    blocks: [
      {
        h: 'The roles',
        list: [
          'A solution architect who writes the plan.',
          'A content analyst who inventories and maps the content.',
          'Component engineers and migrators who build and move.',
          'A parity auditor and performance and accessibility QA who check the work.',
          'A deployment engineer who ships it.',
          'A lead that coordinates the team, so you deal with one voice.',
        ],
      },
      {
        h: 'How the work flows',
        steps: [
          { t: 'Discovery', b: 'The team verifies access, inventories the site and records the facts it will build on.' },
          { t: 'A written plan', b: 'Every component, template and page, and how. A person approves it.' },
          { t: 'Build in order', b: 'Work is picked up in sequence and handed on with notes.' },
          { t: 'Check before moving on', b: 'Validators review each piece; no role marks its own work.' },
          { t: 'Ask a person', b: 'Genuine judgment calls go to a human, with a recommendation.' },
          { t: 'Launch and hand over', b: 'With the evidence, an editor guide and a list of anything not done.' },
        ],
      },
      {
        h: 'What keeps it safe',
        list: [
          'A plan approved by a person before building starts.',
          'Roles that check each other’s work instead of their own.',
          'Access limited to what each job needs.',
          'An append-only log of every action, so any build can be replayed.',
        ],
      },
      {
        h: 'What people still do',
        p: ['People set the goals, approve the plan, answer the judgment calls, sign off the launch and own the result. The team does the building and the checking.'],
      },
      {
        h: 'How Cypher handles this',
        p: ['Cypher is twenty-one specialists and the mind that runs them, working through ten phases with two gates that are yours. One build an agency quoted at $400,000+ cost $512 to run: the cost of the run, not the price of Cypher.'],
      },
    ],
    faq: [
      { q: 'Is the code any good?', a: 'It should meet the same standard as any team’s: reviewed, tested, readable and delivered to your repository.' },
      { q: 'Does an AI team replace the marketing team?', a: 'No. It takes on the building and checking; the marketing team decides and owns the brand.' },
      { q: 'What happens when something breaks?', a: 'The checks find it, it’s logged, fixed and checked again. Anything left over is reported in writing.' },
    ],
    related: ['/how-it-works', '/answers/what-does-a-marketer-decide-in-a-website-build', '/playbooks', '/demo'],
    updated: '2026-11-14',
  },
];

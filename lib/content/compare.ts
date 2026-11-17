import type { Compare } from './types';

/**
 * Cypher against the other ways to get the work done. Kinds, never companies: no agency, tool or
 * vendor is named. Every page says plainly when the other way is the better choice.
 */

export const COMPARES: Compare[] = [
  {
    slug: 'agency-build',
    name: 'Cypher vs an agency build',
    card: 'Time, change orders, who decides and what you own, and when an agency is still the right call.',
    h1: { light: 'Cypher vs a traditional agency build.', bold: 'The same site, without the change orders.' },
    metaTitle: 'Cypher vs a traditional agency website build',
    description: 'How Cypher compares with a traditional agency build on time, change orders, who decides and what you own, and when an agency is still the better choice.',
    answer:
      'A traditional agency build is staffed with people, scoped up front and changed by change order. Cypher runs a written playbook with twenty-one AI specialists, checks every page before you see it, and asks you to make three decisions. You get a site on your own platform that your team edits on day one.',
    blocks: [
      {
        h: 'At a glance',
        table: {
          head: ['', 'Cypher', 'A traditional agency build'],
          rows: [
            ['Pace', 'Set by your three decisions', 'Set by people’s availability, often over months'],
            ['A new request', 'A decision for you, then built. No change orders', 'A change order, a new estimate and often a new date'],
            ['How you’re kept informed', 'You always know, without a status meeting', 'Status meetings and review rounds'],
            ['Quality checks', 'Every page checked before you see it', 'A testing phase, usually near the end'],
            ['Platform knowledge', 'Twenty-five years of engineering and ten of enterprise platforms, written down', 'Whoever is staffed on your account'],
            ['What you own', 'Your code, hosting and keys. No retainer', 'Depends on the contract'],
            ['When your team edits', 'Day one', 'After handover and training'],
          ],
        },
      },
      {
        h: 'Where the time goes in an agency build',
        p: [
          'Much of a traditional build’s calendar goes to coordination: kickoff workshops, discovery phases, status meetings, review rounds, and new estimates whenever the scope moves. The building itself is only part of it.',
          'Cypher writes the plan once, you approve it once, and the specialists get on with it. The only meetings are the decisions only you can make.',
        ],
      },
      {
        h: 'What Cypher does differently',
        steps: [
          { t: 'A written playbook', b: 'Every outcome is run the same way every time, so nothing depends on who happens to be staffed.' },
          { t: 'One plan, approved once', b: 'You see exactly what will be built before anything is.' },
          { t: 'Every page checked', b: 'Against the design, for accessibility and for speed, before it reaches you.' },
          { t: 'Three decisions', b: 'You approve the plan, answer the calls only a marketer can make, and say when it goes live.' },
          { t: 'Evidence at handover', b: 'Speed, accessibility and parity reports, an editor guide, and a known-gaps report in writing.' },
        ],
      },
      {
        h: 'When an agency is the better choice',
        list: [
          'You need a brand, a name or a visual identity created from scratch. Cypher builds from the designs you bring or the site you have.',
          'You want one long-term creative partner for campaigns well beyond the website.',
          'Most of the work is offline: events, media buying or production.',
        ],
      },
      {
        h: 'Using both',
        p: ['Many teams keep their agency for brand and creative and hand the build, the migration and the personalization to Cypher. The agency’s designs go in; a site your team edits comes out.'],
      },
    ],
    faq: [
      { q: 'Is Cypher an agency?', a: 'No. Cypher is twenty-one AI specialists and the mind that runs them, working from written playbooks. People who know the platforms stand behind every build.' },
      { q: 'Can our agency work alongside Cypher?', a: 'Yes. Bring your agency’s designs: Cypher builds them pixel for pixel on your platform.' },
      { q: 'How does the cost compare?', a: 'We talk about pricing in the demo, against your own project. As one data point, a build an agency quoted at $400,000+ cost $512 to run. That’s the cost of the run, not the price of Cypher.' },
    ],
    related: ['/compare/in-house-team', '/compare/ai-coding-tools', '/proof', '/how-it-works', '/playbooks/website-build'],
    updated: '2026-11-17',
  },
  {
    slug: 'in-house-team',
    name: 'Cypher vs an in-house team',
    card: 'Keep your team and lose the queue: what Cypher takes on, and what your own people should keep.',
    h1: { light: 'Cypher vs doing it in-house.', bold: 'Keep your team. Lose the queue.' },
    metaTitle: 'Cypher vs an in-house web team',
    description: 'How Cypher compares with building in-house: what it takes off your team’s queue, how it works with your developers and marketers, and what your team should keep.',
    answer:
      'An in-house web team knows your brand and your systems, but it has a queue: every request waits behind the last one. Cypher doesn’t replace that team. It takes builds, migrations and personalization off the queue, works in your platform with your components, and hands back pages your team edits on day one.',
    blocks: [
      {
        h: 'At a glance',
        table: {
          head: ['', 'Cypher', 'Your in-house team alone'],
          rows: [
            ['When work starts', 'When you approve the plan', 'When the queue reaches it'],
            ['Skills on hand', 'Twenty-one specialists, from discovery to launch', 'The skills you’ve been able to hire'],
            ['Platform pitfalls', 'Ten years of them, written down', 'What the team has met before'],
            ['Quality checks', 'Every page, every time', 'As time allows'],
            ['What’s learned', 'Written into the playbooks and kept', 'Leaves when people leave'],
            ['Who runs it afterwards', 'Your team, with an editor guide and component catalog', 'Your team'],
          ],
        },
      },
      {
        h: 'Why the queue keeps growing',
        p: [
          'An in-house team is asked for everything: fixes, campaign pages, integrations, the next migration. Urgent work beats important work, so the big projects slip a quarter at a time, and the personalization you paid for stays switched off.',
        ],
      },
      {
        h: 'How Cypher works with your team',
        list: [
          'It builds in your platform, with your components, the way your team already works.',
          'Your developers can review everything: the code is in your repository.',
          'Your marketers edit every page on day one, with an editor guide written for them.',
          'Your team keeps the decisions and the sign-off. Cypher does the rest.',
        ],
      },
      {
        h: 'When your own team is the better choice',
        list: [
          'Small changes on a site that already works: a headline, an image, a new section. Your team edits those directly.',
          'Day-to-day content and campaign publishing.',
          'Work deep inside internal systems only your team can reach.',
        ],
      },
    ],
    faq: [
      { q: 'Will Cypher replace our developers?', a: 'No. It takes the big projects off their queue so they can work on what only they can do. It doesn’t replace your team; it promotes it.' },
      { q: 'Do our developers need to learn new tools?', a: 'No. Cypher builds in your platform, with your components, and the code lives in your repository.' },
      { q: 'Who looks after the site afterwards?', a: 'Your team, with an editor guide, a catalog of every component and a known-gaps report in writing.' },
    ],
    related: ['/compare/agency-build', '/compare/ai-coding-tools', '/how-it-works', '/answers/why-isnt-our-personalization-switched-on', '/playbooks'],
    updated: '2026-11-17',
  },
  {
    slug: 'ai-coding-tools',
    name: 'Cypher vs DIY with AI coding tools',
    card: 'A prompt at a time, or a whole project run to a playbook: what each is good at.',
    h1: { light: 'Cypher vs doing it yourself with AI tools.', bold: 'A playbook, not a prompt.' },
    metaTitle: 'Cypher vs building it yourself with AI coding tools',
    description: 'How Cypher compares with doing a website project yourself with AI coding assistants: who drives, what gets checked, what’s recorded, and when DIY is the better choice.',
    answer:
      'AI coding assistants help a developer write code faster, one prompt at a time. Cypher runs the whole project: discovery, the plan, the build, the checks and the launch, with twenty-one specialists working from written playbooks and a record of every step. You make three decisions instead of writing prompts.',
    blocks: [
      {
        h: 'At a glance',
        table: {
          head: ['', 'Cypher', 'DIY with AI coding tools'],
          rows: [
            ['Who drives', 'A written plan you approve once', 'A developer, prompt by prompt'],
            ['Scope', 'The whole project, brief to launch', 'One task at a time'],
            ['Platform knowledge', 'Ten years of enterprise platform pitfalls, written down', 'What the model knows in general'],
            ['Checks', 'Every page: the design, accessibility, speed and content parity', 'Whatever you test'],
            ['The record', 'Every action logged and exportable; any build replayed', 'Your chat history'],
            ['Handover', 'Editor guide, component catalog, evidence and a known-gaps report', 'What you wrote down'],
            ['Who needs to be technical', 'Someone to grant access; the decisions are marketing ones', 'A developer, throughout'],
          ],
        },
      },
      {
        h: 'What AI coding tools are good at',
        p: ['They make a developer faster on code the developer understands: a component, a script, a fix, a prototype. In good hands they save real time.'],
      },
      {
        h: 'What a website project needs beyond code',
        list: [
          'Discovery: the brand recorded and every page inventoried.',
          'A plan someone approves before anything is built.',
          'Components built the way your platform expects, so editors can use them.',
          'Content moved and checked for parity, and every old URL redirected.',
          'Accessibility and speed checked on every page.',
          'A launch someone signs off, with the evidence in front of them.',
        ],
      },
      {
        h: 'When DIY is the better choice',
        list: [
          'You have developers who want to build it themselves and the time to do it.',
          'You need a prototype or a one-off page, not a site your team will run.',
          'The work sits outside your content platform entirely.',
        ],
      },
    ],
    faq: [
      { q: 'Isn’t Cypher just an AI coding tool?', a: 'No. A coding tool helps a developer write code. Cypher runs the project: discovery, plan, build, checks and launch, with you making three decisions.' },
      { q: 'Can our developers use their own AI tools too?', a: 'Yes. The code is in your repository, so your developers can work on it with whatever tools they like.' },
      { q: 'Do we need a developer on our side?', a: 'You need someone who can grant access to your platform and hosting. After that, the decisions Cypher asks for are marketing decisions.' },
    ],
    related: ['/compare/agency-build', '/compare/in-house-team', '/answers/how-does-an-ai-team-build-a-website', '/how-it-works', '/security'],
    updated: '2026-11-17',
  },
];

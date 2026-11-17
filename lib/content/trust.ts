import type { Page } from './types';

/**
 * The pages that answer "can we trust it?": how Cypher keeps a project safe, and the proof so far.
 * Only facts the site already states, or that the platform does today; new claims are listed for
 * sign-off in docs/discovery-content.md. No certifications are claimed.
 */

export const SECURITY: Page = {
  slug: 'security',
  name: 'Security',
  h1: { light: 'Safe to say yes to.', bold: 'For you, IT and legal.' },
  metaTitle: 'Cypher security: access, records and ownership',
  description: 'How Cypher keeps a website project safe: each client in its own space, only the access a job needs, every change on the record, and your code and keys at the end.',
  answer:
    'Cypher works inside your platform with only the access a job needs. Each client’s work is kept in a space of its own, every action is recorded with who did it and when, and nothing launches without your sign-off. At the end, the code, the hosting and the keys are yours.',
  blocks: [
    {
      h: 'Each client in its own space',
      p: [
        'Every client’s projects, plans, decisions and records are kept apart from every other client’s, and access is checked on every request. One client never sees another’s work.',
        'Rules and lessons your own team adds to a playbook apply to your projects only. They never reach anyone else’s.',
      ],
    },
    {
      h: 'Only the access a job needs',
      p: ['Cypher asks for the access a playbook needs on your platform, your code repository and your hosting, and nothing more. Access is checked in discovery, before anyone builds, and you can take it away when the project ends.'],
    },
    {
      h: 'Your people decide who does what',
      list: [
        'Directors on your side approve the plan, answer the decisions only a marketer can make, and sign off the launch.',
        'Watchers can follow every step but change nothing.',
        'If our experts need to look inside your project to help, that access is granted for a set number of hours, up to three days. Your Directors see it in their list of people, and it ends on its own.',
      ],
    },
    {
      h: 'Every change on the record',
      p: ['Who did what, when and why: every plan, decision, page and approval is logged. The record can be exported for IT, legal or your CMO, and any build can be replayed step by step.'],
    },
    {
      h: 'Nothing launches without you',
      p: ['A Cypher project has two gates, and both are yours. You approve the plan once before anything is built, and you sign off the finished site before it goes live, with the evidence in front of you: speed, accessibility and parity, page by page.'],
    },
    {
      h: 'Yours at the end',
      list: [
        'Your code, in your repository.',
        'Your hosting and your keys.',
        'Pages your team edits on day one, with an editor guide and a catalog of every component.',
        'A known-gaps report: anything not done, and why, in writing.',
        'No lock-in and no retainer.',
      ],
    },
    {
      h: 'When an agreement ends',
      p: ['Your projects become read only. You can export everything for 90 days; after that, your projects, records and your own rules and lessons are deleted.'],
    },
    {
      h: 'People behind every build',
      p: ['Cypher’s specialists are AI, and people who know the platforms stand behind every project. Twenty-five years of engineering and ten years of enterprise platforms are written into the playbooks Cypher follows.'],
    },
  ],
  faq: [
    { q: 'Is Cypher safe enough for an enterprise?', a: 'It’s built for everyone who has to sign it off: each client in its own space, only the access a job needs, every action logged and exportable, and your sign-off before anything launches.' },
    { q: 'What access does Cypher need to our platform?', a: 'The access the playbook needs, and nothing more. It’s checked in discovery, before anyone builds, and you can remove it when the project ends.' },
    { q: 'Can we see everything Cypher did?', a: 'Yes. Every action is logged with who did it, when and why, the record can be exported, and any build can be replayed step by step.' },
    { q: 'Who owns the code?', a: 'You do. It’s in your repository and your hosting, with your keys. There’s no lock-in and no retainer.' },
    { q: 'What happens to our data when we stop?', a: 'Your projects become read only and you can export everything for 90 days. After that, your projects and records are deleted.' },
  ],
  related: ['/how-it-works', '/proof', '/compare/agency-build', '/answers/what-does-a-marketer-decide-in-a-website-build', '/answers/how-does-an-ai-team-build-a-website'],
  updated: '2026-11-17',
};

export const PROOF: Page = {
  slug: 'proof',
  name: 'Proof',
  h1: { light: 'Don’t take our word for it.', bold: 'Here are the receipts.' },
  metaTitle: 'Cypher results: the $512 build and 200 pages in 3 hours',
  description: 'What Cypher has done so far: a build an agency quoted at $400,000+ that cost $512 to run, and a 200-page website lifted and ready to use within three hours.',
  answer:
    'Two results so far. A build an agency quoted at $400,000+ cost $512 to run: the cost of the run, not the price of Cypher. And for Icreon, Cypher’s first customer, discovery took 15 minutes and a 200-page website was lifted and ready to use within three hours.',
  blocks: [
    {
      h: '$400,000+ quoted. $512 to run.',
      p: [
        'An agency quoted more than $400,000 for one website build. Cypher ran that build for $512.',
        'That’s the cost of the run, not the price of Cypher. What it shows is how much of a traditional build is work that Cypher’s specialists now do, with every page checked before a person sees it.',
      ],
    },
    {
      h: 'Icreon: 200 pages in three hours',
      p: [
        'Icreon was Cypher’s first customer. Discovery, the step where Cypher reads the brand and inventories every page, was done in 15 minutes. The entire 200-page website was lifted and ready to use within three hours.',
      ],
      quote: {
        text: '…it was beyond the most impressive thing I’ve ever seen. Discovery was done in 15 minutes, our entire 200-page website lifted and ready to use within 3 hours…',
        who: 'VP Delivery, Icreon',
      },
    },
    {
      h: 'Every build leaves a record',
      p: ['Every action in a Cypher build is logged: who did it, when and why. Any build can be replayed step by step, so a result like these can be checked, not just claimed.'],
    },
    {
      h: 'The best proof is your own site',
      p: ['In a 30-minute demo, Cypher rebuilds your homepage on your platform while you watch. You keep the replay of every step and a plain account of what the rest of your site would take.'],
    },
  ],
  faq: [
    { q: 'Is $512 the price of Cypher?', a: 'No. $512 is what one build cost to run. It isn’t the price of Cypher.' },
    { q: 'Who was Cypher’s first customer?', a: 'Icreon. Its VP Delivery said discovery was done in 15 minutes and its entire 200-page website was lifted and ready to use within three hours.' },
    { q: 'How can I check these results for myself?', a: 'Book a demo. Cypher rebuilds your own homepage while you watch, and you keep the replay of every step.' },
  ],
  related: ['/playbooks/homepage-rebuild', '/how-it-works', '/security', '/compare/agency-build', '/playbooks/migration'],
  updated: '2026-11-17',
};

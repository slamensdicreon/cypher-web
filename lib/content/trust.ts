import type { Page } from './types';

/**
 * The page that answers "can we trust it?": how Cypher keeps a project safe.
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
      p: ['Your projects become read only. You can export everything for 90 days; after that, your projects, records and your own rules and lessons are deleted. Your site keeps running, and your code is kept so it can be handed over.'],
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
    { q: 'What happens to our data when we stop?', a: 'Your projects become read only and you can export everything for 90 days. After that, your projects and records are deleted, but your site keeps running and your code is kept so it can be handed over.' },
  ],
  related: ['/how-it-works', '/compare/agency-build', '/compare/in-house-team', '/answers/what-does-a-marketer-decide-in-a-website-build', '/answers/how-does-an-ai-team-build-a-website'],
  updated: '2026-11-18',
};

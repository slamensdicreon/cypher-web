import { ANSWERS } from './answers';
import { COMPARES } from './compare';
import { TERMS } from './glossary';
import { COMBOS, PLATFORMS } from './platforms';
import { PLAYBOOKS } from './playbooks';
import { RESOURCES } from './resources';
import { PROOF, SECURITY } from './trust';

export { ANSWERS, COMBOS, COMPARES, PLATFORMS, PLAYBOOKS, PROOF, RESOURCES, SECURITY, TERMS };

/** One page of the site, for related links, the sitemap and llms.txt. */
export type Entry = { path: string; name: string; line: string; group: string; updated?: string };

/** The pages written by hand. */
const STATIC: Entry[] = [
  { path: '/', name: 'Home', line: 'What Cypher is: twenty-one AI specialists that build, migrate, personalize and optimize your site.', group: 'Cypher' },
  { path: '/how-it-works', name: 'How it works', line: 'How Cypher and a marketer work together, from brief to launch, with two approvals.', group: 'Cypher' },
  { path: '/playbooks', name: 'Playbooks', line: 'Every outcome Cypher runs, written down and run the same way every time.', group: 'Cypher' },
  { path: '/platforms', name: 'Platforms', line: 'Sitecore, Optimizely, Contentful, or whatever you run.', group: 'Cypher' },
  { path: '/answers', name: 'Answers', line: 'Straight answers to what marketers ask about builds, migrations, personalization and launches.', group: 'Learn' },
  { path: '/glossary', name: 'Glossary', line: 'The words you meet in a website build, in plain English.', group: 'Learn' },
  { path: '/resources', name: 'Checklists and templates', line: 'Free checklists and templates for migrations, redirects and personalization.', group: 'Learn' },
  { path: '/proof', name: 'Proof', line: 'The receipts: a $400,000+ build that cost $512 to run, and a 200-page site ready in three hours.', group: 'Cypher', updated: PROOF.updated },
  { path: '/security', name: 'Security', line: 'Each client in its own space, only the access a job needs, every change on the record, and your code at the end.', group: 'Cypher', updated: SECURITY.updated },
  { path: '/compare', name: 'Compare', line: 'Cypher against an agency, an in-house team and DIY AI tools, including when each is the better choice.', group: 'Learn', updated: '2026-11-17' },
  { path: '/demo', name: 'Book a demo', line: 'Thirty minutes: watch Cypher rebuild your homepage on your platform.', group: 'Cypher' },
];

export function entries(): Entry[] {
  return [
    ...STATIC,
    ...PLATFORMS.map((p) => ({ path: `/platforms/${p.slug}`, name: p.name, line: p.card, group: 'Platforms', updated: p.updated })),
    ...COMBOS.map((c) => ({ path: `/platforms/${c.platform}/${c.slug}`, name: c.name, line: c.card, group: 'Platforms', updated: c.updated })),
    ...PLAYBOOKS.map((p) => ({ path: `/playbooks/${p.slug}`, name: p.name, line: p.card, group: 'Playbooks', updated: p.updated })),
    ...ANSWERS.map((a) => ({ path: `/answers/${a.slug}`, name: a.h1.bold || a.name, line: a.description, group: 'Answers', updated: a.updated })),
    ...RESOURCES.map((r) => ({ path: `/resources/${r.slug}`, name: r.name, line: r.card, group: 'Checklists and templates', updated: r.updated })),
    ...COMPARES.map((c) => ({ path: `/compare/${c.slug}`, name: c.name, line: c.card, group: 'Compare', updated: c.updated })),
  ];
}

/** Look up a page by its path, for related links. */
export function entry(path: string): Entry | undefined {
  return entries().find((e) => e.path === path);
}

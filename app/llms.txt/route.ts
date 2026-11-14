import { entries } from '@/lib/content';
import { WHAT_CYPHER_IS } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * llms.txt: a plain map of the site for AI crawlers and answer engines (llmstxt.org): what Cypher is,
 * then every page that matters, each with one line.
 */
export function GET() {
  const all = entries();
  const groups = ['Cypher', 'Platforms', 'Playbooks', 'Answers', 'Checklists and templates', 'Learn'];
  const lines: string[] = [
    '# Cypher',
    '',
    `> ${WHAT_CYPHER_IS}`,
    '',
    'Cypher works from playbooks: website builds, migrations, customer and member portals, personalization, optimization, design systems for many brand sites, storefronts and intranets. Every project runs ten phases in order; two of them end in a gate the marketer approves (the Blueprint, and UAT before launch). Every action goes through one gateway into an append-only log. The marketer’s team edits everything in their own platform on day one, and owns the code, hosting and keys at the end. To see it, book a demo: Cypher rebuilds your homepage on your platform while you watch.',
    '',
  ];
  for (const g of groups) {
    const items = all.filter((e) => e.group === g);
    if (!items.length) continue;
    lines.push(`## ${g}`, '');
    for (const e of items) lines.push(`- [${e.name}](${SITE_URL}${e.path === '/' ? '/' : e.path}): ${e.line}`);
    lines.push('');
  }
  lines.push('## Optional', '', `- [Privacy](${SITE_URL}/privacy): What the site collects, why, and how to have it deleted.`, `- [Terms of Use](${SITE_URL}/terms): A parody. Read slowly.`, '');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}

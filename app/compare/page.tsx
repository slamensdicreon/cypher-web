import type { Metadata } from 'next';
import { Card, IndexHero, IndexShell } from '@/components/site/Article';
import { COMPARES } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';
import { contentPage, graph } from '@/lib/schema';

const description =
  'How Cypher compares with the other ways to get a website built, migrated or personalized: an agency, an in-house team, or doing it yourself with AI tools.';

export const metadata: Metadata = pageMeta({ metaTitle: 'Cypher compared: agencies, in-house teams, AI tools', description }, '/compare');
export const viewport = LIGHT;

/** Compare: Cypher against each other way of getting the work done, including when that way is better. */
export default function ComparePage() {
  return (
    <IndexShell label="compare" data={graph(contentPage({ path: '/compare', title: 'Cypher compared', description, updated: '2026-11-17' }))}>
      <IndexHero
        trail={[{ name: 'Compare', href: '/compare' }]}
        light="Cypher compared."
        bold="Including when it’s not the answer."
        lead="How Cypher stacks up against the other ways to get a site built, migrated or personalized. Each page says plainly when the other way is the better choice."
      />
      <div className="bl-w bl-after">
        <ul className="bl-related">
          {COMPARES.map((c) => <Card key={c.slug} href={`/compare/${c.slug}`} name={c.name} line={c.card} />)}
        </ul>
      </div>
    </IndexShell>
  );
}

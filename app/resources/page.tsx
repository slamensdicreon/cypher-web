import type { Metadata } from 'next';
import { Card, IndexHero, IndexShell } from '@/components/site/Article';
import { RESOURCES } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';
import { contentPage, graph } from '@/lib/schema';

const description =
  'Free, ungated checklists and templates for marketers: a website migration checklist, a redirect map template and a personalization readiness checklist.';

export const metadata: Metadata = pageMeta({ metaTitle: 'Free checklists and templates for website projects', description }, '/resources');
export const viewport = LIGHT;

/** Checklists and templates: free, ungated, usable without Cypher. */
export default function Resources() {
  return (
    <IndexShell label="resources" data={graph(contentPage({ path: '/resources', title: 'Checklists and templates', description, updated: '2026-11-14' }))}>
      <IndexHero
        trail={[{ name: 'Checklists and templates', href: '/resources' }]}
        light="Take these. They’re free."
        bold="Checklists and templates from real builds."
        lead="No form, no email. The same lists Cypher works through, written so your team can use them with or without us."
      />
      <section className="bl-w bl-after">
        <ul className="bl-related">
          {RESOURCES.map((r) => <Card key={r.slug} href={`/resources/${r.slug}`} name={r.name} line={r.card} />)}
        </ul>
      </section>
    </IndexShell>
  );
}

import type { Metadata } from 'next';
import { Card, IndexHero, IndexShell } from '@/components/site/Article';
import { COMBOS, PLATFORMS } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';
import { contentPage, graph } from '@/lib/schema';

const description =
  'Cypher builds, migrates, personalizes and optimizes on Sitecore, Optimizely, Contentful and other enterprise platforms. What it does on each, and what it watches for.';

export const metadata: Metadata = pageMeta({ metaTitle: 'Platforms: Sitecore, Optimizely, Contentful and more', description }, '/platforms');
export const viewport = LIGHT;

/** Platforms: the platform you run, and what Cypher does on it. */
export default function Platforms() {
  return (
    <IndexShell label="platforms" data={graph(contentPage({ path: '/platforms', title: 'Platforms', description, updated: '2026-11-14' }))}>
      <IndexHero
        trail={[{ name: 'Platforms', href: '/platforms' }]}
        light="I work on the platform you already run."
        bold="Sitecore, Optimizely, Contentful, or whatever you run."
        lead="Same crew, same playbooks, same checks, on any enterprise platform. Here’s what I do on each, and what I watch for so you don’t have to."
      />
      <section className="bl-w bl-after bl-stack">
        <ul className="bl-related">
          {PLATFORMS.map((p) => <Card key={p.slug} href={`/platforms/${p.slug}`} name={p.name} line={p.card} />)}
        </ul>
        <h2 className="bl-h3">Go deeper</h2>
        <ul className="bl-related">
          {COMBOS.map((c) => <Card key={`${c.platform}/${c.slug}`} href={`/platforms/${c.platform}/${c.slug}`} name={c.name} line={c.card} />)}
        </ul>
      </section>
    </IndexShell>
  );
}

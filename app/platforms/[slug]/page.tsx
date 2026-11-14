import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article, { Card } from '@/components/site/Article';
import { COMBOS, PLATFORMS } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const dynamicParams = false;
export const viewport = LIGHT;
export const generateStaticParams = () => PLATFORMS.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PLATFORMS.find((x) => x.slug === slug);
  return p ? pageMeta(p, `/platforms/${slug}`) : {};
}

/** One platform: what Cypher does on it, the playbooks that apply, and what it watches for. */
export default async function PlatformPage({ params }: Props) {
  const { slug } = await params;
  const p = PLATFORMS.find((x) => x.slug === slug);
  if (!p) notFound();
  const deeper = COMBOS.filter((c) => c.platform === slug);
  return (
    <Article page={p} path={`/platforms/${slug}`} label={`platform-${slug}`} trail={[{ name: 'Platforms', href: '/platforms' }, { name: p.name, href: `/platforms/${slug}` }]}>
      {deeper.length > 0 && (
        <section className="bl-art-sec">
          <h2>Go deeper on {p.name}</h2>
          <ul className="bl-related">
            {deeper.map((c) => <Card key={c.slug} href={`/platforms/${slug}/${c.slug}`} name={c.name} line={c.card} />)}
          </ul>
        </section>
      )}
    </Article>
  );
}

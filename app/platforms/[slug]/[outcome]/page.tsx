import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article from '@/components/site/Article';
import { COMBOS, PLATFORMS } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const dynamicParams = false;
export const viewport = LIGHT;
export const generateStaticParams = () => COMBOS.map((c) => ({ slug: c.platform, outcome: c.slug }));

type Props = { params: Promise<{ slug: string; outcome: string }> };
const find = (slug: string, outcome: string) => COMBOS.find((c) => c.platform === slug && c.slug === outcome);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, outcome } = await params;
  const c = find(slug, outcome);
  return c ? pageMeta(c, `/platforms/${slug}/${outcome}`) : {};
}

/** One platform and one outcome, where there is something real to say. */
export default async function ComboPage({ params }: Props) {
  const { slug, outcome } = await params;
  const c = find(slug, outcome);
  const platform = PLATFORMS.find((p) => p.slug === slug);
  if (!c || !platform) notFound();
  const path = `/platforms/${slug}/${outcome}`;
  return (
    <Article
      page={c}
      path={path}
      label={`platform-${slug}-${outcome}`}
      trail={[{ name: 'Platforms', href: '/platforms' }, { name: platform.name, href: `/platforms/${slug}` }, { name: c.name, href: path }]}
    />
  );
}

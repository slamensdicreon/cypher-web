import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article from '@/components/site/Article';
import { COMPARES } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const dynamicParams = false;
export const viewport = LIGHT;
export const generateStaticParams = () => COMPARES.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARES.find((x) => x.slug === slug);
  return c ? pageMeta(c, `/compare/${slug}`) : {};
}

/** One comparison: the answer first, the table, then when the other way is the better choice. */
export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const c = COMPARES.find((x) => x.slug === slug);
  if (!c) notFound();
  return <Article page={c} path={`/compare/${slug}`} label={`compare-${slug}`} article trail={[{ name: 'Compare', href: '/compare' }, { name: c.name, href: `/compare/${slug}` }]} />;
}

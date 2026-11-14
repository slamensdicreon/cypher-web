import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article from '@/components/site/Article';
import { PLAYBOOKS } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const dynamicParams = false;
export const viewport = LIGHT;
export const generateStaticParams = () => PLAYBOOKS.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PLAYBOOKS.find((x) => x.slug === slug);
  return p ? pageMeta(p, `/playbooks/${slug}`) : {};
}

/** One playbook: what you get, how it runs, what it checks, what you decide. */
export default async function PlaybookPage({ params }: Props) {
  const { slug } = await params;
  const p = PLAYBOOKS.find((x) => x.slug === slug);
  if (!p) notFound();
  return <Article page={p} path={`/playbooks/${slug}`} label={`playbook-${slug}`} trail={[{ name: 'Playbooks', href: '/playbooks' }, { name: p.name, href: `/playbooks/${slug}` }]} />;
}

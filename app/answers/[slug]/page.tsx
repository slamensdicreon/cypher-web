import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article from '@/components/site/Article';
import { ANSWERS } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const dynamicParams = false;
export const viewport = LIGHT;
export const generateStaticParams = () => ANSWERS.map((a) => ({ slug: a.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ANSWERS.find((x) => x.slug === slug);
  return a ? pageMeta(a, `/answers/${slug}`) : {};
}

/** One answer: the question as the headline, the answer first, then the depth. */
export default async function AnswerPage({ params }: Props) {
  const { slug } = await params;
  const a = ANSWERS.find((x) => x.slug === slug);
  if (!a) notFound();
  return <Article page={a} path={`/answers/${slug}`} label={`answer-${slug}`} article heroCta={false} trail={[{ name: 'Answers', href: '/answers' }, { name: a.name, href: `/answers/${slug}` }]} />;
}

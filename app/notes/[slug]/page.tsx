import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article from '@/components/site/Article';
import { LIGHT, pageMeta } from '@/lib/content/meta';
import type { Page } from '@/lib/content/types';
import { bodyBlocks, publishedNote, publishedNotes, type Note } from '@/lib/notes';

export const viewport = LIGHT;
/** Notes published since the last deploy render on first visit, then stay cached until changed. */
export const dynamicParams = true;
export const generateStaticParams = async () => (await publishedNotes()).map((n) => ({ slug: n.slug }));

type Props = { params: Promise<{ slug: string }> };

const PLATFORM_PATH: Record<string, string> = { Sitecore: '/platforms/sitecore', Optimizely: '/platforms/optimizely', Contentful: '/platforms/contentful' };

/** A short description for search results, cut at a word. */
const short = (s: string, max = 158) => (s.length <= max ? s : `${s.slice(0, s.lastIndexOf(' ', max - 1))}…`);

/** A note in the shape every long page uses, so it gets the same layout and structured data. */
function asPage(n: Note): Page {
  return {
    slug: n.slug,
    name: n.title,
    h1: { light: '', bold: n.title },
    metaTitle: n.title,
    description: short(n.summary),
    answer: n.summary,
    blocks: [],
    faq: [],
    related: ['/notes', ...(PLATFORM_PATH[n.platform] ? [PLATFORM_PATH[n.platform]] : []), '/playbooks', '/answers'],
    updated: new Date(n.updatedAt).toISOString().slice(0, 10),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = await publishedNote(slug);
  return n ? pageMeta(asPage(n), `/notes/${slug}`) : {};
}

/** One playbook note: the lesson first, then the detail. */
export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const n = await publishedNote(slug);
  if (!n) notFound();
  return (
    <Article page={asPage(n)} path={`/notes/${slug}`} label={`note-${slug}`} article trail={[{ name: 'Playbook notes', href: '/notes' }, { name: n.title, href: `/notes/${slug}` }]}>
      <section className="bl-art-sec">
        {bodyBlocks(n.body).map((b, i) =>
          b.kind === 'p' ? <p key={i}>{b.text}</p> : <ul key={i} className="bl-art-list">{b.items.map((t) => <li key={t}>{t}</li>)}</ul>,
        )}
      </section>
    </Article>
  );
}

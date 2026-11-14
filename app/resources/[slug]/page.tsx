import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article from '@/components/site/Article';
import { RESOURCES } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const dynamicParams = false;
export const viewport = LIGHT;
export const generateStaticParams = () => RESOURCES.map((r) => ({ slug: r.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = RESOURCES.find((x) => x.slug === slug);
  return r ? pageMeta(r, `/resources/${slug}`) : {};
}

/** One checklist or template: how to use it, then the list itself, and the file if there is one. */
export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const r = RESOURCES.find((x) => x.slug === slug);
  if (!r) notFound();
  return (
    <Article page={r} path={`/resources/${slug}`} label={`resource-${slug}`} article heroCta={false} trail={[{ name: 'Checklists and templates', href: '/resources' }, { name: r.name, href: `/resources/${slug}` }]}>
      <section className="bl-art-sec bl-checklist" aria-label={`${r.name}: the list`}>
        {r.download && (
          <p><a className="bl-btn bl-btn-ink" href={r.download.href} download>{r.download.label}</a></p>
        )}
        {r.groups.map((g) => (
          <div key={g.h} className="bl-check-group">
            <h2>{g.h}</h2>
            <ul className="bl-check-list">
              {g.items.map((i) => <li key={i}><span className="bl-box" aria-hidden="true" />{i}</li>)}
            </ul>
          </div>
        ))}
      </section>
    </Article>
  );
}

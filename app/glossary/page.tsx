import type { Metadata } from 'next';
import Link from 'next/link';
import { IndexHero, IndexShell } from '@/components/site/Article';
import { TERMS, entry } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';
import { SITE_URL } from '@/lib/site';
import { contentPage, graph } from '@/lib/schema';

const description =
  'The words you meet in a website build, migration or personalization project, defined in plain English: content parity, headless CMS, redirect map, UAT and more.';

export const metadata: Metadata = pageMeta({ metaTitle: 'Glossary: website build and migration terms, in plain English', description }, '/glossary');
export const viewport = LIGHT;

/** The glossary: every term on one page, each with its own anchor. */
export default function Glossary() {
  const terms = [...TERMS].sort((a, b) => a.term.localeCompare(b.term));
  const set = {
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}/glossary#terms`,
    name: 'Cypher glossary',
    hasDefinedTerm: terms.map((t) => ({ '@type': 'DefinedTerm', name: t.term, description: t.def, url: `${SITE_URL}/glossary#${t.slug}`, inDefinedTermSet: `${SITE_URL}/glossary#terms` })),
  };
  return (
    <IndexShell label="glossary" data={graph(contentPage({ path: '/glossary', title: 'Glossary', description, updated: '2026-11-14' }), set)}>
      <IndexHero
        trail={[{ name: 'Glossary', href: '/glossary' }]}
        light="The words you’ll hear."
        bold="In plain English."
        lead="Everything that comes up in a website build, a migration or a personalization project, defined in a sentence or two."
      />
      <section className="bl-w bl-after">
        <dl className="bl-terms">
          {terms.map((t) => (
            <div key={t.slug} id={t.slug} className="bl-term">
              <dt>{t.term}</dt>
              <dd>
                <p>{t.def}</p>
                {t.see && t.see.length > 0 && (
                  <span className="bl-term-see">
                    {t.see.map((p) => entry(p)).filter((e): e is NonNullable<typeof e> => !!e).map((e) => <Link key={e.path} href={e.path}>{e.name}</Link>)}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </IndexShell>
  );
}

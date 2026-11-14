import type { Metadata } from 'next';
import { Card, IndexHero, IndexShell } from '@/components/site/Article';
import { ANSWERS } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';
import type { Answer } from '@/lib/content/types';
import { contentPage, graph } from '@/lib/schema';

const description =
  'Straight answers to what marketers ask about website builds, CMS migrations, personalization, A/B tests and launches, on Sitecore, Optimizely, Contentful and more.';

export const metadata: Metadata = pageMeta({ metaTitle: 'Answers for marketers: builds, migrations, launches', description }, '/answers');
export const viewport = LIGHT;

const TOPICS: Answer['topic'][] = ['Migration', 'Personalization and testing', 'Launch', 'Platforms', 'Working with Cypher'];

/** Answers: the questions marketers ask, answered first and plainly. */
export default function Answers() {
  return (
    <IndexShell label="answers" data={graph(contentPage({ path: '/answers', title: 'Answers', description, updated: '2026-11-14' }))}>
      <IndexHero
        trail={[{ name: 'Answers', href: '/answers' }]}
        light="Straight answers."
        bold="For marketers who build, migrate and launch."
        lead="The questions that come up in every website project, answered first and plainly. Useful whether or not you ever book a demo."
      />
      <div className="bl-w bl-after bl-stack">
        {TOPICS.map((t) => {
          const items = ANSWERS.filter((a) => a.topic === t);
          if (!items.length) return null;
          return (
            <section key={t} className="bl-stack-sm">
              <h2 className="bl-h3">{t}</h2>
              <ul className="bl-related">
                {items.map((a) => <Card key={a.slug} href={`/answers/${a.slug}`} name={a.h1.bold || a.name} line={a.description} />)}
              </ul>
            </section>
          );
        })}
      </div>
    </IndexShell>
  );
}

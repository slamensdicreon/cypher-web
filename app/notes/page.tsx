import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, IndexHero, IndexShell } from '@/components/site/Article';
import { LIGHT, pageMeta } from '@/lib/content/meta';
import { publishedNotes } from '@/lib/notes';
import { contentPage, graph } from '@/lib/schema';

const description =
  'Short lessons from real website builds, migrations and personalization projects on Sitecore, Optimizely and Contentful, written down so nobody learns them twice.';

/** Until the first note is published, the page stays out of search results. */
export async function generateMetadata(): Promise<Metadata> {
  const notes = await publishedNotes();
  return { ...pageMeta({ metaTitle: 'Playbook notes: lessons from real website builds', description }, '/notes'), ...(notes.length ? {} : { robots: { index: false, follow: true } }) };
}
export const viewport = LIGHT;

const day = (d: Date | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '');

/** Playbook notes: lessons from real builds, newest first. */
export default async function Notes() {
  const notes = await publishedNotes();
  return (
    <IndexShell label="notes" data={graph(contentPage({ path: '/notes', title: 'Playbook notes', description, updated: notes[0]?.publishedAt ? new Date(notes[0].publishedAt).toISOString().slice(0, 10) : '2026-11-17' }))}>
      <IndexHero
        trail={[{ name: 'Playbook notes', href: '/notes' }]}
        light="Playbook notes."
        bold="Lessons from real builds."
        lead="Every build teaches the playbooks something. These are the lessons worth sharing: short, specific and written down so nobody has to learn them twice."
      />
      <div className="bl-w bl-after">
        {notes.length ? (
          <ul className="bl-related">
            {notes.map((n) => <Card key={n.slug} href={`/notes/${n.slug}`} name={n.title} line={`${n.platform ? `${n.platform} · ` : ''}${day(n.publishedAt)}`} />)}
          </ul>
        ) : (
          <p className="bl-hero-p left">The first notes are on their way. Until then, the <Link href="/playbooks">playbooks</Link> and <Link href="/answers">answers</Link> cover how Cypher works.</p>
        )}
      </div>
    </IndexShell>
  );
}

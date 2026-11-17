import 'server-only';
import { cache } from 'react';
import { migrate, sql } from '@/lib/store';

/**
 * Playbook notes: short, expert lessons from real builds, published on the site at /notes. Each
 * starts from one of Icreon's own lessons in the Launchworks knowledge base (never a customer's),
 * is rewritten for the public by a person in the admin, and goes live only when they publish it.
 *
 * The body is plain text: paragraphs separated by a blank line, and lines starting "- " as a list.
 */

export type Note = {
  /** A bigserial: postgres returns it as a string. */
  id: string;
  slug: string;
  sourceId: string;
  sourceRef: string;
  platform: string;
  title: string;
  summary: string;
  body: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
};

/** The platforms a note can be about; blank is any platform. */
export const NOTE_PLATFORMS = ['', 'Sitecore', 'Optimizely', 'Contentful'] as const;

/** Limits, checked on save, so every note keeps the answer-first shape. */
export const LIMITS = { title: [8, 110], summary: [120, 420], body: [200, 8000] } as const;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

/** Every note, newest first (the admin). */
export async function allNotes(): Promise<Note[]> {
  if (!sql) return [];
  await migrate();
  return sql<Note[]>`select * from site_notes order by coalesce(published_at, updated_at) desc, id desc`;
}

/**
 * Published notes, newest first. Read when public pages are built or revalidated; a database that
 * can't be reached means no notes, never a broken page.
 */
export const publishedNotes = cache(async (): Promise<Note[]> => {
  if (!sql) return [];
  try {
    await migrate();
    return await sql<Note[]>`select * from site_notes where published order by published_at desc, id desc`;
  } catch (err) {
    console.error('[notes] could not read published notes', (err as Error).message);
    return [];
  }
});

export async function publishedNote(slug: string): Promise<Note | null> {
  return (await publishedNotes()).find((n) => n.slug === slug) ?? null;
}

export async function noteById(id: number): Promise<Note | null> {
  if (!sql) return null;
  await migrate();
  const [n] = await sql<Note[]>`select * from site_notes where id = ${id}`;
  return n ?? null;
}

/** What's wrong with a note's text, in words, or null when it's ready. */
export function problems(n: Pick<Note, 'title' | 'summary' | 'body' | 'slug'>): string | null {
  const len = (k: keyof typeof LIMITS, v: string, label: string) =>
    v.length < LIMITS[k][0] || v.length > LIMITS[k][1] ? `${label} needs ${LIMITS[k][0]} to ${LIMITS[k][1]} characters (it has ${v.length}).` : null;
  return (
    len('title', n.title, 'The title') ??
    len('summary', n.summary, 'The summary') ??
    len('body', n.body, 'The note') ??
    (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n.slug) ? 'The web address can only use lower-case letters, numbers and hyphens.' : null)
  );
}

/** A note's body as paragraphs and lists, for the page. */
export function bodyBlocks(body: string): ({ kind: 'p'; text: string } | { kind: 'list'; items: string[] })[] {
  return body
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n').map((l) => l.trim());
      return lines.every((l) => l.startsWith('- '))
        ? { kind: 'list' as const, items: lines.map((l) => l.slice(2).trim()) }
        : { kind: 'p' as const, text: lines.join(' ') };
    });
}

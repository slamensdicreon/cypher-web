import { revalidatePath } from 'next/cache';
import { NextResponse, after } from 'next/server';
import { audit } from '@/lib/audit';
import { apiUser } from '@/lib/auth/request';
import { runIndexNow } from '@/lib/indexnow';
import { NOTE_PLATFORMS, noteById, problems, slugify, type Note } from '@/lib/notes';
import { ICREON, isCustomers, platform, platformConfigured, type KnowledgeList, type Org } from '@/lib/platform';
import { migrate, sql } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Every public page that shows notes: the notes themselves, the footer link, the sitemap and llms.txt. */
function refreshSite(slug: string) {
  revalidatePath('/notes');
  revalidatePath(`/notes/${slug}`);
  revalidatePath('/', 'layout');
  revalidatePath('/sitemap.xml');
  revalidatePath('/llms.txt');
  // Tell the search engines once the response has gone.
  after(async () => {
    try {
      const r = await runIndexNow();
      console.log('[indexnow] after a note', JSON.stringify({ sent: r.sent.length, removed: r.removed.length, result: r.result }));
    } catch (err) {
      console.error('[indexnow] after a note failed', (err as Error).message);
    }
  });
}

/** Saves, publishes, unpublishes or deletes a playbook note, as the person signed in. */
export async function POST(req: Request) {
  const s = await apiUser('site', 'write');
  if (!s || !sql) return new Response('Not found', { status: 404 });
  await migrate();
  const f = await req.formData().catch(() => new FormData());
  const str = (k: string) => (typeof f.get(k) === 'string' ? (f.get(k) as string).trim() : '');
  const intent = str('intent');
  const id = Number(str('id')) || 0;
  const who = s.user.name || s.user.email;
  const back = (msg: string, noteId?: number | string) => {
    const u = new URL('/admin/notes', req.url);
    if (noteId) u.searchParams.set('edit', String(noteId));
    u.searchParams.set('msg', msg);
    return NextResponse.redirect(new URL(u.pathname + u.search, req.url), 303);
  };
  const before = id ? await noteById(id) : null;
  if (id && !before) return back('That didn’t work: that note no longer exists.');

  if (intent === 'delete') {
    if (!before) return back('That didn’t work: nothing to delete.');
    await sql`delete from site_notes where id = ${id}`;
    await audit(s, { action: 'notes.delete', entity: 'note', entityId: id, summary: `Deleted note “${before.title}”`, before: { slug: before.slug, published: before.published } }, req.headers);
    if (before.published) refreshSite(before.slug);
    return back(`“${before.title}” is deleted.`);
  }

  if (intent === 'unpublish') {
    if (!before) return back('That didn’t work: nothing to unpublish.');
    await sql`update site_notes set published = false, updated_at = now(), updated_by = ${who} where id = ${id}`;
    await audit(s, { action: 'notes.unpublish', entity: 'note', entityId: id, summary: `Unpublished note “${before.title}”` }, req.headers);
    refreshSite(before.slug);
    return back(`“${before.title}” is off the site. It’s kept as a draft.`, id);
  }

  // Save (a draft, or a published note's new wording), optionally publishing it.
  const sourceId = before ? before.sourceId : str('source_id');
  const sourceRef = before ? before.sourceRef : str('source_ref');
  const platformName = (NOTE_PLATFORMS as readonly string[]).includes(str('platform')) ? str('platform') : '';
  const title = str('title');
  // The address is fixed once a note has been published, so links to it never break.
  const slug = before?.publishedAt ? before.slug : slugify(str('slug') || title);
  const n = { title, summary: str('summary'), body: str('body'), slug };
  const publish = intent === 'publish' || (before?.published ?? false);

  // A note always starts from one of Icreon's own lessons, never a customer's.
  if (sourceId && !before && platformConfigured()) {
    try {
      const list = await platform<KnowledgeList>(s.user, 'GET', '/knowledge?status=active');
      const src = list.entries.find((e) => e.id === sourceId);
      if (src && isCustomers(src)) return back('That didn’t work: that lesson is a customer’s own. Notes only come from Icreon’s lessons.');
    } catch {
      // The knowledge base isn't reachable: the note stands on its own text.
    }
  }

  // Why it can't go on the site yet, if anything: then a new note or a draft is kept as a draft, so no
  // writing is lost, and a published note keeps its live wording.
  let held: string | null = null;
  if (publish) {
    held = problems(n);
    // Notes never name a client: check against every organization on the platform.
    if (!held && platformConfigured()) {
      try {
        const orgs = await platform<Org[]>(s.user, 'GET', '/admin/organizations');
        const text = `${n.title}\n${n.summary}\n${n.body}`;
        const named = [{ id: ICREON, name: 'Icreon' }, ...orgs]
          .filter((o) => o.name.trim().length >= 3)
          .find((o) => new RegExp(`\\b${o.name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text));
        if (named) held = `The note names ${named.name}. Notes never name a client: take it out and publish again.`;
      } catch {
        // Can't reach the organization list: the person publishing is the check.
      }
    }
    if (held && before?.published) return back(`That didn’t work: ${held} The note on the site is unchanged.`, id);
  }
  if (!n.title || !n.slug) return back('That didn’t work: a note needs a title.', id || undefined);
  const live = publish && !held;

  let saved: Note;
  try {
    if (before) {
      [saved] = await sql<Note[]>`
        update site_notes set title = ${n.title}, summary = ${n.summary}, body = ${n.body}, slug = ${n.slug}, platform = ${platformName},
          published = ${live}, published_at = case when ${live} and published_at is null then now() else published_at end,
          updated_at = now(), updated_by = ${who}
        where id = ${id} returning *`;
    } else {
      [saved] = await sql<Note[]>`
        insert into site_notes (slug, source_id, source_ref, platform, title, summary, body, published, published_at, created_by, updated_by)
        values (${n.slug}, ${sourceId}, ${sourceRef}, ${platformName}, ${n.title}, ${n.summary}, ${n.body}, ${live}, ${live ? new Date() : null}, ${who}, ${who})
        returning *`;
    }
  } catch (err) {
    if ((err as { code?: string }).code === '23505') return back(`That didn’t work: another note already uses the address /notes/${n.slug}. Change the title or the address.`, id || undefined);
    throw err;
  }

  const verb = !before ? (live ? 'Published' : 'Drafted') : live && !before.published ? 'Published' : 'Edited';
  await audit(s, { action: `notes.${verb.toLowerCase()}`, entity: 'note', entityId: saved.id, summary: `${verb} note “${saved.title}”${sourceRef ? ` (from ${sourceRef})` : ''}`, after: { slug: saved.slug, published: saved.published } }, req.headers);
  if (saved.published || before?.published) refreshSite(saved.slug);
  if (held) return back(`Saved as a draft, not published: ${held}`, saved.id);
  return back(saved.published ? (verb === 'Published' ? `“${saved.title}” is live at /notes/${saved.slug}.` : `“${saved.title}” is updated on the site.`) : `“${saved.title}” is saved as a draft.`, saved.id);
}

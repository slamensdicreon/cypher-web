import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { attempt } from '@/components/admin/platform/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { LIMITS, NOTE_PLATFORMS, allNotes, type Note } from '@/lib/notes';
import { isCustomers, platform, platformConfigured, type Entry, type KnowledgeList, type Playbook } from '@/lib/platform';

type Search = { msg?: string; edit?: string; from?: string; new?: string };

const day = (d: Date | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');

/**
 * Playbook notes: lessons from real builds, published on the site at /notes. Start from one of
 * Icreon's lessons in the knowledge base, rewrite it for the public, and publish. Customers' own
 * lessons never appear here.
 */
export default async function NotesAdmin({ searchParams }: { searchParams: Promise<Search> }) {
  const s = await requireUser('site', 'read', '/admin/notes');
  const sp = await searchParams;
  const writable = can(s.user.roles, 'site', 'write');
  const notes = await allNotes();

  // The knowledge base: Icreon's active lessons and procedures (never a customer's, never engineering's gaps).
  const [kb, cat] = platformConfigured()
    ? await Promise.all([attempt(platform<KnowledgeList>(s.user, 'GET', '/knowledge?status=active')), attempt(platform<Playbook[]>(s.user, 'GET', '/playbooks'))])
    : [null, null];
  const lessons: Entry[] = kb?.ok ? kb.data.entries.filter((e) => !isCustomers(e) && (e.kind === 'lesson' || e.kind === 'procedure')) : [];
  const platformOf = (e: Entry) => {
    const id = e.scope.kind === 'platform' ? e.scope.id : e.scope.kind === 'playbook' && cat?.ok ? cat.data.find((p) => p.id === e.scope.id)?.platform.id : undefined;
    const name = cat?.ok ? cat.data.find((p) => p.platform.id === id)?.platform.name : undefined;
    return (NOTE_PLATFORMS as readonly string[]).includes(name ?? '') ? name! : '';
  };
  const used = new Map(notes.filter((n) => n.sourceId).map((n) => [n.sourceId, n]));

  const editing = sp.edit ? notes.find((n) => String(n.id) === sp.edit) : undefined;
  const from = !editing && sp.from ? lessons.find((e) => e.id === sp.from) : undefined;
  const open = Boolean(editing || from || sp.new);
  const draft: Pick<Note, 'title' | 'summary' | 'body' | 'platform' | 'slug'> & { sourceId: string; sourceRef: string } = editing
    ? editing
    : from
      ? { title: from.title, summary: '', body: from.text, platform: platformOf(from), slug: '', sourceId: from.id, sourceRef: from.ref }
      : { title: '', summary: '', body: '', platform: '', slug: '', sourceId: '', sourceRef: '' };

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Playbook notes</h1>
          <p>Short lessons from real builds, published on the site at <a href="/notes" target="_blank" rel="noreferrer">/notes</a>. Start from one of Icreon’s lessons in the knowledge base, rewrite it for a marketer, and publish. Customers’ own lessons never appear here.</p>
        </div>
        {writable && !open && <Link className="ad-btn primary" href="/admin/notes?new=1">New note</Link>}
      </header>
      <Banner msg={sp.msg} />

      {writable && open && (
        <section className="ad-card ad-wide">
          <h3>{editing ? (editing.published ? 'Edit a published note' : 'Edit a draft') : 'Write a note'}{draft.sourceRef ? <span className="ad-dim"> · from {draft.sourceRef}</span> : null}</h3>
          <p className="ad-fine lw-gap">Rewrite it for the public: plain words for a marketer, no client names, no project details, no internal references. The platform’s organization names are checked when you publish.</p>
          <form method="post" action="/api/admin/notes" className="ad-form">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            {!editing && <input type="hidden" name="source_id" value={draft.sourceId} />}
            {!editing && <input type="hidden" name="source_ref" value={draft.sourceRef} />}
            <label className="ad-field"><span>Title <small>{LIMITS.title[0]} to {LIMITS.title[1]} characters, said plainly</small></span>
              <input className="ad-input" name="title" defaultValue={draft.title} maxLength={LIMITS.title[1]} required placeholder="Insert options belong on the template, not the page" />
            </label>
            <label className="ad-field"><span>Summary <small>the answer first: two or three sentences a search engine could quote on their own</small></span>
              <textarea className="ad-input" name="summary" rows={3} defaultValue={draft.summary} maxLength={LIMITS.summary[1]} />
            </label>
            <label className="ad-field"><span>The note <small>a blank line between paragraphs; start a line with “- ” for a list</small></span>
              <textarea className="ad-input" name="body" rows={12} defaultValue={draft.body} maxLength={LIMITS.body[1]} />
            </label>
            <div className="ad-row2">
              <label className="ad-field"><span>Platform</span>
                <select className="ad-input" name="platform" defaultValue={draft.platform}>{NOTE_PLATFORMS.map((p) => <option key={p} value={p}>{p || 'Any platform'}</option>)}</select>
              </label>
              {editing?.publishedAt ? (
                <div className="ad-field"><span>Web address <small>fixed once published, so links never break</small></span><a className="ad-input" href={`/notes/${editing.slug}`} target="_blank" rel="noreferrer">/notes/{editing.slug}</a></div>
              ) : (
                <label className="ad-field"><span>Web address <small>optional; made from the title</small></span><input className="ad-input" name="slug" defaultValue={draft.slug} placeholder="insert-options-belong-on-the-template" /></label>
              )}
            </div>
            <div className="ad-actions">
              {editing?.published ? (
                <>
                  <button className="ad-btn primary" type="submit" name="intent" value="save">Save the published note</button>
                  <button className="ad-btn" type="submit" name="intent" value="unpublish" formNoValidate>Take it off the site</button>
                </>
              ) : (
                <>
                  <button className="ad-btn primary" type="submit" name="intent" value="publish">Publish</button>
                  <button className="ad-btn" type="submit" name="intent" value="save" formNoValidate>Save as a draft</button>
                </>
              )}
              {editing && !editing.published && <button className="ad-btn ghost" type="submit" name="intent" value="delete" formNoValidate>Delete the draft</button>}
              <Link className="ad-btn ghost" href="/admin/notes">Close</Link>
            </div>
          </form>
        </section>
      )}

      <section className="ad-card ad-wide">
        <h3>Notes <span className="ad-dim">· {notes.filter((n) => n.published).length} on the site, {notes.filter((n) => !n.published).length} drafts</span></h3>
        {notes.length === 0 ? (
          <p className="ad-empty">No notes yet. Pick a lesson below and write the first one.</p>
        ) : (
          <div className="lw-cards">
            {notes.map((n) => (
              <article key={n.id} className="lw-card">
                <div className="lw-card-head">
                  <span className={`ad-pill ${n.published ? 'ok' : 'no'}`}>{n.published ? 'On the site' : 'Draft'}</span>
                  {n.platform && <span className="ad-pill no">{n.platform}</span>}
                  <span className="crm-tl-meta">{n.published ? `Published ${day(n.publishedAt)}` : `Saved ${day(n.updatedAt)}`} · by {n.updatedBy || n.createdBy}{n.sourceRef ? ` · from ${n.sourceRef}` : ''}</span>
                </div>
                <p className="lw-rule"><b>{n.title}</b></p>
                {n.summary && <p className="crm-tl-text">{n.summary}</p>}
                <div className="lw-card-foot">
                  {writable && <Link className="ad-btn small" href={`/admin/notes?edit=${n.id}`}>Edit</Link>}
                  {n.published && <a className="ad-btn small ghost" href={`/notes/${n.slug}`} target="_blank" rel="noreferrer">View on the site</a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="ad-card ad-wide">
        <h3>From the knowledge base <span className="ad-dim">· Icreon’s active lessons and procedures</span></h3>
        {!platformConfigured() ? (
          <p className="ad-empty">The platform isn’t connected here, so the knowledge base can’t be read. You can still write a note from scratch.</p>
        ) : kb && !kb.ok ? (
          <p className="ad-empty">The knowledge base isn’t available to you: {kb.err.message} You can still write a note from scratch.</p>
        ) : lessons.length === 0 ? (
          <p className="ad-empty">No active lessons yet.</p>
        ) : (
          <div className="lw-cards">
            {lessons.map((e) => {
              const n = used.get(e.id);
              return (
                <article key={e.id} className="lw-card">
                  <div className="lw-card-head">
                    <span className="lw-ref">{e.ref}</span>
                    <span className="ad-pill no">{e.kind === 'lesson' ? 'Lesson' : 'Procedure'}</span>
                    {platformOf(e) && <span className="crm-tl-meta">{platformOf(e)}</span>}
                    {n && <span className="ad-pill ok">{n.published ? 'Note on the site' : 'Note drafted'}</span>}
                  </div>
                  <p className="lw-rule"><b>{e.title}</b></p>
                  <p className="crm-tl-text">{e.text.length > 320 ? `${e.text.slice(0, 320)}…` : e.text}</p>
                  {writable && (
                    <div className="lw-card-foot">
                      {n ? <Link className="ad-btn small" href={`/admin/notes?edit=${n.id}`}>Open its note</Link> : <Link className="ad-btn small" href={`/admin/notes?from=${encodeURIComponent(e.id)}`}>Write a note from this</Link>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import ProposalReview from '@/components/admin/platform/ProposalReview';
import { Back, Refused, Status, attempt, plural, stamp } from '@/components/admin/platform/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { platform, type Entry, type HistoryItem, type KnowledgeList, type Playbook, type Rule } from '@/lib/platform';

type Search = { msg?: string; status?: string; kind?: string; q?: string; history?: string };
const KINDS = { lesson: 'Lesson', procedure: 'Procedure', gap: 'Known gap' } as const;

/** What the team knows across projects: lessons, procedures and gaps every new build starts with. */
export default async function Knowledge({ searchParams }: { searchParams: Promise<Search> }) {
  const s = await requireUser('platform', 'read', '/admin/platform/knowledge');
  const sp = await searchParams;
  const status = ['proposed', 'active', 'retired'].includes(sp.status ?? '') ? sp.status! : '';
  const kind = sp.kind && sp.kind in KINDS ? sp.kind : '';
  const q = (sp.q ?? '').slice(0, 200);
  const qs = new URLSearchParams(Object.entries({ status, kind, q }).filter(([, v]) => v) as [string, string][]).toString();
  const [list, waiting, rulesWaiting, cat] = await Promise.all([
    attempt(platform<KnowledgeList>(s.user, 'GET', `/knowledge${qs ? `?${qs}` : ''}`)),
    attempt(platform<KnowledgeList>(s.user, 'GET', '/knowledge?status=proposed')),
    attempt(platform<Rule[]>(s.user, 'GET', '/rules?status=proposed')),
    attempt(platform<Playbook[]>(s.user, 'GET', '/playbooks')),
  ]);
  const hist = sp.history ? await attempt(platform<HistoryItem[]>(s.user, 'GET', `/knowledge/${encodeURIComponent(sp.history)}/history`)) : null;
  const writable = can(s.user.roles, 'platform', 'write');
  const playbooks = cat.ok ? cat.data : [];
  const platforms = [...new Map(playbooks.map((p) => [p.platform.id, p.platform.name])).entries()];
  const back = `/admin/platform/knowledge${qs ? `?${qs}` : ''}`;
  const effects = new Map(list.ok ? list.data.effects.map((e) => [e.id, e]) : []);
  const scopeOf = (e: Entry) =>
    e.scope.kind === 'global' ? 'Everywhere'
    : e.scope.kind === 'platform' ? `Every ${platforms.find(([id]) => id === e.scope.id)?.[1] ?? e.scope.id} project`
    : e.scope.kind === 'playbook' ? `The ${playbooks.find((p) => p.id === e.scope.id)?.name ?? e.scope.id} playbook`
    : e.scope.kind === 'role' ? `Role: ${e.scope.id}` : `Project: ${e.scope.id}`;
  const waitingCount = (waiting.ok ? waiting.data.entries.length : 0) + (rulesWaiting.ok ? rulesWaiting.data.length : 0);
  const href = (p: Partial<Search>) => {
    const u = new URLSearchParams(Object.entries({ status, kind, q, ...p }).filter(([, v]) => v) as [string, string][]).toString();
    return `/admin/platform/knowledge${u ? `?${u}` : ''}`;
  };

  const card = (e: Entry) => {
    const fx = effects.get(e.id);
    return (
      <article key={e.id} id={`k-${e.id}`} className={`lw-card${fx?.flagged ? ' flagged' : ''}`}>
        <div className="lw-card-head">
          <span className="lw-ref">{e.ref}</span>
          <Status value={e.status} />
          <span className="ad-pill no">{KINDS[e.kind]}</span>
          <span className="crm-tl-meta">{scopeOf(e)}{e.roles.length ? ` · ${e.roles.join(', ')}` : ''}</span>
        </div>
        <p className="lw-rule"><b>{e.title}</b></p>
        <p className="crm-tl-text">{e.text}</p>
        <p className="crm-tl-meta">
          In {plural(e.used, 'brief')}{fx ? ` · carried by ${plural(fx.tasks, 'task')}, ${fx.failed} still failed` : ''} · version {e.version} · by {e.author === 'seed' ? 'the seed documents' : e.author === 'cypher' ? 'Cypher' : 'a Director'}
          {e.source?.projectId ? ` · from ${e.source.projectId}${e.source.phase !== null ? `, phase ${e.source.phase}` : ''}` : ''} · updated {stamp(e.updatedAt)}
          {e.tags.length ? ` · ${e.tags.join(', ')}` : ''}
        </p>
        {fx?.flagged && <p className="lw-flag">Work that carries it keeps failing anyway: edit it or retire it.</p>}
        <div className="lw-card-foot">
          {writable && (
            <form method="post" className="lw-decide">
              <input type="hidden" name="id" value={e.id} />
              <Back to={back} />
              <label className="ad-check"><input type="checkbox" name="confirm" required /> <span>Confirm: this shapes every future build on its scope</span></label>
              {e.status === 'proposed' && <><button className="ad-btn primary small" formAction="/api/admin/platform/knowledge-approve">Approve</button><button className="ad-btn small" formAction="/api/admin/platform/knowledge-reject">Reject</button></>}
              {e.status === 'active' && <button className="ad-btn small" formAction="/api/admin/platform/knowledge-retire">Retire</button>}
              {e.status === 'retired' && <button className="ad-btn small" formAction="/api/admin/platform/knowledge-activate">Activate</button>}
            </form>
          )}
          <Link className="ad-btn small ghost" href={`${href({ history: e.id })}#k-${e.id}`}>History</Link>
        </div>
        {hist && sp.history === e.id && (hist.ok
          ? <ol className="lw-hist">{hist.data.map((h, i) => <li key={i}><b>{h.kind[0].toUpperCase() + h.kind.slice(1)}</b> {stamp(h.at)}</li>)}</ol>
          : <p className="lw-flag">{hist.err.message}</p>)}
        {(writable || e.evidence.length > 0) && (
          <details className="lw-more">
            <summary>{writable ? 'Edit, and what it stands on' : 'What it stands on'}</summary>
            {writable && (
              <form method="post" action="/api/admin/platform/knowledge-edit" className="ad-form">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="was" value={e.status} />
                <Back to={back} />
                <div className="ad-row2">
                  <label className="ad-field"><span>Kind</span><select className="ad-input" name="kind" defaultValue={e.kind}>{Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
                  <label className="ad-field"><span>Tags <small>comma-separated</small></span><input className="ad-input" name="tags" defaultValue={e.tags.join(', ')} /></label>
                </div>
                <label className="ad-field"><span>Title</span><input className="ad-input" name="title" defaultValue={e.title} minLength={3} maxLength={200} required /></label>
                <label className="ad-field"><span>What to know</span><textarea className="ad-input" name="text" rows={4} defaultValue={e.text} minLength={3} maxLength={2000} required /></label>
                {e.status === 'active' && <label className="ad-check"><input type="checkbox" name="confirm" required /> <span>Confirm: editing an active entry changes the next briefs</span></label>}
                <div className="ad-actions"><button className="ad-btn" type="submit">Save a new version</button></div>
              </form>
            )}
            {e.evidence.length > 0 && <ul className="lw-sources">{e.evidence.slice(0, 10).map((x) => <li key={x.ref}>{x.label}{x.projectId ? ` · ${x.projectId}` : ''}</li>)}</ul>}
          </details>
        )}
      </article>
    );
  };

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Knowledge</h1>
          <p>Lessons, procedures and known gaps every new build on a playbook starts with. Proposed entries reach no brief until approved.</p>
        </div>
        {platforms.length > 0 && (
          <form method="get" action="/api/admin/platform/knowledge-export" className="ad-controls">
            <select className="ad-input ad-select" name="platform" aria-label="Export lessons for"><option value="">All platforms</option>{platforms.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
            <button className="ad-btn" type="submit">Export lessons</button>
          </form>
        )}
      </header>
      <Banner msg={sp.msg} />
      {!list.ok ? <Refused err={list.err} /> : (
        <>
          {writable && <ProposalReview waiting={waitingCount} />}
          {writable && (
            <details className="ad-card ad-wide crm-new">
              <summary>New entry</summary>
              <form method="post" action="/api/admin/platform/knowledge-create" className="ad-form">
                <Back to={back} />
                <div className="ad-row2">
                  <label className="ad-field"><span>Kind</span><select className="ad-input" name="kind" defaultValue="lesson">{Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
                  <label className="ad-field"><span>Applies to</span>
                    <select className="ad-input" name="scope" defaultValue={platforms[0] ? `platform:${platforms[0][0]}` : 'global:*'}>
                      <option value="global:*">Everywhere</option>
                      {platforms.map(([id, name]) => <option key={id} value={`platform:${id}`}>Every {name} project</option>)}
                      {playbooks.map((p) => <option key={p.id} value={`playbook:${p.id}`}>The {p.name} playbook</option>)}
                    </select>
                  </label>
                </div>
                <label className="ad-field"><span>Title</span><input className="ad-input" name="title" minLength={3} maxLength={200} required placeholder="Insert options go on Standard Values" /></label>
                <label className="ad-field"><span>What to know</span><textarea className="ad-input" name="text" rows={4} minLength={3} maxLength={2000} required /></label>
                <div className="ad-row2">
                  <label className="ad-field"><span>Roles <small>optional, comma-separated</small></span><input className="ad-input" name="roles" /></label>
                  <label className="ad-field"><span>Tags <small>optional</small></span><input className="ad-input" name="tags" /></label>
                </div>
                <div className="ad-row2">
                  <label className="ad-field"><span>Save as</span><select className="ad-input" name="status" defaultValue="proposed"><option value="proposed">Proposed (reaches no brief yet)</option><option value="active">Active (reaches briefs now)</option></select></label>
                  <label className="ad-check lw-self-end"><input type="checkbox" name="confirm" /> <span>If active: I know it reaches the next briefs</span></label>
                </div>
                <div className="ad-actions"><button className="ad-btn primary" type="submit">Save the entry</button></div>
              </form>
            </details>
          )}
          <section className="ad-card ad-wide">
            <nav className="ad-tabs" aria-label="Status">
              {[['', 'All'], ['proposed', 'Proposed'], ['active', 'Active'], ['retired', 'Retired']].map(([k, v]) => <Link key={v} href={href({ status: k, history: '' })} className={status === k ? 'on' : undefined}>{v}</Link>)}
            </nav>
            <form className="ad-search" method="get" action="/admin/platform/knowledge">
              {status && <input type="hidden" name="status" value={status} />}
              <select className="ad-input ad-select" name="kind" defaultValue={kind} aria-label="Kind"><option value="">Every kind</option>{Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              <input type="search" name="q" defaultValue={q} placeholder="Search titles and text" aria-label="Search knowledge" />
              <button className="ad-btn" type="submit">Search</button>
            </form>
            {list.data.entries.length === 0 ? <p className="ad-empty">{q || kind || status ? 'Nothing matches.' : 'No entries yet.'}</p> : <div className="lw-cards">{list.data.entries.map(card)}</div>}
          </section>
        </>
      )}
    </main>
  );
}

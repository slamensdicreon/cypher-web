import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { Back, Owner, Refused, Status, attempt, plural, stamp } from '@/components/admin/platform/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { CATEGORIES, ICREON, isCustomers, ownerName, platform, type Diagnostics, type HistoryItem, type Org, type Playbook, type Rule } from '@/lib/platform';

const HISTORY: Record<string, string> = { created: 'Created', edited: 'Edited', activated: 'Activated', retired: 'Retired', applied: 'Applied', overridden: 'Overridden by a Director' };
const times = (n: number) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`);

/**
 * Rules: when this happens, do that. The Leads apply active rules to cards in their scope. Icreon's
 * reach every customer's projects; a customer's own reach only theirs, and here they can only be retired.
 */
export default async function Rules({ searchParams }: { searchParams: Promise<{ msg?: string; history?: string; owner?: string }> }) {
  const s = await requireUser('platform', 'read', '/admin/platform/rules');
  const sp = await searchParams;
  const [rules, cat, diag, orgList] = await Promise.all([
    attempt(platform<Rule[]>(s.user, 'GET', '/rules')),
    attempt(platform<Playbook[]>(s.user, 'GET', '/playbooks')),
    attempt(platform<Diagnostics>(s.user, 'GET', '/portfolio/diagnostics')),
    attempt(platform<Org[]>(s.user, 'GET', '/admin/organizations')),
  ]);
  const hist = sp.history ? await attempt(platform<HistoryItem[]>(s.user, 'GET', `/rules/${encodeURIComponent(sp.history)}/history`)) : null;
  const writable = can(s.user.roles, 'platform', 'write');
  const playbooks = cat.ok ? cat.data : [];
  const platforms = [...new Map(playbooks.map((p) => [p.platform.id, p.platform.name])).entries()];
  const projects = diag.ok ? diag.data.projects : [];
  const orgs = orgList.ok ? orgList.data : [];
  const pbName = (id: string) => playbooks.find((p) => p.id === id)?.name ?? id;
  const scopeOf = (r: Rule) => {
    // A customer's own rule reaches only their projects; their project names aren't visible from here.
    if (isCustomers(r)) {
      const who = ownerName(r, orgs);
      return r.scope.kind === 'project' ? `${who}’s project ${r.scope.id}` : r.scope.kind === 'playbook' ? `${who}’s projects on the ${pbName(r.scope.id)} playbook` : `${who}’s projects on ${platforms.find(([id]) => id === r.scope.id)?.[1] ?? r.scope.id}`;
    }
    return r.scope.kind === 'project'
      ? `Project: ${projects.find((p) => p.projectId === r.scope.id)?.name ?? r.scope.id}`
      : r.scope.kind === 'playbook'
        ? `Every project on the ${pbName(r.scope.id)} playbook`
        : `Every project on ${platforms.find(([id]) => id === r.scope.id)?.[1] ?? r.scope.id}`;
  };
  // Filter by owner: everyone, Icreon's, or one customer's own.
  const all = rules.ok ? rules.data : [];
  // Customers with items of their own, plus one asked for by link (e.g. from its organization page).
  const ids = new Set(all.filter(isCustomers).map((r) => r.organizationId!));
  if (sp.owner && sp.owner !== ICREON && orgs.some((o) => o.id === sp.owner)) ids.add(sp.owner);
  const customers = [...ids].map((id) => ({ id, name: ownerName({ organizationId: id }, orgs) }));
  const owner = sp.owner === 'icreon' || ids.has(sp.owner ?? '') ? sp.owner! : '';
  const shown = all.filter((r) => (owner === '' ? true : owner === 'icreon' ? !isCustomers(r) : r.organizationId === owner));
  const back = `/admin/platform/rules${owner ? `?owner=${encodeURIComponent(owner)}` : ''}`;
  const href = (p: { owner?: string; history?: string }) => {
    const u = new URLSearchParams(Object.entries({ owner, ...p }).filter(([, v]) => v) as [string, string][]).toString();
    return `/admin/platform/rules${u ? `?${u}` : ''}`;
  };

  const card = (r: Rule) => {
    const theirs = isCustomers(r);
    const who = ownerName(r, orgs);
    return (
    <article key={r.id} id={`r-${r.id}`} className={`lw-card${r.flagged ? ' flagged' : ''}`}>
      <div className="lw-card-head">
        <span className="lw-ref">{r.ref}</span>
        <Status value={r.status} />
        <Owner of={r} orgs={orgs} />
        <span className="ad-pill no">{CATEGORIES[r.category] ?? r.category}</span>
        <span className="crm-tl-meta">{scopeOf(r)}{r.roles.length ? ` · only for ${r.roles.join(', ')}` : ''}</span>
      </div>
      <p className="lw-rule"><b>When</b> {r.when}, <b>then</b> {r.then}.</p>
      <p className="crm-tl-meta">Applied {times(r.applied)}, overridden {times(r.overridden)}. Version {r.version}, from {plural(r.sources.length, 'card')}. By {theirs ? `${who}’s Directors` : r.author === 'cypher' ? 'Cypher' : 'a Director'}, updated {stamp(r.updatedAt)}.</p>
      {r.flagged && <p className="lw-flag">{theirs ? `Directors keep overriding it: retire it and tell ${who}.` : 'Directors keep overriding it: edit it or retire it.'}</p>}
      <div className="lw-card-foot">
        {writable && theirs && r.status !== 'retired' && (
          <form method="post" className="lw-decide">
            <input type="hidden" name="id" value={r.id} />
            <Back to={back} />
            <label className="ad-check"><input type="checkbox" name="confirm" required /> <span>Confirm: this switches it off for {who}’s running projects</span></label>
            <button className="ad-btn small" formAction="/api/admin/platform/rule-retire">Retire</button>
          </form>
        )}
        {writable && !theirs && (
          <form method="post" className="lw-decide">
            <input type="hidden" name="id" value={r.id} />
            <Back to={back} />
            <label className="ad-check"><input type="checkbox" name="confirm" required /> <span>Confirm: this changes how every customer’s running projects answer cards</span></label>
            {r.status === 'proposed' && <button className="ad-btn primary small" formAction="/api/admin/platform/rule-activate">Approve</button>}
            {r.status === 'retired' && <button className="ad-btn small" formAction="/api/admin/platform/rule-activate">Reactivate</button>}
            {r.status !== 'retired' && <button className="ad-btn small" formAction="/api/admin/platform/rule-retire">{r.status === 'proposed' ? 'Reject' : 'Retire'}</button>}
          </form>
        )}
        <Link className="ad-btn small ghost" href={`${href({ history: r.id })}#r-${r.id}`}>History</Link>
      </div>
      {hist && sp.history === r.id && (
        hist.ok ? (
          <ol className="lw-hist">{hist.data.map((h, i) => <li key={i}><b>{HISTORY[h.kind] ?? h.kind}</b> {stamp(h.at)}{typeof h.detail.escalationId === 'string' && !h.detail.escalationId.startsWith('task:') ? ` · card ${h.detail.escalationId}` : ''}</li>)}</ol>
        ) : <p className="lw-flag">{hist.err.message}</p>
      )}
      {theirs && <p className="lw-note">{who}’s Directors wrote this, for their projects only. To change it, retire it and tell them: they edit it in Launchworks.</p>}
      {((writable && !theirs) || r.sources.length > 0) && (
        <details className="lw-more">
          <summary>{writable && !theirs ? 'Edit, and the cards it came from' : 'The cards it came from'}</summary>
          {writable && !theirs && (
            <form method="post" action="/api/admin/platform/rule-edit" className="ad-form">
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="was" value={r.status} />
              <Back to={back} />
              <label className="ad-field"><span>When</span><textarea className="ad-input" name="when" rows={2} defaultValue={r.when} minLength={3} maxLength={600} required /></label>
              <label className="ad-field"><span>Do this</span><textarea className="ad-input" name="then" rows={2} defaultValue={r.then} minLength={3} maxLength={600} required /></label>
              <label className="ad-field"><span>Category</span>
                <select className="ad-input" name="category" defaultValue={r.category}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              </label>
              {r.status === 'active' && <label className="ad-check"><input type="checkbox" name="confirm" required /> <span>Confirm: editing an active rule changes what running projects do next</span></label>}
              <div className="ad-actions"><button className="ad-btn" type="submit">Save a new version</button></div>
            </form>
          )}
          {r.sources.length > 0 && <ul className="lw-sources">{r.sources.slice(0, 10).map((x) => <li key={x.escalationId}>{x.title}{x.answer ? `: ${x.answer}` : ''}</li>)}</ul>}
        </details>
      )}
    </article>
    );
  };

  const of = (st: Rule['status']) => shown.filter((r) => r.status === st);
  const [proposed, active, retired] = [of('proposed'), of('active'), of('retired')];

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Rules</h1>
          <p>When this happens, do that. The Leads apply active rules to cards in their scope, so nobody is asked the same thing twice; proposed rules apply nowhere until approved. A customer’s Directors can add their own on the playbooks they license: those reach only their projects, and you can retire them here.</p>
        </div>
      </header>
      <Banner msg={sp.msg} />
      {!rules.ok ? <Refused err={rules.err} /> : (
        <>
          <p className="ad-fine lw-gap">Proposals from every project (rules and knowledge) can also be sorted by Cypher and applied together on <Link href="/admin/platform/knowledge#proposals">Knowledge</Link>.</p>
          {writable && (
            <div className="ad-grid2">
              <details className="ad-card crm-new lw-nomargin">
                <summary>New rule</summary>
                <form method="post" action="/api/admin/platform/rule-create" className="ad-form">
                  <Back to={back} />
                  <label className="ad-field"><span>When</span><textarea className="ad-input" name="when" rows={2} minLength={3} maxLength={600} required placeholder="an image has no licensed source" /></label>
                  <label className="ad-field"><span>Do this</span><textarea className="ad-input" name="then" rows={2} minLength={3} maxLength={600} required placeholder="use the client's DAM placeholder and note it on the card" /></label>
                  <div className="ad-row2">
                    <label className="ad-field"><span>Category</span>
                      <select className="ad-input" name="category" defaultValue="other">{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
                    </label>
                    <label className="ad-field"><span>Applies to</span>
                      <select className="ad-input" name="scope" required>
                        {platforms.map(([id, name]) => <option key={`pl-${id}`} value={`platform:${id}`}>Every {name} project</option>)}
                        {playbooks.map((p) => <option key={`pb-${p.id}`} value={`playbook:${p.id}`}>The {p.name} playbook</option>)}
                        {projects.map((p) => <option key={`pr-${p.projectId}`} value={`project:${p.projectId}`}>Project: {p.name}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="ad-field"><span>Only for roles <small>optional, comma-separated</small></span><input className="ad-input" name="roles" /></label>
                  <div className="ad-row2">
                    <label className="ad-field"><span>Save as</span>
                      <select className="ad-input" name="status" defaultValue="proposed"><option value="proposed">Proposed (applies nowhere yet)</option><option value="active">Active (applies now)</option></select>
                    </label>
                    <label className="ad-check lw-self-end"><input type="checkbox" name="confirm" /> <span>If active: I know it applies to live projects now</span></label>
                  </div>
                  <div className="ad-actions"><button className="ad-btn primary" type="submit">Save the rule</button></div>
                </form>
              </details>
              {projects.length > 0 && (
                <details className="ad-card crm-new lw-nomargin">
                  <summary>Propose rules from a project</summary>
                  <form method="post" action="/api/admin/platform/rule-harvest" className="ad-form">
                    <Back to={back} />
                    <label className="ad-field"><span>Project <small>each cause answered the same way twice or more becomes a proposed rule</small></span>
                      <select className="ad-input" name="project_id">{projects.map((p) => <option key={p.projectId} value={p.projectId}>{p.name}</option>)}</select>
                    </label>
                    <div className="ad-actions"><button className="ad-btn" type="submit">Propose rules</button></div>
                  </form>
                  <p className="ad-fine">Icreon’s own projects only, for now: the platform answers 404 for a customer’s project through the admin.</p>
                </details>
              )}
            </div>
          )}
          {customers.length > 0 && (
            <nav className="ad-tabs lw-gap" aria-label="Whose rules">
              {[['', 'Everyone’s'], ['icreon', 'Icreon’s'], ...customers.map((c) => [c.id, `${c.name}’s own`])].map(([k, v]) => <Link key={k || 'all'} href={href({ owner: k, history: '' })} className={owner === k ? 'on' : undefined}>{v}</Link>)}
            </nav>
          )}
          {rules.data.length === 0 && <p className="ad-empty lw-gap">No rules yet. On a card a Director answered, “Make this a rule” proposes one.</p>}
          {rules.data.length > 0 && shown.length === 0 && <p className="ad-empty lw-gap">{owner === 'icreon' ? 'No rules of Icreon’s.' : `${ownerName({ organizationId: owner }, orgs)} hasn’t added any rules of its own.`}</p>}
          {proposed.length > 0 && <section className="ad-card ad-wide"><h3>Proposed <span className="ad-dim">· waiting for you · {proposed.length}</span></h3><div className="lw-cards">{proposed.map(card)}</div></section>}
          {active.length > 0 && <section className="ad-card ad-wide"><h3>Active <span className="ad-dim">· {active.length}</span></h3><div className="lw-cards">{active.map(card)}</div></section>}
          {retired.length > 0 && <details className="ad-card ad-wide lw-fold"><summary>Retired · {retired.length}</summary><div className="lw-cards">{retired.map(card)}</div></details>}
        </>
      )}
    </main>
  );
}

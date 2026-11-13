import Link from 'next/link';
import { Refused, attempt, plural } from '@/components/admin/platform/parts';
import { requireUser } from '@/lib/auth/request';
import { CATEGORIES, platform, type InForce, type Playbook } from '@/lib/platform';

/** What a new project on a playbook starts with: its rules, lessons, procedures and known gaps. Read only. */
export default async function InForcePage({ searchParams }: { searchParams: Promise<{ playbook?: string }> }) {
  const s = await requireUser('platform', 'read', '/admin/platform/in-force');
  const sp = await searchParams;
  const cat = await attempt(platform<Playbook[]>(s.user, 'GET', '/playbooks'));
  const pick = cat.ok ? (cat.data.find((p) => p.id === sp.playbook) ?? cat.data[0]) : undefined;
  const snap = pick ? await attempt(platform<InForce>(s.user, 'GET', `/playbooks/${encodeURIComponent(pick.id)}/in-force`)) : null;
  const roleName = (r: string) => (snap?.ok ? snap.data.roles.find((x) => x.role === r)?.name : undefined) ?? r;
  const scopeName = (k: string, id: string) => (k === 'global' ? 'Everywhere' : k === 'platform' ? `Every ${snap?.ok ? snap.data.platform.name : id} project` : k === 'playbook' ? 'This playbook' : `${k} ${id}`);

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>In force</h1>
          <p>What a new project on a playbook starts with. Each brief carries the few entries that fit the task; known gaps are engineering’s and reach no agent.</p>
        </div>
        {cat.ok && (
          <form method="get" className="ad-controls">
            <select className="ad-input ad-select" name="playbook" defaultValue={pick?.id} aria-label="Playbook">
              {cat.data.map((p) => <option key={p.id} value={p.id}>{p.platform.name} · {p.name}</option>)}
            </select>
            <button className="ad-btn" type="submit">Show</button>
          </form>
        )}
      </header>
      {!cat.ok ? <Refused err={cat.err} /> : !snap ? <p className="ad-empty">No playbooks.</p> : !snap.ok ? <Refused err={snap.err} /> : (
        <>
          <p className="ad-banner">
            {snap.data.playbook.name} {snap.data.playbook.version} on {snap.data.platform.name}: {plural(snap.data.rules.length, 'rule')}, {plural(snap.data.entries.length, 'lesson or procedure', 'lessons and procedures')}, {plural(snap.data.gaps.length, 'known gap')}.
            {snap.data.pending.knowledge + snap.data.pending.rules > 0 && <> {snap.data.pending.knowledge + snap.data.pending.rules} proposals would apply here once approved: <Link href="/admin/platform/knowledge?status=proposed">review them</Link>.</>}
          </p>
          <section className="ad-card ad-wide">
            <h3>Rules the Leads apply</h3>
            {snap.data.rules.length === 0 ? <p className="ad-empty">None.</p> : (
              <ul className="lw-list">
                {snap.data.rules.map((r) => (
                  <li key={r.id}><span className="lw-ref">{r.ref}</span><div><p><b>When</b> {r.when}, <b>then</b> {r.then}.</p><span className="crm-tl-meta">{CATEGORIES[r.category]}{r.roles.length ? ` · only for ${r.roles.map(roleName).join(', ')}` : ''} · applied {r.applied}×</span></div></li>
                ))}
              </ul>
            )}
          </section>
          <section className="ad-card ad-wide">
            <h3>Lessons and procedures</h3>
            {snap.data.entries.length === 0 ? <p className="ad-empty">None.</p> : (
              <ul className="lw-list">
                {snap.data.entries.map((e) => (
                  <li key={e.id}><span className="lw-ref">{e.ref}</span><div><p><b>{e.title}</b> <span className="ad-pill no">{e.kind}</span></p><p className="crm-tl-text">{e.text}</p><span className="crm-tl-meta">{scopeName(e.scope.kind, e.scope.id)}{e.roles.length ? ` · ${e.roles.map(roleName).join(', ')}` : ' · every role'} · in {plural(e.used, 'brief')}</span></div></li>
                ))}
              </ul>
            )}
          </section>
          <section className="ad-card ad-wide">
            <h3>Known gaps</h3>
            {snap.data.gaps.length === 0 ? <p className="ad-empty">None.</p> : (
              <ul className="lw-list">
                {snap.data.gaps.map((g) => <li key={g.id}><span className="lw-ref">{g.ref}</span><div><p><b>{g.title}</b></p><p className="crm-tl-text">{g.text}</p></div></li>)}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}

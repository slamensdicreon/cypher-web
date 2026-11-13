import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Banner } from '@/components/admin/AdminNav';
import { Back, Confirm, Refused, attempt, day, num, plural, stamp, usd } from '@/components/admin/platform/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { ICREON, STANDING, byName, controlCenterUrl, platform, type LicenseView, type Org, type Playbook, type Usage } from '@/lib/platform';

const KIND = { granted: 'Granted', changed: 'Changed', suspended: 'Paused projects', resumed: 'Resumed' } as const;
const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** One customer organization: its license (which changes live behavior), its usage, and support access. */
export default async function OrganizationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  const s = await requireUser('platform', 'read', `/admin/platform/organizations/${raw}`);
  const { msg } = await searchParams;
  const back = `/admin/platform/organizations/${encodeURIComponent(id)}`;
  const path = `/admin/organizations/${encodeURIComponent(id)}`;
  const [orgs, lic, use, cat] = await Promise.all([
    attempt(platform<Org[]>(s.user, 'GET', '/admin/organizations')),
    attempt(platform<LicenseView>(s.user, 'GET', `${path}/license`)),
    attempt(platform<Usage>(s.user, 'GET', `${path}/usage`)),
    attempt(platform<Playbook[]>(s.user, 'GET', '/playbooks')),
  ]);
  if (!orgs.ok) return <main className="wrap ad"><p className="crm-crumbs"><Link href="/admin/platform">Organizations</Link></p><Refused err={orgs.err} /></main>;
  const org = orgs.data.find((o) => o.id === id);
  if (!org) notFound();
  const writable = can(s.user.roles, 'platform', 'write');
  const icreon = id === ICREON;
  const l = lic.ok ? lic.data.license : null;
  const platforms = cat.ok ? [...new Map(cat.data.map((p) => [p.platform.id, p.platform.name])).entries()] : [];
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setUTCFullYear(today.getUTCFullYear() + 1);

  return (
    <main className="wrap ad crm-record">
      <p className="crm-crumbs"><Link href="/admin/platform">Organizations</Link></p>
      <header className="ad-top">
        <div>
          <h1>{org.name}</h1>
          <p className="crm-facts">
            <span className={`lw-standing st-${(org.license?.standing ?? 'none')}`}>{STANDING[(org.license?.standing ?? 'none')]}{org.license?.purgedAt ? ', data purged' : ''}</span>
            <span>{plural(org.directors, 'Director')}, {plural(org.watchers, 'Watcher')}</span>
            {org.invitations > 0 && <span>{plural(org.invitations, 'open invitation')}</span>}
            <span>{plural(org.projects, 'live project')}{org.running ? `, ${org.running} running` : ''}</span>
            <span>{org.slug}</span>
          </p>
        </div>
      </header>
      <Banner msg={msg} />
      {icreon && <p className="ad-banner">Icreon needs no license, and support access to it is refused.</p>}

      <div className="crm-cols">
        <div className="crm-main">
          {!icreon && (
            <section className="ad-card">
              <h3>License</h3>
              {!lic.ok ? <Refused err={lic.err} /> : !cat.ok ? <Refused err={cat.err} /> : (
                <>
                  {l?.suspended?.projects?.length ? <p className="ad-banner bad">Paused by the license: {l.suspended.projects.join(', ')}. Renewing resumes exactly these.</p> : null}
                  {writable ? (
                    <form method="post" action="/api/admin/platform/save-license" className="ad-form">
                      <input type="hidden" name="id" value={id} />
                      <Back to={back} />
                      <fieldset className="lw-catalog">
                        <legend>Platforms and playbooks</legend>
                        {platforms.map(([pid, pname]) => (
                          <div key={pid} className="lw-plat">
                            <label className="lw-plat-head"><input type="checkbox" name={`entity_${pid}`} defaultChecked={l ? (l.entities ?? []).includes(pid) : false} /> <b>{pname}</b></label>
                            <div className="lw-pbs">
                              {cat.data.filter((p) => p.platform.id === pid).map((p) => (
                                <label key={p.id} className="chip-check" title={p.description}>
                                  <input type="checkbox" name={`playbook_${p.id}`} defaultChecked={l ? (l.playbooks ?? []).includes(p.id) : false} /> <span>{p.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <p className="ad-fine">A playbook counts only on a licensed platform; ticked playbooks on an unticked platform are dropped when you save.</p>
                      </fieldset>
                      <div className="lw-row3">
                        <label className="ad-field"><span>Projects included</span><input className="ad-input" name="projects_included" type="number" min={0} step={1} defaultValue={l?.projectsIncluded ?? 1} required /></label>
                        <label className="ad-field"><span>Starts</span><input className="ad-input" name="starts" type="date" defaultValue={l ? l.startsAt.slice(0, 10) : ymd(today)} required /></label>
                        <label className="ad-field"><span>Ends</span><input className="ad-input" name="ends" type="date" defaultValue={l ? l.endsAt.slice(0, 10) : ymd(nextYear)} required /></label>
                      </div>
                      <Confirm>I understand saving changes live behavior: taking out a platform or ending the term pauses this organization’s running projects now; renewing resumes the ones the license paused.</Confirm>
                      <div className="ad-actions">
                        <button className="ad-btn primary" type="submit">Save the license</button>
                        <span className="ad-fine">{(org.license?.used ?? 0)} project{(org.license?.used ?? 0) === 1 ? '' : 's'} holding a place now.</span>
                      </div>
                    </form>
                  ) : l ? (
                    <p>{l.entities.join(', ')} · {l.playbooks.length} playbooks · {l.projectsIncluded} projects · {day(l.startsAt)} to {day(l.endsAt)}</p>
                  ) : (
                    <p className="ad-empty">No license.</p>
                  )}
                  {(lic.data.history ?? []).length > 0 && (
                    <details className="lw-history">
                      <summary>History ({(lic.data.history ?? []).length})</summary>
                      <ol className="crm-tl">
                        {[...(lic.data.history ?? [])].reverse().map((h, i) => (
                          <li key={i} className={`k-${h.kind === 'suspended' ? 'form' : h.kind === 'resumed' ? 'task' : 'stage'}`}>
                            <span className="crm-tl-dot" aria-hidden="true" />
                            <div className="crm-tl-body">
                              <div className="crm-tl-head"><b>{KIND[h.kind] ?? h.kind}</b><span>{h.license ? `${h.license.entities?.join(', ') || 'no platforms'} · ${plural(h.license.playbooks?.length ?? 0, 'playbook')} · ${plural(h.license.projectsIncluded ?? 0, 'project')} · ${day(h.license.startsAt)} to ${day(h.license.endsAt)}` : ''}</span></div>
                              <span className="crm-tl-meta">{stamp(h.at)} · {byName(h.by ?? '')}</span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </details>
                  )}
                </>
              )}
            </section>
          )}

          <section className="ad-card">
            <h3>Usage</h3>
            {!use.ok ? <Refused err={use.err} /> : (
              <>
                <div className="ad-tiles lw-tiles">
                  <div className="ad-tile"><span className="ad-tl">Claude</span><b>{usd((use.data.totals?.claudeUsd ?? 0))}</b><span className="ad-tn">{num((use.data.totals?.claudeTokens ?? 0))} tokens</span></div>
                  <div className="ad-tile"><span className="ad-tl">Sandbox</span><b>{num((use.data.totals?.sandboxMinutes ?? 0))}</b><span className="ad-tn">minutes</span></div>
                  <div className="ad-tile"><span className="ad-tl">Tools</span><b>{num((use.data.totals?.toolMinutes ?? 0))}</b><span className="ad-tn">minutes, from Nov 13</span></div>
                  <div className="ad-tile"><span className="ad-tl">Vercel</span><b>{num((use.data.totals?.vercelDeployments ?? 0))}</b><span className="ad-tn">deployments, {num((use.data.totals?.vercelBuildMinutes ?? 0))} build min</span></div>
                </div>
                {(use.data.projects ?? []).length === 0 ? <p className="ad-empty">No projects.</p> : (
                  <div className="ad-scroll">
                    <table className="ad-tbl">
                      <thead><tr><th>Project</th><th className="r">Claude</th><th className="r">Hours</th><th className="r">Tool min</th><th>Vercel</th></tr></thead>
                      <tbody>
                        {(use.data.projects ?? []).map((p) => (
                          <tr key={p.projectId}>
                            <td><b>{p.name}</b><br /><span className="ad-dim">{p.status}</span></td>
                            <td className="r">{usd(p.claude?.usd ?? 0)}<br /><span className="ad-dim">{num(p.claude?.tokens ?? 0)}</span></td>
                            <td className="r">{(p.claude?.hours ?? 0).toFixed(1)}</td>
                            <td className="r">{num(Object.values(p.toolMinutes ?? {}).reduce((a, b) => a + b, 0))}</td>
                            <td>{p.vercelNote ? <span className="ad-dim">{p.vercelNote}</span> : p.vercel ? <>{p.vercel.deployments} deploys{p.vercel.failed ? `, ${p.vercel.failed} failed` : ''} · {num(p.vercel.buildMinutes)} build min</> : <span className="ad-dim">–</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="ad-fine">Vercel figures are cached {use.data.cachedForMinutes ?? 15} minutes. Tool minutes count from November 13, 2026. Vercel gives no bandwidth or function time per project.</p>
              </>
            )}
          </section>
        </div>

        <aside className="crm-side">
          {!icreon && writable && (
            <section className="ad-card">
              <h3>Support access</h3>
              <p className="ad-fine lw-gap">Makes you a member of {org.name} for a while, in that role. Its Directors see it in their People, with when it ends, and it ends on its own.</p>
              <form method="post" action="/api/admin/platform/support" className="ad-form">
                <input type="hidden" name="id" value={id} />
                <Back to={back} />
                <div className="ad-row2">
                  <label className="ad-field"><span>Hours</span><input className="ad-input" name="hours" type="number" min={1} max={72} defaultValue={4} required /></label>
                  <label className="ad-field"><span>As</span>
                    <select className="ad-input" name="role" defaultValue="watcher"><option value="watcher">Watcher</option><option value="director">Director</option></select>
                  </label>
                </div>
                <Confirm>Give me access to {org.name}.</Confirm>
                <div className="ad-actions"><button className="ad-btn primary" type="submit">Give me access</button></div>
              </form>
              <p className="ad-fine lw-gap">Then use it in <a href={controlCenterUrl()} target="_blank" rel="noreferrer">Launchworks</a>: account menu, then {org.name}.</p>
            </section>
          )}
          <section className="ad-card">
            <h3>Spend so far</h3>
            <p>{usd((org.usage?.usd ?? 0))} on Claude across {plural(org.projects, 'live project')}, {(org.usage?.hours ?? 0).toFixed(1)} hours, {num((org.usage?.sandboxMinutes ?? 0))} sandbox minutes.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}

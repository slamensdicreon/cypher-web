import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { Back, Refused, attempt, day, num, usd } from '@/components/admin/platform/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { ICREON, PlatformError, STANDING, platform, platformConfigured, platformMe, type Org } from '@/lib/platform';

/** Launchworks organizations: every customer, its people, projects, spend and license. */
export default async function Organizations({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const s = await requireUser('platform', 'read', '/admin/platform');
  const { msg } = await searchParams;
  if (!platformConfigured()) return <Shell msg={msg}><Refused err={new PlatformError(503, 'unset', '')} /></Shell>;
  const me = await platformMe(s.user);
  if (!me.ok) return <Shell msg={msg}><Refused err={new PlatformError(403, me.code, me.message)} /></Shell>;
  const got = await attempt(platform<Org[]>(s.user, 'GET', '/admin/organizations'));
  const writable = can(s.user.roles, 'platform', 'write');

  return (
    <Shell msg={msg} who={me.name}>
      {!got.ok ? (
        <Refused err={got.err} />
      ) : (
        <>
          {writable && (
            <details className="ad-card ad-wide crm-new">
              <summary>New organization</summary>
              <form method="post" action="/api/admin/platform/create-org" className="ad-form">
                <Back to="/admin/platform" />
                <div className="ad-row2">
                  <label className="ad-field"><span>Name</span><input className="ad-input" name="name" required minLength={2} maxLength={80} placeholder="Contoso" /></label>
                  <label className="ad-field"><span>Address <small>optional; made from the name</small></span><input className="ad-input" name="slug" maxLength={40} pattern="[a-z0-9-]*" placeholder="contoso" /></label>
                </div>
                <label className="ad-field"><span>First Director’s email <small>optional; the invitation stays open 7 days</small></span><input className="ad-input" name="director_email" type="email" placeholder="name@contoso.com" /></label>
                <p className="ad-fine">You become its kickoff Director. The customer can’t remove you for three months; after that their Directors can.</p>
                <div className="ad-actions"><button className="ad-btn primary" type="submit">Create</button></div>
              </form>
            </details>
          )}
          <section className="ad-card ad-wide">
            <div className="ad-scroll">
              <table className="ad-tbl">
                <thead><tr><th>Organization</th><th>People</th><th className="r">Projects</th><th className="r">Claude</th><th className="r">Sandbox</th><th>License</th><th></th></tr></thead>
                <tbody>
                  {got.data.map((o) => {
                    const l = o.license ?? { standing: 'none' as const, used: 0 };
                    const href = `/admin/platform/organizations/${encodeURIComponent(o.id)}`;
                    return (
                      <tr key={o.id}>
                        <td>
                          <Link href={href}><b>{o.name}</b></Link>
                          <br /><span className="ad-dim">{o.slug} · since {day(o.createdAt)}</span>
                        </td>
                        <td>{o.directors} Director{o.directors === 1 ? '' : 's'}, {o.watchers} Watcher{o.watchers === 1 ? '' : 's'}{o.invitations ? <><br /><span className="ad-dim">{o.invitations} invitation{o.invitations === 1 ? '' : 's'} open</span></> : null}</td>
                        <td className="r">{o.projects}{o.running ? <><br /><span className="ad-dim">{o.running} running</span></> : null}</td>
                        <td className="r">{usd(o.usage?.usd ?? 0)}<br /><span className="ad-dim">{num(o.usage?.tokens ?? 0)} tokens</span></td>
                        <td className="r">{num(o.usage?.sandboxMinutes ?? 0)} min</td>
                        <td>
                          <span className={`lw-standing st-${l.standing}`}>{STANDING[l.standing]}{l.purgedAt ? ', data purged' : ''}</span>
                          {l.projectsIncluded !== undefined && <><br /><span className="ad-dim">{l.used} of {l.projectsIncluded} projects{l.endsAt ? ` · to ${day(l.endsAt)}` : ''}</span></>}
                        </td>
                        <td className="r"><Link className="ad-btn small" href={href}>{o.id === ICREON ? 'Usage' : 'Manage'}</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="ad-fine">Icreon needs no license and can’t be given support access, so its page shows usage only.</p>
          </section>
        </>
      )}
    </Shell>
  );
}

function Shell({ msg, who, children }: { msg?: string; who?: string; children: React.ReactNode }) {
  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Organizations</h1>
          <p>Launchworks customers, server to server{who ? `, as ${who}` : ''}. Every action is recorded by name on the platform and in the audit log here.</p>
        </div>
      </header>
      <Banner msg={msg} />
      {children}
    </main>
  );
}

import { Banner } from '@/components/admin/AdminNav';
import { Back, Refused, Status, attempt, stamp } from '@/components/admin/platform/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { platform, type Diagnostics } from '@/lib/platform';

/** The services Launchworks runs on and each project's orchestrator; the watchdog and test email behind buttons. */
export default async function DiagnosticsPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const s = await requireUser('platform', 'read', '/admin/platform/diagnostics');
  const { msg } = await searchParams;
  const got = await attempt(platform<Diagnostics>(s.user, 'GET', '/portfolio/diagnostics'));
  const writable = can(s.user.roles, 'platform', 'write');
  const back = '/admin/platform/diagnostics';

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Diagnostics</h1>
          <p>Services and orchestrators as last seen. Nothing here runs on its own: the watchdog and the test email run only from their buttons.</p>
        </div>
      </header>
      <Banner msg={msg} />
      {!got.ok ? <Refused err={got.err} /> : (
        <>
          <section className="ad-card ad-wide">
            <h3>Services</h3>
            <ul className="lw-list">
              {got.data.services.map((x) => (
                <li key={x.key}><Status value={x.status} /><div><p><b>{x.label}</b></p><span className="crm-tl-meta">{x.detail}{x.checkedAt ? ` · checked ${stamp(x.checkedAt)}` : ''}</span></div></li>
              ))}
            </ul>
          </section>
          <section className="ad-card ad-wide">
            <h3>Projects</h3>
            {got.data.projects.length === 0 ? <p className="ad-empty">No projects.</p> : (
              <div className="ad-scroll">
                <table className="ad-tbl">
                  <thead><tr><th>Project</th><th>Status</th><th>Orchestrator</th><th>Needs attention</th></tr></thead>
                  <tbody>
                    {got.data.projects.map((p) => (
                      <tr key={p.projectId}>
                        <td><b>{p.name}</b><br /><span className="ad-dim">{p.projectId}</span></td>
                        <td>{p.status}</td>
                        <td><Status value={p.orchestrator.status} /><br /><span className="ad-dim">{p.orchestrator.detail}</span></td>
                        <td>{p.attention.length ? p.attention.join('; ') : <span className="ad-dim">–</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="ad-fine">Icreon’s own projects only, for now: through the admin the platform lists only Icreon’s.</p>
          </section>
          {writable && (
            <div className="ad-grid2">
              <section className="ad-card">
                <h3>Watchdog</h3>
                <p className="ad-fine lw-gap">Runs now: it nudges stuck projects. The platform’s schedule runs it too.</p>
                <form method="post" action="/api/admin/platform/watchdog" className="ad-form">
                  <Back to={back} />
                  <label className="ad-check"><input type="checkbox" name="confirm" required /> <span>Run the watchdog against live projects</span></label>
                  <div className="ad-actions"><button className="ad-btn" type="submit">Run the watchdog</button></div>
                </form>
              </section>
              {got.data.projects.length > 0 && (
                <section className="ad-card">
                  <h3>Operator test email</h3>
                  <p className="ad-fine lw-gap">Sends a real email to the Operator’s recipients, with the project’s open cards as the example.</p>
                  <form method="post" action="/api/admin/platform/test-email" className="ad-form">
                    <Back to={back} />
                    <select className="ad-input" name="project_id" aria-label="Project">{got.data.projects.map((p) => <option key={p.projectId} value={p.projectId}>{p.name}</option>)}</select>
                    <label className="ad-check"><input type="checkbox" name="confirm" required /> <span>Send a real email</span></label>
                    <div className="ad-actions"><button className="ad-btn" type="submit">Send the test email</button></div>
                  </form>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}

import { auditLog } from '@/lib/audit';
import { requireUser } from '@/lib/auth/request';

const when = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(d);

/** Every change made in the admin, newest first. */
export default async function Audit({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireUser('audit', 'read', '/admin/audit');
  const { q = '' } = await searchParams;
  const rows = await auditLog({ q: q.slice(0, 80), limit: 300 });
  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Audit log</h1>
          <p>Every change made in the admin: who, what and when, with the values before and after. US Eastern time.</p>
        </div>
        <form className="ad-controls" method="get">
          <input className="ad-input" name="q" defaultValue={q} placeholder="Search people, actions, records" aria-label="Search the audit log" />
        </form>
      </header>
      <section className="ad-card ad-wide">
        {rows.length === 0 ? (
          <p className="ad-empty">{q ? 'Nothing matches.' : 'Nothing has happened yet.'}</p>
        ) : (
          <div className="ad-scroll">
            <table className="ad-tbl">
              <thead><tr><th>When</th><th>Who</th><th>What</th><th>Record</th><th>Details</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="nw">{when(new Date(r.at))}</td>
                    <td><b>{r.actor}</b></td>
                    <td>{r.summary || r.action}<br /><span className="ad-dim">{r.action}</span></td>
                    <td className="nw">{r.entity ? `${r.entity}${r.entityId ? ` ${r.entityId}` : ''}` : '–'}</td>
                    <td>
                      {r.before !== null || r.after !== null ? (
                        <details className="ad-diff"><summary>Before and after</summary>
                          <pre>{JSON.stringify({ before: r.before, after: r.after }, null, 2)}</pre>
                        </details>
                      ) : <span className="ad-dim">–</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import Board from '@/components/admin/crm/Board';
import { Score, StagePill, money, when } from '@/components/admin/crm/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { OUTCOMES } from '@/lib/config';
import { catchUpLeads, owners, pipeline, rescorePending, stages } from '@/lib/crm/data';

type Search = { msg?: string; q?: string; who?: string; view?: string };

/** The pipeline: every deal by stage. Board or table, mine or everyone's. */
export default async function Pipeline({ searchParams }: { searchParams: Promise<Search> }) {
  const s = await requireUser('crm', 'read', '/admin/crm');
  const sp = await searchParams;
  await catchUpLeads();
  await rescorePending();
  const mine = sp.who === 'me';
  const table = sp.view === 'table';
  const q = (sp.q ?? '').slice(0, 80);
  const [all, deals, people] = await Promise.all([stages(), pipeline({ ownerId: mine ? s.user.id : undefined, q }), owners()]);
  const writable = can(s.user.roles, 'crm', 'write');
  const open = deals.filter((d) => all.find((x) => x.id === d.stage)?.kind === 'open');
  const openValue = open.reduce((a, d) => a + (d.value ?? 0), 0);
  // Won and lost columns show the last 30 days; older closed deals stay in the table view.
  const cutoff = Date.now() - 30 * 86400_000;
  const boardDeals = deals.filter((d) => !d.closedAt || new Date(d.closedAt).getTime() > cutoff);
  const href = (p: Partial<Search>) => `/admin/crm?${new URLSearchParams(Object.entries({ q, who: mine ? 'me' : '', view: table ? 'table' : '', ...p }).filter(([, v]) => v) as [string, string][])}`;

  return (
    <main className="wrap ad crm-wide">
      <header className="ad-top">
        <div>
          <h1>Pipeline</h1>
          <p>{open.length} open deal{open.length === 1 ? '' : 's'}{openValue ? ` · ${money(openValue)} in play` : ''}. Drag a card to move it.</p>
        </div>
        <div className="ad-controls">
          <form method="get" className="crm-search">
            <input className="ad-input" name="q" defaultValue={q} placeholder="Search deals, companies, emails" aria-label="Search the pipeline" />
            {mine && <input type="hidden" name="who" value="me" />}
            {table && <input type="hidden" name="view" value="table" />}
          </form>
          <nav className="ad-range" aria-label="Whose deals">
            <Link href={href({ who: '' })} className={!mine ? 'on' : undefined}>Everyone</Link>
            <Link href={href({ who: 'me' })} className={mine ? 'on' : undefined}>Mine</Link>
          </nav>
          <nav className="ad-range" aria-label="View">
            <Link href={href({ view: '' })} className={!table ? 'on' : undefined}>Board</Link>
            <Link href={href({ view: 'table' })} className={table ? 'on' : undefined}>Table</Link>
          </nav>
          <a className="ad-btn" href="/api/admin/crm/export">Export CSV</a>
        </div>
      </header>
      <Banner msg={sp.msg} />

      {writable && (
        <details className="ad-card ad-wide crm-new">
          <summary>New deal</summary>
          <form method="post" action="/api/admin/crm/create-deal" className="ad-form">
            <div className="ad-row2">
              <label className="ad-field"><span>Company</span><input className="ad-input" name="company_name" required placeholder="Contoso" /></label>
              <label className="ad-field"><span>Website <small>matches an existing company</small></span><input className="ad-input" name="domain" placeholder="contoso.com" /></label>
            </div>
            <div className="ad-row2">
              <label className="ad-field"><span>Contact email <small>optional</small></span><input className="ad-input" name="contact_email" type="email" placeholder="name@contoso.com" /></label>
              <label className="ad-field"><span>Value <small>optional, USD</small></span><input className="ad-input" name="value" inputMode="decimal" placeholder="120,000" /></label>
            </div>
            <fieldset className="crm-outcomes">
              <legend>What they want</legend>
              {OUTCOMES.map((o) => (
                <label key={o} className="chip-check"><input type="checkbox" name={`outcome_${o}`} /> <span>{o}</span></label>
              ))}
            </fieldset>
            <div className="ad-row2">
              <label className="ad-field"><span>Stage</span>
                <select className="ad-input" name="stage" defaultValue="new">{all.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
              </label>
              <label className="ad-field"><span>Owner</span>
                <select className="ad-input" name="owner_id" defaultValue={s.user.id}>{people.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
              </label>
            </div>
            <div className="ad-actions"><button className="ad-btn primary" type="submit">Open the deal</button></div>
          </form>
        </details>
      )}

      {table ? (
        <section className="ad-card ad-wide">
          {deals.length === 0 ? (
            <p className="ad-empty">{q ? 'Nothing matches.' : 'No deals yet. Sign-ups from the website appear here on their own.'}</p>
          ) : (
            <div className="ad-scroll">
              <table className="ad-tbl">
                <thead><tr><th>Score</th><th>Deal</th><th>Stage</th><th className="r">Value</th><th>Owner</th><th>Next step</th><th>Source</th><th>Updated</th></tr></thead>
                <tbody>
                  {deals.map((d) => (
                    <tr key={d.id}>
                      <td><Score score={d.score} reasons={d.scoreReasons} /></td>
                      <td><Link href={`/admin/crm/deals/${d.id}`}><b>{d.title}</b></Link>{d.contactEmail && <><br /><span className="ad-dim">{d.contactName ?? d.contactEmail}</span></>}</td>
                      <td><StagePill stage={d.stage} stages={all} /></td>
                      <td className="r">{money(d.value)}</td>
                      <td>{d.ownerName ?? <span className="ad-dim">Unassigned</span>}</td>
                      <td>{d.nextStep || <span className="ad-dim">–</span>}{d.nextStepAt && <><br /><span className="ad-dim">{d.nextStepAt}</span></>}</td>
                      <td>{d.source || <span className="ad-dim">–</span>}</td>
                      <td className="nw">{when(d.updatedAt, false)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <Board
          stages={all.map(({ id, label, kind }) => ({ id, label, kind }))}
          deals={boardDeals.map((d) => ({
            id: d.id,
            title: d.title,
            stage: d.stage,
            companyName: d.companyName,
            contactName: d.contactName ?? d.contactEmail,
            value: d.value,
            ownerName: d.ownerName,
            score: d.score,
            nextStep: d.nextStep,
            nextStepAt: d.nextStepAt,
            openTasks: d.openTasks,
            daysInStage: Math.floor((Date.now() - new Date(d.stageChangedAt).getTime()) / 86400_000),
          }))}
        />
      )}
    </main>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Banner } from '@/components/admin/AdminNav';
import { ActivityForm, EmailForm, OwnerSelect, Score, StagePill, TaskForm, TaskList, Timeline, money, when } from '@/components/admin/crm/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { OUTCOMES } from '@/lib/config';
import { contacts, deal, owners, stages, tasks, timeline } from '@/lib/crm/data';

const LEVEL = ['Curious', 'Interested', 'Needs it', 'Offered their budget'];

/** One deal: where it stands, who's involved, what's next, and everything that has happened. */
export default async function DealPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  const s = await requireUser('crm', 'read', `/admin/crm/deals/${raw}`);
  if (!Number.isInteger(id)) notFound();
  const d = await deal(id);
  if (!d) notFound();
  const sp = await searchParams;
  const back = `/admin/crm/deals/${id}`;
  const [all, items, todo, people, team] = await Promise.all([
    stages(),
    timeline({ dealId: id }),
    tasks({ dealId: id, scope: 'all' }),
    owners(),
    d.companyId ? contacts({ companyId: d.companyId, limit: 50 }) : Promise.resolve([]),
  ]);
  const writable = can(s.user.roles, 'crm', 'write');
  const stage = all.find((x) => x.id === d.stage);
  const primary = team.find((c) => c.id === d.contactId);

  return (
    <main className="wrap ad crm-record">
      <p className="crm-crumbs"><Link href="/admin/crm">Pipeline</Link>{d.companyId && <> / <Link href={`/admin/crm/companies/${d.companyId}`}>{d.companyName}</Link></>}</p>
      <header className="ad-top">
        <div>
          <h1>{d.title}</h1>
          <p className="crm-facts">
            <StagePill stage={d.stage} stages={all} />
            <Score score={d.score} reasons={d.scoreReasons} />
            <span>{money(d.value)}</span>
            <span>{d.ownerName ?? 'Unassigned'}</span>
            <span>In this stage since {when(d.stageChangedAt, false)}</span>
            {d.source && <span>From {d.source}</span>}
          </p>
        </div>
        {writable && (
          <form method="post" action="/api/admin/crm/move-deal" className="crm-moveform">
            <input type="hidden" name="id" value={d.id} />
            <input type="hidden" name="back" value={back} />
            <select className="ad-input" name="stage" defaultValue={d.stage} aria-label="Stage">
              {all.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
            <input className="ad-input" name="lost_reason" placeholder="If lost, why" aria-label="Why it was lost" />
            <button className="ad-btn" type="submit">Move</button>
          </form>
        )}
      </header>
      <Banner msg={sp.msg} />
      {stage?.kind === 'lost' && d.lostReason && <p className="ad-banner bad">Lost: {d.lostReason}</p>}

      <div className="crm-cols">
        <div className="crm-main">
          <section className="ad-card">
            <h3>Next step</h3>
            {writable ? (
              <form method="post" action="/api/admin/crm/update-deal" className="crm-nextform">
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="back" value={back} />
                <input className="ad-input" name="next_step" defaultValue={d.nextStep} placeholder="e.g. Send the recording to their CMO" maxLength={300} />
                <input className="ad-input" type="date" name="next_step_at" defaultValue={d.nextStepAt ?? ''} aria-label="By when" />
                <button className="ad-btn" type="submit">Save</button>
              </form>
            ) : (
              <p>{d.nextStep || 'None set.'}{d.nextStepAt ? ` · by ${d.nextStepAt}` : ''}</p>
            )}
          </section>

          <section className="ad-card">
            <h3>Tasks</h3>
            <TaskList items={todo} back={back} owners links={false} />
            {writable && <TaskForm r={{ dealId: d.id, back }} owners={people} me={s.user.id} />}
          </section>

          <section className="ad-card">
            <h3>Timeline</h3>
            {writable && <ActivityForm r={{ dealId: d.id, contactId: d.contactId ?? undefined, back }} />}
            <Timeline items={items} />
          </section>
        </div>

        <aside className="crm-side">
          <section className="ad-card">
            <h3>Why the score is {d.score}</h3>
            {d.scoreReasons.length ? (
              <ul className="crm-reasons">{d.scoreReasons.map((r) => <li key={r}>{r}</li>)}</ul>
            ) : (
              <p className="ad-empty">Nothing to go on yet.</p>
            )}
            {d.level !== null && <p className="ad-fine">On the dial: {LEVEL[d.level] ?? d.level}.</p>}
          </section>

          <section className="ad-card">
            <h3>People</h3>
            {primary ? (
              <div className="crm-person">
                <Link href={`/admin/crm/contacts/${primary.id}`}><b>{[primary.firstName, primary.lastName].filter(Boolean).join(' ') || primary.email}</b></Link>
                <span className="ad-dim">{primary.title || primary.email}</span>
                {writable && primary.status !== 'unsubscribed' && <EmailForm contactId={primary.id} dealId={d.id} back={back} to={primary.firstName || primary.email} />}
                {primary.status === 'unsubscribed' && <span className="ad-fine">Unsubscribed, so no email from here.</span>}
              </div>
            ) : (
              <p className="ad-empty">No main contact.</p>
            )}
            {team.filter((c) => c.id !== d.contactId).length > 0 && (
              <ul className="crm-others">
                {team.filter((c) => c.id !== d.contactId).slice(0, 8).map((c) => (
                  <li key={c.id}><Link href={`/admin/crm/contacts/${c.id}`}>{[c.firstName, c.lastName].filter(Boolean).join(' ') || c.email}</Link>{c.title && <span className="ad-dim"> · {c.title}</span>}</li>
                ))}
              </ul>
            )}
          </section>

          {writable ? (
            <section className="ad-card">
              <h3>Details</h3>
              <form method="post" action="/api/admin/crm/update-deal" className="ad-form">
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="back" value={back} />
                <input type="hidden" name="outcomes_present" value="1" />
                <label className="ad-field"><span>Title</span><input className="ad-input" name="title" defaultValue={d.title} maxLength={160} /></label>
                <div className="ad-row2">
                  <label className="ad-field"><span>Value</span><input className="ad-input" name="value" defaultValue={d.value ?? ''} inputMode="decimal" placeholder="USD" /></label>
                  <label className="ad-field"><span>Expected close</span><input className="ad-input" type="date" name="expected_close" defaultValue={d.expectedClose ?? ''} /></label>
                </div>
                <label className="ad-field"><span>Owner</span><OwnerSelect owners={people} value={d.ownerId} /></label>
                {team.length > 0 && (
                  <label className="ad-field"><span>Main contact</span>
                    <select className="ad-input" name="contact_id" defaultValue={d.contactId ?? ''}>
                      <option value="">None</option>
                      {team.map((c) => <option key={c.id} value={c.id}>{[c.firstName, c.lastName].filter(Boolean).join(' ') || c.email}</option>)}
                    </select>
                  </label>
                )}
                <fieldset className="crm-outcomes">
                  <legend>What they want</legend>
                  {OUTCOMES.map((o) => (
                    <label key={o} className="chip-check"><input type="checkbox" name={`outcome_${o}`} defaultChecked={d.outcomes.includes(o)} /> <span>{o}</span></label>
                  ))}
                </fieldset>
                <div className="ad-actions"><button className="ad-btn primary" type="submit">Save</button></div>
              </form>
            </section>
          ) : (
            <section className="ad-card">
              <h3>Details</h3>
              <p>Wants: {d.outcomes.join(', ') || '–'}</p>
              <p>Expected close: {d.expectedClose ?? '–'}</p>
            </section>
          )}

          <p className="ad-fine">Opened {when(d.createdAt)}{d.closedAt ? ` · closed ${when(d.closedAt)}` : ''}.</p>
        </aside>
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Banner } from '@/components/admin/AdminNav';
import StepEditor from '@/components/admin/StepEditor';
import { requireUser } from '@/lib/auth/request';
import { loadSettings } from '@/lib/settings';
import { canSend, checks } from '@/lib/drip/config';
import { getSteps } from '@/lib/drip/engine';
import { sequence } from '@/lib/drip/stats';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sequence | Cypher', robots: { index: false, follow: false } };

const fmt = (n: number) => n.toLocaleString('en-US');
const rate = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '–');
const when = (d: unknown) =>
  d ? new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(d as string)) : '–';
const REASON: Record<string, string> = { put_forward: 'put their company forward', unsubscribed: 'unsubscribed', bounced: 'bounced', complained: 'marked as spam' };

export default async function SequencePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { id: raw } = await params;
  await requireUser('email', 'read', `/admin/drip/${raw}`);
  await loadSettings();
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const [q, steps] = await Promise.all([sequence(id), getSteps(id)]);
  if (!q) notFound();
  const { msg } = await searchParams;
  const back = `/admin/drip/${id}`;
  const count = (status: string) => q.enrolled.filter((e) => e.status === status).reduce((a, e) => a + e.n, 0);
  const total = q.steps.reduce(
    (a, s) => ({ sent: a.sent + s.sent, delivered: a.delivered + s.delivered, opened: a.opened + s.opened, clicked: a.clicked + s.clicked, converted: a.converted + s.converted }),
    { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 },
  );
  const todo = checks().filter((c) => !c.ok && (c.key === 'address' || c.key === 'resend'));
  let day = 0;

  return (
    <main className="wrap ad">
      <p className="ad-crumb"><Link href="/admin/drip">← All sequences</Link></p>
      <header className="ad-top">
        <div>
          <form method="post" action="/api/admin/drip/rename" className="ad-rename">
            <input type="hidden" name="sequence" value={id} />
            <input type="hidden" name="back" value={back} />
            <input className="ad-title-input" name="name" defaultValue={q.name} aria-label="Sequence name" maxLength={120} />
            <button className="ad-btn ghost" type="submit">Rename</button>
          </form>
          <p>
            <span className={`ad-pill ${q.status === 'active' ? 'ok' : 'no'}`}>{q.status === 'active' ? 'Live' : q.status === 'paused' ? 'Paused' : 'Draft'}</span>{' '}
            {q.status === 'active' ? 'Due emails go out with each send run.' : 'Nothing sends until it’s live.'}
          </p>
        </div>
        <div className="ad-controls">
          <form method="post" action="/api/admin/drip/sequence-status">
            <input type="hidden" name="sequence" value={id} />
            <input type="hidden" name="back" value={back} />
            <input type="hidden" name="status" value={q.status === 'active' ? 'paused' : 'active'} />
            <button className={q.status === 'active' ? 'ad-btn' : 'ad-btn primary'} type="submit" disabled={q.status !== 'active' && !canSend()}>
              {q.status === 'active' ? 'Pause' : 'Go live'}
            </button>
          </form>
          <form method="post" action="/api/admin/drip/run">
            <input type="hidden" name="back" value={back} />
            <button className="ad-btn" type="submit" disabled={!canSend()}>Send due now{q.due ? ` (${q.due})` : ''}</button>
          </form>
        </div>
      </header>
      <Banner msg={msg} />
      {todo.length > 0 && (
        <p className="ad-banner bad">Sending is off until setup is done: {todo.map((t) => t.fix).join(' ')} <Link href="/admin/drip">Setup</Link></p>
      )}
      {q.errors.n > 0 && <p className="ad-banner bad">{q.errors.n} contact{q.errors.n === 1 ? '' : 's'} failed on the last run and will retry: {q.errors.last}</p>}

      <div className="ad-tiles">
        <div className="ad-tile"><span className="ad-tl">In progress</span><b>{fmt(count('active'))}</b></div>
        <div className="ad-tile"><span className="ad-tl">Finished</span><b>{fmt(count('completed'))}</b></div>
        <div className="ad-tile"><span className="ad-tl">Left early</span><b>{fmt(count('exited'))}</b><span className="ad-tn">{q.enrolled.filter((e) => e.status === 'exited').map((e) => `${e.n} ${REASON[e.reason ?? ''] ?? e.reason}`).join(' · ')}</span></div>
        <div className="ad-tile"><span className="ad-tl">Sent</span><b>{fmt(total.sent)}</b></div>
        <div className="ad-tile"><span className="ad-tl">Clicked</span><b>{rate(total.clicked, total.delivered || total.sent)}</b><span className="ad-tn">opened {rate(total.opened, total.delivered || total.sent)}</span></div>
        <div className="ad-tile"><span className="ad-tl">Put forward</span><b>{fmt(total.converted)}</b><span className="ad-tn">from these emails</span></div>
      </div>

      {steps.map((st, i) => {
        day += st.delayDays;
        const dated = st.sendOn ? new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${st.sendOn}T12:00:00Z`)) : null;
        const s = q.steps.find((x) => x.id === st.id);
        return (
          <section className="ad-card ad-wide ad-step" key={st.id} id={`step-${st.id}`}>
            <div className="ad-step-head">
              <h3>Email {st.position} <small>· {dated ? `${dated}, 9 to 10 AM ET` : `day ${day}${i === 0 ? ' (after enrolling)' : ''}`}</small></h3>
              {s && s.sent > 0 && (
                <p className="ad-step-stats">
                  {fmt(s.sent)} sent · {rate(s.delivered, s.sent)} delivered · {rate(s.opened, s.delivered || s.sent)} opened · {rate(s.clicked, s.delivered || s.sent)} clicked
                  {s.bounced ? ` · ${s.bounced} bounced` : ''}{s.unsubscribed ? ` · ${s.unsubscribed} unsubscribed` : ''}{s.complained ? ` · ${s.complained} spam` : ''}{s.converted ? ` · ${s.converted} put forward` : ''}
                </p>
              )}
            </div>
            <StepEditor step={st} sequenceId={id} back={back} first={i === 0} />
          </section>
        );
      })}
      <form method="post" action="/api/admin/drip/add-step" className="ad-wide">
        <input type="hidden" name="sequence" value={id} />
        <input type="hidden" name="back" value={back} />
        <button className="ad-btn" type="submit">+ Add an email</button>
      </form>

      <div className="ad-grid2">
        <section className="ad-card">
          <h3>Enroll contacts</h3>
          <form method="post" action="/api/admin/drip/enroll" className="ad-form">
            <input type="hidden" name="sequence" value={id} />
            <input type="hidden" name="back" value={back} />
            <label className="ad-field">
              <span>Who</span>
              <select className="ad-input" name="list" defaultValue="">
                <option value="">All active contacts</option>
                {q.lists.map((l) => <option key={l} value={l}>List: {l}</option>)}
              </select>
            </label>
            <label className="ad-check"><input type="checkbox" name="skip_put_forward" defaultChecked /> Skip anyone who already put their company forward</label>
            <button className="ad-btn primary" type="submit">Enroll</button>
            <p className="ad-hint">Enrolled contacts get email 1 on the next send run after its delay. Contacts already in this sequence are left alone. Need contacts? <Link href="/admin/drip/contacts">Upload a list</Link>.</p>
          </form>
        </section>
        <section className="ad-card">
          <h3>Delete sequence</h3>
          <p className="ad-hint">Removes the sequence, its emails, enrollments and stats. Contacts stay.</p>
          <form method="post" action="/api/admin/drip/delete-sequence">
            <input type="hidden" name="sequence" value={id} />
            <input type="hidden" name="back" value={back} />
            <button className="ad-btn ghost" type="submit">Delete “{q.name}”</button>
          </form>
        </section>
      </div>

      <section className="ad-card ad-wide">
        <h3>Recent sends</h3>
        {q.recent.length === 0 ? (
          <p className="ad-empty">Nothing sent yet.</p>
        ) : (
          <div className="ad-scroll">
            <table className="ad-tbl">
              <thead><tr><th>Sent (ET)</th><th>To</th><th>Email</th><th>Delivered</th><th>Opened</th><th>Clicked</th><th>Problem</th></tr></thead>
              <tbody>
                {q.recent.map((r) => (
                  <tr key={String(r.id)}>
                    <td className="nw">{when(r.sentAt)}</td>
                    <td>{String(r.email)}</td>
                    <td>{String(r.position)}</td>
                    <td>{r.deliveredAt ? '✓' : '–'}</td>
                    <td>{r.openedAt ? '✓' : '–'}</td>
                    <td>{r.clickedAt ? '✓' : '–'}</td>
                    <td>{r.bouncedAt ? <span className="ad-warn">bounced</span> : r.complainedAt ? <span className="ad-warn">spam</span> : ''}</td>
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

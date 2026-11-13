import Link from 'next/link';
import type { Activity, DealRow, Stage, Task } from '@/lib/crm/data';

/** Shared pieces of the CRM's record pages: timeline, forms, tasks, labels. Plain forms, no client code. */

export const when = (d: Date | string | null, withTime = true) =>
  d
    ? new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}) }).format(new Date(d))
    : '';
export const money = (n: number | null) => (n === null ? '–' : `$${Math.round(n).toLocaleString('en-US')}`);
export const heat = (n: number) => (n >= 60 ? 'hot' : n >= 35 ? 'warm' : 'cool');

const KIND: Record<string, string> = {
  note: 'Note',
  call: 'Call',
  meeting: 'Meeting',
  email: 'Email',
  campaign: 'Campaign email',
  stage: 'Stage',
  task: 'Task',
  form: 'Website',
  system: 'Record',
};

export function StagePill({ stage, stages }: { stage: string; stages: Stage[] }) {
  const s = stages.find((x) => x.id === stage);
  return <span className={`crm-stage ${s?.kind ?? 'open'}`}>{s?.label ?? stage}</span>;
}

export function Score({ score, reasons }: { score: number; reasons?: string[] }) {
  return (
    <span className={`crm-heat ${heat(score)}`} title={reasons?.join('\n') || `Lead score ${score}`}>
      {score}
    </span>
  );
}

export function Timeline({ items, showDeal = false }: { items: Activity[]; showDeal?: boolean }) {
  if (!items.length) return <p className="ad-empty">Nothing yet.</p>;
  return (
    <ol className="crm-tl">
      {items.map((a) => (
        <li key={a.id} className={`k-${a.kind}`}>
          <span className="crm-tl-dot" aria-hidden="true" />
          <div className="crm-tl-body">
            <div className="crm-tl-head">
              <b>{KIND[a.kind] ?? a.kind}</b>
              {a.subject && <span>{a.subject}</span>}
            </div>
            {a.body && <p className="crm-tl-text">{a.body}</p>}
            <span className="crm-tl-meta">
              {when(a.at)} · {a.actor}
              {a.contactName ? ` · ${a.contactName}` : ''}
              {showDeal && a.dealId ? (
                <>
                  {' · '}
                  <Link href={`/admin/crm/deals/${a.dealId}`}>{a.dealTitle}</Link>
                </>
              ) : null}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

type Ref = { dealId?: number; companyId?: number; contactId?: number; back: string };
const Hidden = ({ r }: { r: Ref }) => (
  <>
    {r.dealId && <input type="hidden" name="deal_id" value={r.dealId} />}
    {r.companyId && <input type="hidden" name="company_id" value={r.companyId} />}
    {r.contactId && <input type="hidden" name="contact_id" value={r.contactId} />}
    <input type="hidden" name="back" value={r.back} />
  </>
);

export function ActivityForm({ r }: { r: Ref }) {
  return (
    <form method="post" action="/api/admin/crm/add-activity" className="crm-log">
      <Hidden r={r} />
      <div className="ad-seg crm-kinds" role="radiogroup" aria-label="What happened">
        {['note', 'call', 'meeting'].map((k, i) => (
          <label key={k}>
            <input type="radio" name="kind" value={k} defaultChecked={i === 0} />
            <span>{k[0].toUpperCase() + k.slice(1)}</span>
          </label>
        ))}
      </div>
      <input className="ad-input" name="subject" placeholder="Subject (optional)" maxLength={300} />
      <textarea className="ad-input" name="body" rows={3} placeholder="What happened, what was said, what's next" />
      <div className="ad-actions">
        <button className="ad-btn primary" type="submit">Log it</button>
      </div>
    </form>
  );
}

export function TaskList({ items, back, owners, links = true }: { items: Task[]; back: string; owners?: boolean; links?: boolean }) {
  if (!items.length) return <p className="ad-empty">No tasks.</p>;
  const now = Date.now();
  return (
    <ul className="crm-tasks">
      {items.map((t) => {
        const late = !t.doneAt && t.dueAt && new Date(t.dueAt).getTime() < now;
        return (
          <li key={t.id} className={t.doneAt ? 'done' : late ? 'late' : undefined}>
            <form method="post" action={`/api/admin/crm/${t.doneAt ? 'task-reopen' : 'task-done'}`}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="back" value={back} />
              <button className="crm-check" type="submit" aria-label={t.doneAt ? `Reopen ${t.title}` : `Finish ${t.title}`}>
                {t.doneAt ? '✓' : ''}
              </button>
            </form>
            <div className="crm-task-body">
              <b>{t.title}</b>
              <span className="crm-tl-meta">
                {t.dueAt ? `${late ? 'Overdue · ' : 'Due '}${when(t.dueAt)}` : 'No date'}
                {owners && t.ownerName ? ` · ${t.ownerName}` : ''}
                {!links ? null : t.dealId ? (
                  <>
                    {' · '}
                    <Link href={`/admin/crm/deals/${t.dealId}`}>{t.dealTitle}</Link>
                  </>
                ) : t.companyId ? (
                  <>
                    {' · '}
                    <Link href={`/admin/crm/companies/${t.companyId}`}>{t.companyName}</Link>
                  </>
                ) : null}
              </span>
            </div>
            <form method="post" action="/api/admin/crm/task-delete">
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="back" value={back} />
              <button className="ad-btn small ghost" type="submit" aria-label={`Delete ${t.title}`}>Delete</button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}

export function TaskForm({ r, owners, me }: { r: Ref; owners: { id: number; name: string }[]; me: number }) {
  return (
    <form method="post" action="/api/admin/crm/add-task" className="crm-taskform">
      <Hidden r={r} />
      <input className="ad-input" name="title" placeholder="Add a task, e.g. Book the demo" required maxLength={200} />
      <input className="ad-input" type="date" name="due" aria-label="Due date" />
      <select className="ad-input" name="owner_id" defaultValue={me} aria-label="Owner">
        {owners.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
      <button className="ad-btn" type="submit">Add</button>
    </form>
  );
}

export function EmailForm({ contactId, dealId, back, to }: { contactId: number; dealId?: number; back: string; to: string }) {
  return (
    <details className="crm-email">
      <summary className="ad-btn">Email {to}</summary>
      <form method="post" action="/api/admin/crm/email-contact" className="ad-form">
        <input type="hidden" name="contact_id" value={contactId} />
        {dealId && <input type="hidden" name="deal_id" value={dealId} />}
        <input type="hidden" name="back" value={back} />
        <input className="ad-input" name="subject" placeholder="Subject" required maxLength={200} />
        <textarea className="ad-input" name="body" rows={6} placeholder="Write it like you would from your own inbox. Replies come to you." required />
        <div className="ad-actions">
          <button className="ad-btn primary" type="submit">Send</button>
          <span className="ad-fine">Sent from “Your name at Cypher”; logged on the timeline.</span>
        </div>
      </form>
    </details>
  );
}

export function DealList({ deals, stages }: { deals: DealRow[]; stages: Stage[] }) {
  if (!deals.length) return <p className="ad-empty">No deals.</p>;
  return (
    <ul className="crm-deals">
      {deals.map((d) => (
        <li key={d.id}>
          <Score score={d.score} reasons={d.scoreReasons} />
          <Link href={`/admin/crm/deals/${d.id}`}>{d.title}</Link>
          <StagePill stage={d.stage} stages={stages} />
          <span className="crm-tl-meta">{money(d.value)}</span>
        </li>
      ))}
    </ul>
  );
}

export function OwnerSelect({ owners, value, name = 'owner_id' }: { owners: { id: number; name: string }[]; value: number | null; name?: string }) {
  return (
    <select className="ad-input" name={name} defaultValue={value ?? ''}>
      <option value="">Unassigned</option>
      {owners.map((o) => (
        <option key={o.id} value={o.id}>{o.name}</option>
      ))}
    </select>
  );
}

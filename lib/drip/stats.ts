import 'server-only';
import { db, dripReady } from './db';

/** The numbers the admin shows for the drip. Rates are left to the page. */

export type Funnel = { sent: number; delivered: number; opened: number; clicked: number; bounced: number; complained: number; unsubscribed: number; converted: number };
export type SequenceRow = Funnel & { id: number; name: string; status: string; steps: number; active: number; completed: number; exited: number; createdAt: Date };
export type StepRow = Funnel & { id: number; position: number };
export type ContactRowOut = { id: number; email: string; firstName: string; lastName: string; company: string; title: string; lists: string[]; status: string; createdAt: Date };

const n = (v: unknown) => Number(v ?? 0);

function funnel(r: Record<string, unknown>): Funnel {
  return { sent: n(r.sent), delivered: n(r.delivered), opened: n(r.opened), clicked: n(r.clicked), bounced: n(r.bounced), complained: n(r.complained), unsubscribed: n(r.unsubscribed), converted: n(r.converted) };
}

export async function sequences(): Promise<SequenceRow[]> {
  await dripReady();
  const rows = await db()<Record<string, unknown>[]>`
    select q.id, q.name, q.status, q.created_at,
      (select count(*) from steps st where st.sequence_id = q.id) as steps,
      (select count(*) from enrollments e where e.sequence_id = q.id and e.status = 'active') as active,
      (select count(*) from enrollments e where e.sequence_id = q.id and e.status = 'completed') as completed,
      (select count(*) from enrollments e where e.sequence_id = q.id and e.status = 'exited') as exited,
      count(d.id) filter (where d.status = 'sent') as sent,
      count(d.delivered_at) as delivered, count(d.opened_at) as opened, count(d.clicked_at) as clicked,
      count(d.bounced_at) as bounced, count(d.complained_at) as complained,
      (select count(*) from contacts c join drip_sends u on u.id = c.unsub_send_id where u.sequence_id = q.id) as unsubscribed,
      (select count(*) from submissions sub where sub.outcome = 'ok' and sub.source like 'd' || q.id || 's%') as converted
    from sequences q left join drip_sends d on d.sequence_id = q.id
    group by q.id order by q.created_at desc`;
  return rows.map((r) => ({ ...funnel(r), id: n(r.id), name: String(r.name), status: String(r.status), steps: n(r.steps), active: n(r.active), completed: n(r.completed), exited: n(r.exited), createdAt: r.createdAt as Date }));
}

export async function sequence(id: number) {
  await dripReady();
  const s = db();
  const [q] = await s<{ id: number; name: string; status: string }[]>`select id, name, status from sequences where id = ${id}`;
  if (!q) return null;
  const [steps, enrolled, recent, lists] = await Promise.all([
    s<Record<string, unknown>[]>`
      select st.id, st.position,
        count(d.id) filter (where d.status = 'sent') as sent,
        count(d.delivered_at) as delivered, count(d.opened_at) as opened, count(d.clicked_at) as clicked,
        count(d.bounced_at) as bounced, count(d.complained_at) as complained,
        (select count(*) from contacts c join drip_sends u on u.id = c.unsub_send_id where u.step_id = st.id) as unsubscribed,
        (select count(*) from submissions sub where sub.outcome = 'ok' and sub.source = 'd' || ${id} || 's' || st.position) as converted
      from steps st left join drip_sends d on d.step_id = st.id
      where st.sequence_id = ${id} group by st.id order by st.position`,
    s<{ status: string; exitReason: string | null; n: string }[]>`
      select status, exit_reason, count(*) as n from enrollments where sequence_id = ${id} group by status, exit_reason`,
    s<Record<string, unknown>[]>`
      select d.id, d.email, d.position, d.status, d.sent_at, d.delivered_at, d.opened_at, d.clicked_at, d.bounced_at, d.complained_at
      from drip_sends d where d.sequence_id = ${id} order by d.created_at desc limit 50`,
    s<{ list: string }[]>`select distinct unnest(lists) as list from contacts order by 1`,
  ]);
  const [errors] = await s<{ n: string; last: string | null }[]>`
    select count(*) as n, max(last_error) as last from enrollments where sequence_id = ${id} and status = 'active' and last_error is not null`;
  const [due] = await s<{ n: string }[]>`select count(*) as n from enrollments where sequence_id = ${id} and status = 'active' and next_send_at <= now()`;
  return {
    ...q,
    steps: steps.map((r) => ({ ...funnel(r), id: n(r.id), position: n(r.position) })) as StepRow[],
    enrolled: enrolled.map((r) => ({ status: r.status, reason: r.exitReason, n: n(r.n) })),
    recent,
    lists: lists.map((l) => l.list),
    errors: { n: n(errors?.n), last: errors?.last ?? null },
    due: n(due?.n),
  };
}

export async function contacts(opts: { q: string; status: string; list: string; limit?: number }) {
  await dripReady();
  const s = db();
  const like = `%${opts.q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
  const where = s`where true
    ${opts.q ? s`and (email ilike ${like} or company ilike ${like} or first_name ilike ${like} or last_name ilike ${like})` : s``}
    ${opts.list ? s`and ${opts.list} = any(lists)` : s``}`;
  const [rows, counts, lists] = await Promise.all([
    s<ContactRowOut[]>`select id::int as id, email, first_name, last_name, company, title, lists, status, created_at from contacts ${where}
      ${opts.status ? s`and status = ${opts.status}` : s``} order by created_at desc limit ${opts.limit ?? 300}`,
    s<{ status: string; n: string }[]>`select status, count(*) as n from contacts ${where} group by status`,
    s<{ list: string; n: string }[]>`select unnest(lists) as list, count(*) as n from contacts group by 1 order by 1`,
  ]);
  const c: Record<string, number> = { all: 0, active: 0, unsubscribed: 0, bounced: 0, complained: 0 };
  for (const r of counts) { c[r.status] = n(r.n); c.all += n(r.n); }
  return { rows, counts: c, lists: lists.map((l) => ({ list: l.list, n: n(l.n) })) };
}

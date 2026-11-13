import 'server-only';
import { loadSettings } from '../settings';
import { classify } from '../rules';
import { domainOf } from '../company';
import { canSend, dripFrom, dripReplyTo, postalAddress, resendKey, senderName, SITE } from './config';
import { db, dripReady } from './db';
import { TEMPLATES, renderEmail, SAMPLE, type Person, type StepCopy } from './render';
import { unsubToken } from './tokens';
import type { ContactRow } from './csv';

/** The drip: contacts in, sequences of steps, one send run a day, and Resend's events back. */

export type Step = StepCopy & { id: number; sequenceId: number; position: number; delayDays: number; sendOn?: string | null };

const code = (sequenceId: number, position: number) => `d${sequenceId}s${position}`;

/**
 * The next step to send after `after` (0 to start). A dated step is skipped once its date has passed,
 * so someone enrolled late never gets two emails in a day or a last call after the close. After a send,
 * a dated step dated today waits (one email a day); when starting, today's step is fine.
 */
async function nextStep(sequenceId: number, after: number) {
  const s = db();
  const [st] = await s<{ position: number }[]>`
    select position from steps
    where sequence_id = ${sequenceId} and position > ${after}
      and (send_on is null or ${after === 0 ? s`send_on >= current_date` : s`send_on > current_date`})
    order by position limit 1`;
  return st?.position ?? null;
}

/** When a step is due: its date, or today plus its delay. */
const dueAt = (sequenceId: number, position: number) => db()`(
  select coalesce(st.send_on::timestamptz, date_trunc('day', now()) + make_interval(days => st.delay_days))
  from steps st where st.sequence_id = ${sequenceId} and st.position = ${position})`;

function footer(contactId: number, sendId: number | null) {
  return {
    senderName: senderName(),
    postalAddress: postalAddress(),
    unsubscribeUrl: `${SITE}/unsubscribe?t=${unsubToken(contactId, sendId)}`,
    reason: 'You’re getting this because Cypher thinks your company should be one of the twenty-five.',
  };
}

export function render(step: Step, person: Person, contactId: number, sendId: number | null) {
  return renderEmail({
    step: { subject: step.subject, preheader: step.preheader, body: step.body, cta_label: step.cta_label, cta_url: step.cta_url },
    person,
    code: code(step.sequenceId, step.position),
    footer: footer(contactId, sendId),
  });
}

type ResendEmail = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
};

async function resend(path: '/emails' | '/emails/batch', body: unknown, idempotencyKey?: string) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey()}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as { data?: { id: string }[]; id?: string; message?: string };
  if (!res.ok) throw new Error(`Resend refused (${res.status}): ${data.message ?? res.statusText}`);
  return data;
}

function message(step: Step, person: Person, contactId: number, sendId: number | null, test = false): ResendEmail {
  const r = render(step, person, contactId, sendId);
  const unsub = footer(contactId, sendId).unsubscribeUrl;
  const m: ResendEmail = {
    from: dripFrom(),
    to: [person.email],
    subject: test ? `[Test] ${r.subject}` : r.subject,
    html: r.html,
    text: r.text,
    headers: { 'List-Unsubscribe': `<${unsub.replace('/unsubscribe?', '/api/unsubscribe?')}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    tags: [
      { name: 'drip_sequence', value: String(step.sequenceId) },
      { name: 'drip_step', value: String(step.position) },
    ],
  };
  if (dripReplyTo()) m.reply_to = dripReplyTo();
  return m;
}

// ---------- sequences ----------

export async function createSequence(name: string, template = 'starter'): Promise<number> {
  const steps = (TEMPLATES[template] ?? TEMPLATES.starter).steps;
  await dripReady();
  const s = db();
  return s.begin(async (tx) => {
    const [{ id }] = await tx<{ id: number }[]>`insert into sequences (name) values (${name.slice(0, 120) || 'Untitled sequence'}) returning id`;
    for (const [i, st] of steps.entries()) {
      await tx`insert into steps (sequence_id, position, delay_days, send_on, subject, preheader, body, cta_label, cta_url)
        values (${id}, ${i + 1}, ${st.delay_days}, ${st.send_on ?? null}, ${st.subject}, ${st.preheader}, ${st.body}, ${st.cta_label}, ${st.cta_url})`;
    }
    return id;
  });
}

export async function getSteps(sequenceId: number): Promise<Step[]> {
  await dripReady();
  const rows = await db()<Record<string, unknown>[]>`
    select id, sequence_id, position, delay_days, to_char(send_on, 'YYYY-MM-DD') as send_on, subject, preheader, body, cta_label, cta_url
    from steps where sequence_id = ${sequenceId} order by position`;
  return rows.map((r) => ({
    id: Number(r.id),
    sequenceId: Number(r.sequenceId),
    position: Number(r.position),
    delayDays: Number(r.delayDays),
    sendOn: (r.sendOn as string | null) ?? null,
    subject: String(r.subject),
    preheader: String(r.preheader),
    body: String(r.body),
    cta_label: String(r.ctaLabel),
    cta_url: String(r.ctaUrl),
  }));
}

export async function saveStep(stepId: number, v: StepCopy & { delay_days: number; send_on: string }) {
  await dripReady();
  const sendOn = /^\d{4}-\d{2}-\d{2}$/.test(v.send_on) ? v.send_on : null;
  await db()`update steps set subject = ${v.subject}, preheader = ${v.preheader}, body = ${v.body}, cta_label = ${v.cta_label},
    cta_url = ${v.cta_url}, delay_days = ${Math.max(0, Math.min(365, v.delay_days))}, send_on = ${sendOn}, updated_at = now() where id = ${stepId}`;
}

export async function addStep(sequenceId: number) {
  await dripReady();
  await db()`insert into steps (sequence_id, position, delay_days, subject, body, cta_label)
    select ${sequenceId}, coalesce(max(position), 0) + 1, 3, 'New email', 'Hi {{first_name|there}},', 'Put your company forward'
    from steps where sequence_id = ${sequenceId}`;
}

/** Removes a step and closes the gap, so positions stay 1, 2, 3. */
export async function deleteStep(stepId: number) {
  await dripReady();
  await db().begin(async (tx) => {
    const [st] = await tx<{ sequenceId: number; position: number }[]>`delete from steps where id = ${stepId} returning sequence_id, position`;
    if (st) await tx`update steps set position = position - 1 where sequence_id = ${st.sequenceId} and position > ${st.position}`;
  });
}

export async function setSequence(sequenceId: number, v: { status?: string; name?: string }) {
  await dripReady();
  if (v.status && ['draft', 'active', 'paused'].includes(v.status)) await db()`update sequences set status = ${v.status} where id = ${sequenceId}`;
  if (v.name) await db()`update sequences set name = ${v.name.slice(0, 120)} where id = ${sequenceId}`;
}

export async function deleteSequence(sequenceId: number) {
  await dripReady();
  await db()`delete from sequences where id = ${sequenceId}`;
}

// ---------- contacts ----------

const VALID = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ImportResult = { added: number; updated: number; invalid: number; skipped: number };

/** Adds or updates contacts from an upload. Unsubscribed, bounced and complained contacts stay that way. */
export async function importContacts(rows: ContactRow[], list: string, skipDeclined: boolean): Promise<ImportResult> {
  await dripReady();
  const s = db();
  const out: ImportResult = { added: 0, updated: 0, invalid: 0, skipped: 0 };
  const seen = new Set<string>();
  const tagList = list.trim() ? [list.trim().slice(0, 60)] : [];
  for (const r of rows) {
    const email = r.email.trim().toLowerCase();
    if (!VALID.test(email) || seen.has(email)) { out.invalid += VALID.test(email) ? 0 : 1; continue; }
    seen.add(email);
    if (skipDeclined && classify(domainOf(email)) !== 'ok') { out.skipped++; continue; }
    const [row] = await s<{ inserted: boolean }[]>`
      insert into contacts (email, first_name, last_name, company, title, lists)
      values (${email}, ${r.first_name.slice(0, 80)}, ${r.last_name.slice(0, 80)}, ${r.company.slice(0, 120)}, ${r.title.slice(0, 120)}, ${s.array(tagList)})
      on conflict (lower(email)) do update set
        first_name = coalesce(nullif(excluded.first_name, ''), contacts.first_name),
        last_name = coalesce(nullif(excluded.last_name, ''), contacts.last_name),
        company = coalesce(nullif(excluded.company, ''), contacts.company),
        title = coalesce(nullif(excluded.title, ''), contacts.title),
        lists = (select array(select distinct unnest(contacts.lists || excluded.lists)))
      returning (xmax = 0) as inserted`;
    if (row.inserted) out.added++;
    else out.updated++;
  }
  return out;
}

export async function setContactStatus(contactId: number, status: 'active' | 'unsubscribed', sendId: number | null = null) {
  await dripReady();
  if (status === 'unsubscribed') {
    await db()`update contacts set status = 'unsubscribed', unsubscribed_at = coalesce(unsubscribed_at, now()), unsub_send_id = coalesce(unsub_send_id, ${sendId}) where id = ${contactId}`;
    await db()`update enrollments set status = 'exited', exit_reason = 'unsubscribed' where contact_id = ${contactId} and status = 'active'`;
  } else {
    await db()`update contacts set status = 'active', unsubscribed_at = null where id = ${contactId} and status = 'unsubscribed'`;
  }
}

/** Enrolls active contacts (all, or one list) in a sequence. Already-enrolled contacts are left alone. */
export async function enroll(sequenceId: number, opts: { list: string; skipPutForward: boolean }): Promise<number> {
  await dripReady();
  const s = db();
  const first = await nextStep(sequenceId, 0);
  if (!first) return 0;
  const rows = await s`
    insert into enrollments (contact_id, sequence_id, next_position, next_send_at)
    select c.id, ${sequenceId}, ${first}, ${dueAt(sequenceId, first)}
    from contacts c
    where c.status = 'active'
      ${opts.list ? s`and ${opts.list} = any(c.lists)` : s``}
      ${opts.skipPutForward ? s`and not exists (select 1 from submissions sub where lower(sub.email) = lower(c.email) and sub.outcome = 'ok')` : s``}
    on conflict (contact_id, sequence_id) do nothing
    returning id`;
  return rows.length;
}

// ---------- sending ----------

export type RunResult = { sent: number; failed: number; exited: number; completed: number; blocked?: string };

/**
 * Sends every step that's due. Each (enrollment, step) is claimed by a row in drip_sends before it
 * goes out, so a run can never send the same step twice; failures are released to retry next run.
 */
export async function runDue(limit = 1000): Promise<RunResult> {
  await loadSettings();
  if (!canSend()) return { sent: 0, failed: 0, exited: 0, completed: 0, blocked: !resendKey() ? 'No Resend key is set.' : 'Set DRIP_POSTAL_ADDRESS first: every marketing email must show one.' };
  await dripReady();
  const s = db();
  const out: RunResult = { sent: 0, failed: 0, exited: 0, completed: 0 };

  const due = await s<Record<string, unknown>[]>`
    select e.id as enrollment_id, e.sequence_id, e.next_position, c.id as contact_id, c.email, c.first_name, c.last_name, c.company, c.title, c.status as contact_status,
      st.id as step_id, st.subject, st.preheader, st.body, st.cta_label, st.cta_url,
      exists (select 1 from submissions sub where lower(sub.email) = lower(c.email) and sub.outcome = 'ok') as put_forward
    from enrollments e
    join contacts c on c.id = e.contact_id
    join sequences q on q.id = e.sequence_id
    left join steps st on st.sequence_id = e.sequence_id and st.position = e.next_position
    where e.status = 'active' and q.status = 'active' and e.next_send_at <= now()
    order by e.next_send_at
    limit ${limit}`;

  type Job = { sendId: number; enrollmentId: number; step: Step; person: Person; contactId: number };
  const jobs: Job[] = [];
  for (const r of due) {
    const enrollmentId = Number(r.enrollmentId);
    if (r.contactStatus !== 'active') {
      await s`update enrollments set status = 'exited', exit_reason = ${String(r.contactStatus)} where id = ${enrollmentId}`;
      out.exited++;
      continue;
    }
    if (r.putForward) {
      await s`update enrollments set status = 'exited', exit_reason = 'put_forward' where id = ${enrollmentId}`;
      out.exited++;
      continue;
    }
    if (!r.stepId) {
      await s`update enrollments set status = 'completed' where id = ${enrollmentId}`;
      out.completed++;
      continue;
    }
    const step: Step = {
      id: Number(r.stepId), sequenceId: Number(r.sequenceId), position: Number(r.nextPosition), delayDays: 0,
      subject: String(r.subject), preheader: String(r.preheader), body: String(r.body), cta_label: String(r.ctaLabel), cta_url: String(r.ctaUrl),
    };
    const [claim] = await s<{ id: string }[]>`
      insert into drip_sends (enrollment_id, contact_id, sequence_id, step_id, position, email)
      values (${enrollmentId}, ${Number(r.contactId)}, ${step.sequenceId}, ${step.id}, ${step.position}, ${String(r.email)})
      on conflict (enrollment_id, step_id) do nothing returning id`;
    if (!claim) continue;
    jobs.push({
      sendId: Number(claim.id), enrollmentId, step, contactId: Number(r.contactId),
      person: { email: String(r.email), first_name: String(r.firstName), last_name: String(r.lastName), company: String(r.company), title: String(r.title) },
    });
  }

  for (let i = 0; i < jobs.length; i += 100) {
    const batch = jobs.slice(i, i + 100);
    try {
      const res = await resend('/emails/batch', batch.map((j) => message(j.step, j.person, j.contactId, j.sendId)), `drip-batch/${batch[0].sendId}-${batch[batch.length - 1].sendId}`);
      const ids = res.data ?? [];
      for (const [k, j] of batch.entries()) {
        await s`update drip_sends set status = 'sent', resend_id = ${ids[k]?.id ?? null}, sent_at = now() where id = ${j.sendId}`;
        const next = await nextStep(j.step.sequenceId, j.step.position);
        if (next) await s`update enrollments set next_position = ${next}, next_send_at = ${dueAt(j.step.sequenceId, next)}, last_error = null where id = ${j.enrollmentId}`;
        else {
          await s`update enrollments set status = 'completed', last_error = null where id = ${j.enrollmentId}`;
          out.completed++;
        }
        out.sent++;
      }
    } catch (err) {
      const msg = (err as Error).message.slice(0, 300);
      for (const j of batch) {
        await s`delete from drip_sends where id = ${j.sendId}`;
        await s`update enrollments set last_error = ${msg} where id = ${j.enrollmentId}`;
      }
      out.failed += batch.length;
      console.error('[drip] batch failed', msg);
    }
  }
  return out;
}

/** Sends one step to any address, marked [Test], with sample merge data. Doesn't touch enrollments. */
export async function sendTest(stepId: number, to: string) {
  await loadSettings();
  if (!resendKey()) throw new Error('No Resend key is set.');
  await dripReady();
  const [r] = await db()<Record<string, unknown>[]>`select * from steps where id = ${stepId}`;
  if (!r) throw new Error('That step is gone.');
  const step: Step = {
    id: Number(r.id), sequenceId: Number(r.sequenceId), position: Number(r.position), delayDays: Number(r.delayDays),
    subject: String(r.subject), preheader: String(r.preheader), body: String(r.body), cta_label: String(r.ctaLabel), cta_url: String(r.ctaUrl),
  };
  await resend('/emails', message(step, { ...SAMPLE, email: to }, 0, null, true));
}

// ---------- events from Resend ----------

const COLUMN: Record<string, string> = {
  'email.delivered': 'delivered_at',
  'email.opened': 'opened_at',
  'email.clicked': 'clicked_at',
  'email.bounced': 'bounced_at',
  'email.complained': 'complained_at',
};

/** Records a webhook event against its send; a bounce or complaint stops the contact everywhere. */
export async function recordEvent(type: string, emailId: string, url: string | null) {
  await dripReady();
  const s = db();
  const [send] = await s<{ id: string; contactId: string }[]>`select id, contact_id from drip_sends where resend_id = ${emailId}`;
  if (!send) return false;
  await s`insert into drip_events (send_id, type, url) values (${Number(send.id)}, ${type}, ${url})`;
  const col = COLUMN[type];
  if (col) await s`update drip_sends set ${s(col)} = coalesce(${s(col)}, now()) where id = ${Number(send.id)}`;
  if (type === 'email.bounced' || type === 'email.complained') {
    const status = type === 'email.bounced' ? 'bounced' : 'complained';
    await s`update contacts set status = ${status} where id = ${Number(send.contactId)} and status = 'active'`;
    await s`update enrollments set status = 'exited', exit_reason = ${status} where contact_id = ${Number(send.contactId)} and status = 'active'`;
  }
  return true;
}

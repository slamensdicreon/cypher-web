import { NextResponse } from 'next/server';
import { audit } from '@/lib/audit';
import { apiUser } from '@/lib/auth/request';
import { OUTCOMES } from '@/lib/config';
import {
  addActivity,
  addTask,
  createCompany,
  createDeal,
  deal,
  deleteTask,
  moveDeal,
  setTaskDone,
  stages,
  updateCompany,
  updateContact,
  updateDeal,
  upsertContact,
} from '@/lib/crm/data';
import { emailContact } from '@/lib/crm/mail';

export const runtime = 'nodejs';

/** A date and time as typed in the admin, read as Eastern time (the server runs on UTC). */
function eastern(day: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const asUtc = new Date(`${day}T${time}:00Z`);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(asUtc)
      .map((p) => [p.type, p.value]),
  );
  const shown = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return new Date(asUtc.getTime() + (asUtc.getTime() - shown)).toISOString();
}
export const dynamic = 'force-dynamic';

/**
 * Every change in the CRM posts here. Forms get a redirect back with a message; the pipeline board
 * (which moves cards with fetch) gets JSON. Each change goes on the record's timeline and in the audit log.
 */
export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const s = await apiUser('crm', 'write');
  if (!s) return new Response('Not found', { status: 404 });
  const { action } = await params;
  const json = (req.headers.get('content-type') || '').includes('application/json');
  const body: Record<string, unknown> = json ? await req.json().catch(() => ({})) : Object.fromEntries(await req.formData().catch(() => new FormData()));
  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '');
  const num = (k: string) => (str(k) && Number.isFinite(Number(str(k))) ? Number(str(k)) : null);
  const money = (k: string) => {
    const v = str(k).replace(/[$,\s]/g, '');
    return v && Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : null;
  };
  const backRaw = str('back');
  const back = /^\/admin\/crm(\/[\w/-]*)?(\?[\w=&%.-]*)?$/.test(backRaw) ? backRaw : '/admin/crm';
  const done = (msg: string, to = back, hash = '') => {
    if (json) return NextResponse.json({ ok: !msg.startsWith('That didn’t work'), msg });
    const u = new URL(to, req.url);
    u.searchParams.set('msg', msg);
    return NextResponse.redirect(new URL(u.pathname + u.search + hash, req.url), 303);
  };
  const log = (summary: string, entity: string, entityId: number | string, before?: unknown, after?: unknown) =>
    audit(s, { action: `crm.${action}`, entity, entityId, summary, before, after }, req.headers);
  // Forms send repeated fields (outcomes) as one value per field; read them all.
  const outcomesFrom = async () => {
    const raw = json ? (Array.isArray(body.outcomes) ? body.outcomes : []) : [];
    return OUTCOMES.filter((o) => raw.includes(o) || str(`outcome_${o}`) === 'on');
  };

  try {
    switch (action) {
      case 'create-deal': {
        let companyId = num('company_id');
        if (!companyId) {
          const name = str('company_name');
          if (!name && !str('domain')) return done('That didn’t work: give the company a name.');
          companyId = await createCompany(s, { name: name || str('domain'), domain: str('domain') });
        }
        const contactId = str('contact_email') ? await upsertContact({ email: str('contact_email'), firstName: str('first_name'), lastName: str('last_name'), title: str('title'), companyId, source: 'admin' }) : num('contact_id');
        const outcomes = await outcomesFrom();
        const title = str('title') || `${str('company_name') || 'New deal'} · ${outcomes.join(', ') || 'See it on your site'}`;
        const all = await stages();
        const stage = all.some((x) => x.id === str('stage')) ? str('stage') : 'new';
        const id = await createDeal(s, { title, companyId, contactId, stage, value: money('value'), expectedClose: str('expected_close') || null, ownerId: num('owner_id') ?? s.user.id, outcomes, source: 'admin' });
        await log(`Opened deal “${title}”`, 'deal', id);
        return done('Deal opened.', `/admin/crm/deals/${id}`);
      }
      case 'update-deal': {
        const id = num('id')!;
        const cur = await updateDeal(id, {
          title: str('title') || undefined,
          value: 'value' in body ? money('value') : undefined,
          expectedClose: 'expected_close' in body ? str('expected_close') || null : undefined,
          ownerId: 'owner_id' in body ? num('owner_id') : undefined,
          outcomes: 'outcomes_present' in body ? await outcomesFrom() : undefined,
          nextStep: 'next_step' in body ? str('next_step') : undefined,
          nextStepAt: 'next_step_at' in body ? str('next_step_at') || null : undefined,
          contactId: 'contact_id' in body ? num('contact_id') : undefined,
        });
        const after = await deal(id);
        await log(`Updated deal “${after?.title}”`, 'deal', id, { title: cur.title, value: cur.value, ownerId: cur.ownerId, nextStep: cur.nextStep }, { title: after?.title, value: after?.value, ownerId: after?.ownerId, nextStep: after?.nextStep });
        return done('Saved.');
      }
      case 'move-deal': {
        const id = num('id')!;
        const r = await moveDeal(s, id, str('stage'), str('lost_reason'));
        if (!r) return done('No change.');
        await log(`Moved deal ${id}: ${r.from} → ${r.to}`, 'deal', id, { stage: r.from }, { stage: r.to });
        return done('Moved.');
      }
      case 'add-activity': {
        const kind = ['note', 'call', 'meeting'].includes(str('kind')) ? str('kind') : 'note';
        if (!str('body') && !str('subject')) return done('That didn’t work: write something first.');
        await addActivity(s, { kind, subject: str('subject'), body: str('body'), dealId: num('deal_id'), companyId: num('company_id'), contactId: num('contact_id') });
        await log(`Logged a ${kind}`, num('deal_id') ? 'deal' : num('company_id') ? 'company' : 'contact', num('deal_id') ?? num('company_id') ?? num('contact_id') ?? '');
        return done(`${kind[0].toUpperCase() + kind.slice(1)} logged.`);
      }
      case 'add-task': {
        if (!str('title')) return done('That didn’t work: the task needs a title.');
        const due = str('due') ? eastern(str('due'), str('due_time') || '09:00') : null;
        const id = await addTask(s, { title: str('title'), notes: str('notes'), dueAt: due, ownerId: num('owner_id') ?? s.user.id, dealId: num('deal_id'), companyId: num('company_id'), contactId: num('contact_id') });
        await log(`Added task “${str('title')}”`, 'task', id);
        return done('Task added.');
      }
      case 'task-done':
      case 'task-reopen': {
        const id = num('id')!;
        await setTaskDone(s, id, action === 'task-done');
        await log(action === 'task-done' ? 'Finished a task' : 'Reopened a task', 'task', id);
        return done(action === 'task-done' ? 'Done.' : 'Reopened.');
      }
      case 'task-delete': {
        await deleteTask(num('id')!);
        await log('Deleted a task', 'task', num('id')!);
        return done('Task deleted.');
      }
      case 'create-company': {
        if (!str('name')) return done('That didn’t work: give the company a name.');
        const id = await createCompany(s, { name: str('name'), domain: str('domain'), website: str('website'), platform: str('platform'), size: str('size'), industry: str('industry') });
        await log(`Added company “${str('name')}”`, 'company', id);
        return done('Company added.', `/admin/crm/companies/${id}`);
      }
      case 'update-company': {
        const id = num('id')!;
        await updateCompany(id, { name: str('name'), domain: str('domain'), website: str('website'), platform: str('platform'), size: str('size'), industry: str('industry'), notes: str('notes'), ownerId: 'owner_id' in body ? num('owner_id') : undefined });
        await log(`Updated company ${str('name')}`, 'company', id);
        return done('Saved.');
      }
      case 'create-contact': {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(str('email'))) return done('That didn’t work: that isn’t an email address.');
        const id = await upsertContact({ email: str('email'), firstName: str('first_name'), lastName: str('last_name'), title: str('title'), phone: str('phone'), linkedin: str('linkedin'), companyId: num('company_id'), source: 'admin' });
        await log(`Added contact ${str('email')}`, 'contact', id);
        return done('Contact saved.', back === '/admin/crm' ? `/admin/crm/contacts/${id}` : back);
      }
      case 'update-contact': {
        const id = num('id')!;
        await updateContact(id, { firstName: str('first_name'), lastName: str('last_name'), title: str('title'), phone: str('phone'), linkedin: str('linkedin'), ownerId: 'owner_id' in body ? num('owner_id') : undefined });
        await log('Updated a contact', 'contact', id);
        return done('Saved.');
      }
      case 'email-contact': {
        const contactId = num('contact_id')!;
        if (!str('subject') || !str('body')) return done('That didn’t work: write a subject and a message.');
        const r = await emailContact(s, { contactId, dealId: num('deal_id'), subject: str('subject'), body: str('body') });
        await log(`Emailed ${r.to}: ${str('subject')}`, 'contact', contactId);
        return done(`Sent to ${r.to}. Replies go to ${s.user.email}.`);
      }
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    console.error('[crm]', action, err);
    return done(`That didn’t work: ${(err as Error).message.slice(0, 200)}`);
  }
}

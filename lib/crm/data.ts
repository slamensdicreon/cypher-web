import 'server-only';
import { ROLES, can } from '../auth/roles';
import type { Session } from '../auth/session';
import { loadSettings, setting } from '../settings';
import { migrate, sql } from '../store';
import { scoreLead } from './score';

/**
 * The CRM: companies, contacts (shared with email marketing), deals moving through the pipeline,
 * and one timeline per record built from activities, form submissions and emails.
 */

const db = () => {
  if (!sql) throw new Error('No database is connected.');
  return sql;
};

export type StageKind = 'open' | 'won' | 'lost' | 'nurture';
export type Stage = { id: string; label: string; position: number; kind: StageKind };

export type DealRow = {
  id: number;
  title: string;
  stage: string;
  value: number | null;
  expectedClose: string | null;
  ownerId: number | null;
  ownerName: string | null;
  companyId: number | null;
  companyName: string | null;
  companyDomain: string | null;
  contactId: number | null;
  contactName: string | null;
  contactEmail: string | null;
  outcomes: string[];
  level: number | null;
  source: string;
  nextStep: string;
  nextStepAt: string | null;
  lostReason: string;
  score: number;
  scoreReasons: string[];
  createdAt: Date;
  updatedAt: Date;
  stageChangedAt: Date;
  closedAt: Date | null;
  openTasks: number;
};

export type Company = {
  id: number;
  name: string;
  domain: string;
  website: string;
  size: string;
  industry: string;
  platform: string;
  notes: string;
  ownerId: number | null;
  ownerName: string | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  contacts: number;
  deals: number;
  openDeals: number;
};

export type Contact = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
  linkedin: string;
  companyId: number | null;
  companyName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  status: string;
  source: string;
  lists: string[];
  createdAt: Date;
};

export type Activity = {
  id: string;
  at: Date;
  kind: string;
  actor: string;
  subject: string;
  body: string;
  dealId: number | null;
  dealTitle: string | null;
  contactName: string | null;
};

export type Task = {
  id: number;
  title: string;
  notes: string;
  dueAt: Date | null;
  doneAt: Date | null;
  ownerId: number | null;
  ownerName: string | null;
  dealId: number | null;
  dealTitle: string | null;
  companyId: number | null;
  companyName: string | null;
  contactId: number | null;
  contactName: string | null;
};

export const fullName = (c: { firstName?: string | null; lastName?: string | null; email?: string | null }) =>
  [c.firstName, c.lastName].filter(Boolean).join(' ') || c.email || '';

/** The owner's display name, as a fresh SQL fragment each time (fragments aren't reused across queries). */
const ownerName = () => db()`coalesce(nullif(o.name, ''), o.email)`;

// ---------------------------------------------------------------- reading

export async function stages(): Promise<Stage[]> {
  await migrate();
  return db()<Stage[]>`select id, label, position, kind from pipeline_stages order by position`;
}

const DEAL_SELECT = () => db()`
  select d.id::int as id, d.title, d.stage, d.value::float as value, to_char(d.expected_close, 'YYYY-MM-DD') as expected_close,
         d.owner_id::int as owner_id, ${ownerName()} as owner_name,
         d.company_id::int as company_id, co.name as company_name, co.domain as company_domain,
         d.primary_contact_id::int as contact_id,
         nullif(trim(coalesce(ct.first_name, '') || ' ' || coalesce(ct.last_name, '')), '') as contact_name, ct.email as contact_email,
         d.outcomes, d.level, d.source, d.next_step, to_char(d.next_step_at, 'YYYY-MM-DD') as next_step_at, d.lost_reason,
         d.score, d.score_reasons, d.created_at, d.updated_at, d.stage_changed_at, d.closed_at,
         (select count(*)::int from tasks t where t.deal_id = d.id and t.done_at is null) as open_tasks
  from deals d
  left join companies co on co.id = d.company_id
  left join contacts ct on ct.id = d.primary_contact_id
  left join users o on o.id = d.owner_id`;

/** Every deal, newest activity first. Closed deals are included; the board decides what to show. */
export async function pipeline(opts: { ownerId?: number; q?: string } = {}): Promise<DealRow[]> {
  await migrate();
  const q = (opts.q || '').trim();
  return db()<DealRow[]>`
    ${DEAL_SELECT()}
    where true
      ${opts.ownerId ? db()`and d.owner_id = ${opts.ownerId}` : db()``}
      ${q ? db()`and (d.title ilike ${'%' + q + '%'} or co.name ilike ${'%' + q + '%'} or co.domain ilike ${'%' + q + '%'} or ct.email ilike ${'%' + q + '%'})` : db()``}
    order by d.score desc, d.updated_at desc
    limit 1000`;
}

export async function deal(id: number): Promise<DealRow | null> {
  await migrate();
  const [r] = await db()<DealRow[]>`${DEAL_SELECT()} where d.id = ${id}`;
  return r ?? null;
}

export async function dealsFor(opts: { companyId?: number; contactId?: number }): Promise<DealRow[]> {
  await migrate();
  return db()<DealRow[]>`
    ${DEAL_SELECT()}
    where ${opts.companyId ? db()`d.company_id = ${opts.companyId}` : db()`(d.primary_contact_id = ${opts.contactId!} or exists (select 1 from deal_contacts dc where dc.deal_id = d.id and dc.contact_id = ${opts.contactId!}))`}
    order by d.updated_at desc`;
}

export async function companies(opts: { q?: string; limit?: number } = {}): Promise<Company[]> {
  await migrate();
  const q = (opts.q || '').trim();
  return db()<Company[]>`
    select c.id::int as id, c.name, c.domain, c.website, c.size, c.industry, c.platform, c.notes,
           c.owner_id::int as owner_id, ${ownerName()} as owner_name, c.source, c.created_at, c.updated_at,
           (select count(*)::int from contacts x where x.company_id = c.id) as contacts,
           (select count(*)::int from deals x where x.company_id = c.id) as deals,
           (select count(*)::int from deals x join pipeline_stages s on s.id = x.stage where x.company_id = c.id and s.kind = 'open') as open_deals
    from companies c left join users o on o.id = c.owner_id
    where true ${q ? db()`and (c.name ilike ${'%' + q + '%'} or c.domain ilike ${'%' + q + '%'} or c.platform ilike ${'%' + q + '%'})` : db()``}
    order by open_deals desc, c.updated_at desc
    limit ${Math.min(opts.limit ?? 300, 2000)}`;
}

export async function company(id: number): Promise<Company | null> {
  const [r] = await db()<Company[]>`
    select c.id::int as id, c.name, c.domain, c.website, c.size, c.industry, c.platform, c.notes,
           c.owner_id::int as owner_id, ${ownerName()} as owner_name, c.source, c.created_at, c.updated_at,
           (select count(*)::int from contacts x where x.company_id = c.id) as contacts,
           (select count(*)::int from deals x where x.company_id = c.id) as deals,
           (select count(*)::int from deals x join pipeline_stages s on s.id = x.stage where x.company_id = c.id and s.kind = 'open') as open_deals
    from companies c left join users o on o.id = c.owner_id where c.id = ${id}`;
  return r ?? null;
}

const CONTACT_SELECT = () => db()`
  select c.id::int as id, c.email, c.first_name, c.last_name, c.title, c.phone, c.linkedin,
         c.company_id::int as company_id, co.name as company_name, c.owner_id::int as owner_id, ${ownerName()} as owner_name,
         c.status, c.source, c.lists, c.created_at
  from contacts c left join companies co on co.id = c.company_id left join users o on o.id = c.owner_id`;

export async function contacts(opts: { q?: string; companyId?: number; limit?: number } = {}): Promise<Contact[]> {
  await migrate();
  const q = (opts.q || '').trim();
  return db()<Contact[]>`
    ${CONTACT_SELECT()}
    where true
      ${opts.companyId ? db()`and c.company_id = ${opts.companyId}` : db()``}
      ${q ? db()`and (c.email ilike ${'%' + q + '%'} or c.first_name ilike ${'%' + q + '%'} or c.last_name ilike ${'%' + q + '%'} or co.name ilike ${'%' + q + '%'} or c.title ilike ${'%' + q + '%'})` : db()``}
    order by c.created_at desc
    limit ${Math.min(opts.limit ?? 300, 2000)}`;
}

export async function contact(id: number): Promise<Contact | null> {
  const [r] = await db()<Contact[]>`${CONTACT_SELECT()} where c.id = ${id}`;
  return r ?? null;
}

/** One timeline for a deal, company or contact: activities, plus marketing emails sent to its contacts. */
export async function timeline(opts: { dealId?: number; companyId?: number; contactId?: number }): Promise<Activity[]> {
  await migrate();
  const where = opts.dealId
    ? db()`a.deal_id = ${opts.dealId}`
    : opts.companyId
      ? db()`a.company_id = ${opts.companyId}`
      : db()`a.contact_id = ${opts.contactId!}`;
  const contactIds = opts.contactId
    ? db()`select ${opts.contactId}::bigint`
    : opts.companyId
      ? db()`select id from contacts where company_id = ${opts.companyId}`
      : db()`select primary_contact_id from deals where id = ${opts.dealId!} union select contact_id from deal_contacts where deal_id = ${opts.dealId!}`;
  return db()<Activity[]>`
    select 'a' || a.id as id, a.at, a.kind, a.actor, a.subject, a.body, a.deal_id::int as deal_id, d.title as deal_title,
           nullif(trim(coalesce(ct.first_name, '') || ' ' || coalesce(ct.last_name, '')), '') as contact_name
    from activities a left join deals d on d.id = a.deal_id left join contacts ct on ct.id = a.contact_id
    where ${where}
    union all
    select 'e' || s.id, coalesce(s.sent_at, s.created_at), 'campaign', 'Email sequence',
           coalesce(st.subject, 'Sequence email'),
           concat_ws(' · ', q.name, case when s.clicked_at is not null then 'clicked' when s.opened_at is not null then 'opened' when s.delivered_at is not null then 'delivered' else s.status end),
           null::int, null::text, nullif(trim(coalesce(ct.first_name, '') || ' ' || coalesce(ct.last_name, '')), '')
    from drip_sends s left join steps st on st.id = s.step_id left join sequences q on q.id = s.sequence_id
    left join contacts ct on ct.id = s.contact_id
    where s.contact_id in (${contactIds}) and s.status in ('sent', 'delivered')
    order by at desc
    limit 300`;
}

export async function tasks(opts: { ownerId?: number; scope?: 'open' | 'overdue' | 'done' | 'all'; dealId?: number; companyId?: number; contactId?: number } = {}): Promise<Task[]> {
  await migrate();
  const scope = opts.scope ?? 'open';
  return db()<Task[]>`
    select t.id::int as id, t.title, t.notes, t.due_at, t.done_at, t.owner_id::int as owner_id, ${ownerName()} as owner_name,
           t.deal_id::int as deal_id, d.title as deal_title, coalesce(t.company_id, d.company_id)::int as company_id, co.name as company_name,
           t.contact_id::int as contact_id, nullif(trim(coalesce(ct.first_name, '') || ' ' || coalesce(ct.last_name, '')), '') as contact_name
    from tasks t
    left join deals d on d.id = t.deal_id
    left join companies co on co.id = coalesce(t.company_id, d.company_id)
    left join contacts ct on ct.id = t.contact_id
    left join users o on o.id = t.owner_id
    where true
      ${opts.ownerId ? db()`and t.owner_id = ${opts.ownerId}` : db()``}
      ${opts.dealId ? db()`and t.deal_id = ${opts.dealId}` : db()``}
      ${opts.companyId ? db()`and (t.company_id = ${opts.companyId} or d.company_id = ${opts.companyId})` : db()``}
      ${opts.contactId ? db()`and t.contact_id = ${opts.contactId}` : db()``}
      ${scope === 'open' ? db()`and t.done_at is null` : scope === 'overdue' ? db()`and t.done_at is null and t.due_at < now()` : scope === 'done' ? db()`and t.done_at is not null` : db()``}
    order by (t.done_at is null) desc, t.due_at asc nulls last, t.created_at desc
    limit 500`;
}

export async function owners(): Promise<{ id: number; name: string }[]> {
  await migrate();
  return db()<{ id: number; name: string }[]>`
    select id::int as id, coalesce(nullif(name, ''), email) as name from users where status = 'active' order by 2`;
}

// ---------------------------------------------------------------- changing

const actorOf = (s: Session | null) => (s ? s.user.name || s.user.email : 'Website');

export async function addActivity(
  s: Session | null,
  a: { kind: string; subject?: string; body?: string; dealId?: number | null; companyId?: number | null; contactId?: number | null; meta?: Record<string, unknown>; at?: Date },
): Promise<void> {
  // A deal's activity belongs to its company too, so the company timeline shows everything.
  let companyId = a.companyId ?? null;
  if (!companyId && a.dealId) [{ companyId }] = await db()<{ companyId: number | null }[]>`select company_id::int as company_id from deals where id = ${a.dealId}`;
  if (!companyId && a.contactId) [{ companyId }] = await db()<{ companyId: number | null }[]>`select company_id::int as company_id from contacts where id = ${a.contactId}`;
  await db()`
    insert into activities (at, kind, user_id, actor, company_id, contact_id, deal_id, subject, body, meta)
    values (${a.at ?? new Date()}, ${a.kind}, ${s?.user.id ?? null}, ${actorOf(s)}, ${companyId}, ${a.contactId ?? null}, ${a.dealId ?? null},
            ${(a.subject ?? '').slice(0, 300)}, ${(a.body ?? '').slice(0, 10000)}, ${db().json((a.meta ?? {}) as never)})`;
}

export async function createCompany(s: Session, v: { name: string; domain?: string; website?: string; platform?: string; size?: string; industry?: string }): Promise<number> {
  await migrate();
  const domain = (v.domain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  if (domain) {
    const [ex] = await db()<{ id: number }[]>`select id::int as id from companies where lower(domain) = ${domain}`;
    if (ex) return ex.id;
  }
  const [r] = await db()<{ id: number }[]>`
    insert into companies (name, domain, website, platform, size, industry, owner_id, source)
    values (${v.name.trim().slice(0, 120)}, ${domain}, ${(v.website || '').trim().slice(0, 200)}, ${(v.platform || '').trim().slice(0, 60)},
            ${(v.size || '').trim().slice(0, 40)}, ${(v.industry || '').trim().slice(0, 80)}, ${s.user.id}, 'admin')
    returning id::int as id`;
  await addActivity(s, { kind: 'system', subject: 'Company added', companyId: r.id });
  return r.id;
}

const COMPANY_FIELDS = ['name', 'domain', 'website', 'platform', 'size', 'industry', 'notes'] as const;
export async function updateCompany(id: number, v: Partial<Record<(typeof COMPANY_FIELDS)[number], string>> & { ownerId?: number | null }): Promise<void> {
  const cur = await company(id);
  if (!cur) throw new Error('no such company');
  const next = { ...cur, ...Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined)) } as Company;
  await db()`
    update companies set name = ${next.name.trim().slice(0, 120) || cur.name}, domain = ${next.domain.trim().toLowerCase().slice(0, 120)},
      website = ${next.website.slice(0, 200)}, platform = ${next.platform.slice(0, 60)}, size = ${next.size.slice(0, 40)},
      industry = ${next.industry.slice(0, 80)}, notes = ${next.notes.slice(0, 5000)},
      owner_id = ${v.ownerId === undefined ? cur.ownerId : v.ownerId}, updated_at = now()
    where id = ${id}`;
}

/** Adds a contact, or returns the existing one with that email (filling in what was blank). */
export async function upsertContact(
  v: { email: string; firstName?: string; lastName?: string; title?: string; phone?: string; linkedin?: string; companyId?: number | null; source?: string; company?: string },
): Promise<number> {
  await migrate();
  const email = v.email.trim().toLowerCase().slice(0, 254);
  // Without a company, they join the one that has their email's domain, if there is one.
  let companyId = v.companyId ?? null;
  if (!companyId) {
    const [m] = await db()<{ id: number }[]>`select id::int as id from companies where domain <> '' and lower(domain) = ${email.split('@')[1] ?? ''} limit 1`;
    companyId = m?.id ?? null;
  }
  const [r] = await db()<{ id: number }[]>`
    insert into contacts (email, first_name, last_name, title, phone, linkedin, company_id, source, company)
    values (${email}, ${(v.firstName || '').slice(0, 80)}, ${(v.lastName || '').slice(0, 80)}, ${(v.title || '').slice(0, 120)},
            ${(v.phone || '').slice(0, 40)}, ${(v.linkedin || '').slice(0, 200)}, ${companyId}, ${(v.source || '').slice(0, 40)}, ${(v.company || '').slice(0, 120)})
    on conflict ((lower(email))) do update set
      first_name = case when contacts.first_name = '' then excluded.first_name else contacts.first_name end,
      last_name = case when contacts.last_name = '' then excluded.last_name else contacts.last_name end,
      title = case when contacts.title = '' then excluded.title else contacts.title end,
      phone = case when contacts.phone = '' then excluded.phone else contacts.phone end,
      linkedin = case when contacts.linkedin = '' then excluded.linkedin else contacts.linkedin end,
      company_id = coalesce(contacts.company_id, excluded.company_id),
      source = case when contacts.source = '' then excluded.source else contacts.source end,
      updated_at = now()
    returning id::int as id`;
  return r.id;
}

const CONTACT_FIELDS = ['firstName', 'lastName', 'title', 'phone', 'linkedin'] as const;
export async function updateContact(id: number, v: Partial<Record<(typeof CONTACT_FIELDS)[number], string>> & { companyId?: number | null; ownerId?: number | null }): Promise<void> {
  const cur = await contact(id);
  if (!cur) throw new Error('no such contact');
  const pick = (k: (typeof CONTACT_FIELDS)[number], max: number) => (v[k] ?? cur[k]).trim().slice(0, max);
  await db()`
    update contacts set first_name = ${pick('firstName', 80)}, last_name = ${pick('lastName', 80)}, title = ${pick('title', 120)},
      phone = ${pick('phone', 40)}, linkedin = ${pick('linkedin', 200)},
      company_id = ${v.companyId === undefined ? cur.companyId : v.companyId},
      owner_id = ${v.ownerId === undefined ? cur.ownerId : v.ownerId}, updated_at = now()
    where id = ${id}`;
}

export async function createDeal(
  s: Session | null,
  v: { title: string; companyId: number | null; contactId?: number | null; stage?: string; value?: number | null; expectedClose?: string | null; ownerId?: number | null; outcomes?: string[]; level?: number | null; source?: string; submissionId?: number | null },
): Promise<number> {
  await migrate();
  const [r] = await db()<{ id: number }[]>`
    insert into deals (title, company_id, primary_contact_id, stage, value, expected_close, owner_id, outcomes, level, source, submission_id)
    values (${v.title.trim().slice(0, 160)}, ${v.companyId}, ${v.contactId ?? null}, ${v.stage ?? 'new'}, ${v.value ?? null},
            ${v.expectedClose || null}, ${v.ownerId ?? null}, ${v.outcomes ?? []}, ${v.level ?? null}, ${(v.source ?? '').slice(0, 40)}, ${v.submissionId ?? null})
    returning id::int as id`;
  if (v.contactId) await db()`insert into deal_contacts (deal_id, contact_id) values (${r.id}, ${v.contactId}) on conflict do nothing`;
  await addActivity(s, { kind: 'system', subject: 'Deal opened', dealId: r.id, contactId: v.contactId ?? null });
  await rescore(r.id);
  return r.id;
}

export async function updateDeal(
  id: number,
  v: { title?: string; value?: number | null; expectedClose?: string | null; ownerId?: number | null; outcomes?: string[]; nextStep?: string; nextStepAt?: string | null; contactId?: number | null },
): Promise<DealRow> {
  const cur = await deal(id);
  if (!cur) throw new Error('no such deal');
  await db()`
    update deals set
      title = ${(v.title ?? cur.title).trim().slice(0, 160) || cur.title},
      value = ${v.value === undefined ? cur.value : v.value},
      expected_close = ${v.expectedClose === undefined ? cur.expectedClose : v.expectedClose || null},
      owner_id = ${v.ownerId === undefined ? cur.ownerId : v.ownerId},
      outcomes = ${v.outcomes ?? cur.outcomes},
      next_step = ${(v.nextStep ?? cur.nextStep).slice(0, 300)},
      next_step_at = ${v.nextStepAt === undefined ? cur.nextStepAt : v.nextStepAt || null},
      primary_contact_id = ${v.contactId === undefined ? cur.contactId : v.contactId},
      updated_at = now()
    where id = ${id}`;
  if (v.contactId) await db()`insert into deal_contacts (deal_id, contact_id) values (${id}, ${v.contactId}) on conflict do nothing`;
  return cur;
}

/** Moves a deal to another stage, with the reason when it's lost; records it on the timeline. */
export async function moveDeal(s: Session, id: number, stage: string, lostReason = ''): Promise<{ from: string; to: string } | null> {
  const cur = await deal(id);
  if (!cur || cur.stage === stage) return null;
  const all = await stages();
  const to = all.find((x) => x.id === stage);
  if (!to) throw new Error('no such stage');
  if (to.kind === 'lost' && !lostReason.trim()) throw new Error('say why it was lost');
  await db()`
    update deals set stage = ${stage}, stage_changed_at = now(), updated_at = now(),
      closed_at = ${to.kind === 'won' || to.kind === 'lost' ? db()`now()` : null},
      lost_reason = ${to.kind === 'lost' ? lostReason.trim().slice(0, 300) : ''}
    where id = ${id}`;
  const from = all.find((x) => x.id === cur.stage);
  await addActivity(s, { kind: 'stage', subject: `${from?.label ?? cur.stage} → ${to.label}`, body: to.kind === 'lost' ? lostReason.trim() : '', dealId: id, meta: { from: cur.stage, to: stage } });
  return { from: cur.stage, to: stage };
}

export async function addTask(s: Session, v: { title: string; notes?: string; dueAt?: string | null; ownerId?: number | null; dealId?: number | null; companyId?: number | null; contactId?: number | null }): Promise<number> {
  await migrate();
  const [r] = await db()<{ id: number }[]>`
    insert into tasks (title, notes, due_at, owner_id, created_by, deal_id, company_id, contact_id)
    values (${v.title.trim().slice(0, 200)}, ${(v.notes ?? '').slice(0, 2000)}, ${v.dueAt ? new Date(v.dueAt) : null},
            ${v.ownerId ?? s.user.id}, ${s.user.id}, ${v.dealId ?? null}, ${v.companyId ?? null}, ${v.contactId ?? null})
    returning id::int as id`;
  return r.id;
}

export async function setTaskDone(s: Session, id: number, done: boolean): Promise<boolean> {
  const [t] = await db()<{ title: string; dealId: number | null; companyId: number | null; contactId: number | null }[]>`
    update tasks set done_at = ${done ? db()`now()` : null} where id = ${id}
    returning title, deal_id::int as deal_id, company_id::int as company_id, contact_id::int as contact_id`;
  if (!t) return false;
  if (done) await addActivity(s, { kind: 'task', subject: `Done: ${t.title}`, dealId: t.dealId, companyId: t.companyId, contactId: t.contactId });
  return true;
}

export async function deleteTask(id: number): Promise<void> {
  await db()`delete from tasks where id = ${id}`;
}

// ---------------------------------------------------------------- leads from the site

export type LeadInput = { email: string; domain: string; company: string; site: string; wants: string; level: number; source: string; submissionId: number | null };

/**
 * Who gets a new website lead, from Settings: nobody, one person, or taking turns (the person with
 * the CRM write role whose last website lead is oldest goes next).
 */
export async function leadOwner(): Promise<number | null> {
  await loadSettings();
  const rule = setting('lead_owner');
  if (/^\d+$/.test(rule)) {
    const [u] = await db()<{ id: number }[]>`select id::int as id from users where id = ${Number(rule)} and status = 'active'`;
    return u?.id ?? null;
  }
  if (rule !== 'rotate') return null;
  const writers = ROLES.filter((r) => can([r], 'crm', 'write'));
  const [u] = await db()<{ id: number }[]>`
    select u.id::int as id from users u
    where u.status = 'active' and u.roles && ${writers as unknown as string[]}::text[]
    order by (select max(d.created_at) from deals d where d.owner_id = u.id and d.source <> 'admin') asc nulls first, u.id
    limit 1`;
  return u?.id ?? null;
}

/**
 * A company asked to see Cypher on its site: find or create the company and the contact, then open a
 * deal, or log the request on the company's open deal. Returns what it touched.
 */
export async function recordLead(l: LeadInput): Promise<{ companyId: number; contactId: number; dealId: number; created: boolean }> {
  await migrate();
  const domain = l.domain.toLowerCase();
  const [co] = await db()<{ id: number }[]>`
    insert into companies (name, domain, website, source) values (${l.company || domain}, ${domain}, ${l.site ? 'https://' + l.site.replace(/^https?:\/\//, '') : ''}, ${l.source})
    on conflict ((lower(domain))) where domain <> '' do update set
      website = case when companies.website = '' then excluded.website else companies.website end, updated_at = now()
    returning id::int as id`;
  const contactId = await upsertContact({ email: l.email, companyId: co.id, source: l.source, company: l.company });
  const outcomes = l.wants ? l.wants.split(', ').filter(Boolean) : [];
  const [open] = await db()<{ id: number }[]>`
    select d.id::int as id from deals d join pipeline_stages s on s.id = d.stage
    where d.company_id = ${co.id} and s.kind in ('open', 'nurture') order by d.updated_at desc limit 1`;
  let dealId: number;
  let created = false;
  const owner = await leadOwner();
  if (owner) await db()`update companies set owner_id = coalesce(owner_id, ${owner}) where id = ${co.id}`;
  if (open) {
    dealId = open.id;
    await db()`
      update deals set updated_at = now(), owner_id = coalesce(owner_id, ${owner}), level = greatest(coalesce(level, 0), ${l.level}),
        outcomes = (select coalesce(array_agg(distinct x), '{}') from unnest(outcomes || ${outcomes}::text[]) x),
        stage = case when stage = 'nurture' then 'new' else stage end
      where id = ${dealId}`;
    await db()`insert into deal_contacts (deal_id, contact_id) values (${dealId}, ${contactId}) on conflict do nothing`;
  } else {
    dealId = await createDeal(null, {
      title: `${l.company || domain} · ${l.wants || 'See it on your site'}`,
      companyId: co.id,
      contactId,
      outcomes,
      level: l.level,
      source: l.source,
      ownerId: owner,
      submissionId: l.submissionId,
    });
    created = true;
  }
  await addActivity(null, {
    kind: 'form',
    subject: 'Asked to see it on their site',
    body: [l.site, l.wants].filter(Boolean).join(' · '),
    dealId,
    companyId: co.id,
    contactId,
    meta: { submission_id: l.submissionId, source: l.source, site: l.site, wants: l.wants, level: l.level },
  });
  await rescore(dealId);
  return { companyId: co.id, contactId, dealId, created };
}

/** Works out a deal's score from what's known about it, and stores the score with its reasons. */
export async function rescore(dealId: number): Promise<void> {
  const [d] = await db()<{ level: number | null; outcomes: string[]; source: string; title: string | null; platform: string | null; site: string | null; requests: number }[]>`
    select d.level, d.outcomes, d.source, ct.title, co.platform,
           (select a.meta->>'site' from activities a where a.deal_id = d.id and a.kind = 'form' and coalesce(a.meta->>'site', '') <> '' order by a.at desc limit 1) as site,
           (select count(*)::int from activities a where a.deal_id = d.id and a.kind = 'form') as requests
    from deals d left join contacts ct on ct.id = d.primary_contact_id left join companies co on co.id = d.company_id
    where d.id = ${dealId}`;
  if (!d) return;
  const r = scoreLead({ level: d.level, outcomes: d.outcomes, site: d.site ?? '', source: d.source, requests: d.requests, title: d.title ?? '', platform: d.platform ?? '' });
  await db()`update deals set score = ${r.score}, score_reasons = ${db().json(r.reasons)}, scored_at = now() where id = ${dealId}`;
}

/** Scores any deal that hasn't been scored (the backfilled ones). */
/**
 * Records any accepted sign-up the CRM missed: one that came in after the CRM's tables were made but
 * before the site started recording leads (preview and production share a database), or one whose
 * recording failed. Skips the last two minutes, which the form is still recording itself.
 */
export async function catchUpLeads(): Promise<number> {
  await migrate();
  const missed = await db()<{ id: number; email: string; domain: string; company: string; site: string; wants: string; level: number | null; source: string }[]>`
    select s.id::int as id, s.email, s.domain, s.company, s.site, s.wants, s.level, s.source from submissions s
    where s.outcome = 'ok' and s.domain <> '' and s.created_at < now() - interval '2 minutes'
      and not exists (select 1 from activities a where a.kind = 'form' and (a.meta->>'submission_id')::bigint = s.id)
    order by s.created_at limit 200`;
  for (const m of missed) {
    await recordLead({ email: m.email, domain: m.domain, company: m.company, site: m.site, wants: m.wants, level: m.level ?? 0, source: m.source, submissionId: m.id });
  }
  return missed.length;
}

export async function rescorePending(): Promise<void> {
  await migrate();
  const rows = await db()<{ id: number }[]>`select id::int as id from deals where scored_at is null limit 500`;
  for (const r of rows) await rescore(r.id);
}

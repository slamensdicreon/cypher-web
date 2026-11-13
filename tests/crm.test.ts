/** The CRM against a real Postgres (TEST_DATABASE_URL, wiped). Scoring tests run without it. */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { scoreLead } from '../lib/crm/score';

const url = process.env.TEST_DATABASE_URL || '';
const skip = !url && 'set TEST_DATABASE_URL to run the database tests';
process.env.DATABASE_URL = url;

test('scores add up, with a reason for every point', () => {
  const r = scoreLead({ level: 3, outcomes: ['Migrate', 'Personalize'], site: 'acme.com', source: 'linkedin', requests: 2, title: 'VP Digital', platform: 'AEM' });
  assert.equal(r.score, 35 + 10 + 5 + 5 + 10 + 15 + 5);
  assert.equal(r.reasons.length, 7);
  assert.match(r.reasons.join(' '), /Offered their budget/);
  const low = scoreLead({ level: 0, outcomes: [], site: '', source: '', requests: 1, title: '', platform: '' });
  assert.deepEqual(low, { score: 5, reasons: ['+5 Curious on the dial'] });
});

test('scores never pass 100', () => {
  const r = scoreLead({ level: 3, outcomes: ['Build', 'Migrate', 'Personalize', 'Optimize', 'x', 'y'], site: 'a.com', source: 's', requests: 9, title: 'Chief Digital Officer', platform: 'Sitecore' });
  assert.ok(r.score <= 100);
});

let crm: typeof import('../lib/crm/data');
let store: typeof import('../lib/store');
let me: import('../lib/auth/session').Session;

before(async () => {
  if (skip) return;
  store = await import('../lib/store');
  await store.sql!.unsafe('drop schema public cascade; create schema public;');
  await store.migrate();
  const [u] = await store.sql!`insert into users (email, name, roles) values ('sales@example.com', 'Sal', ${['sales']}) returning id`;
  me = { id: 1, user: { id: Number(u.id), email: 'sales@example.com', name: 'Sal', roles: ['sales'], status: 'active' }, fresh: true, method: 'link' };
  crm = await import('../lib/crm/data');
});
after(async () => {
  if (!skip) await store.sql!.end();
});

test('a sign-up opens a deal with its company and contact', { skip }, async () => {
  const r = await crm.recordLead({ email: 'Dana@Contoso.com', domain: 'contoso.com', company: 'Contoso', site: 'contoso.com/en', wants: 'Migrate, Personalize', level: 2, source: 'linkedin', submissionId: 1 });
  assert.equal(r.created, true);
  const d = (await crm.deal(r.dealId))!;
  assert.equal(d.companyName, 'Contoso');
  assert.equal(d.contactEmail, 'dana@contoso.com');
  assert.deepEqual(d.outcomes, ['Migrate', 'Personalize']);
  assert.equal(d.stage, 'new');
  assert.ok(d.score > 0 && d.scoreReasons.length > 0);
  const tl = await crm.timeline({ dealId: r.dealId });
  assert.ok(tl.some((a) => a.kind === 'form'));
});

test('a second sign-up from the same company joins its open deal and raises the score', { skip }, async () => {
  const [before] = await crm.pipeline();
  const r = await crm.recordLead({ email: 'ana@contoso.com', domain: 'contoso.com', company: 'Contoso', site: '', wants: 'Optimize', level: 3, source: '', submissionId: 2 });
  assert.equal(r.created, false);
  assert.equal(r.dealId, before.id);
  const d = (await crm.deal(r.dealId))!;
  assert.deepEqual([...d.outcomes].sort(), ['Migrate', 'Optimize', 'Personalize']);
  assert.equal(d.level, 3);
  assert.ok(d.score > before.score);
  assert.ok(d.scoreReasons.some((x) => /asked 2 times/.test(x)));
  assert.equal((await crm.contacts({ companyId: d.companyId! })).length, 2);
});

test('moving a deal records the change; losing one needs a reason', { skip }, async () => {
  const [d] = await crm.pipeline();
  assert.deepEqual(await crm.moveDeal(me, d.id, 'qualified'), { from: 'new', to: 'qualified' });
  await assert.rejects(() => crm.moveDeal(me, d.id, 'lost'), /say why/);
  await crm.moveDeal(me, d.id, 'won');
  const won = (await crm.deal(d.id))!;
  assert.equal(won.stage, 'won');
  assert.ok(won.closedAt);
  const stagesSeen = (await crm.timeline({ dealId: d.id })).filter((a) => a.kind === 'stage').map((a) => a.subject);
  assert.deepEqual(stagesSeen, ['Qualified → Won', 'New lead → Qualified']);
});

test('a won company that asks again gets a new deal', { skip }, async () => {
  const r = await crm.recordLead({ email: 'dana@contoso.com', domain: 'contoso.com', company: 'Contoso', site: '', wants: 'Build', level: 1, source: '', submissionId: 3 });
  assert.equal(r.created, true);
  assert.equal((await crm.dealsFor({ companyId: r.companyId })).length, 2);
});

test('tasks: add, finish (logged on the timeline), list by scope', { skip }, async () => {
  const [d] = await crm.pipeline();
  const id = await crm.addTask(me, { title: 'Book the demo', dueAt: new Date(Date.now() - 3600_000).toISOString(), dealId: d.id });
  assert.equal((await crm.tasks({ ownerId: me.user.id, scope: 'overdue' })).length, 1);
  assert.equal(await crm.setTaskDone(me, id, true), true);
  assert.equal((await crm.tasks({ ownerId: me.user.id, scope: 'open' })).length, 0);
  assert.ok((await crm.timeline({ dealId: d.id })).some((a) => a.subject === 'Done: Book the demo'));
});

test('a contact added without a company joins the one with their email domain', { skip }, async () => {
  const id = await crm.upsertContact({ email: 'Lee@contoso.com', source: 'admin' });
  const c = (await crm.contact(id))!;
  assert.equal(c.companyName, 'Contoso');
  const other = await crm.upsertContact({ email: 'pat@nowhere.example', source: 'admin' });
  assert.equal((await crm.contact(other))!.companyId, null);
});

test('new website leads follow the owner rule in Settings', { skip }, async () => {
  const settings = await import('../lib/settings');
  const [u2] = await store.sql!`insert into users (email, name, roles) values ('rep@example.com', 'Rep', ${['sales']}) returning id::int as id`;
  await store.sql!`insert into users (email, name, roles) values ('mkt@example.com', 'Mkt', ${['marketing']})`;
  await settings.saveSetting('lead_owner', String(u2.id), me.user.id);
  const a = await crm.recordLead({ email: 'x@alpha.example', domain: 'alpha.example', company: 'Alpha', site: '', wants: '', level: 1, source: '', submissionId: null });
  assert.equal((await crm.deal(a.dealId))!.ownerId, u2.id);
  await settings.saveSetting('lead_owner', 'rotate', me.user.id);
  const owners = [];
  for (const co of ['Beta', 'Gamma', 'Delta']) {
    const r = await crm.recordLead({ email: `x@${co.toLowerCase()}.example`, domain: `${co.toLowerCase()}.example`, company: co, site: '', wants: '', level: 1, source: '', submissionId: null });
    owners.push((await crm.deal(r.dealId))!.ownerId);
  }
  // Two people can edit the CRM (Sal and Rep); marketing can't, so it never gets one. They alternate.
  assert.equal(new Set(owners).size, 2);
  assert.notEqual(owners[0], owners[1]);
  assert.equal(owners[0], owners[2]);
  await settings.saveSetting('lead_owner', '', me.user.id);
  const z = await crm.recordLead({ email: 'x@zeta.example', domain: 'zeta.example', company: 'Zeta', site: '', wants: '', level: 1, source: '', submissionId: null });
  assert.equal((await crm.deal(z.dealId))!.ownerId, null);
});

test('sign-ups the CRM missed are caught up once, and recent ones are left to the form', { skip }, async () => {
  const [old] = await store.sql!`insert into submissions (id, created_at, email, domain, company, outcome, level, site, wants, source)
    values (1000, now() - interval '1 hour', 'kim@missed.example', 'missed.example', 'Missed Co', 'ok', 2, 'missed.example', 'Optimize', 'postcard') returning id::int as id`;
  await store.sql!`insert into submissions (id, email, domain, company, outcome, level) values (1001, 'new@fresh.example', 'fresh.example', 'Fresh', 'ok', 1)`;
  await store.sql!`insert into submissions (id, created_at, email, domain, company, outcome) values (1002, now() - interval '1 hour', 'x@gmail.com', 'gmail.com', 'Gmail', 'personal')`;
  assert.equal(await crm.catchUpLeads(), 1);
  assert.equal(await crm.catchUpLeads(), 0);
  const [d] = await crm.pipeline({ q: 'Missed Co' });
  assert.equal(d.contactEmail, 'kim@missed.example');
  assert.deepEqual(d.outcomes, ['Optimize']);
  assert.ok((await crm.timeline({ dealId: d.id })).some((a) => a.kind === 'form'));
  assert.equal((await crm.pipeline({ q: 'Fresh' })).length, 0);
  void old;
});

test('a demo request opens the deal at Demo booked, with a task to confirm the time', { skip }, async () => {
  const r = await crm.recordLead({
    email: 'ria@demo-co.example', domain: 'demo-co.example', company: 'Demo Co', site: 'demo-co.example', wants: 'Migrate', level: 2, source: '',
    submissionId: 2001, name: 'Ria Patel', platform: 'Contentful', page: '/demo', demo: { times: 'Mon, Nov 16, morning; Tue, Nov 17, afternoon', tz: 'America/Chicago' },
  });
  const d = (await crm.deal(r.dealId))!;
  assert.equal(d.stage, 'demo_booked');
  assert.equal(d.nextStep, 'Confirm the demo time');
  assert.ok(d.scoreReasons.some((x) => x.includes('asked for a demo')));
  assert.ok(d.scoreReasons.some((x) => x.includes('runs Contentful')));
  assert.equal(d.contactName, 'Ria Patel');
  const t = await crm.tasks({ dealId: r.dealId, scope: 'open' });
  assert.equal(t.length, 1);
  assert.match(t[0].title, /Confirm a demo time with Ria Patel/);
  assert.match(t[0].notes, /Mon, Nov 16, morning/);
  const form = (await crm.timeline({ dealId: r.dealId })).find((a) => a.kind === 'form')!;
  assert.equal(form.subject, 'Asked for a demo');
  // A company with an earlier deal moves it up to Demo booked rather than opening a second one.
  const early = await crm.recordLead({ email: 'x@early.example', domain: 'early.example', company: 'Early', site: '', wants: '', level: 1, source: '', submissionId: 2002 });
  assert.equal((await crm.deal(early.dealId))!.stage, 'new');
  const again = await crm.recordLead({ email: 'y@early.example', domain: 'early.example', company: 'Early', site: '', wants: '', level: 1, source: '', submissionId: 2003, demo: { times: '', tz: '' } });
  assert.equal(again.dealId, early.dealId);
  assert.equal((await crm.deal(early.dealId))!.stage, 'demo_booked');
});

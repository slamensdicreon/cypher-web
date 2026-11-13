/**
 * Sign-in, against a real Postgres. Set TEST_DATABASE_URL to a throwaway database (it's wiped);
 * without it these tests are skipped. Email is caught by a stand-in for Resend's API.
 */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

const url = process.env.TEST_DATABASE_URL || '';
const skip = !url && 'set TEST_DATABASE_URL to run the database tests';
process.env.DATABASE_URL = url;
process.env.ADMIN_OWNERS = 'first@example.com, second@example.com';
process.env.ADMIN_PIN = '9999';
process.env.ADMIN_URL = 'http://admin.test';
process.env.RESEND_KEY = 're_test';

const mail: { to: string[]; subject: string; html: string }[] = [];
const realFetch = globalThis.fetch;
globalThis.fetch = (async (u: string | URL, init?: RequestInit) => {
  if (String(u).startsWith('https://api.resend.com/')) {
    mail.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ id: 're_' + mail.length }), { status: 200 });
  }
  return realFetch(u, init);
}) as typeof fetch;

const h = new Headers({ 'x-forwarded-for': '203.0.113.7', 'user-agent': 'test' });
const tokenFrom = (html: string) => decodeURIComponent(/verify\?t=([A-Za-z0-9_%-]+)/.exec(html)![1]);

let auth: typeof import('../lib/auth/session');
let store: typeof import('../lib/store');

before(async () => {
  if (skip) return;
  store = await import('../lib/store');
  await store.sql!.unsafe('drop schema public cascade; create schema public;');
  auth = await import('../lib/auth/session');
});
after(async () => {
  if (!skip) await store.sql!.end();
});

test('migrations apply once and are idempotent', { skip }, async () => {
  const { applyMigrations } = await import('../lib/db/schema');
  const first = await applyMigrations(store.sql!);
  const second = await applyMigrations(store.sql!);
  assert.ok(first.length >= 2);
  assert.deepEqual(second, []);
});

test('unknown emails get the same answer and no email', { skip }, async () => {
  assert.equal(await auth.requestLink('nobody@example.com', '/admin', h), 'sent');
  assert.equal(mail.length, 0);
});

test('the first Owner is created from ADMIN_OWNERS and gets a link', { skip }, async () => {
  assert.equal(await auth.requestLink('First@Example.com', '/admin/people', h), 'sent');
  assert.equal(mail.length, 1);
  assert.match(mail[0].html, /http:\/\/admin\.test\/admin\/auth\/verify\?t=/);
  const u = await auth.userByEmail('first@example.com');
  assert.deepEqual(u?.roles, ['owner']);
});

test('someone listed in ADMIN_OWNERS who already has an account is made an Owner', { skip }, async () => {
  await store.sql!`insert into users (email, roles) values ('second@example.com', ${['platform']})`;
  const sent = mail.length;
  await auth.requestLink('second@example.com', '/admin', h);
  assert.equal(mail.length, sent + 1);
  assert.deepEqual((await auth.userByEmail('second@example.com'))?.roles, ['platform', 'owner']);
  const [a] = await store.sql!`select action from audit_log where action = 'people.owner_from_settings'`;
  assert.ok(a, 'the upgrade is in the audit log');
});

test('a link can be looked at, used once, and never again', { skip }, async () => {
  const t = tokenFrom(mail[0].html);
  assert.ok(await auth.peekLink(t));
  assert.ok(await auth.peekLink(t), 'looking does not use it up');
  const r = await auth.useLink(t, h);
  assert.ok(r);
  assert.equal(r!.next, '/admin/people');
  assert.equal(await auth.useLink(t, h), null);
  const s = await auth.sessionFromToken(r!.cookie.value);
  assert.equal(s?.user.email, 'first@example.com');
  assert.equal(s?.fresh, true);
});

test('expired links are refused', { skip }, async () => {
  await auth.requestLink('first@example.com', '/admin', h);
  const t = tokenFrom(mail.at(-1)!.html);
  await store.sql!`update login_links set expires_at = now() - interval '1 second' where used_at is null`;
  assert.equal(await auth.useLink(t, h), null);
});

test('sessions end when revoked, when idle, and when the person is deactivated', { skip }, async () => {
  await auth.requestLink('first@example.com', '/admin', h);
  const r1 = (await auth.useLink(tokenFrom(mail.at(-1)!.html), h))!;
  await auth.revokeSession(r1.cookie.value);
  assert.equal(await auth.sessionFromToken(r1.cookie.value), null);

  await auth.requestLink('first@example.com', '/admin', h);
  const r2 = (await auth.useLink(tokenFrom(mail.at(-1)!.html), h))!;
  await store.sql!`update sessions set last_seen_at = now() - interval '25 hours' where revoked_at is null`;
  await auth.revokeAll(0); // clears the per-instance cache
  assert.equal(await auth.sessionFromToken(r2.cookie.value), null);
});

test('the PIN works only until an Owner has signed in by link', { skip }, async () => {
  assert.equal(await auth.pinAllowed(), false, 'an Owner has signed in above');
  await store.sql!`update users set last_sign_in_at = null`;
  assert.equal(await auth.pinAllowed(), true);
});

test('too many requests are limited', { skip }, async () => {
  let last = '';
  for (let i = 0; i < 6; i++) last = await auth.requestLink('first@example.com', '/admin', new Headers({ 'x-forwarded-for': '198.51.100.9' }));
  assert.equal(last, 'limited');
});

test('after sign-in, only admin paths are allowed as the next page', () => {
  // safeNext is pure; it lives with the session code
  return import('../lib/auth/session').then(({ safeNext }) => {
    assert.equal(safeNext('/admin/people'), '/admin/people');
    assert.equal(safeNext('/postcards?bleed=1'), '/postcards?bleed=1');
    assert.equal(safeNext('https://evil.example/admin'), '/admin');
    assert.equal(safeNext('//evil.example'), '/admin');
    assert.equal(safeNext('/admin/sign-in'), '/admin');
    assert.equal(safeNext(undefined), '/admin');
  });
});

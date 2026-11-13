import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { esc, frame, send } from '../email';
import { clientIp, keyedHash } from '../keys';
import { migrate, sql } from '../store';
import { can, isRole, type Area, type Level, type Role } from './roles';

/**
 * Sign-in for the admin: named people on an allowlist (the users table), one-time email links, and
 * sessions stored in the database so they can be listed and revoked.
 *
 * - A link is single use, expires (15 minutes; 3 days for an invitation), and only its hash is kept.
 * - Opening a link shows a button; the session starts when it's pressed. Email security scanners
 *   that open links on arrival can't use it up.
 * - A session lasts 7 days, ends after a day without use, and counts as "fresh" for 15 minutes after
 *   sign-in. Sensitive actions (people, platform grants) ask for a fresh sign-in.
 * - ADMIN_OWNERS (comma-separated emails) are made Owners the first time they ask for a link, so
 *   the first person can get in.
 */

export const SESSION_COOKIE = 'cy_session';
const LINK_MIN = 15;
const INVITE_HOURS = 72;
const SESSION_DAYS = 7;
const IDLE_HOURS = 24;
const FRESH_MIN = 15;

export type User = { id: number; email: string; name: string; roles: Role[]; status: string };
export type Session = { id: number; user: User; fresh: boolean; method: string };

const hash = (t: string) => createHash('sha256').update(t).digest('hex');
const token = () => randomBytes(32).toString('base64url');
const db = () => {
  if (!sql) throw new Error('No database is connected.');
  return sql;
};

export const normalEmail = (e: unknown) => (typeof e === 'string' ? e.trim().toLowerCase().slice(0, 254) : '');
const owners = () => (process.env.ADMIN_OWNERS || '').split(',').map(normalEmail).filter(Boolean);

/** Where links in emails point. Configured, never taken from the request, so a forged Host can't redirect a token. */
export function adminOrigin(): string {
  const u = (process.env.ADMIN_URL || process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/$/, '');
  if (u) return u;
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:3000';
  return 'https://www.ignoranceisbliss.ai';
}

/** Only back into the admin or the campaign pages after signing in. */
export const safeNext = (next: unknown) =>
  typeof next === 'string' && /^\/(admin|postcards)(\/[\w./-]*)?(\?[\w=&%.-]*)?$/.test(next) && !next.startsWith('/admin/sign-in') ? next : '/admin';

const rowToUser = (r: { id: string | number; email: string; name: string; roles: string[]; status: string }): User => ({
  id: Number(r.id),
  email: r.email,
  name: r.name,
  roles: (r.roles || []).filter(isRole),
  status: r.status,
});

export async function userByEmail(email: string): Promise<User | null> {
  await migrate();
  const [r] = await db()`select id, email, name, roles, status from users where lower(email) = ${normalEmail(email)}`;
  return r ? rowToUser(r as never) : null;
}

/** The first Owners, from ADMIN_OWNERS, are created on demand. */
async function ensureOwner(email: string): Promise<User | null> {
  if (!owners().includes(email)) return null;
  const [r] = await db()`
    insert into users (email, roles) values (${email}, ${['owner']})
    on conflict (lower(email)) do nothing
    returning id, email, name, roles, status`;
  return r ? rowToUser(r as never) : userByEmail(email);
}

type LinkPurpose = 'sign_in' | 'invite' | 'confirm';

async function createLink(user: User, purpose: LinkPurpose, next: string, ipHash: string): Promise<string> {
  const t = token();
  const minutes = purpose === 'invite' ? INVITE_HOURS * 60 : LINK_MIN;
  await db()`
    insert into login_links (user_id, token_hash, purpose, next, expires_at, ip_hash)
    values (${user.id}, ${hash(t)}, ${purpose}, ${safeNext(next)}, now() + make_interval(mins => ${minutes}), ${ipHash})`;
  return `${adminOrigin()}/admin/auth/verify?t=${encodeURIComponent(t)}`;
}

function linkEmail(user: User, url: string, purpose: LinkPurpose, inviter?: string) {
  const invite = purpose === 'invite';
  const title = invite ? 'You’re invited to the Cypher admin.' : purpose === 'confirm' ? 'Confirm it’s you.' : 'Your sign-in link.';
  const lead = invite
    ? `${inviter ? esc(inviter) + ' has' : 'You’ve been'} invited ${inviter ? 'you ' : ''}to the Cypher admin. The link works once and for three days.`
    : purpose === 'confirm'
      ? 'You asked to do something that needs a fresh sign-in. The link works once and for fifteen minutes.'
      : 'Use this to sign in to the Cypher admin. It works once and for fifteen minutes.';
  const html = frame(
    `<tr><td style="padding:0 0 16px;font-size:30px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;">${title}</td></tr>
<tr><td style="padding:0 0 28px;font-size:17px;line-height:1.55;color:#d6d0f5;">${lead}</td></tr>
<tr><td style="padding:0 0 32px;"><a href="${esc(url)}" style="display:inline-block;background:#e8553d;color:#ffffff;text-decoration:none;font-weight:800;font-size:16px;padding:14px 24px;border-radius:999px;">${invite ? 'Accept and sign in' : 'Sign in'}</a></td></tr>
<tr><td style="padding:24px 0 0;border-top:1px solid #2c2c5a;font-size:13px;line-height:1.6;color:#8f8cb3;">This was sent to ${esc(user.email)}. If you didn’t ask for it, ignore it; nobody can sign in without this email.</td></tr>`,
    title,
  );
  const text = `${title}\n\n${lead.replace(/<[^>]+>/g, '')}\n\n${url}\n\nIf you didn’t ask for it, ignore it.`;
  return { to: [user.email], subject: invite ? 'You’re invited to the Cypher admin' : purpose === 'confirm' ? 'Confirm it’s you' : 'Your Cypher admin sign-in link', html, text };
}

/**
 * Sends a sign-in link if this email belongs to an active person. Says nothing either way, so the
 * form can't be used to find out who has access. Rate limited per person and per network.
 */
export async function requestLink(emailRaw: string, next: string, h: Headers, purpose: LinkPurpose = 'sign_in'): Promise<'sent' | 'limited'> {
  await migrate();
  const email = normalEmail(emailRaw);
  const ipHash = keyedHash(`admin|${clientIp(h)}`);
  const [{ n: perIp }] = await db()<{ n: string }[]>`
    select count(*) as n from login_links where ip_hash = ${ipHash} and created_at > now() - interval '15 minutes'`;
  if (Number(perIp) >= 10) return 'limited';
  const user = (await userByEmail(email)) ?? (await ensureOwner(email));
  if (!user || user.status !== 'active') return 'sent';
  const [{ n: perUser }] = await db()<{ n: string }[]>`
    select count(*) as n from login_links where user_id = ${user.id} and created_at > now() - interval '15 minutes'`;
  if (Number(perUser) >= 5) return 'limited';
  const url = await createLink(user, purpose, next, ipHash);
  await send(linkEmail(user, url, purpose), null);
  return 'sent';
}

/** Invites a person (or re-sends their invitation). */
export async function sendInvite(user: User, inviter: User, h: Headers): Promise<void> {
  const url = await createLink(user, 'invite', '/admin', keyedHash(`admin|${clientIp(h)}`));
  await send(linkEmail(user, url, 'invite', inviter.name || inviter.email), null);
}

/** Is this link still good? Doesn't use it up (the confirm page calls this to show the button). */
export async function peekLink(t: string): Promise<{ email: string; purpose: string } | null> {
  if (!t) return null;
  await migrate();
  const [r] = await db()<{ email: string; purpose: string }[]>`
    select u.email, l.purpose from login_links l join users u on u.id = l.user_id
    where l.token_hash = ${hash(t)} and l.used_at is null and l.expires_at > now() and u.status = 'active'`;
  return r ?? null;
}

async function startSession(userId: number, method: string, h: Headers): Promise<{ value: string; maxAge: number }> {
  const t = token();
  await db()`
    insert into sessions (user_id, token_hash, expires_at, fresh_until, method, ua, ip_hash)
    values (${userId}, ${hash(t)}, now() + make_interval(days => ${SESSION_DAYS}), now() + make_interval(mins => ${FRESH_MIN}),
            ${method}, ${(h.get('user-agent') || '').slice(0, 200)}, ${keyedHash(`admin|${clientIp(h)}`)})`;
  return { value: t, maxAge: SESSION_DAYS * 86400 };
}

/** Uses a link: marks it used, starts a session, and says where to go next. */
export async function useLink(t: string, h: Headers): Promise<{ cookie: { value: string; maxAge: number }; next: string; user: User } | null> {
  if (!t) return null;
  await migrate();
  const [l] = await db()<{ id: string; userId: string; next: string }[]>`
    update login_links set used_at = now()
    where token_hash = ${hash(t)} and used_at is null and expires_at > now()
    returning id, user_id, next`;
  if (!l) return null;
  const [u] = await db()`
    update users set last_sign_in_at = now() where id = ${l.userId} and status = 'active'
    returning id, email, name, roles, status`;
  if (!u) return null;
  const user = rowToUser(u as never);
  return { cookie: await startSession(user.id, 'link', h), next: safeNext(l.next), user };
}

/** The break-glass PIN, while it's allowed (see pinAllowed): signs in as the first Owner. */
export async function usePin(h: Headers): Promise<{ cookie: { value: string; maxAge: number }; user: User } | null> {
  const first = owners()[0];
  if (!first) return null;
  const user = (await userByEmail(first)) ?? (await ensureOwner(first));
  if (!user || user.status !== 'active') return null;
  return { cookie: await startSession(user.id, 'pin', h), user };
}

/**
 * The shared PIN only works until an Owner has signed in with an email link, unless
 * ADMIN_PIN_FALLBACK=on (for an email outage). Then it's just a way in for the first Owner.
 */
export async function pinAllowed(): Promise<boolean> {
  if (!(process.env.ADMIN_PIN || '').trim() || !owners().length) return false;
  if (process.env.ADMIN_PIN_FALLBACK === 'on') return true;
  if (!sql) return false;
  await migrate();
  const [{ n }] = await db()<{ n: string }[]>`select count(*) as n from users where 'owner' = any(roles) and last_sign_in_at is not null`;
  return Number(n) === 0;
}

const cache = new Map<string, { s: Session | null; until: number }>();

/** The session for a cookie value. Cached for a few seconds per instance, so the request gate stays quick. */
export async function sessionFromToken(t: string | undefined): Promise<Session | null> {
  if (!t || !sql) return null;
  const k = hash(t);
  const c = cache.get(k);
  if (c && c.until > Date.now()) return c.s;
  await migrate();
  const [r] = await db()<
    { sid: string; method: string; fresh: boolean; lastSeen: Date; id: string; email: string; name: string; roles: string[]; status: string }[]
  >`
    select s.id as sid, s.method, (s.fresh_until > now()) as fresh, s.last_seen_at as last_seen, u.id, u.email, u.name, u.roles, u.status
    from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${k} and s.revoked_at is null and s.expires_at > now()
      and s.last_seen_at > now() - make_interval(hours => ${IDLE_HOURS}) and u.status = 'active'`;
  const s: Session | null = r ? { id: Number(r.sid), user: rowToUser(r), fresh: r.fresh, method: r.method } : null;
  if (r && Date.now() - new Date(r.lastSeen).getTime() > 5 * 60_000) await db()`update sessions set last_seen_at = now() where id = ${r.sid}`;
  cache.set(k, { s, until: Date.now() + 10_000 });
  if (cache.size > 500) cache.clear();
  return s;
}

/** The signed-in session for this request, or null. */
export async function currentSession(): Promise<Session | null> {
  return sessionFromToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages: the signed-in person, sent to the sign-in page if needed, and shown "not found" without the role. */
export async function requireUser(area: Area, level: Level = 'read', next = '/admin'): Promise<Session> {
  const s = await currentSession();
  if (!s) redirect(`/admin/sign-in?next=${encodeURIComponent(next)}`);
  if (!can(s.user.roles, area, level)) redirect('/admin?msg=' + encodeURIComponent('That part of the admin isn’t in your role.'));
  return s;
}

/** For routes: the session if it may do this, else null (the route answers 404). */
export async function apiUser(area: Area, level: Level = 'read'): Promise<Session | null> {
  const s = await currentSession();
  return s && can(s.user.roles, area, level) ? s : null;
}

/** Ends this session. */
export async function revokeSession(t: string | undefined): Promise<void> {
  if (!t || !sql) return;
  await db()`update sessions set revoked_at = now() where token_hash = ${hash(t)} and revoked_at is null`;
  cache.delete(hash(t));
}

/** Ends every session a person has (when they're deactivated or their roles change). */
export async function revokeAll(userId: number): Promise<void> {
  await db()`update sessions set revoked_at = now() where user_id = ${userId} and revoked_at is null`;
  cache.clear();
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
});

/** The request's headers, for routes that only have next/headers. */
export const requestHeaders = async () => new Headers(await headers());

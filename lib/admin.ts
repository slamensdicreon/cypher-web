import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { clientIp, keyedHash } from './keys';
import { hasStore, migrate, sql } from './store';

/**
 * The admin sign-in. One PIN (ADMIN_PIN), checked on the server in constant time; a session is
 * a signed, httpOnly cookie that lasts twelve hours. Changing the PIN signs everyone out.
 * Five wrong PINs from one network within fifteen minutes lock that network out for the rest.
 */

export const COOKIE = 'cy_admin';
const HOURS = 12;
const LIMIT = 5;
const WINDOW_MIN = 15;

const pin = () => (process.env.ADMIN_PIN || '').trim();
export const adminConfigured = () => pin().length > 0;

const sessionKey = () => createHmac('sha256', `cypher-admin:${pin()}`).update(process.env.IP_HASH_SECRET || process.env.ADMIN_KEY || '').digest();
const sign = (exp: number) => createHmac('sha256', sessionKey()).update(String(exp)).digest('hex');

export function newSession(): { value: string; maxAge: number } {
  const exp = Date.now() + HOURS * 3600_000;
  return { value: `${exp}.${sign(exp)}`, maxAge: HOURS * 3600 };
}

function validToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now() || !sig) return false;
  const want = Buffer.from(sign(exp), 'hex');
  const got = Buffer.from(sig, 'hex');
  return got.length === want.length && timingSafeEqual(got, want);
}

/** Is this request signed in? */
export async function isAdmin(): Promise<boolean> {
  return validToken((await cookies()).get(COOKIE)?.value);
}

/** Constant-time PIN check (both sides hashed first, so lengths always match). */
export function pinMatches(candidate: string): boolean {
  if (!adminConfigured()) return false;
  const a = createHash('sha256').update(candidate.trim()).digest();
  const b = createHash('sha256').update(pin()).digest();
  return timingSafeEqual(a, b);
}

/** Has this network failed too often lately? */
export async function lockedOut(headers: Headers): Promise<boolean> {
  if (!hasStore || !sql) return false;
  await migrate();
  const [{ n }] = await sql<{ n: string }[]>`
    select count(*) as n from admin_attempts
    where ip_hash = ${keyedHash(`admin|${clientIp(headers)}`)} and not ok
      and at > now() - make_interval(mins => ${WINDOW_MIN})`;
  return Number(n) >= LIMIT;
}

export async function noteAttempt(headers: Headers, ok: boolean): Promise<void> {
  if (!hasStore || !sql) return;
  await migrate();
  await sql`insert into admin_attempts (ip_hash, ok) values (${keyedHash(`admin|${clientIp(headers)}`)}, ${ok})`;
}

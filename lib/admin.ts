import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';
import { currentSession } from './auth/session';
import { clientIp, keyedHash } from './keys';
import { hasStore, migrate, sql } from './store';

/**
 * Helpers kept from the PIN era. Sign-in is now by email link (lib/auth/session.ts); the PIN is a
 * break-glass way in for the first Owner, with the same lockout: five wrong tries from one network
 * within fifteen minutes lock that network out for the rest.
 */

const LIMIT = 5;
const WINDOW_MIN = 15;

const pin = () => (process.env.ADMIN_PIN || '').trim();

/** Is anyone signed in? Routes that need a particular role use apiUser() instead. */
export async function isAdmin(): Promise<boolean> {
  return (await currentSession()) !== null;
}

/** Constant-time PIN check (both sides hashed first, so lengths always match). */
export function pinMatches(candidate: string): boolean {
  if (!pin()) return false;
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

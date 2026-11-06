import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * The admin session token, on its own so the request proxy can check it without the database or
 * next/headers. A token is `<expiry>.<signature>`, signed with a key derived from ADMIN_PIN, so
 * changing the PIN signs everyone out.
 */

export const COOKIE = 'cy_admin';
const HOURS = 12;

const pin = () => (process.env.ADMIN_PIN || '').trim();
export const adminConfigured = () => pin().length > 0;

const sessionKey = () =>
  createHmac('sha256', `cypher-admin:${pin()}`).update(process.env.IP_HASH_SECRET || process.env.ADMIN_KEY || '').digest();
const sign = (exp: number) => createHmac('sha256', sessionKey()).update(String(exp)).digest('hex');

export function newSession(): { value: string; maxAge: number } {
  const exp = Date.now() + HOURS * 3600_000;
  return { value: `${exp}.${sign(exp)}`, maxAge: HOURS * 3600 };
}

export function validToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now() || !sig) return false;
  const want = Buffer.from(sign(exp), 'hex');
  const got = Buffer.from(sig, 'hex');
  return got.length === want.length && timingSafeEqual(got, want);
}

/** Where to send someone after signing in: only back to the admin or the campaign pages. */
export const safeNext = (next: unknown) =>
  typeof next === 'string' && /^\/(admin|postcards)(\/[\w./-]*)?$/.test(next) ? next : '/admin';

import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Signed unsubscribe tokens: `<contact>.<send>.<signature>`, so a link can't be forged or guessed. */

const key = () => process.env.IP_HASH_SECRET || process.env.ADMIN_KEY || 'cypher-web';
const sig = (body: string) => createHmac('sha256', `unsub:${key()}`).update(body).digest('base64url').slice(0, 22);

export const unsubToken = (contactId: number, sendId: number | null) => {
  const body = `${contactId}.${sendId ?? 0}`;
  return `${body}.${sig(body)}`;
};

export function readUnsubToken(token: string | null | undefined): { contactId: number; sendId: number | null } | null {
  if (!token) return null;
  const [c, s, mac] = token.split('.');
  if (!c || !s || !mac) return null;
  const want = Buffer.from(sig(`${c}.${s}`));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  const contactId = Number(c);
  const sendId = Number(s);
  return Number.isInteger(contactId) && contactId > 0 ? { contactId, sendId: sendId > 0 ? sendId : null } : null;
}

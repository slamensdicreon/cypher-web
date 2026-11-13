import { NextResponse } from 'next/server';
import { lockedOut, noteAttempt, pinMatches } from '@/lib/admin';
import { audit } from '@/lib/audit';
import { SESSION_COOKIE, cookieOptions, pinAllowed, safeNext, sessionFromToken, usePin } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The break-glass PIN. It works only until an Owner has signed in with an email link (or while
 * ADMIN_PIN_FALLBACK=on), and signs in as the first Owner in ADMIN_OWNERS.
 */
export async function POST(req: Request) {
  const f = await req.formData().catch(() => null);
  const next = safeNext(f?.get('next'));
  const back = (e: string) => NextResponse.redirect(new URL(`/admin/sign-in?e=${e}${next !== '/admin' ? `&next=${encodeURIComponent(next)}` : ''}`, req.url), 303);
  if (!(await pinAllowed())) return back('pinoff');
  if (await lockedOut(req.headers)) return back('locked');
  const ok = pinMatches(typeof f?.get('pin') === 'string' ? (f.get('pin') as string) : '');
  await noteAttempt(req.headers, ok);
  if (!ok) return back('pin');
  const r = await usePin(req.headers);
  if (!r) return back('pinoff');
  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(SESSION_COOKIE, r.cookie.value, cookieOptions(r.cookie.maxAge));
  await audit(await sessionFromToken(r.cookie.value), { action: 'auth.sign_in_pin', entity: 'user', entityId: r.user.id, summary: 'Signed in with the break-glass PIN' }, req.headers);
  return res;
}

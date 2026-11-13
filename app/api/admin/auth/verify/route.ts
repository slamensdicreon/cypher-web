import { NextResponse } from 'next/server';
import { audit } from '@/lib/audit';
import { SESSION_COOKIE, cookieOptions, sessionFromToken, useLink } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The confirm page's button posts the link's token here; a good one starts a session. */
export async function POST(req: Request) {
  const f = await req.formData().catch(() => null);
  const t = typeof f?.get('t') === 'string' ? (f.get('t') as string) : '';
  const r = await useLink(t, req.headers).catch((err) => {
    console.error('[auth] verify failed', err);
    return null;
  });
  if (!r) return NextResponse.redirect(new URL('/admin/sign-in?e=expired', req.url), 303);
  const res = NextResponse.redirect(new URL(r.next, req.url), 303);
  res.cookies.set(SESSION_COOKIE, r.cookie.value, cookieOptions(r.cookie.maxAge));
  res.cookies.set('cy_admin', '', { path: '/', maxAge: 0 });
  await audit(await sessionFromToken(r.cookie.value), { action: 'auth.sign_in', entity: 'user', entityId: r.user.id, summary: `${r.user.email} signed in with an email link` }, req.headers);
  return res;
}

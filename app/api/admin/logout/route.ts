import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { audit } from '@/lib/audit';
import { SESSION_COOKIE, revokeSession, sessionFromToken } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const t = (await cookies()).get(SESSION_COOKIE)?.value;
  const s = await sessionFromToken(t);
  await revokeSession(t);
  if (s) await audit(s, { action: 'auth.sign_out', entity: 'user', entityId: s.user.id, summary: `${s.user.email} signed out` }, req.headers);
  const res = NextResponse.redirect(new URL('/admin/sign-in?out=1', req.url), 303);
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('cy_admin', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

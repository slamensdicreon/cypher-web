import { NextResponse } from 'next/server';
import { COOKIE, adminConfigured, lockedOut, newSession, noteAttempt, pinMatches, safeNext } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const back = (req: Request, next: string, error?: string) => {
  const url = new URL(error ? '/admin' : next, req.url);
  if (error) {
    url.searchParams.set('e', error);
    if (next !== '/admin') url.searchParams.set('next', next);
  }
  return NextResponse.redirect(url, 303);
};

/** The PIN form posts here. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const next = safeNext(form?.get('next'));
  if (!adminConfigured()) return back(req, next, 'unset');
  if (await lockedOut(req.headers)) return back(req, next, 'locked');
  const candidate = typeof form?.get('pin') === 'string' ? (form!.get('pin') as string) : '';
  const ok = pinMatches(candidate);
  await noteAttempt(req.headers, ok);
  if (!ok) return back(req, next, 'pin');
  const res = back(req, next);
  const s = newSession();
  res.cookies.set(COOKIE, s.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: s.maxAge,
  });
  return res;
}

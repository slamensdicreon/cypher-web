import { NextResponse } from 'next/server';
import { COOKIE, adminConfigured, lockedOut, newSession, noteAttempt, pinMatches } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const back = (req: Request, error?: string) =>
  NextResponse.redirect(new URL(error ? `/admin?e=${error}` : '/admin', req.url), 303);

/** The PIN form posts here. */
export async function POST(req: Request) {
  if (!adminConfigured()) return back(req, 'unset');
  if (await lockedOut(req.headers)) return back(req, 'locked');
  const form = await req.formData().catch(() => null);
  const candidate = typeof form?.get('pin') === 'string' ? (form!.get('pin') as string) : '';
  const ok = pinMatches(candidate);
  await noteAttempt(req.headers, ok);
  if (!ok) return back(req, 'pin');
  const res = back(req);
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

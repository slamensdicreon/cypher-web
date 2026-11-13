import { NextResponse } from 'next/server';
import { requestLink, safeNext } from '@/lib/auth/session';
import { canEmail } from '@/lib/email';
import { hasStore } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The sign-in form posts here. The answer is the same whether or not the email has access. */
export async function POST(req: Request) {
  const f = await req.formData().catch(() => null);
  const next = safeNext(f?.get('next'));
  const confirm = f?.get('confirm') === '1';
  const back = (q: Record<string, string>) => {
    const u = new URL('/admin/sign-in', req.url);
    for (const [k, v] of Object.entries({ ...q, ...(next !== '/admin' ? { next } : {}), ...(confirm ? { confirm: '1' } : {}) })) u.searchParams.set(k, v);
    return NextResponse.redirect(u, 303);
  };
  if (!hasStore) return back({ e: 'db' });
  if (!canEmail) return back({ e: 'email' });
  const email = typeof f?.get('email') === 'string' ? (f.get('email') as string) : '';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return back({ e: 'bad' });
  try {
    const r = await requestLink(email, next, req.headers, confirm ? 'confirm' : 'sign_in');
    return back(r === 'limited' ? { e: 'limited' } : { sent: '1' });
  } catch (err) {
    console.error('[auth] request link failed', err);
    return back({ e: 'send' });
  }
}

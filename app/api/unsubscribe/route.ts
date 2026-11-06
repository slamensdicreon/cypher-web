import { NextResponse } from 'next/server';
import { setContactStatus } from '@/lib/drip/engine';
import { readUnsubToken } from '@/lib/drip/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Unsubscribe. Mail apps post here directly for one-click unsubscribe (RFC 8058); the page's
 * button posts here too and is sent back to a confirmation.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const form = await req.formData().catch(() => null);
  const token = url.searchParams.get('t') || (typeof form?.get('t') === 'string' ? (form!.get('t') as string) : '');
  const t = readUnsubToken(token);
  if (t) await setContactStatus(t.contactId, 'unsubscribed', t.sendId);
  if (form?.get('List-Unsubscribe') === 'One-Click') return new Response(null, { status: t ? 200 : 400 });
  return NextResponse.redirect(new URL(t ? '/unsubscribe?done=1' : '/unsubscribe?bad=1', req.url), 303);
}

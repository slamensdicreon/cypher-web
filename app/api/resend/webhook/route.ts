import { createHmac, timingSafeEqual } from 'node:crypto';
import { recordEvent } from '@/lib/drip/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Resend signs webhooks with Svix: HMAC-SHA256 of "<id>.<timestamp>.<body>" with the endpoint secret. */
function verified(req: Request, body: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET || '';
  const id = req.headers.get('svix-id');
  const ts = req.headers.get('svix-timestamp');
  const sigs = req.headers.get('svix-signature');
  if (!secret || !id || !ts || !sigs) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const want = Buffer.from(createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest('base64'));
  return sigs.split(' ').some((s) => {
    const got = Buffer.from(s.split(',')[1] ?? '');
    return got.length === want.length && timingSafeEqual(got, want);
  });
}

/** Delivery, open, click, bounce and complaint events for drip emails. Other emails are ignored. */
export async function POST(req: Request) {
  const body = await req.text();
  if (!verified(req, body)) return new Response('Invalid signature', { status: 401 });
  try {
    const e = JSON.parse(body) as { type?: string; data?: { email_id?: string; click?: { link?: string } } };
    if (e.type && e.data?.email_id) await recordEvent(e.type, e.data.email_id, e.data.click?.link ?? null);
  } catch (err) {
    console.error('[resend webhook]', err);
    return new Response('Error', { status: 500 });
  }
  return new Response(null, { status: 204 });
}

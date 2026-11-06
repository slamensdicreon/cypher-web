import { isAdmin } from '@/lib/admin';
import { postalAddress, senderName, SITE } from '@/lib/drip/config';
import { renderEmail, SAMPLE } from '@/lib/drip/render';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Live preview for the step editor: renders the copy as the real email, with sample merge data. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return new Response('Not found', { status: 404 });
  const b = (await req.json().catch(() => ({}))) as Record<string, string>;
  const str = (k: string) => (typeof b[k] === 'string' ? b[k] : '').slice(0, 20000);
  const r = renderEmail({
    step: { subject: str('subject'), preheader: str('preheader'), body: str('body'), cta_label: str('cta_label'), cta_url: str('cta_url') },
    person: SAMPLE,
    code: str('code') || 'd0s0',
    footer: {
      senderName: senderName(),
      postalAddress: postalAddress(),
      unsubscribeUrl: `${SITE}/unsubscribe?t=preview`,
      reason: 'You’re getting this because Cypher thinks your company should be one of the twenty-five.',
    },
  });
  return Response.json({ subject: r.subject, preheader: r.preheader, html: r.html });
}

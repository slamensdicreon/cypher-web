import 'server-only';
import type { Session } from '../auth/session';
import { esc, send } from '../email';
import { addActivity, contact, fullName } from './data';

/**
 * A one-to-one email from the CRM: a plain message from the person sending it (shown as
 * "Name at Cypher"), with replies going straight to their own inbox, logged on the contact's timeline.
 * Someone who unsubscribed from marketing isn't emailed from here either.
 */
export async function emailContact(s: Session, v: { contactId: number; dealId: number | null; subject: string; body: string }): Promise<{ to: string; id: string | null }> {
  const c = await contact(v.contactId);
  if (!c) throw new Error('no such contact');
  if (c.status === 'unsubscribed') throw new Error(`${c.email} unsubscribed; email them from your own inbox if they asked you to`);
  const sender = s.user.name || s.user.email.split('@')[0];
  const fromAddress = (process.env.EMAIL_FROM || 'Cypher <onboarding@resend.dev>').replace(/^.*<([^>]+)>.*$/, '$1');
  const paragraphs = v.body.trim().split(/\n{2,}/).map((p) => `<p style="margin:0 0 14px;">${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  const html = `<!doctype html><html><body style="margin:0;padding:24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#141433;">
${paragraphs}<p style="margin:18px 0 0;color:#55546f;">${esc(sender)}<br>Cypher · ignoranceisbliss.ai</p></body></html>`;
  const text = `${v.body.trim()}\n\n${sender}\nCypher · ignoranceisbliss.ai`;
  const id = await send(
    { to: [c.email], subject: v.subject.slice(0, 200), html, text, reply_to: s.user.email, from: `${sender} at Cypher <${fromAddress}>` },
    null,
  );
  await addActivity(s, {
    kind: 'email',
    subject: v.subject.slice(0, 200),
    body: v.body.slice(0, 10000),
    dealId: v.dealId,
    contactId: v.contactId,
    meta: { to: c.email, resend_id: id, name: fullName(c) },
  });
  return { to: c.email, id };
}

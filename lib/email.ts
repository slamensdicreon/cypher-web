import 'server-only';
import { NOTED } from './config';

/**
 * Email through Resend's HTTP API: an internal notice to the team for every company put forward,
 * and a confirmation to the person who put it forward. No SDK, no extra dependency.
 */

const apiKey = (process.env.RESEND_API_KEY || process.env.RESEND || '').trim();
const from = process.env.EMAIL_FROM || 'Cypher <onboarding@resend.dev>';
const replyTo = (process.env.EMAIL_REPLY_TO || '').trim();
const internalTo = (process.env.INTERNAL_EMAIL_TO || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ignoranceisbliss.ai';

export const canEmail = Boolean(apiKey);

export type PutForward = {
  id: number | null;
  email: string;
  domain: string;
  company: string;
  level: number;
  interest: string;
  source: string;
};

type Message = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
};

async function send(m: Message, idempotencyKey: string | null): Promise<void> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify({ from, ...m }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(`Resend refused the email (${res.status}): ${body.message ?? res.statusText}`);
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const FONT = `'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif`;

/** A one-column, table-based layout, which is what email clients render reliably. */
function frame(inner: string, preheader: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="dark"><title>Cypher</title></head>
<body style="margin:0;padding:0;background:#141433;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141433;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${FONT};color:#ffffff;">
<tr><td style="padding:0 0 32px;font-size:20px;font-weight:800;letter-spacing:-0.02em;">cypher</td></tr>
${inner}
</table></td></tr></table></body></html>`;
}

/** The confirmation to the person who put their company forward. */
export function confirmation(p: PutForward): Message {
  const noted = NOTED[p.level] ?? NOTED[1];
  const company = esc(p.company);
  const html = frame(
    `<tr><td style="padding:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b7a6ff;">Put forward</td></tr>
<tr><td style="padding:0 0 16px;font-size:34px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;">Noted, ${company}.</td></tr>
<tr><td style="padding:0 0 16px;font-size:17px;line-height:1.55;">${esc(noted)}</td></tr>
<tr><td style="padding:0 0 32px;font-size:17px;line-height:1.55;color:#d6d0f5;">If ${company} is one of the twenty-five, you’ll hear from Cypher again. If not, you won’t. Ignorance is bliss.</td></tr>
<tr><td style="padding:24px 0 0;border-top:1px solid #2c2c5a;font-size:13px;line-height:1.6;color:#8f8cb3;">You’re getting this because ${esc(p.email)} was put forward for Cypher at <a href="${esc(siteUrl)}" style="color:#b7a6ff;">${esc(siteUrl.replace(/^https?:\/\//, ''))}</a>. If that wasn’t you, ignore this. Nothing else will arrive.</td></tr>`,
    `If ${p.company} is one of the twenty-five, you’ll hear from Cypher again.`,
  );
  const text = [
    `Noted, ${p.company}.`,
    '',
    noted,
    '',
    `If ${p.company} is one of the twenty-five, you’ll hear from Cypher again. If not, you won’t. Ignorance is bliss.`,
    '',
    '--',
    `You’re getting this because ${p.email} was put forward for Cypher at ${siteUrl}. If that wasn’t you, ignore this. Nothing else will arrive.`,
  ].join('\n');
  const m: Message = { to: [p.email], subject: `Noted, ${p.company}.`, html, text };
  if (replyTo) m.reply_to = replyTo;
  return m;
}

/** The notice to the team. Replying goes straight to the person who put the company forward. */
export function internalNotice(p: PutForward, soFar: number | null): Message {
  const at = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const rows: [string, string][] = [
    ['Company', p.company],
    ['Domain', p.domain],
    ['Email', p.email],
    ['How badly', `${p.interest} (${p.level + 1} of 4)`],
    ['Postcard', p.source || 'None (direct visit)'],
    ['When', `${at} ET`],
  ];
  if (soFar !== null) rows.push(['Companies so far', String(soFar)]);
  const html = frame(
    `<tr><td style="padding:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b7a6ff;">New company put forward</td></tr>
<tr><td style="padding:0 0 24px;font-size:30px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;">${esc(p.company)} · ${esc(p.interest)}</td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.5;">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:10px 16px 10px 0;border-top:1px solid #2c2c5a;color:#8f8cb3;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:10px 0;border-top:1px solid #2c2c5a;">${esc(v)}</td></tr>`,
  )
  .join('\n')}
</table></td></tr>
<tr><td style="padding:24px 0 0;font-size:13px;color:#8f8cb3;">Reply to this email to write to ${esc(p.email)} directly.</td></tr>`,
    `${p.email} put ${p.company} forward: ${p.interest}.`,
  );
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  return {
    to: internalTo,
    subject: `Put forward: ${p.company} · ${p.interest}`,
    html,
    text,
    reply_to: p.email,
  };
}

/**
 * Sends both emails. Never throws: the submission is already stored, so a failed email is
 * recorded beside it rather than failing the form.
 */
export async function notify(
  p: PutForward,
  opts: { confirm: boolean; soFar: number | null },
): Promise<{ internal: boolean; confirmation: boolean; error: string | null }> {
  if (!canEmail) {
    console.log('[email] RESEND_API_KEY is not set; no email sent for', p.email);
    return { internal: false, confirmation: false, error: 'RESEND_API_KEY is not set' };
  }
  const key = (kind: string) => (p.id === null ? null : `cypher-web/${kind}/${p.id}`);
  const [internal, confirm] = await Promise.allSettled([
    internalTo.length
      ? send(internalNotice(p, opts.soFar), key('internal'))
      : Promise.reject(new Error('INTERNAL_EMAIL_TO is not set')),
    // An address confirmed in the last day is skipped on purpose; that isn't an error.
    opts.confirm ? send(confirmation(p), key('confirmation')) : Promise.resolve('skipped' as const),
  ]);
  const errors: string[] = [];
  if (internal.status === 'rejected') errors.push(`internal: ${(internal.reason as Error).message}`);
  if (confirm.status === 'rejected') errors.push(`confirmation: ${(confirm.reason as Error).message}`);
  if (errors.length) console.error('[email]', errors.join('; '));
  return {
    internal: internal.status === 'fulfilled',
    confirmation: confirm.status === 'fulfilled' && confirm.value !== 'skipped',
    error: errors.length ? errors.join('; ') : null,
  };
}

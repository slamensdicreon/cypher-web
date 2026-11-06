import { SITE } from './config';

/**
 * A drip email in the Cypher brand: the eye and wordmark on ink, the message on a white card, a
 * coral button, and a footer with the sender, postal address and unsubscribe link. Copy is written
 * in a small Markdown (paragraphs, **bold**, _italic_, [links](https://…), "- " lists) with merge
 * fields like {{first_name|there}} (the part after | is the fallback).
 */

export type StepCopy = { subject: string; preheader: string; body: string; cta_label: string; cta_url: string };
export type Person = { email: string; first_name: string; last_name: string; company: string; title: string };
export type Footer = { senderName: string; postalAddress: string; unsubscribeUrl: string; reason: string };

export const SAMPLE: Person = { email: 'jane@northwind-traders.com', first_name: 'Jane', last_name: 'Doe', company: 'Northwind Traders', title: 'Director of Digital' };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Fills {{field}} and {{field|fallback}}. Unknown fields fall back too. */
export function merge(text: string, p: Person): string {
  return text.replace(/\{\{\s*(\w+)\s*(?:\|([^}]*))?\}\}/g, (_, k: string, fb?: string) => {
    const v = (p as Record<string, string>)[k];
    return v && v.trim() ? v.trim() : (fb ?? '').trim();
  });
}

/** Adds the drip's tracking code (?c=d<seq>s<step>) to links back to the site, so clicks and conversions count. */
export function tag(url: string, code: string): string {
  try {
    const u = new URL(url, SITE);
    if (!/(^|\.)ignoranceisbliss\.ai$/.test(u.hostname) && u.origin !== new URL(SITE).origin) return url;
    if (!u.searchParams.has('c')) u.searchParams.set('c', code);
    return u.toString();
  } catch {
    return url;
  }
}

const safeUrl = (u: string) => (/^(https?:|mailto:)/i.test(u) ? u : '#');

function inline(s: string, code: string): string {
  return esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t: string, u: string) => {
      const href = safeUrl(u.replace(/&amp;/g, '&'));
      return `<a href="${esc(href === '#' ? '#' : tag(href, code))}" style="color:#c8402b;font-weight:700;text-decoration:underline">${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#141433">$1</strong>')
    .replace(/(^|[\s(])_([^_]+)_(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>');
}

/** Markdown body to email-safe HTML blocks (inline styles only). */
export function bodyHtml(md: string, code: string): string {
  const blocks = md.replace(/\r\n/g, '\n').trim().split(/\n{2,}/);
  return blocks
    .map((b) => {
      const lines = b.split('\n');
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        const items = lines.map((l) => `<li style="margin:0 0 6px">${inline(l.replace(/^\s*[-*]\s+/, ''), code)}</li>`).join('');
        return `<ul style="margin:0 0 18px;padding-left:20px">${items}</ul>`;
      }
      return `<p style="margin:0 0 18px">${lines.map((l) => inline(l, code)).join('<br>')}</p>`;
    })
    .join('\n');
}

function bodyText(md: string, code: string): string {
  return md
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t: string, u: string) => `${t} (${tag(u, code)})`)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)_([^_]+)_/g, '$1$2')
    .trim();
}

const FONT = `'Plus Jakarta Sans','Helvetica Neue',Helvetica,Arial,sans-serif`;

export function renderEmail(opts: { step: StepCopy; person: Person; code: string; footer: Footer }) {
  const { step, person, code, footer } = opts;
  const subject = merge(step.subject, person) || '(no subject)';
  const preheader = merge(step.preheader, person);
  const md = merge(step.body, person);
  const ctaLabel = merge(step.cta_label, person);
  const ctaUrl = step.cta_url.trim() ? tag(safeUrl(merge(step.cta_url, person)), code) : tag(`${SITE}/#join`, code);
  const address = footer.postalAddress || '[Postal address: set DRIP_POSTAL_ADDRESS]';
  const button = ctaLabel
    ? `<tr><td style="padding:6px 0 4px"><a href="${esc(ctaUrl)}" style="display:inline-block;background:#e8553d;color:#ffffff;font-family:${FONT};font-size:16px;font-weight:800;text-decoration:none;padding:15px 26px;border-radius:999px">${esc(ctaLabel)}</a></td></tr>`
    : '';

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#141433;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#141433">${esc(preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141433">
<tr><td align="center" style="padding:32px 14px 40px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 6px 22px">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="vertical-align:middle"><img src="${SITE}/email/eye.png" width="40" height="40" alt="" style="display:block;border:0"></td>
    <td style="vertical-align:middle;padding-left:10px;font-family:${FONT};font-size:24px;font-weight:800;letter-spacing:-0.8px;color:#ffffff">cypher</td>
  </tr></table>
</td></tr>
<tr><td style="background:#ffffff;border-radius:22px;padding:34px 30px 30px;font-family:${FONT};font-size:16px;line-height:1.6;color:#3b3a5c">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="font-family:${FONT};font-size:16px;line-height:1.6;color:#3b3a5c">${bodyHtml(md, code)}</td></tr>
    ${button}
  </table>
</td></tr>
<tr><td style="padding:22px 8px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:#8f86c4">
  ${esc(footer.reason)}<br>
  ${esc(footer.senderName)} · ${esc(address)}<br>
  <a href="${esc(footer.unsubscribeUrl)}" style="color:#b7a6ff;text-decoration:underline">Unsubscribe</a> · <a href="${esc(tag(SITE, code))}" style="color:#b7a6ff;text-decoration:underline">ignoranceisbliss.ai</a>
</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    bodyText(md, code),
    ctaLabel ? `\n${ctaLabel}: ${ctaUrl}` : '',
    '\n--',
    footer.reason,
    `${footer.senderName} · ${address}`,
    `Unsubscribe: ${footer.unsubscribeUrl}`,
  ].join('\n');

  return { subject, preheader, html, text };
}

export type TemplateStep = StepCopy & { delay_days: number; send_on?: string };

/** The copy a new sequence starts with: three steps in the Cypher voice, ready to edit. */
export const STARTER_STEPS: TemplateStep[] = [
  {
    delay_days: 0,
    subject: 'You weren’t supposed to get this.',
    preheader: 'But since you did.',
    body: `Hi {{first_name|there}},

Cypher is twenty-one specialists and the mind that runs them. It builds on SitecoreAI for a rounding error of what you pay now.

We’re not selling it. We’re **choosing** twenty-five companies to build for, right after Symposium. Selection closes Friday, November 13.

It takes ten seconds to put {{company|your company}} forward.`,
    cta_label: 'Put your company forward',
    cta_url: '',
  },
  {
    delay_days: 3,
    subject: '$512.',
    preheader: 'The cost of the run. Not the price.',
    body: `{{first_name|Hi}},

Forrester priced a plain lift-and-shift to XM Cloud at **$258,500**. Not a redesign: the same site, moved.

An agency quoted a SitecoreAI build at **$400,000+**. Cypher ran it for **$512**. That’s the cost of the run, not the price of Cypher. We have the receipts.

- Self-learning. It never asks twice.
- Self-healing. It fixes what breaks before anyone files a ticket.
- Self-enhancing. Every build starts smarter than the last.

Twenty-five companies get to see it for themselves.

_Source: [Forrester, The Total Economic Impact of Sitecore XM Cloud](https://delivery-sitecore.sitecorecontenthub.cloud/api/public/content/419814f28e284b76b77bd6afd57ea057?v=7c8ccfa5), July 2025, commissioned by Sitecore._`,
    cta_label: 'Get considered',
    cta_url: '',
  },
  {
    delay_days: 4,
    subject: 'Last call, {{company|you}}.',
    preheader: 'Selection closes Friday, November 13.',
    body: `{{first_name|Hi}},

Selection closes Friday, November 13. After that, the twenty-five are chosen and we go quiet.

If {{company|your company}} isn’t on the list, ignorance is bliss.`,
    cta_label: 'Put your company forward',
    cta_url: '',
  },
];

/** Forrester, The Total Economic Impact of Sitecore XM Cloud, July 2025 (commissioned by Sitecore). */
const FORRESTER = 'https://delivery-sitecore.sitecorecontenthub.cloud/api/public/content/419814f28e284b76b77bd6afd57ea057?v=7c8ccfa5';

/**
 * Symposium week (Swan and Dolphin, Tuesday November 10 to Thursday 12; selection closes Friday the
 * 13th at midnight Eastern). Five dated emails, Monday to Friday, sent at the daily run (9 to 10 AM
 * Eastern). The arc flatters, then proves, then asks: Monday they've been picked for a first look,
 * Tuesday they know something the keynote room doesn't, Wednesday the credit and the math, Thursday
 * why they belong in the twenty-five, Friday they pick back. Anyone who puts their company forward
 * stops getting them.
 */
export const SYMPOSIUM_STEPS: TemplateStep[] = [
  {
    delay_days: 0,
    send_on: '2026-11-09',
    subject: 'You’ve been selected.',
    preheader: 'Out of everyone walking into Symposium tomorrow.',
    body: `{{first_name|Hi}},

You’ve been selected.

Out of everyone walking into Symposium tomorrow, a short list gets to hear about this first. We didn’t pull names out of a hat. We picked people whose companies run on Sitecore and could use an unfair advantage. {{company|Your company}} made the list.

What you were picked for: a first look at Cypher. Twenty-one specialists and the mind that runs them, building on SitecoreAI at a pace your board will assume is a typo.

Everyone else will spend this week hearing what AI might do someday. You’ll spend it knowing what already does.

Keep this one to yourself. That’s rather the point.`,
    cta_label: 'See what you were selected for',
    cta_url: `${SITE}/`,
  },
  {
    delay_days: 0,
    send_on: '2026-11-10',
    subject: 'You already know something they don’t.',
    preheader: 'Watch the keynote with that in mind.',
    body: `{{first_name|Hi}},

This morning, a room full of smart people will hear about the future of SitecoreAI.

You’re one of the few who knows it’s already here.

Cypher plans the build, builds it, checks it, and fixes what it finds before you find it. Every page is screenshotted at three breakpoints and diffed, pixel by pixel, against the original. Your part is three decisions. That’s the job now.

So when the keynote gets to the part about what’s coming, enjoy the feeling. Most people in that room won’t have it.`,
    cta_label: 'See it for yourself',
    cta_url: `${SITE}/`,
  },
  {
    delay_days: 0,
    send_on: '2026-11-11',
    subject: 'Imagine taking the credit.',
    preheader: 'You’d deserve it. Technically.',
    body: `{{first_name|Hi}},

Picture your next leadership meeting. The roadmap everyone budgeted a year for is done. It took a week.

Every head in the room turns to you. Let them.

An agency quoted a SitecoreAI build at **$400,000+**. Cypher ran it for **$512**: the cost of the run, not the price of Cypher. For scale, Forrester put a plain lift-and-shift to XM Cloud at **$258,500**, and one insurer reported **5,000 hours** to move 23 sites. At partner rates, that’s **$750K to $1.25M**.

Cypher doesn’t replace your team. It makes them look like they hired a hundred people. The credit stays with you. We insist.

_Sources: [Forrester, The Total Economic Impact of Sitecore XM Cloud](${FORRESTER}), July 2025, commissioned by Sitecore. The dollar range for 5,000 hours is our estimate at $150 to $250 an hour._`,
    cta_label: 'See the math',
    cta_url: `${SITE}/`,
  },
  {
    delay_days: 0,
    send_on: '2026-11-12',
    subject: '{{company|You}} belongs in the twenty-five.',
    preheader: 'Here’s why we think so.',
    body: `{{first_name|Hi}},

After Symposium, twenty-five companies get something nobody else in that building has. We think {{company|yours}} should be one of them.

You’ve sat through enough discovery workshops to know how this usually goes. Cypher doesn’t hold them. It never asks the same question twice: every answer becomes a rule for every build after. When something breaks, it finds why and fixes it before anyone files a ticket. Every action is logged, over 225,000 so far, and any build can be replayed step by step.

Sitecore MVPs built it. Ten years of every pitfall and every 2 AM fix, written down so nobody has to learn them again.

We picked you on Monday. All that’s left is putting {{company|your company}} forward. It takes ten seconds.`,
    cta_label: 'Put {{company|your company}} forward',
    cta_url: '',
  },
  {
    delay_days: 0,
    send_on: '2026-11-13',
    subject: 'Tonight, you pick back.',
    preheader: 'Selection closes at midnight Eastern.',
    body: `{{first_name|Hi}},

On Monday, we picked you. Tonight it’s your turn.

Selection closes at midnight Eastern. After that, Cypher sits down with twenty-five companies. They bring the website, the portal, the idea nobody would fund. They leave with it built, on SitecoreAI.

Twenty-five. Not twenty-six. Once the seats are gone, we go quiet: no follow-up, no “just checking in.”

You made the short list without asking. The final one takes ten seconds.`,
    cta_label: 'Put {{company|your company}} forward',
    cta_url: '',
  },
];

export const TEMPLATES: Record<string, { label: string; steps: TemplateStep[] }> = {
  symposium: { label: 'Symposium week: Mon to Fri (Nov 9 to 13)', steps: SYMPOSIUM_STEPS },
  starter: { label: 'Starter: three emails, days 0, 3 and 7', steps: STARTER_STEPS },
};

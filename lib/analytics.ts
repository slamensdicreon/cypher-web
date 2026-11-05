import 'server-only';
import { clientIp, keyedHash } from './keys';
import { hasStore, migrate, sql } from './store';

/** What the site records. Page views, and a few moments that matter. */
export const KINDS = ['view', 'form_start', 'card_flip', 'card_approve'] as const;
export type Kind = (typeof KINDS)[number];

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|headless|lighthouse|pingdom|monitor|curl|wget|python|node-fetch|vercel/i;

const clean = (v: unknown, max: number, pattern = /[^\w\-./:]/g) =>
  typeof v === 'string' ? v.replace(pattern, '').slice(0, max) : '';

function device(ua: string) {
  if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(ua)) return 'Tablet';
  if (/Mobi|iPhone|iPod|Android/i.test(ua)) return 'Phone';
  return 'Desktop';
}

/** Where a visit came from: the referring host, or nothing for a direct visit or our own pages. */
function refHost(ref: unknown, own: string) {
  if (typeof ref !== 'string' || !ref) return '';
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '');
    return h === own.replace(/^www\./, '') ? '' : h.slice(0, 80);
  } catch {
    return '';
  }
}

/**
 * Records one event. No cookies and no IP address: the visitor is a keyed hash of the day, the
 * network address and the browser, so a person counts once a day and can't be followed across days.
 */
export async function record(body: Record<string, unknown>, headers: Headers): Promise<void> {
  if (!hasStore || !sql) return;
  const ua = headers.get('user-agent') || '';
  if (!ua || BOT.test(ua)) return;
  const kind = KINDS.find((k) => k === body.kind);
  if (!kind) return;
  const day = new Date().toISOString().slice(0, 10);
  const own = headers.get('host') || '';
  await migrate();
  await sql`
    insert into events (kind, path, ref, card, utm, country, device, visitor)
    values (
      ${kind},
      ${clean(body.path, 120) || '/'},
      ${refHost(body.ref, own)},
      ${clean(body.card, 12, /[^a-z0-9-]/gi)},
      ${clean(body.utm, 40)},
      ${clean(headers.get('x-vercel-ip-country'), 2, /[^A-Z]/g)},
      ${device(ua)},
      ${keyedHash(`${day}|${clientIp(headers)}|${ua}`, 24)}
    )`;
}

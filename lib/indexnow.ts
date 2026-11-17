import 'server-only';
import { createHash } from 'node:crypto';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/site';
import { migrate, sql } from '@/lib/store';

/**
 * IndexNow: tells Bing (and the other engines that share it) the moment a page is added, changed or
 * removed, instead of waiting for a recrawl. Bing's index feeds ChatGPT search and Copilot.
 *
 * Once a day (Vercel Cron), and right after a playbook note is published, every page in the sitemap
 * is read and its main text fingerprinted; only new, changed or removed pages are sent. Production
 * only: previews and local copies never submit.
 *
 * The key is public by design: search engines read it at /indexnow.txt to confirm the site sent it.
 */
export const INDEXNOW_KEY = 'b06e92a3976ca997aedb2516afc4b659';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

export const indexNowEnabled = () => process.env.VERCEL_ENV === 'production';

/** The words a reader sees in <main>, so a new build with the same words isn't a change. */
export function mainText(html: string): string {
  const start = html.indexOf('<main');
  const end = html.indexOf('</main>', start);
  const main = start >= 0 && end > start ? html.slice(start, end) : html;
  return main
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const fingerprint = (text: string) => createHash('sha256').update(text).digest('hex').slice(0, 32);

/** Sends URLs to IndexNow. Up to 10,000 per call; we never come close. */
export async function submit(urls: string[]): Promise<{ status: number } | { skipped: string }> {
  if (!urls.length) return { skipped: 'nothing to send' };
  if (!indexNowEnabled()) return { skipped: 'not production' };
  const host = new URL(SITE_URL).host;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/indexnow.txt`, urlList: urls }),
    signal: AbortSignal.timeout(15_000),
  });
  return { status: res.status };
}

export type IndexNowRun = { checked: number; sent: string[]; removed: string[]; failed: string[]; result: { status: number } | { skipped: string } };

/** Reads every page, sends what's new, changed or gone, and remembers what was sent. */
export async function runIndexNow(): Promise<IndexNowRun> {
  if (!indexNowEnabled()) return { checked: 0, sent: [], removed: [], failed: [], result: { skipped: 'not production' } };
  const urls = [...new Set((await sitemap()).map((e) => e.url))];
  const seen = new Map<string, string>();
  const failed: string[] = [];
  // A few at a time, so a daily run stays gentle on our own functions.
  for (let i = 0; i < urls.length; i += 6) {
    await Promise.all(
      urls.slice(i, i + 6).map(async (u) => {
        try {
          const res = await fetch(u, { cache: 'no-store', signal: AbortSignal.timeout(15_000), headers: { 'user-agent': 'cypher-indexnow' } });
          if (res.ok) seen.set(u, fingerprint(mainText(await res.text())));
          else failed.push(`${u} ${res.status}`);
        } catch (err) {
          failed.push(`${u} ${(err as Error).message}`);
        }
      }),
    );
  }
  if (!sql) return { checked: seen.size, sent: [], removed: [], failed, result: { skipped: 'no database' } };
  await migrate();
  const rows = await sql<{ url: string; hash: string }[]>`select url, hash from indexnow_pages`;
  const before = new Map(rows.map((r) => [r.url, r.hash]));
  const changed = [...seen].filter(([u, h]) => before.get(u) !== h).map(([u]) => u);
  // Gone from the sitemap: tell the engines once, then forget it. A page that failed to load isn't gone.
  const removed = [...before.keys()].filter((u) => !urls.includes(u));
  const result = await submit([...changed, ...removed]);
  if ('status' in result && (result.status === 200 || result.status === 202)) {
    for (const u of changed) {
      await sql`insert into indexnow_pages (url, hash) values (${u}, ${seen.get(u)!})
                on conflict (url) do update set hash = excluded.hash, submitted_at = now()`;
    }
    if (removed.length) await sql`delete from indexnow_pages where url = any(${removed})`;
  }
  return { checked: seen.size, sent: changed, removed, failed, result };
}

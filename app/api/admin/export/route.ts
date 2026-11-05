import { isAdmin } from '@/lib/admin';
import { csvResponse, toCsv } from '@/lib/csv';
import { all, hasStore, type Outcome } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OUTCOMES: Outcome[] = ['ok', 'sitecore', 'vendor', 'personal'];

/** The admin's CSV download, behind the admin session. ?tab=all|ok|declined|vendor|sitecore|personal */
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response('Not found', { status: 404 });
  if (!hasStore) return new Response('No database is connected.', { status: 501 });
  const tab = new URL(req.url).searchParams.get('tab') || 'all';
  let rows = await all(OUTCOMES.includes(tab as Outcome) ? { outcome: tab as Outcome } : {});
  if (tab === 'declined') rows = rows.filter((r) => r.outcome !== 'ok');
  return csvResponse(toCsv(rows), `cypher-${tab}`);
}

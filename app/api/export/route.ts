import { csvResponse, toCsv } from '@/lib/csv';
import { all, hasStore, type Outcome } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OUTCOMES: Outcome[] = ['ok', 'sitecore', 'vendor', 'personal'];

/**
 * GET /api/export?key=ADMIN_KEY → the companies put forward as CSV, keenest first.
 * Add &outcome=all for every attempt (declined ones too), or &outcome=vendor (or sitecore, personal).
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const key = params.get('key') || req.headers.get('x-admin-key') || '';
  const admin = process.env.ADMIN_KEY || '';
  if (!admin || key !== admin) return new Response('Not found', { status: 404 });
  if (!hasStore) return new Response('No database is connected. Add Neon Postgres in Vercel.', { status: 501 });

  const want = params.get('outcome') || 'ok';
  const outcome = OUTCOMES.find((o) => o === want);
  if (want !== 'all' && !outcome) return new Response('Unknown outcome', { status: 400 });

  const rows = await all(outcome ? { outcome } : {});
  if (outcome === 'ok') {
    rows.sort((a, b) => (b.level ?? 0) - (a.level ?? 0) || a.createdAt.getTime() - b.createdAt.getTime());
  }

  return csvResponse(toCsv(rows), `cypher-selection-${want}`);
}

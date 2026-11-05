import { all, hasStore } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

/** GET /api/export?key=ADMIN_KEY → every submission as CSV, keenest first. */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key') || req.headers.get('x-admin-key') || '';
  const admin = process.env.ADMIN_KEY || '';
  if (!admin || key !== admin) return new Response('Not found', { status: 404 });
  if (!hasStore) return new Response('No storage is connected. Add Upstash for Redis in Vercel.', { status: 501 });

  const rows = (await all()).sort((a, b) => b.level - a.level || a.at.localeCompare(b.at));
  const head = ['company', 'domain', 'email', 'interest', 'level', 'card', 'at'];
  const csv = [
    head.join(','),
    ...rows.map((r) => [r.company, r.domain, r.email, r.interest, r.level, r.source, r.at].map(cell).join(',')),
  ].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cypher-selection-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

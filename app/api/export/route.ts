import { all, hasStore, type Outcome } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cell = (v: unknown) => {
  const s = v instanceof Date ? v.toISOString() : String(v ?? '');
  // A leading =, +, - or @ would run as a formula when the CSV is opened in a spreadsheet.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

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

  const head = ['company', 'domain', 'email', 'outcome', 'interest', 'level', 'card', 'at', 'team_emailed', 'confirmation_sent', 'email_error'];
  const csv = [
    head.join(','),
    ...rows.map((r) =>
      [r.company, r.domain, r.email, r.outcome, r.interest, r.level, r.source, r.createdAt, r.internalSentAt, r.confirmationSentAt, r.emailError]
        .map(cell)
        .join(','),
    ),
  ].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cypher-selection-${want}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

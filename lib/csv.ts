import type { Row } from './store';

const cell = (v: unknown) => {
  const s = v instanceof Date ? v.toISOString() : String(v ?? '');
  // A leading =, +, - or @ would run as a formula when the CSV is opened in a spreadsheet.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

/** Submissions as CSV: one row each, with whether the emails went out. */
export function toCsv(rows: Row[]): string {
  const head = ['company', 'domain', 'email', 'outcome', 'site', 'wants', 'interest', 'level', 'card', 'at', 'team_emailed', 'confirmation_sent', 'email_error'];
  return [
    head.join(','),
    ...rows.map((r) =>
      [r.company, r.domain, r.email, r.outcome, r.site, r.wants, r.interest, r.level, r.source, r.createdAt, r.internalSentAt, r.confirmationSentAt, r.emailError]
        .map(cell)
        .join(','),
    ),
  ].join('\n');
}

export const csvResponse = (csv: string, name: string) =>
  new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });

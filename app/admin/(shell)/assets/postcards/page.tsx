import Link from 'next/link';
import { AssetsHead, FILES } from '@/components/admin/assets/parts';
import PrintButton from '@/components/PrintButton';
import { QuarterCard, THEME_NAME, qrCodes } from '@/components/PrintCard';
import { cardStats } from '@/lib/adminData';
import { requireUser } from '@/lib/auth/request';
import { EYE, RETIRED, SCAN_BASE, USE_CASES } from '@/lib/postcards';

/** A card's file name in the print run, as scripts/postcard-pdfs.mjs writes it. */
const printName = (i: number, id: string) => `cypher-P${i + 1}-${id}`;
const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (a: number, b: number) => (!b ? '–' : !a ? '0%' : `${((a / b) * 100).toFixed(a / b < 0.1 ? 1 : 0)}%`);
const RANGES = [[7, '7 days'], [30, '30 days'], [0, 'All time']] as const;

/**
 * The print run: six cards, 4.25 × 5.5 in, portrait, one per sheet, each in its own colour, and how each
 * one does (scans of its QR code, and sign-ups that named it). Printing this page gives one card per
 * page at trim size; ?bleed=1 adds an eighth of an inch on every side for a commercial printer.
 */
export default async function Postcards({ searchParams }: { searchParams: Promise<{ bleed?: string; days?: string }> }) {
  await requireUser('assets', 'read', '/admin/assets/postcards');
  const sp = await searchParams;
  const withBleed = sp.bleed === '1';
  const days = RANGES.some(([n]) => String(n) === sp.days) ? Number(sp.days) : 0;
  const [codes, stats] = await Promise.all([qrCodes(), cardStats(days)]);
  const cards = USE_CASES.flatMap((u) => u.cards);
  const info = new Map<string, { label: string; line: string }>([
    ...RETIRED.flatMap((u) => u.cards.map((c) => [c.id, { label: 'Retired', line: c.line }] as [string, { label: string; line: string }])),
    ...cards.map((c, i) => [c.id, { label: `P${i + 1}`, line: c.line }] as [string, { label: string; line: string }]),
  ]);
  const rows = stats
    ? [
        ...cards.map((c) => stats.cards.find((s) => s.card === c.id) ?? { card: c.id, scans: 0, ok: 0, declined: 0 }),
        ...stats.cards.filter((s) => !cards.some((c) => c.id === s.card) && (s.scans || s.ok || s.declined)),
      ]
    : [];
  const q = (o: Record<string, string>) => `/admin/assets/postcards?${new URLSearchParams(Object.entries({ days: days ? String(days) : '', bleed: withBleed ? '1' : '', ...o }).filter(([, v]) => v))}`;

  return (
    <main className={`wrap ad pc-admin${withBleed ? ' bleed' : ''}`}>
      <AssetsHead
        on="/admin/assets/postcards"
        title="Postcards"
        actions={
          <>
            <PrintButton label={withBleed ? 'Print with bleed' : 'Print the six'} />
            <a className="ad-btn" href={`${FILES}/print/cypher-postcards-print-run.zip`} download>All PDFs (ZIP)</a>
          </>
        }
      >
        The six we print: 4.25 × 5.5 in, portrait, one card per sheet, each in its own colour. Every QR code carries its card’s code, so each card’s scans are counted.
      </AssetsHead>

      <section className="ad-card ad-wide">
        <div className="ad-people-head">
          <h3>How each card does</h3>
          <nav className="ad-range" aria-label="Range">
            {RANGES.map(([n, label]) => <Link key={n} href={q({ days: n ? String(n) : '' })} className={n === days ? 'on' : undefined}>{label}</Link>)}
          </nav>
        </div>
        {!stats ? (
          <p className="ad-empty">No database is connected.</p>
        ) : (
          <>
            <p className="ad-fine as-story">{fmt(stats.scans)} scans, {pct(stats.scans, stats.visits)} of all visits{days ? ` in the last ${days} days` : ''}. A scan is one person on one day arriving by a card’s QR code.</p>
            <div className="ad-scroll">
              <table className="ad-tbl">
                <thead><tr><th>Card</th><th>Line</th><th className="r">Scans</th><th className="r">Signed up</th><th className="r">Declined</th><th className="r">Scan → sign-up</th></tr></thead>
                <tbody>
                  {rows.map((c) => {
                    const i = info.get(c.card);
                    return (
                      <tr key={c.card} className={c.scans || c.ok ? undefined : 'ad-dim'}>
                        <td><b>{c.card}</b> <span className="ad-v">{i?.label ?? 'Unknown'}</span></td>
                        <td className="ad-line">{i?.line ?? ''}</td>
                        <td className="r">{fmt(c.scans)}</td>
                        <td className="r">{fmt(c.ok)}</td>
                        <td className="r">{fmt(c.declined)}</td>
                        <td className="r">{pct(c.ok, c.scans)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="ad-card ad-wide pc-printnote">
        <div className="ad-people-head">
          <h3>The print run</h3>
          <Link className="ad-btn small" href={q({ bleed: withBleed ? '' : '1' })}>{withBleed ? 'Trim size instead' : 'With bleed, for a print shop'}</Link>
        </div>
        <p className="ad-fine">
          {withBleed
            ? 'Printing with bleed: 4.5 × 5.75 in pages, trim to 4.25 × 5.5 in. Send these to a print shop.'
            : 'Printing at trim size: 4.25 × 5.5 in pages, colour to the edge. For an office printer, use cardstock and borderless printing; a print shop will want the bleed version.'}
        </p>
      </section>

      <div className="qc-grid">
        {cards.map((c, i) => (
          <figure className="qcw" key={c.id} data-file={printName(i, c.id)}>
            <QuarterCard c={c} code={codes[c.id]} />
            <figcaption className="pcw-cap">
              <b>P{i + 1}</b> · {c.id} · {EYE[c.eye].name}, on {THEME_NAME[c.theme]}
              <br />
              <a href={`${SCAN_BASE}${c.id}`}>{`${SCAN_BASE}${c.id}`.replace('https://', '')}</a>
              <span className="qc-dl">
                <a href={`${FILES}/print/${printName(i, c.id)}-trim.pdf`} download>PDF, trim</a>
                <a href={`${FILES}/print/${printName(i, c.id)}-bleed.pdf`} download>PDF, with bleed</a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}

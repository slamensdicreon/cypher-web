import { AssetsHead } from '@/components/admin/assets/parts';
import { requireUser } from '@/lib/auth/request';
import PrintButton from '@/components/PrintButton';
import { PrintCard, qrCodes } from '@/components/PrintCard';
import { USE_CASES } from '@/lib/postcards';

const PER_SHEET = 9;
/** Card edges on the sheet, in inches: three columns from 0.5 in, three rows from 0.25 in. */
const XS = [0.5, 3, 5.5, 8];
const YS = [0.25, 3.75, 7.25, 10.75];

/** Crop marks in the margins, lined up with every card edge. */
function CropMarks() {
  return (
    <svg className="tc-marks" viewBox="0 0 8.5 11" aria-hidden="true">
      <g stroke="#141433" strokeWidth="0.008">
        {XS.map((x) => (
          <g key={`x${x}`}>
            <line x1={x} y1={0.03} x2={x} y2={0.2} />
            <line x1={x} y1={10.8} x2={x} y2={10.97} />
          </g>
        ))}
        {YS.map((y) => (
          <g key={`y${y}`}>
            <line x1={0.05} y1={y} x2={0.42} y2={y} />
            <line x1={8.08} y1={y} x2={8.45} y2={y} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Trading cards, 2.5 × 3.5 in, nine to a US Letter sheet with crop marks. Not linked from the site. */
export default async function TradingCards() {
  await requireUser('assets', 'read', '/admin/assets/trading');
  const codes = await qrCodes();
  const cards = USE_CASES.flatMap((u) => u.cards);
  const sheets = Array.from({ length: Math.ceil(cards.length / PER_SHEET) }, (_, i) => cards.slice(i * PER_SHEET, (i + 1) * PER_SHEET));

  return (
    <main className="wrap ad pc-admin">
      <AssetsHead on="/admin/assets/trading" title="Trading cards" actions={<PrintButton label="Print the sheets" />}>
        All {cards.length} cards at 2.5 × 3.5 in, nine to a US Letter sheet, with crop marks. Print at actual size (100%, no scaling) with background graphics on, then cut on the marks.
      </AssetsHead>

      {sheets.map((sheet, i) => (
        <figure className="tc-sheetw" key={i}>
          <figcaption>
            Sheet {i + 1} of {sheets.length} · {sheet[0].id} to {sheet[sheet.length - 1].id}
          </figcaption>
          <div className="tc-scroll">
            <div className="tc-sheet">
              <CropMarks />
              <div className="tc-grid">
                {sheet.map((c) => (
                  <div className="tc-cell" key={c.id}>
                    <PrintCard c={c} code={codes[c.id]} format="trading" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </figure>
      ))}
    </main>
  );
}

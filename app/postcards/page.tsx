import type { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import { QuarterCard, THEME_NAME, qrCodes } from '@/components/PrintCard';
import SiteHeader from '@/components/SiteHeader';
import { EYE, SCAN_BASE, USE_CASES } from '@/lib/postcards';

/** A card's file name in the print run, as scripts/postcard-pdfs.mjs writes it. */
const printName = (i: number, id: string) => `cypher-P${i + 1}-${id}`;

export const metadata: Metadata = {
  title: 'Postcards | Cypher',
  description: 'The postcard print run for Symposium. Internal.',
  robots: { index: false, follow: false },
};

/**
 * The print run: six cards, 4.25 × 5.5 in, portrait, one per sheet, each in its own colour. Printing
 * this page gives one card per page at trim size; ?bleed=1 adds an eighth of an inch on every side for
 * a commercial printer. Not linked.
 */
export default async function Postcards({ searchParams }: { searchParams: Promise<{ bleed?: string }> }) {
  const { bleed } = await searchParams;
  const withBleed = bleed === '1';
  const codes = await qrCodes();
  const cards = USE_CASES.flatMap((u) => u.cards);

  return (
    <>
      <SiteHeader />
      <main className={`wrap pc-page${withBleed ? ' bleed' : ''}`}>
        <div className="pc-intro">
          <h1>Postcards.</h1>
          <p>
            The six we print. 4.25 × 5.5 in, portrait, one card per sheet, each in its own colour, and every one works handed over or left on a table. Every QR
            code carries its card’s code, so the admin shows which card earns the scans.
          </p>
          <p className="pc-note">
            {withBleed
              ? 'Printing with bleed: 4.5 × 5.75 in pages, trim to 4.25 × 5.5 in. Send these to a print shop.'
              : 'Printing at trim size: 4.25 × 5.5 in pages, colour to the edge. For an office printer, cardstock and borderless printing; a print shop will want the bleed version.'}
          </p>
          <div className="pc-actions">
            <PrintButton label={withBleed ? 'Print with bleed' : 'Print the six'} />
            <a className="pc-switch" href="/postcards/print/cypher-postcards-print-run.zip" download>Download all (ZIP: trim and bleed PDFs)</a>
            <Link className="pc-switch" href={withBleed ? '/postcards' : '/postcards?bleed=1'}>{withBleed ? 'Trim size instead' : 'With bleed, for a print shop'}</Link>
            <Link className="pc-switch" href="/admin">← Admin</Link>
            <Link className="pc-switch" href="/postcards/trading">Trading cards, 2.5 × 3.5 in</Link>
            <Link className="pc-switch" href="/postcards/social">Social ads, 1080 × 1080</Link>
          </div>
        </div>

        <div className="qc-grid">
          {cards.map((c, i) => (
            <figure className="qcw" key={c.id} data-file={printName(i, c.id)}>
              <QuarterCard c={c} code={codes[c.id]} />
              <figcaption className="pcw-cap">
                <b>P{i + 1}</b> · {c.id} · {EYE[c.eye].name}, on {THEME_NAME[c.theme]}
                <br />
                <a href={`${SCAN_BASE}${c.id}`}>{`${SCAN_BASE}${c.id}`.replace('https://', '')}</a>
                <span className="qc-dl">
                  <a href={`/postcards/print/${printName(i, c.id)}-trim.pdf`} download>PDF, trim</a>
                  <a href={`/postcards/print/${printName(i, c.id)}-bleed.pdf`} download>PDF, with bleed</a>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
    </>
  );
}

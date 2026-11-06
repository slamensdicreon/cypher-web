import type { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import { PrintCard, THEME_NAME, qrCodes } from '@/components/PrintCard';
import SiteHeader from '@/components/SiteHeader';
import { EYE, SCAN_BASE, USE_CASES } from '@/lib/postcards';

export const metadata: Metadata = {
  title: 'Postcards | Cypher',
  description: 'The postcard campaign for Symposium. Internal.',
  robots: { index: false, follow: false },
};

/** The campaign, place by place, two versions each, as printed: 4×6 in, one per page. Not linked. */
export default async function Postcards() {
  const codes = await qrCodes();

  return (
    <>
      <SiteHeader />
      <main className="wrap pc-page">
        <div className="pc-intro">
          <h1>Postcards.</h1>
          <p>
            Eleven places around the Swan and Dolphin, two versions of the card for each, and six evergreen cards for anywhere. Unbranded, one line each, five colours and a
            different look in the eye on every card. Every QR code carries its card’s code, so the scans say which version wins.
          </p>
          <div className="pc-actions">
            <PrintButton label="Print the postcards" />
            <Link className="pc-switch" href="/postcards/trading">Trading cards, 2.5 × 3.5 in</Link>
            <Link className="pc-switch" href="/postcards/social">Social ads, 1080 × 1080</Link>
          </div>
        </div>

        {USE_CASES.map((u) => (
          <section className="pc-case" key={u.n}>
            <h2>
              <span>{u.n}</span> {u.place}
            </h2>
            {u.note && <p className="pc-note">{u.note}</p>}
            <div className="pc-pair">
              {u.cards.map((c, i) => (
                <figure className="pcw" key={c.id}>
                  <PrintCard c={c} code={codes[c.id]} />
                  <figcaption>
                    <b>{u.cards.length === 2 ? (i === 0 ? 'A' : 'B') : `${u.n}${i + 1}`}</b> · {c.id} · {EYE[c.eye].name}, on {THEME_NAME[c.theme]}
                    <br />
                    <a href={`${SCAN_BASE}${c.id}`}>{`${SCAN_BASE}${c.id}`.replace('https://', '')}</a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}

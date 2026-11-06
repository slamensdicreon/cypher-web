import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { THEME_NAME } from '@/lib/cardStyle';
import { EYE, USE_CASES } from '@/lib/postcards';
import { AD_CARDS, AD_SIZE, adFile } from '@/lib/socialAd';

export const metadata: Metadata = {
  title: 'Social ads | Cypher',
  description: 'The campaign cards as square social ads. Internal.',
  robots: { index: false, follow: false },
};

const img = (id: string) => `/postcards/social/img/${adFile(id)}`;

/** The cards as 1080 × 1080 social ads, each one a click to download. Not linked from the site. */
export default function SocialAds() {
  return (
    <>
      <SiteHeader />
      <main className="wrap pc-page">
        <div className="pc-intro">
          <h1>Social ads.</h1>
          <p>
            All {AD_CARDS.length} cards as square ads, {AD_SIZE} × {AD_SIZE} PNG: the size Instagram, LinkedIn, Facebook and X take for a
            square post. No QR code; the post links to the site instead. Download one, or all of them in a ZIP.
          </p>
          <div className="pc-actions">
            <a className="btn pc-print" href="/postcards/social/cypher-social-ads.zip" download>
              Download all {AD_CARDS.length} (ZIP)
            </a>
            <Link className="pc-switch" href="/postcards">Postcards, 4 × 6 in</Link>
            <Link className="pc-switch" href="/postcards/trading">Trading cards, 2.5 × 3.5 in</Link>
          </div>
        </div>

        {USE_CASES.map((u) => (
          <section className="pc-case" key={u.n}>
            <h2>
              <span>{u.n}</span> {u.place}
            </h2>
            {u.note && <p className="pc-note">{u.note}</p>}
            <div className="sa-grid">
              {u.cards.map((c, i) => (
                <figure className="sa" key={c.id}>
                  <a href={img(c.id)} target="_blank" rel="noreferrer" className="sa-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(c.id)} width={AD_SIZE} height={AD_SIZE} alt={`${c.line} ${c.payoff}`} loading="lazy" />
                  </a>
                  <figcaption>
                    <span>
                      <b>{u.cards.length === 2 ? (i ? 'B' : 'A') : `${u.n}${i + 1}`}</b> · {c.id} · {EYE[c.eye].name}, on {THEME_NAME[c.theme]}
                    </span>
                    <a className="sa-dl" href={img(c.id)} download={adFile(c.id)}>
                      Download PNG
                    </a>
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

import { AssetsHead } from '@/components/admin/assets/parts';
import { requireUser } from '@/lib/auth/request';
import { THEME_NAME } from '@/lib/cardStyle';
import { EYE, USE_CASES } from '@/lib/postcards';
import { AD_CARDS, AD_SIZE, adFile } from '@/lib/socialAd';

const img = (id: string) => `/admin/assets/social-ads/img/${adFile(id)}`;

/** The cards as 1080 × 1080 social ads, each one a click to download. */
export default async function SocialAds() {
  await requireUser('assets', 'read', '/admin/assets/social-ads');
  return (
    <main className="wrap ad">
      <AssetsHead
        on="/admin/assets/social-ads"
        title="Social ads"
        actions={<a className="ad-btn primary" href="/admin/assets/social-ads/cypher-social-ads.zip" download>All {AD_CARDS.length} (ZIP)</a>}
      >
        The cards as square ads, {AD_SIZE} × {AD_SIZE} PNG: the size Instagram, LinkedIn, Facebook and X take for a square post. No QR code; the post links to the site instead.
      </AssetsHead>
      {USE_CASES.map((u) => (
        <section className="ad-card ad-wide" key={u.n}>
          <h3>{u.place}</h3>
          <div className="as-ads">
            {u.cards.map((c, i) => (
              <figure key={c.id}>
                <a href={img(c.id)} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(c.id)} width={AD_SIZE} height={AD_SIZE} alt={`${c.line} ${c.payoff}`} loading="lazy" />
                </a>
                <figcaption>
                  <span><b>P{i + 1}</b> <span className="ad-dim">{c.id} · {EYE[c.eye].name}, on {THEME_NAME[c.theme]}</span></span>
                  <a className="ad-btn small" href={img(c.id)} download={adFile(c.id)}>PNG</a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

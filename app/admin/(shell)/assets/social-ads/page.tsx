import { AssetsHead } from '@/components/admin/assets/parts';
import { requireUser } from '@/lib/auth/request';
import { THEME_NAME } from '@/lib/cardStyle';
import { EYE } from '@/lib/postcards';
import { AD_CARDS, AD_GROUPS, AD_SIZE, adFile } from '@/lib/socialAd';

const img = (id: string) => `/admin/assets/social-ads/img/${adFile(id)}`;

/** The square social ads, each with the post to publish beside it and a click to download. */
export default async function SocialAds() {
  await requireUser('assets', 'read', '/admin/assets/social-ads');
  return (
    <main className="wrap ad">
      <AssetsHead
        on="/admin/assets/social-ads"
        title="Social ads"
        actions={<a className="ad-btn primary" href="/admin/assets/social-ads/cypher-social-ads.zip" download>All {AD_CARDS.length} (ZIP)</a>}
      >
        Square ads, {AD_SIZE} × {AD_SIZE} PNG, the size Instagram, LinkedIn, Facebook and X take. They speak to the marketer, the same way the site does, and each comes with a post
        that links to the right page. The printed postcards keep their own copy.
      </AssetsHead>
      {AD_GROUPS.map((g) => (
        <section className="ad-card ad-wide" key={g.name}>
          <h3>{g.name} <span className="ad-dim">· {g.note}</span></h3>
          <div className="as-ads">
            {g.ads.map((c) => (
              <figure key={c.id}>
                <a href={img(c.id)} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(c.id)} width={AD_SIZE} height={AD_SIZE} alt={`${c.line} ${c.payoff}`} loading="lazy" />
                </a>
                <figcaption>
                  <span><b>{c.id}</b> <span className="ad-dim">{EYE[c.eye].name}, on {THEME_NAME[c.theme]}</span></span>
                  <a className="ad-btn small" href={img(c.id)} download={adFile(c.id)}>PNG</a>
                </figcaption>
                <p className="as-post"><span className="ad-dim">Post</span>{c.caption}</p>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

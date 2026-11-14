import { AssetsHead, Dl, FILES } from '@/components/admin/assets/parts';
import { requireUser } from '@/lib/auth/request';
import { AVATARS } from '@/lib/socialKitFiles';
import { BANNERS, NETWORKS, VARIANTS } from '@/lib/socialKit';

const S = `${FILES}/social`;
const IMG = '/admin/assets/social/img';

/** The evergreen profile kit: avatars and banners for every network, at each network's size. */
export default async function SocialProfiles() {
  await requireUser('assets', 'read', '/admin/assets/social');
  return (
    <main className="wrap ad">
      <AssetsHead on="/admin/assets/social" title="Social profiles" actions={<Dl href="/admin/assets/social/cypher-social-profiles.zip" primary>Whole kit (ZIP)</Dl>}>
        Avatars and banners at each network’s size, in the site’s look, with the words inside every network’s safe area. Brand, Outcomes, Proof and Day one are the
        message variants: rotate them, keep the avatar.
      </AssetsHead>

      <section className="ad-card ad-wide">
        <h3>Avatars <span className="ad-dim">· 1000 × 1000, crops to a circle</span></h3>
        <div className="as-avatars">
          {AVATARS.map(([f, name]) => (
            <figure key={f}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${S}/${f}.png`} alt={`Avatar, ${name}`} loading="lazy" />
              <figcaption><b>{name}</b><Dl href={`${S}/${f}.png`}>PNG</Dl></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {NETWORKS.map((n) => {
        const files = BANNERS.filter((b) => b.n.key === n.key);
        return (
          <section key={n.key} className="ad-card ad-wide">
            <h3>{n.net} <span className="ad-dim">· {n.w} × {n.h}</span></h3>
            <div className={`as-banners${files.length > 1 ? ' many' : ''}`}>
              {files.map((b) => (
                <figure key={b.file}>
                  <a href={`${IMG}/${b.file}`} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${IMG}/${b.file}`} alt={`${n.net}, ${VARIANTS[b.v].label}: ${[...VARIANTS[b.v].light, ...VARIANTS[b.v].bold].join(' ')}`} loading="lazy" />
                  </a>
                  <figcaption><b>{VARIANTS[b.v].label}</b><Dl href={`${IMG}/${b.file}`}>PNG</Dl></figcaption>
                </figure>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

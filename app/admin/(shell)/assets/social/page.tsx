import { AssetsHead, Dl, FILES } from '@/components/admin/assets/parts';
import { requireUser } from '@/lib/auth/request';

const S = `${FILES}/social`;
const AVATARS = [
  ['cypher-avatar-ink-1000x1000', 'Ink'],
  ['cypher-avatar-coral-1000x1000', 'Coral'],
  ['cypher-avatar-white-1000x1000', 'White'],
] as const;
/** The banners by network, each with its message variants. */
const BANNERS = [
  { net: 'LinkedIn company page', size: '1128 × 191', files: ['cypher-linkedin-company-1128x191', 'cypher-linkedin-company-outcomes-1128x191', 'cypher-linkedin-company-proof-1128x191', 'cypher-linkedin-company-learn-1128x191'] },
  { net: 'LinkedIn personal profile', size: '1584 × 396', files: ['cypher-linkedin-personal-1584x396', 'cypher-linkedin-personal-outcomes-1584x396', 'cypher-linkedin-personal-proof-1584x396', 'cypher-linkedin-personal-learn-1584x396'] },
  { net: 'X header', size: '1500 × 500', files: ['cypher-x-header-1500x500', 'cypher-x-header-outcomes-1500x500', 'cypher-x-header-proof-1500x500', 'cypher-x-header-learn-1500x500'] },
  { net: 'YouTube channel art', size: '2560 × 1440', files: ['cypher-youtube-2560x1440'] },
  { net: 'Facebook cover', size: '1640 × 624', files: ['cypher-facebook-cover-1640x624'] },
  { net: 'Bluesky banner', size: '3000 × 1000', files: ['cypher-bluesky-banner-3000x1000'] },
] as const;
const VARIANT = (f: string) => (f.includes('-outcomes-') ? 'Outcomes' : f.includes('-proof-') ? 'Proof' : f.includes('-learn-') ? 'It learns' : 'Brand');

/** The evergreen profile kit: avatars and banners for every network, at each network's size. */
export default async function SocialProfiles() {
  await requireUser('assets', 'read', '/admin/assets/social');
  return (
    <main className="wrap ad">
      <AssetsHead on="/admin/assets/social" title="Social profiles" actions={<Dl href={`${S}/cypher-social-profiles.zip`} primary>Whole kit (ZIP)</Dl>}>
        Avatars and banners at each network’s size, with the important part inside every network’s safe area. Brand, Outcomes, Proof and It learns are the
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

      {BANNERS.map((b) => (
        <section key={b.net} className="ad-card ad-wide">
          <h3>{b.net} <span className="ad-dim">· {b.size}</span></h3>
          <div className={`as-banners${b.files.length > 1 ? ' many' : ''}`}>
            {b.files.map((f) => (
              <figure key={f}>
                <a href={`${S}/${f}.png`} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${S}/${f}.png`} alt={`${b.net}, ${VARIANT(f)}`} loading="lazy" />
                </a>
                <figcaption><b>{VARIANT(f)}</b><Dl href={`${S}/${f}.png`}>PNG</Dl></figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

import Link from 'next/link';
import { AssetsHead, FILES } from '@/components/admin/assets/parts';
import { cardStats } from '@/lib/adminData';
import { requireUser } from '@/lib/auth/request';
import { USE_CASES } from '@/lib/postcards';
import { AD_CARDS, adFile } from '@/lib/socialAd';

/** Everything that carries the brand, in one place: logos, profiles, videos, ads, print and the deck. */
export default async function Assets() {
  await requireUser('assets', 'read', '/admin/assets');
  const stats = await cardStats(0).catch(() => null);
  const cards = USE_CASES.flatMap((u) => u.cards);
  const sections = [
    { href: '/admin/assets/logos', title: 'Logos & brand', note: '7 logos in SVG and PNG, the colours, the type, and how Cypher talks.', img: `${FILES}/logos/cypher-logo-horizontal-for-dark-backgrounds.svg`, kind: 'logo', zip: `${FILES}/logos/cypher-logos.zip` },
    { href: '/admin/assets/social', title: 'Social profiles', note: 'Avatars and banners for LinkedIn, X, YouTube, Facebook and Bluesky, in the site’s look, with four message variants.', img: '/admin/assets/social/img/cypher-linkedin-personal-1584x396.png', kind: 'banner', zip: '/admin/assets/social/cypher-social-profiles.zip' },
    { href: '/admin/assets/videos', title: 'Videos', note: 'Under the hood, Waiting on you and It asks once, each in 9:16, 1:1 and 16:9, with sound.', img: `${FILES}/videos/cypher-under-the-hood-42s-landscape.jpg`, kind: 'video' },
    { href: '/admin/assets/social-ads', title: 'Social ads', note: `${AD_CARDS.length} square posts for the marketer, each with its post copy.`, img: `/admin/assets/social-ads/img/${adFile(AD_CARDS[0].id)}`, kind: 'ad', zip: '/admin/assets/social-ads/cypher-social-ads.zip' },
    { href: '/admin/assets/postcards', title: 'Postcards', note: `The ${cards.length}-card print run, with each card’s scans and sign-ups${stats ? ` (${stats.scans.toLocaleString('en-US')} scans so far)` : ''}.`, img: `/admin/assets/postcards/img/${adFile(cards[1]?.id ?? cards[0].id)}`, kind: 'ad', zip: `${FILES}/print/cypher-postcards-print-run.zip` },
    { href: '/admin/assets/trading', title: 'Trading cards', note: '2.5 × 3.5 in, nine to a sheet with crop marks.', img: `/admin/assets/postcards/img/${adFile(cards[2]?.id ?? cards[0].id)}`, kind: 'ad' },
  ];

  return (
    <main className="wrap ad">
      <AssetsHead on="/admin/assets" title="Campaign assets" actions={<a className="ad-btn" href="/api/admin/deck" download>Pitch deck (.pptx)</a>}>
        Everything that carries the brand. Download what you need; every file stays behind the admin sign-in.
      </AssetsHead>
      <div className="as-overview">
        {sections.map((s) => (
          <article key={s.href} className="ad-card as-tile">
            <Link href={s.href} className={`as-thumb k-${s.kind}`} tabIndex={-1} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt="" loading="lazy" />
            </Link>
            <h3><Link href={s.href}>{s.title}</Link></h3>
            <p className="ad-fine">{s.note}</p>
            <div className="ad-actions">
              <Link className="ad-btn small" href={s.href}>Open</Link>
              {s.zip && <a className="ad-btn small ghost" href={s.zip} download>Download all</a>}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

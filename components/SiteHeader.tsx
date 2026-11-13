import Link from 'next/link';
import CtaLink from '@/components/site/CtaLink';
import { live } from '@/lib/site';

/** The closed, resting eye: Cypher, saying nothing. */
export const Resting = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden="true">
    <circle cx="36" cy="36" r="31" fill="#ffffff" />
    <path d="M20 36 Q36 50 52 36" fill="none" stroke="#141433" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/**
 * The site's header: the wordmark, the pages that are live (they join as they ship), and the one
 * action, Book a demo. Until there are pages, the line keeps its place.
 */
export default function SiteHeader() {
  const groups = (['Product', 'Outcomes', 'Platforms'] as const).map((g) => ({ g, items: live(g) })).filter((x) => x.items.length);
  const extra = live('Company').filter((n) => n.href !== '/demo');
  return (
    <header className="top">
      <Link className="wordmark" href="/"><Resting size={30} />cypher</Link>
      {groups.length || extra.length ? (
        <nav className="site-nav" aria-label="Site">
          {groups.map(({ g, items }) => (
            <Link key={g} href={items[0].href}>{g}</Link>
          ))}
          {extra.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
      ) : (
        <span className="count lower top-line">there is no spoon.</span>
      )}
      <CtaLink href="/demo" label="header" className="site-cta">Book a demo</CtaLink>
    </header>
  );
}

import Link from 'next/link';
import CtaLink from '@/components/site/CtaLink';
import { Resting } from '@/components/SiteHeader';
import { live } from '@/lib/site';

/** The site's footer: every live page by group, the legal pages, and the line. */
export default function SiteFooter() {
  const groups = (['Product', 'Outcomes', 'Platforms', 'Company'] as const).map((g) => ({ g, items: live(g) })).filter((x) => x.items.length);
  return (
    <footer className="site-foot">
      <div className="sf-top">
        <div className="sf-brand">
          <Link className="wordmark" href="/"><Resting size={26} />cypher</Link>
          <p>Twenty-one specialists and the mind that runs them. Any enterprise platform.</p>
          <CtaLink href="/demo" label="footer" className="site-cta">Book a demo</CtaLink>
        </div>
        <nav className="sf-cols" aria-label="Footer">
          {groups.map(({ g, items }) => (
            <div key={g}>
              <b>{g}</b>
              {items.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
            </div>
          ))}
          <div>
            <b>Legal</b>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </nav>
      </div>
      <p className="sf-line">Not affiliated with your agency. Obviously.</p>
    </footer>
  );
}

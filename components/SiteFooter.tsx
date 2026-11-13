import Link from 'next/link';
import CtaLink from '@/components/site/CtaLink';
import { EyeMark } from '@/components/site/Marks';

/** The site's footer: the wordmark and the line, the pages, the legal pages. */
export default function SiteFooter() {
  return (
    <footer className="bl-foot">
      <div className="bl-w bl-foot-in">
        <div className="bl-foot-brand">
          <Link className="bl-mark bl-mark-sm" href="/" aria-label="Cypher, home"><EyeMark state="resting" size={24} />cypher</Link>
          <p>Twenty-one specialists and the mind that runs them. Any enterprise platform.</p>
        </div>
        <nav className="bl-foot-nav" aria-label="Footer">
          <span><Link href="/how-it-works">How it works</Link><Link href="/playbooks">Playbooks</Link></span>
          <span><CtaLink href="/demo" label="footer">Book a demo</CtaLink></span>
          <span><Link href="/terms">Terms of Use</Link><Link href="/privacy">Privacy</Link></span>
        </nav>
      </div>
      <p className="bl-w bl-foot-line">Not affiliated with your agency. Obviously.</p>
    </footer>
  );
}

import Link from 'next/link';
import { EyeMark } from '@/components/site/Marks';
import SiteMenu from '@/components/site/SiteMenu';

/** The closed, resting eye, drawn for the shell. The Terms' signature block uses it. */
export const Resting = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden="true">
    <circle cx="36" cy="36" r="31" fill="#ffffff" />
    <path d="M20 36 Q36 50 52 36" fill="none" stroke="#141433" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/** The site's header: the wordmark, the line, and the menu. */
export default function SiteHeader() {
  return (
    <header className="bl-w bl-top">
      <Link className="bl-mark" href="/" aria-label="Cypher, home">
        <EyeMark state="resting" size={30} />cypher
      </Link>
      <SiteMenu />
    </header>
  );
}

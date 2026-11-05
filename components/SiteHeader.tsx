import Link from 'next/link';

/** The closed, resting eye: Cypher, saying nothing. */
export const Resting = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden="true">
    <circle cx="36" cy="36" r="31" fill="#ffffff" />
    <path d="M20 36 Q36 50 52 36" fill="none" stroke="#141433" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export default function SiteHeader() {
  return (
    <header className="top">
      <Link className="wordmark" href="/"><Resting size={30} />cypher</Link>
      <span className="count lower">there is no spoon.</span>
    </header>
  );
}

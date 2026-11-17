import type { Metadata } from 'next';
import Article from '@/components/site/Article';
import { PROOF } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const metadata: Metadata = pageMeta(PROOF, '/proof');
export const viewport = LIGHT;

/** The proof so far: what Cypher has done, in numbers, and how to check it on your own site. */
export default function Page() {
  return <Article page={PROOF} path="/proof" label="proof" trail={[{ name: 'Proof', href: '/proof' }]} />;
}

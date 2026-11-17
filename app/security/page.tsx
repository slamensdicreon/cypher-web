import type { Metadata } from 'next';
import Article from '@/components/site/Article';
import { SECURITY } from '@/lib/content';
import { LIGHT, pageMeta } from '@/lib/content/meta';

export const metadata: Metadata = pageMeta(SECURITY, '/security');
export const viewport = LIGHT;

/** How Cypher keeps a project safe, for the marketer and everyone who signs it off. */
export default function Page() {
  return <Article page={SECURITY} path="/security" label="security" trail={[{ name: 'Security', href: '/security' }]} />;
}

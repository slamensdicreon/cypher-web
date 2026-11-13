import { AD_CARDS, adFile, idFromFile, socialAd } from '@/lib/socialAd';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return AD_CARDS.map((c) => ({ file: adFile(c.id) }));
}

/** One square ad as a PNG, e.g. /admin/assets/social-ads/img/cypher-pc01a.png. Rendered at build. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const card = AD_CARDS.find((c) => c.id === idFromFile(file));
  if (!card) return new Response('Not found', { status: 404 });
  return socialAd(card);
}

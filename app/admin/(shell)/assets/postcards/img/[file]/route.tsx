import { USE_CASES } from '@/lib/postcards';
import { adFile, idFromFile, socialAd } from '@/lib/socialAd';

export const dynamic = 'force-static';
export const dynamicParams = false;

const CARDS = USE_CASES.flatMap((u) => u.cards);

export function generateStaticParams() {
  return CARDS.map((c) => ({ file: adFile(c.id) }));
}

/** A printed postcard drawn square, for previews in the admin. Rendered at build. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const card = CARDS.find((c) => c.id === idFromFile(file));
  if (!card) return new Response('Not found', { status: 404 });
  return socialAd(card);
}

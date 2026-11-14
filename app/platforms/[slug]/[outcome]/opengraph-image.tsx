import { COMBOS } from '@/lib/content';
import { PAGE_ALT, SHARE_SIZE, pageImage } from '@/lib/shareImage';

export const alt = PAGE_ALT;
export const size = SHARE_SIZE;
export const contentType = 'image/png';

/** This page's link preview: its own headline. */
export default async function Image({ params }: { params: Promise<{ slug: string; outcome: string }> }) {
  const { slug, outcome } = await params;
  const page = COMBOS.find((x) => x.platform === slug && x.slug === outcome);
  return pageImage(page ? page.h1 : { light: '', bold: 'Cypher' });
}

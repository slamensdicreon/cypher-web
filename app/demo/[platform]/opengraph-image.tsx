import { DEMOS } from '@/lib/content/demos';
import { PAGE_ALT, SHARE_SIZE, pageImage } from '@/lib/shareImage';

export const alt = PAGE_ALT;
export const size = SHARE_SIZE;
export const contentType = 'image/png';

/** This demo page's link preview. */
export default async function Image({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const d = DEMOS.find((x) => x.slug === platform);
  return pageImage({ light: d ? d.title : 'Book a demo.', bold: 'Edit it yourself in Visual Builder.' });
}

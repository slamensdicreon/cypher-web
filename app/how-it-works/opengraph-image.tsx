import { PAGE_ALT, SHARE_SIZE, pageImage } from '@/lib/shareImage';

export const alt = PAGE_ALT;
export const size = SHARE_SIZE;
export const contentType = 'image/png';

/** This page's link preview: its own headline. */
export default function Image() {
  return pageImage({ light: 'Here’s how we work together.', bold: 'You stay in charge of the brand.' });
}

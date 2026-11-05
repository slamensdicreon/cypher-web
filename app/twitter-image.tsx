import { SHARE_ALT, SHARE_SIZE, shareImage } from '@/lib/shareImage';

export const alt = SHARE_ALT;
export const size = SHARE_SIZE;
export const contentType = 'image/png';

/** X shows this; the same picture as the Open Graph image, declared explicitly. */
export default function TwitterImage() {
  return shareImage();
}

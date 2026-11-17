import { publishedNote } from '@/lib/notes';
import { PAGE_ALT, SHARE_SIZE, pageImage } from '@/lib/shareImage';

export const alt = PAGE_ALT;
export const size = SHARE_SIZE;
export const contentType = 'image/png';

/** This note's link preview: its own title. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await publishedNote(slug);
  return pageImage({ light: '', bold: n ? n.title : 'Playbook notes' });
}

import { BANNERS, banner } from '@/lib/socialKit';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return BANNERS.map((b) => ({ file: b.file }));
}

/** One profile banner as a PNG, e.g. /admin/assets/social/img/cypher-x-header-1500x500.png. Rendered at build. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const b = BANNERS.find((x) => x.file === file);
  if (!b) return new Response('Not found', { status: 404 });
  return banner(b.n, b.v);
}

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The print run's files (assets/print, made by scripts/postcard-pdfs.mjs): one PDF per card at trim and
 * with bleed, and a ZIP of them all. Prebuilt; the proxy keeps them behind the admin sign-in.
 */
const DIR = join(process.cwd(), 'assets', 'print');
const files = () => readdirSync(DIR).filter((f) => /^[\w.-]+\.(pdf|zip)$/.test(f));

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return files().map((file) => ({ file }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!files().includes(file)) return new Response('Not found', { status: 404 });
  return new Response(readFileSync(join(DIR, file)), {
    headers: {
      'Content-Type': file.endsWith('.zip') ? 'application/zip' : 'application/pdf',
      'Content-Disposition': `attachment; filename="${file}"`,
    },
  });
}

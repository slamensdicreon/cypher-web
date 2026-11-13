import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { apiUser } from '@/lib/auth/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FILE = 'Cypher-Pitch-Deck.pptx';

/** The pitch deck, behind the admin session. Kept out of public/ so only a signed-in admin can get it. */
export async function GET() {
  if (!(await apiUser('assets'))) return new Response('Not found', { status: 404 });
  const body = await readFile(join(process.cwd(), 'assets', 'deck', FILE));
  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${FILE}"`,
      'Content-Length': String(body.length),
      'Cache-Control': 'private, no-store',
    },
  });
}

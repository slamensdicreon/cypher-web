import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { zipSync } from 'fflate';
import { AVATARS } from '@/lib/socialKitFiles';
import { BANNERS, banner } from '@/lib/socialKit';

export const dynamic = 'force-static';

/** The whole profile kit in one ZIP: the avatars and every banner. Built once, at build time. */
export async function GET() {
  const files: Record<string, [Uint8Array, { level: 0 }]> = {};
  const dir = join(process.cwd(), 'public', 'admin', 'assets', 'files', 'social');
  for (const [f] of AVATARS) files[`${f}.png`] = [new Uint8Array(await readFile(join(dir, `${f}.png`))), { level: 0 }];
  for (const b of BANNERS) files[b.file] = [new Uint8Array(await (await banner(b.n, b.v)).arrayBuffer()), { level: 0 }];
  const zip = zipSync(files);
  return new Response(zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer, {
    headers: { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="cypher-social-profiles.zip"' },
  });
}

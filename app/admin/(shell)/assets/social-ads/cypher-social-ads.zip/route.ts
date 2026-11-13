import { zipSync } from 'fflate';
import { AD_CARDS, adFile, socialAd } from '@/lib/socialAd';

export const dynamic = 'force-static';

/** Every square ad in one ZIP, named by card. Built once, at build time. */
export async function GET() {
  const files: Record<string, [Uint8Array, { level: 0 }]> = {};
  for (const c of AD_CARDS) {
    const png = new Uint8Array(await (await socialAd(c)).arrayBuffer());
    files[adFile(c.id)] = [png, { level: 0 }];
  }
  const zip = zipSync(files);
  return new Response(zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="cypher-social-ads.zip"',
    },
  });
}

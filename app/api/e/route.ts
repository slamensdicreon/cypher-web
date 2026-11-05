import { record } from '@/lib/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Analytics beacon. Always answers 204; a bad or bot event is simply dropped. */
export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (text.length < 2000) await record(JSON.parse(text) as Record<string, unknown>, req.headers);
  } catch (err) {
    console.error('[analytics]', err);
  }
  return new Response(null, { status: 204 });
}

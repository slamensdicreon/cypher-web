import { INDEXNOW_KEY } from '@/lib/indexnow';

export const dynamic = 'force-static';

/** The IndexNow key, where search engines look for it to confirm our submissions are ours. */
export function GET() {
  return new Response(INDEXNOW_KEY, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

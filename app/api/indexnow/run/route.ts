import { runIndexNow } from '@/lib/indexnow';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** The daily IndexNow run, called by Vercel Cron with the CRON_SECRET bearer token. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Not found', { status: 404 });
  const result = await runIndexNow();
  console.log('[indexnow] daily run', JSON.stringify({ ...result, sent: result.sent.length, removed: result.removed.length }));
  return Response.json(result);
}

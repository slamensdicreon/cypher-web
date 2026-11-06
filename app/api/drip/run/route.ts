import { runDue } from '@/lib/drip/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/** The daily send run, called by Vercel Cron with the CRON_SECRET bearer token. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return new Response('Not found', { status: 404 });
  const result = await runDue();
  console.log('[drip] daily run', JSON.stringify(result));
  return Response.json(result);
}

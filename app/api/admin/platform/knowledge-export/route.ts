import { audit } from '@/lib/audit';
import { apiUser } from '@/lib/auth/request';
import { PlatformError, platformText } from '@/lib/platform';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The active lessons of a platform (or all) as Markdown, from Launchworks. ?platform=<id> */
export async function GET(req: Request) {
  const s = await apiUser('platform');
  if (!s) return new Response('Not found', { status: 404 });
  const platform = (new URL(req.url).searchParams.get('platform') || '').slice(0, 80);
  try {
    const md = await platformText(s.user, `/knowledge/export${platform ? `?platform=${encodeURIComponent(platform)}` : ''}`);
    await audit(s, { action: 'platform.knowledge-export', entity: 'knowledge', entityId: platform || 'all', summary: `Exported ${platform || 'all'} lessons` }, req.headers);
    return new Response(md, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Content-Disposition': `attachment; filename="lessons-${platform || 'all'}.md"`, 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return new Response((err as PlatformError).message, { status: (err as PlatformError).status || 502 });
  }
}

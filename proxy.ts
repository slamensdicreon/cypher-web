import { NextResponse, type NextRequest } from 'next/server';
import { areaFor, can } from '@/lib/auth/roles';
import { SESSION_COOKIE, sessionFromToken } from '@/lib/auth/session';

/**
 * The gate for the admin and the campaign pages (postcards, trading cards, social ads, print files):
 * a signed-in person whose roles cover the area, checked against the sessions table on every request
 * (cached a few seconds). It runs before the cache, so even prebuilt files are covered.
 * The sign-in pages are open.
 */
const OPEN = ['/admin/sign-in', '/admin/auth/verify'];
const isAdminPath = (p: string) => p === '/admin' || p.startsWith('/admin/') || p === '/postcards' || p.startsWith('/postcards/');

/**
 * The admin's own address. When ADMIN_HOST is set (admin.ignoranceisbliss.ai), the admin answers
 * only there, with its own cookies: admin paths on the public site move to it, and its home page goes
 * to /admin. (Other public pages aren't gated here, to keep the gate off public traffic; nothing links
 * them on the admin address.) Preview and local addresses are left alone.
 */
function hostRedirect(req: NextRequest): NextResponse | null {
  const adminHost = (process.env.ADMIN_HOST || '').toLowerCase().trim();
  if (!adminHost) return null;
  const host = (req.headers.get('host') || '').toLowerCase();
  const path = req.nextUrl.pathname;
  if (host === adminHost && path === '/') return NextResponse.redirect(new URL('/admin', req.url), 308);
  if (host !== adminHost && host.endsWith('ignoranceisbliss.ai') && isAdminPath(path)) return NextResponse.redirect(`https://${adminHost}${path}${req.nextUrl.search}`, 308);
  return null;
}

export async function proxy(req: NextRequest) {
  const moved = hostRedirect(req);
  if (moved) return moved;
  const path = req.nextUrl.pathname;
  if (!isAdminPath(path)) return NextResponse.next();
  if (OPEN.some((p) => path === p || path.startsWith(p + '/'))) return NextResponse.next();
  const s = await sessionFromToken(req.cookies.get(SESSION_COOKIE)?.value).catch(() => null);
  const file = /\.(png|zip|pdf)$/i.test(path);
  if (s && can(s.user.roles, areaFor(path))) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'private, no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  // A file gets a plain not-found; a page goes to sign-in (or home, if signed in without the role).
  if (file) return new NextResponse('Not found', { status: 404 });
  if (s) return NextResponse.redirect(new URL('/admin?msg=' + encodeURIComponent('That part of the admin isn’t in your role.'), req.url), 307);
  const url = new URL('/admin/sign-in', req.url);
  url.searchParams.set('next', path + req.nextUrl.search);
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: ['/', '/admin', '/admin/:path+', '/postcards', '/postcards/:path*'] };

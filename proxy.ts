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

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
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

export const config = { matcher: ['/admin', '/admin/:path+', '/postcards', '/postcards/:path*'] };

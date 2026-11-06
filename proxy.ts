import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE, validToken } from '@/lib/adminToken';

/**
 * The campaign pages (postcards, trading cards, social ads, and their images and ZIP) are for
 * signed-in admins only. This runs before the cache, so even the prebuilt files are covered.
 */
export function proxy(req: NextRequest) {
  if (validToken(req.cookies.get(COOKIE)?.value)) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'private, no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  const path = req.nextUrl.pathname;
  // A file (an ad, the ZIP) gets a plain not-found; a page goes to the PIN screen and comes back.
  if (/\.(png|zip)$/i.test(path)) return new NextResponse('Not found', { status: 404 });
  const url = new URL('/admin', req.url);
  url.searchParams.set('next', path);
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: ['/postcards', '/postcards/:path*'] };

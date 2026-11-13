import type { Metadata } from 'next';
import { Resting } from '@/components/SiteHeader';
import { peekLink } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Sign in | Cypher admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/**
 * Where an email link lands. It shows a button rather than signing in on arrival, so email security
 * scanners that open links don't use them up. The button posts the token.
 */
export default async function Verify({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t = '' } = await searchParams;
  const link = await peekLink(t.slice(0, 200)).catch(() => null);
  return (
    <main className="ad-login">
      <div className="ad-pin ad-signin">
        <Resting size={40} />
        {link ? (
          <form method="post" action="/api/admin/auth/verify" className="ad-signform">
            <h1>{link.purpose === 'invite' ? 'Welcome.' : link.purpose === 'confirm' ? 'Confirm it’s you.' : 'Sign in.'}</h1>
            <p className="ad-lead">
              {link.purpose === 'invite' ? 'You’re joining the Cypher admin as ' : 'Signing in as '}
              <b>{link.email}</b>.
            </p>
            <input type="hidden" name="t" value={t} />
            <button className="btn" type="submit">{link.purpose === 'invite' ? 'Accept and sign in' : 'Sign in'}</button>
          </form>
        ) : (
          <>
            <h1>That link is spent.</h1>
            <p className="ad-lead">It has expired or has already been used. Links work once and for fifteen minutes.</p>
            <a className="btn" href="/admin/sign-in">Get a new link</a>
          </>
        )}
      </div>
    </main>
  );
}

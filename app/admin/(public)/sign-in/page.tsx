import type { Metadata } from 'next';
import { Resting } from '@/components/SiteHeader';
import { currentSession, pinAllowed, safeNext } from '@/lib/auth/session';
import { hasStore } from '@/lib/store';

export const metadata: Metadata = { title: 'Sign in | Cypher admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  bad: 'That isn’t an email address.',
  limited: 'Too many links asked for. Wait fifteen minutes and try again.',
  expired: 'That link has expired or has already been used. Ask for a new one.',
  send: 'The email didn’t go out. Try again in a minute.',
  email: 'Email isn’t set up on the server (no Resend key), so links can’t be sent.',
  db: 'No database is connected.',
  pin: 'That’s not it.',
  locked: 'Too many wrong tries from this network. Wait fifteen minutes.',
  pinoff: 'The PIN is retired. Sign in with an email link.',
};

type Search = { e?: string; sent?: string; next?: string; confirm?: string; out?: string; pin?: string };

/** Sign in with a one-time email link. The PIN appears only while it's still the way in for the first Owner. */
export default async function SignIn({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const confirm = sp.confirm === '1';
  const session = hasStore ? await currentSession() : null;
  const pin = hasStore && (await pinAllowed());
  const err = sp.e && ERRORS[sp.e];

  return (
    <main className="ad-login">
      <div className="ad-pin ad-signin">
        <Resting size={40} />
        {sp.sent ? (
          <>
            <h1>Check your email.</h1>
            <p className="ad-lead">If that address has access, a sign-in link is on its way. It works once and for fifteen minutes.</p>
            <a className="ad-quiet" href={`/admin/sign-in${next !== '/admin' ? `?next=${encodeURIComponent(next)}` : ''}`}>Use a different address</a>
          </>
        ) : (
          <form method="post" action="/api/admin/auth/request" className="ad-signform">
            <h1>{confirm ? 'Confirm it’s you.' : 'Admin'}</h1>
            <p className="ad-lead">
              {confirm
                ? 'This needs a fresh sign-in. We’ll email you a link; open it and come back.'
                : sp.out
                  ? 'Signed out. Sign in again with your work email.'
                  : 'Sign in with your work email. We’ll send you a link.'}
            </p>
            <label htmlFor="email">Work email</label>
            {confirm && session ? (
              <>
                <input id="email" className="ad-email" type="email" value={session.user.email} readOnly />
                <input type="hidden" name="email" value={session.user.email} />
              </>
            ) : (
              <input id="email" className="ad-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" required autoFocus />
            )}
            {next !== '/admin' && <input type="hidden" name="next" value={next} />}
            {confirm && <input type="hidden" name="confirm" value="1" />}
            {err && !['pin', 'locked', 'pinoff'].includes(sp.e!) && <p className="ad-err" role="alert">{err}</p>}
            <button className="btn" type="submit">Email me a link</button>
          </form>
        )}

        {pin && !confirm && (
          <details className="ad-pinfallback" open={['pin', 'locked'].includes(sp.e ?? '') || sp.pin === '1'}>
            <summary>Use the PIN instead</summary>
            <form method="post" action="/api/admin/login">
              <label htmlFor="pin">PIN</label>
              <input id="pin" name="pin" type="password" inputMode="numeric" autoComplete="current-password" required />
              {next !== '/admin' && <input type="hidden" name="next" value={next} />}
              {err && ['pin', 'locked', 'pinoff'].includes(sp.e!) && <p className="ad-err" role="alert">{err}</p>}
              <button className="btn" type="submit">Enter</button>
              <p className="ad-fine">The PIN retires once an Owner has signed in with an email link.</p>
            </form>
          </details>
        )}
      </div>
    </main>
  );
}

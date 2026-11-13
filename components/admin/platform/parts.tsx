import { PlatformError } from '@/lib/platform';

/** Shared pieces of the Launchworks screens: refusals explained, confirmations, formats. */

/** What each refusal from the platform means, and what fixes it. */
export const WHY: Record<string, { title: string; fix: string }> = {
  unset: { title: 'The platform isn’t connected here.', fix: 'LAUNCHWORKS_API_URL and LAUNCHWORKS_ADMIN_KEY are set for production only, so preview and local copies can’t reach Launchworks.' },
  unauthenticated: { title: 'Launchworks didn’t accept the admin’s key.', fix: 'LAUNCHWORKS_ADMIN_KEY here and ADMIN_CONSOLE_KEY on Launchworks don’t match (or the platform has no key). Reset both to one new value.' },
  not_icreon_director: { title: 'Launchworks doesn’t know you as an Icreon Director.', fix: 'Your Icreon membership in Launchworks must carry the same email you sign in here with. Sign in here with that address, or have your membership’s email changed in Launchworks.' },
  super_admin_only: { title: 'You’re in Icreon on Launchworks, but not as a Director.', fix: 'Platform administration needs the Director role in Icreon’s organization on Launchworks.' },
  not_a_member: { title: 'You aren’t a member of Icreon on Launchworks.', fix: 'Ask an Icreon Director to add you in Launchworks, under the email you sign in here with.' },
  no_actor: { title: 'The admin didn’t say who you are.', fix: 'This is a bug in the admin: it must send your email on every call.' },
  unreachable: { title: 'Launchworks didn’t answer.', fix: 'Try again in a minute. If it persists, check the platform’s health.' },
};

export type Got<T> = { ok: true; data: T } | { ok: false; err: PlatformError };

/** Runs a platform call for a page, keeping the refusal to show instead of throwing. */
export async function attempt<T>(p: Promise<T>): Promise<Got<T>> {
  try {
    return { ok: true, data: await p };
  } catch (err) {
    if (err instanceof PlatformError) return { ok: false, err };
    return { ok: false, err: new PlatformError(500, 'error', (err as Error).message) };
  }
}

/** A refusal, in words: what happened and what fixes it. */
export function Refused({ err }: { err: PlatformError }) {
  const why = WHY[err.code];
  return (
    <section className="ad-card ad-wide">
      <ul className="ad-checks">
        <li className="todo">
          <b aria-hidden="true">!</b>
          <span>
            <strong>{why?.title ?? 'Launchworks refused the call.'}</strong>
            <small>{why?.fix ?? err.message}</small>
            {why && err.code !== 'unset' && <small className="ad-dim">Platform answer: {err.code}{err.message ? `: ${err.message}` : ''}</small>}
          </span>
        </li>
      </ul>
    </section>
  );
}

/** A required checkbox for changes that reach live projects; the action route checks it too. */
export function Confirm({ children }: { children: React.ReactNode }) {
  return (
    <label className="ad-check lw-confirm">
      <input type="checkbox" name="confirm" required /> <span>{children}</span>
    </label>
  );
}

/** The hidden fields every platform form carries. */
export function Back({ to }: { to: string }) {
  return <input type="hidden" name="back" value={to} />;
}

export const day = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso)) : '';
export const stamp = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso)) : '';
export const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n < 100 ? 2 : 0, maximumFractionDigits: n < 100 ? 2 : 0 })}`;
export const num = (n: number) => Math.round(n).toLocaleString('en-US');
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** A status dot and word, for services, orchestrators, rules and entries. */
export function Status({ value, label }: { value: string; label?: string }) {
  return <span className={`lw-status s-${value}`}>{label ?? value}</span>;
}

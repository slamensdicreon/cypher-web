import { requireUser } from '@/lib/auth/request';
import { platformConfigured, platformMe } from '@/lib/platform';

/** What each refusal from the platform means, and what fixes it. */
const WHY: Record<string, { title: string; fix: string }> = {
  unset: { title: 'The platform isn’t connected here.', fix: 'LAUNCHWORKS_API_URL and LAUNCHWORKS_ADMIN_KEY are set for production only, so preview and local copies can’t reach Launchworks.' },
  unauthenticated: { title: 'Launchworks didn’t accept the admin’s key.', fix: 'LAUNCHWORKS_ADMIN_KEY here and ADMIN_CONSOLE_KEY on Launchworks don’t match (or the platform has no key). Reset both to one new value.' },
  not_icreon_director: { title: 'Launchworks doesn’t know you as an Icreon Director.', fix: 'Your Icreon membership in Launchworks must carry the same email you sign in here with. Sign in here with that address, or have your membership’s email changed in Launchworks.' },
  super_admin_only: { title: 'You’re in Icreon on Launchworks, but not as a Director.', fix: 'Platform administration needs the Director role in Icreon’s organization on Launchworks.' },
  not_a_member: { title: 'You aren’t a member of Icreon on Launchworks.', fix: 'Ask an Icreon Director to add you in Launchworks, under the email you sign in here with.' },
  no_actor: { title: 'The admin didn’t say who you are.', fix: 'This is a bug in the admin: it must send your email on every call.' },
  unreachable: { title: 'Launchworks didn’t answer.', fix: 'Try again in a minute. If it persists, check the platform’s health.' },
};

const SCREENS = [
  ['Organizations', 'Every customer, with people, projects, spend and license; create one and invite its first Director.'],
  ['Licenses', 'Platforms, playbooks, projects included and term, with history. Saving can pause or resume projects.'],
  ['Usage', 'Claude spend, sandbox and tool time, Vercel builds, per organization and per project.'],
  ['Support access', 'Give yourself up to 72 hours in a customer’s organization, as Watcher or Director.'],
  ['Rules, Knowledge, In force', 'How the Leads answer cards, and what every new build starts with.'],
  ['Diagnostics', 'Services and orchestrators; the watchdog and test email behind buttons.'],
] as const;

/** Launchworks administration. For now: whether you can reach the platform, and why not if you can't. */
export default async function Platform() {
  const s = await requireUser('platform', 'read', '/admin/platform');
  const me = platformConfigured() ? await platformMe(s.user) : ({ ok: false, code: 'unset', message: '' } as const);
  const why = !me.ok ? WHY[me.code] ?? { title: 'Launchworks refused the call.', fix: me.message } : null;

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Platform</h1>
          <p>Launchworks administration, server to server. Every action is recorded by name on the platform and in the audit log here.</p>
        </div>
      </header>

      <section className="ad-card ad-wide">
        <h3>Your access</h3>
        <ul className="ad-checks">
          <li className={me.ok ? 'ok' : 'todo'}>
            <b aria-hidden="true">{me.ok ? '✓' : '!'}</b>
            {me.ok ? (
              <span><strong>Connected as {me.name}, an Icreon Director.</strong><small>Launchworks accepted the admin’s key and knows {s.user.email}.</small></span>
            ) : (
              <span>
                <strong>{why!.title}</strong>
                <small>{why!.fix}</small>
                {me.code !== 'unset' && <small className="ad-dim">Platform answer: {me.code}{me.message ? `: ${me.message}` : ''}</small>}
              </span>
            )}
          </li>
        </ul>
      </section>

      <section className="ad-card ad-wide">
        <h3>Coming here next</h3>
        <ul className="ad-rank">
          {SCREENS.map(([t, d]) => (
            <li key={t}><span className="ad-rl"><b>{t}</b><br /><span className="ad-dim">{d}</span></span></li>
          ))}
        </ul>
      </section>
    </main>
  );
}

import { Banner } from '@/components/admin/AdminNav';
import { ROLES, ROLE_LABEL, ROLE_NOTE } from '@/lib/auth/roles';
import { requireUser } from '@/lib/auth/request';
import { EVENT_WORDS, emailStatus } from '@/lib/emailStatus';
import { people, type Person } from '@/lib/people';

const when = (d: Date | null) =>
  d ? new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d) : 'Never';

/** Who can sign in to the admin, and what each person may do. Owners only. */
export default async function People({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const s = await requireUser('people', 'read', '/admin/people');
  const { msg } = await searchParams;
  const list = await people();
  // Delivery of each pending invitation, straight from Resend
  const delivery = new Map(await Promise.all(list.filter((p) => p.lastLink && !p.lastSignInAt).map(async (p) => [p.id, await emailStatus(p.lastLink!.emailId)] as const)));
  const fresh = s.fresh;

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>People</h1>
          <p>Who can sign in, and what they may do. Everyone signs in with a one-time link sent to their email.</p>
        </div>
      </header>
      <Banner msg={msg} />
      {!fresh && (
        <p className="ad-banner">Changes here ask you to confirm it’s you with a fresh link. <a href="/admin/sign-in?confirm=1&next=/admin/people">Confirm now</a></p>
      )}

      <section className="ad-card ad-wide">
        <h3>Invite someone</h3>
        <form method="post" action="/api/admin/people/invite" className="ad-form">
          <div className="ad-row2">
            <label className="ad-field"><span>Work email</span><input className="ad-input" name="email" type="email" required placeholder="name@company.com" /></label>
            <label className="ad-field"><span>Name <small>optional</small></span><input className="ad-input" name="name" maxLength={80} /></label>
          </div>
          <fieldset className="ad-roles">
            <legend>Roles</legend>
            {ROLES.map((r) => (
              <label key={r} className="ad-role">
                <input type="checkbox" name="roles" value={r} defaultChecked={r === 'viewer'} />
                <span><b>{ROLE_LABEL[r]}</b><small>{ROLE_NOTE[r]}</small></span>
              </label>
            ))}
          </fieldset>
          <div className="ad-actions"><button className="ad-btn primary" type="submit">Send invitation</button></div>
        </form>
      </section>

      <section className="ad-card ad-wide">
        <h3>Everyone ({list.length})</h3>
        <div className="ad-people">
          {list.map((p) => (
            <details key={p.id} className={p.status === 'active' ? 'ad-person' : 'ad-person ad-dimmed'}>
              <summary>
                <span className="ad-av" aria-hidden="true">{(p.name || p.email).slice(0, 1).toUpperCase()}</span>
                <span className="ad-pwho"><b>{p.name || p.email}</b>{p.name && <small>{p.email}</small>}</span>
                <span className="ad-proles">{p.roles.map((r) => <span key={r} className="ad-pill no">{ROLE_LABEL[r]}</span>)}</span>
                <span className="ad-pmeta">{p.status === 'active' ? (p.lastSignInAt ? `Last in ${when(p.lastSignInAt)}` : deliveryLine(p, delivery.get(p.id) ?? null)) : 'Deactivated'}{p.id === s.user.id ? ' · you' : ''}</span>
              </summary>
              <form method="post" action="/api/admin/people/update" className="ad-form">
                <input type="hidden" name="id" value={p.id} />
                <label className="ad-field"><span>Name</span><input className="ad-input" name="name" defaultValue={p.name} maxLength={80} /></label>
                <fieldset className="ad-roles">
                  <legend>Roles</legend>
                  {ROLES.map((r) => (
                    <label key={r} className="ad-role">
                      <input type="checkbox" name="roles" value={r} defaultChecked={p.roles.includes(r)} />
                      <span><b>{ROLE_LABEL[r]}</b><small>{ROLE_NOTE[r]}</small></span>
                    </label>
                  ))}
                </fieldset>
                <p className="ad-fine">Invited {when(p.createdAt)}{p.invitedBy ? ` by ${p.invitedBy}` : ''} · {p.sessions} active session{p.sessions === 1 ? '' : 's'}</p>
                {p.lastLink && !p.lastSignInAt && <Delivery p={p} status={delivery.get(p.id) ?? null} />}
                <div className="ad-actions">
                  <button className="ad-btn primary" type="submit">Save</button>
                </div>
              </form>
              <div className="ad-actions ad-subactions">
                {p.status === 'active' && !p.lastSignInAt && (
                  <form method="post" action="/api/admin/people/resend"><input type="hidden" name="id" value={p.id} /><button className="ad-btn small" type="submit">Re-send invitation</button></form>
                )}
                {p.sessions > 0 && (
                  <form method="post" action="/api/admin/people/signout"><input type="hidden" name="id" value={p.id} /><button className="ad-btn small" type="submit">Sign out everywhere</button></form>
                )}
                {p.id !== s.user.id && (
                  <form method="post" action={`/api/admin/people/${p.status === 'active' ? 'deactivate' : 'reactivate'}`}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="ad-btn small ghost" type="submit">{p.status === 'active' ? 'Deactivate' : 'Reactivate'}</button>
                  </form>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

type Status = Awaited<ReturnType<typeof emailStatus>>;

/** One line for the list: where the invitation got to. */
function deliveryLine(p: Person, st: Status): string {
  if (!p.lastLink) return 'Invited, not signed in yet';
  if (p.lastLink.emailError) return 'Invitation email failed';
  if (st) return `Invitation: ${(EVENT_WORDS[st.event]?.text ?? st.event).split(';')[0].toLowerCase()}`;
  return 'Invited, not signed in yet';
}

/** The detail, inside the person's row. */
function Delivery({ p, status }: { p: Person; status: Status }) {
  const l = p.lastLink!;
  const word = status ? EVENT_WORDS[status.event] ?? { text: status.event, ok: null } : null;
  return (
    <p className={l.emailError || word?.ok === false ? 'ad-banner bad' : 'ad-banner'}>
      Last {l.purpose === 'invite' ? 'invitation' : 'sign-in link'} sent {when(l.at)}
      {l.used ? ', and used.' : '. '}
      {l.emailError ? <>It didn’t go: {l.emailError}</> : word ? <>{word.text}.</> : l.emailId ? 'Resend hasn’t reported on it yet.' : 'No Resend id was recorded for it (sent before delivery tracking).'}
    </p>
  );
}

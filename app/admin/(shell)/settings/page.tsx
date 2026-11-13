import { Banner } from '@/components/admin/AdminNav';
import { pinAllowed } from '@/lib/auth/session';
import { requireUser } from '@/lib/auth/request';
import { resendKey } from '@/lib/drip/config';
import { owners } from '@/lib/crm/data';
import { SETTINGS, loadSettings, savedSetting, setting, type SettingKey } from '@/lib/settings';
import { hasStore } from '@/lib/store';
import { platformConfigured } from '@/lib/platform';

type Check = { label: string; ok: boolean; detail: string };

/** Settings people edit, and the health of every connection the admin depends on. */
export default async function Settings({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const s = await requireUser('settings', 'read', '/admin/settings');
  const { msg } = await searchParams;
  await loadSettings(true);
  const canEdit = s.user.roles.includes('owner');
  const pin = await pinAllowed();
  const env = (k: string) => Boolean((process.env[k] || '').trim());
  const people = hasStore ? await owners() : [];
  const EMAIL_KEYS: SettingKey[] = ['sender_name', 'postal_address', 'reply_to'];

  const checks: Check[] = [
    { label: 'Database', ok: hasStore, detail: hasStore ? 'Connected (Neon Postgres).' : 'Set DATABASE_URL in Vercel.' },
    { label: 'Email sending (Resend)', ok: Boolean(resendKey()), detail: resendKey() ? 'Key set. Sign-in links, confirmations and campaigns can send.' : 'Set RESEND_API_KEY in Vercel. Without it nobody can get a sign-in link.' },
    { label: 'Postal address', ok: Boolean(setting('postal_address')), detail: setting('postal_address') ? 'Set. Marketing emails can send.' : 'Add it below. Marketing emails are held until it’s set.' },
    { label: 'Delivery, open and click tracking', ok: env('RESEND_WEBHOOK_SECRET'), detail: env('RESEND_WEBHOOK_SECRET') ? 'Webhook secret set.' : 'Add a webhook in Resend to /api/resend/webhook, then set RESEND_WEBHOOK_SECRET in Vercel.' },
    { label: 'Scheduled jobs', ok: env('CRON_SECRET'), detail: env('CRON_SECRET') ? 'Cron secret set; the daily send runs.' : 'Set CRON_SECRET in Vercel.' },
    { label: 'First Owners', ok: env('ADMIN_OWNERS'), detail: env('ADMIN_OWNERS') ? 'ADMIN_OWNERS is set, so its people can always get a link.' : 'Set ADMIN_OWNERS (comma-separated emails) in Vercel as a way back in.' },
    { label: 'Admin address for links', ok: env('ADMIN_URL') || env('NEXT_PUBLIC_SITE_URL'), detail: `Sign-in links point to ${(process.env.ADMIN_URL || process.env.NEXT_PUBLIC_SITE_URL || 'the site')}.` },
    { label: 'Launchworks platform', ok: platformConfigured(), detail: platformConfigured() ? 'Key and address set; the platform screens can reach Launchworks (production only).' : 'Not connected here. LAUNCHWORKS_ADMIN_KEY and LAUNCHWORKS_API_URL are set for production only.' },
    { label: 'Break-glass PIN', ok: !pin, detail: pin ? 'Still works, until an Owner signs in with an email link (or while ADMIN_PIN_FALLBACK=on).' : 'Retired. Everyone signs in with an email link.' },
  ];

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Settings</h1>
          <p>What the admin sends with, and whether everything it depends on is connected.</p>
        </div>
      </header>
      <Banner msg={msg} />

      <section className="ad-card ad-wide">
        <h3>Email sender</h3>
        <form method="post" action="/api/admin/settings" className="ad-form">
          {EMAIL_KEYS.map((k) => {
            const def = SETTINGS[k];
            const saved = savedSetting(k);
            const fromEnv = !saved && setting(k);
            return (
              <label key={k} className="ad-field">
                <span>{def.label} <small>{def.note}{fromEnv ? ' Currently from the environment.' : ''}</small></span>
                {k === 'postal_address' ? (
                  <textarea className="ad-input" name={k} rows={2} defaultValue={saved ?? setting(k)} disabled={!canEdit} placeholder="Company, street, city, state, ZIP" />
                ) : (
                  <input className="ad-input" name={k} defaultValue={saved ?? setting(k)} disabled={!canEdit} type={k === 'reply_to' ? 'email' : 'text'} />
                )}
              </label>
            );
          })}
          {canEdit && <div className="ad-actions"><button className="ad-btn primary" type="submit">Save</button></div>}
        </form>
      </section>

      <section className="ad-card ad-wide">
        <h3>Sales</h3>
        <form method="post" action="/api/admin/settings" className="ad-form">
          <label className="ad-field">
            <span>{SETTINGS.lead_owner.label} <small>{SETTINGS.lead_owner.note}</small></span>
            <select className="ad-input" name="lead_owner" defaultValue={setting('lead_owner')} disabled={!canEdit}>
              <option value="">Nobody: leave them unassigned</option>
              <option value="rotate">Take turns</option>
              {people.map((u) => <option key={u.id} value={String(u.id)}>{u.name}</option>)}
            </select>
          </label>
          {canEdit && <div className="ad-actions"><button className="ad-btn primary" type="submit">Save</button></div>}
        </form>
      </section>

      <section className="ad-card ad-wide">
        <h3>Connections</h3>
        <ul className="ad-checks">
          {checks.map((c) => (
            <li key={c.label} className={c.ok ? 'ok' : 'todo'}>
              <b aria-hidden="true">{c.ok ? '✓' : '!'}</b>
              <span><strong>{c.label}</strong><small>{c.detail}</small></span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

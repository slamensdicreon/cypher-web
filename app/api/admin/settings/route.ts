import { NextResponse } from 'next/server';
import { audit } from '@/lib/audit';
import { apiUser } from '@/lib/auth/session';
import { SETTINGS, loadSettings, saveSetting, savedSetting, type SettingKey } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Saves the settings form. Owners only; each changed value goes in the audit log. */
export async function POST(req: Request) {
  const s = await apiUser('settings', 'write');
  if (!s) return new Response('Not found', { status: 404 });
  const f = await req.formData();
  await loadSettings(true);
  const changed: string[] = [];
  try {
    for (const key of Object.keys(SETTINGS) as SettingKey[]) {
      const raw = f.get(key);
      if (typeof raw !== 'string') continue;
      const value = raw.trim().slice(0, key === 'postal_address' ? 300 : 200);
      if (key === 'reply_to' && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) throw new Error('the reply-to isn’t an email address');
      const before = savedSetting(key) ?? '';
      if (value === before) continue;
      await saveSetting(key, value, s.user.id);
      changed.push(SETTINGS[key].label);
      await audit(s, { action: 'settings.update', entity: 'setting', entityId: key, summary: `Changed ${SETTINGS[key].label.toLowerCase()}`, before, after: value }, req.headers);
    }
  } catch (err) {
    return NextResponse.redirect(new URL(`/admin/settings?msg=${encodeURIComponent(`That didn’t work: ${(err as Error).message}`)}`, req.url), 303);
  }
  const msg = changed.length ? `Saved: ${changed.join(', ')}.` : 'Nothing changed.';
  return NextResponse.redirect(new URL(`/admin/settings?msg=${encodeURIComponent(msg)}`, req.url), 303);
}

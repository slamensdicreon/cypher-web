import 'server-only';
import { migrate, sql } from './store';

/**
 * Settings edited in the admin, kept in the settings table and read through a short per-instance
 * cache. Each one falls back to its environment variable, so nothing changes until someone saves.
 */
export const SETTINGS = {
  sender_name: { label: 'Sender name', env: 'DRIP_SENDER_NAME', note: 'Shown in the footer of every marketing email.' },
  postal_address: { label: 'Postal address', env: 'DRIP_POSTAL_ADDRESS', note: 'Required by law in every marketing email. Nothing sends until it’s set.' },
  reply_to: { label: 'Reply-to address', env: 'DRIP_REPLY_TO', note: 'Where replies to marketing emails go.' },
} as const;
export type SettingKey = keyof typeof SETTINGS;

let cache: Partial<Record<SettingKey, string>> = {};
let loadedAt = 0;

/** Loads the saved settings (every 30 seconds at most, unless forced). Call before reading. */
export async function loadSettings(force = false): Promise<void> {
  if (!sql) return;
  if (!force && Date.now() - loadedAt < 30_000) return;
  await migrate();
  const rows = await sql<{ key: string; value: unknown }[]>`select key, value from settings`;
  cache = Object.fromEntries(rows.filter((r) => r.key in SETTINGS && typeof r.value === 'string').map((r) => [r.key, r.value as string]));
  loadedAt = Date.now();
}

/** The saved value, or the environment's, or ''. Synchronous; reflects the last loadSettings(). */
export function setting(key: SettingKey): string {
  const saved = cache[key];
  if (saved !== undefined && saved !== '') return saved;
  return (process.env[SETTINGS[key].env] || (key === 'reply_to' ? process.env.EMAIL_REPLY_TO : '') || '').trim();
}

export function savedSetting(key: SettingKey): string | undefined {
  return cache[key];
}

export async function saveSetting(key: SettingKey, value: string, userId: number): Promise<void> {
  if (!sql) throw new Error('No database is connected.');
  await migrate();
  await sql`
    insert into settings (key, value, updated_at, updated_by) values (${key}, ${sql.json(value)}, now(), ${userId})
    on conflict (key) do update set value = excluded.value, updated_at = now(), updated_by = excluded.updated_by`;
  await loadSettings(true);
}

import 'server-only';

/**
 * Who gets declined, and how. These lists live on the server so the surprise
 * stays a surprise: nothing here ships to the browser.
 * Add domains without a deploy through BLOCK_VENDOR_DOMAINS / BLOCK_PERSONAL_DOMAINS.
 */

const SITECORE = ['sitecore.com', 'sitecore.net'];

const VENDOR = ['velir.com', 'perficient.com', 'valtech.com', 'icreon.com'];

const PERSONAL = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'msn.com',
  'ymail.com', 'pm.me', 'hey.com', 'gmx.com', 'zoho.com', 'yandex.com', 'mail.com',
];

const fromEnv = (name: string) =>
  (process.env[name] || '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

export type Kind = 'ok' | 'sitecore' | 'vendor' | 'personal' | 'bad';

const matches = (domain: string, list: string[]) =>
  list.some((d) => domain === d || domain.endsWith('.' + d));

export function classify(domain: string): Kind {
  if (!domain) return 'bad';
  if (matches(domain, SITECORE)) return 'sitecore';
  if (matches(domain, [...VENDOR, ...fromEnv('BLOCK_VENDOR_DOMAINS')])) return 'vendor';
  if (matches(domain, [...PERSONAL, ...fromEnv('BLOCK_PERSONAL_DOMAINS')])) return 'personal';
  return 'ok';
}

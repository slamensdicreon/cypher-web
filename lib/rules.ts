import 'server-only';
import { VENDOR_DOMAINS } from './vendors';

/**
 * Who gets declined, and how. These lists live on the server so the surprise
 * stays a surprise: nothing here ships to the browser.
 * Add domains without a deploy through BLOCK_VENDOR_DOMAINS / BLOCK_PERSONAL_DOMAINS.
 */

/** Always accepted, whatever the lists below or the environment say. */
const ALLOWED = ['icreon.com'];

const SITECORE = ['sitecore.com', 'sitecore.net'];


const PERSONAL = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'msn.com',
  'ymail.com', 'pm.me', 'hey.com', 'gmx.com', 'zoho.com', 'yandex.com', 'mail.com',
  'outlook.in', 'hotmail.co.uk', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.ca', 'live.ca', 'live.co.uk',
  'gmx.de', 'web.de', 't-online.de', 'orange.fr', 'hotmail.fr', 'libero.it', 'qq.com', '163.com',
  '126.com', 'naver.com', 'rediffmail.com', 'comcast.net', 'att.net', 'verizon.net',
  'sbcglobal.net', 'btinternet.com', 'bigpond.com', 'shaw.ca', 'rogers.com', 'tutanota.com',
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
  if (matches(domain, ALLOWED)) return 'ok';
  if (matches(domain, SITECORE)) return 'sitecore';
  if (matches(domain, [...VENDOR_DOMAINS, ...fromEnv('BLOCK_VENDOR_DOMAINS')])) return 'vendor';
  if (matches(domain, [...PERSONAL, ...fromEnv('BLOCK_PERSONAL_DOMAINS')])) return 'personal';
  return 'ok';
}

/** Shared by the browser (live preview) and the server (what gets stored). */

export function domainOf(email: string): string {
  const m = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(email.trim().toLowerCase());
  return m ? m[1] : '';
}

const SECOND_LEVEL = ['co', 'com', 'org', 'net', 'ac', 'gov', 'edu', 'ltd', 'plc'];

export function companyOf(domain: string): string {
  const parts = domain.split('.').filter(Boolean);
  if (parts.length < 2) return '';
  let i = parts.length - 2;
  if (parts.length >= 3 && SECOND_LEVEL.includes(parts[i]) && parts[parts.length - 1].length === 2) i--;
  const raw = parts[i];
  if (raw.length <= 4) return raw.toUpperCase();
  return raw
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * The free email providers most people use, checked in the browser so a personal address is caught
 * at the first step. The server's own lists stay on the server and still decide.
 */
const COMMON_PERSONAL = ['gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com', 'msn.com'];

export const isCommonPersonal = (domain: string) => COMMON_PERSONAL.includes(domain.toLowerCase());

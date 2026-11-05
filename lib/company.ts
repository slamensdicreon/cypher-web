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

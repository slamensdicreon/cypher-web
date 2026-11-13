/**
 * The marketing site's shared settings: the pages in the navigation (each appears once it's live),
 * the platforms Cypher names, and the demo time slots. Used by the client and the server.
 */

/** Where the site lives; links in structured data are absolute. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ignoranceisbliss.ai';

export type NavItem = { href: string; label: string; note: string; group: 'Product' | 'Outcomes' | 'Platforms' | 'Company'; live: boolean; top?: boolean };

/** Pages join the navigation and footer as they ship: flip `live` when a page is built. */
export const NAV: NavItem[] = [
  { href: '/how-it-works', label: 'How it works', note: 'One project, start to finish', group: 'Product', live: true, top: true },
  { href: '/playbooks', label: 'Playbooks', note: 'The method, written down', group: 'Product', live: true, top: true },
  { href: '/product/team', label: 'The team', note: 'The specialists and the mind that runs them', group: 'Product', live: false },
  { href: '/product/decisions', label: 'Three decisions', note: 'You decide; it does the rest', group: 'Product', live: false },
  { href: '/product/learning', label: 'It asks once', note: 'Every answer becomes a rule', group: 'Product', live: false },
  { href: '/product/receipts', label: 'Receipts', note: 'Every action logged, any build replayed', group: 'Product', live: false },
  { href: '/outcomes/build', label: 'Build', note: 'Sites, portals, storefronts, intranets', group: 'Outcomes', live: false },
  { href: '/outcomes/migrate', label: 'Migrate', note: 'Old platform to new, nothing left behind', group: 'Outcomes', live: false },
  { href: '/outcomes/personalize', label: 'Personalize', note: 'The personalization you paid for, switched on', group: 'Outcomes', live: false },
  { href: '/outcomes/optimize', label: 'Optimize', note: 'Faster, accessible, findable', group: 'Outcomes', live: false },
  { href: '/platforms/sitecore', label: 'Sitecore', note: '', group: 'Platforms', live: false },
  { href: '/platforms/optimizely', label: 'Optimizely', note: '', group: 'Platforms', live: false },
  { href: '/platforms/contentful', label: 'Contentful', note: '', group: 'Platforms', live: false },
  { href: '/proof', label: 'Proof', note: 'The receipts', group: 'Company', live: false },
  { href: '/security', label: 'Security', note: '', group: 'Company', live: false },
  { href: '/demo', label: 'Book a demo', note: '', group: 'Company', live: true },
];

export const live = (group?: NavItem['group']) => NAV.filter((n) => n.live && (!group || n.group === group));
/** The header's links: live pages marked as top level. */
export const topNav = () => NAV.filter((n) => n.live && n.top);

/** The platforms the site names. Anything else is welcome too ("Something else"). */
export const PLATFORMS = ['Sitecore', 'Optimizely', 'Contentful'] as const;

/** A demo slot: a day and a part of it, in the visitor's own time zone. Key: "2026-11-16|am". */
export const PARTS = { am: 'Morning', pm: 'Afternoon' } as const;
export type Part = keyof typeof PARTS;
export const SLOT = /^(\d{4})-(\d{2})-(\d{2})\|(am|pm)$/;
export const MAX_SLOTS = 3;

/** The next `n` weekdays, starting tomorrow, as YYYY-MM-DD in the local calendar. */
export function nextWeekdays(n: number, from = new Date()): string[] {
  const out: string[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return out;
}

/** "Mon, Nov 16" for a YYYY-MM-DD. */
export function dayLabel(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "Mon, Nov 16, morning" for a slot key, or '' when it isn't one. */
export function slotLabel(key: string): string {
  const m = SLOT.exec(key);
  if (!m) return '';
  return `${dayLabel(`${m[1]}-${m[2]}-${m[3]}`)}, ${PARTS[m[4] as Part].toLowerCase()}`;
}

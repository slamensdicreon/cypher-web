'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export type RailItem = { href: string; label: string; icon: keyof typeof ICONS; group: string; external?: boolean };

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const ICONS = {
  home: <path {...P} d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />,
  crm: <g {...P}><path d="M3 6h18M3 12h18M3 18h12" /></g>,
  company: <g {...P}><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3" /></g>,
  rules: <g {...P}><path d="M5 6h14M5 12h9M5 18h6" /><path d="m15 16 2 2 4-4" /></g>,
  knowledge: <g {...P}><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" /></g>,
  inforce: <g {...P}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6z" /><path d="m9 12 2 2 4-4" /></g>,
  diag: <g {...P}><path d="M3 12h4l2.5-6 5 12 2.5-6h4" /></g>,
  tasks: <g {...P}><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" /><path d="m8 12 3 3 5-6" /></g>,
  email: <g {...P}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></g>,
  contacts: <g {...P}><circle cx="9" cy="9" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 7.5a3 3 0 0 1 0 5.8M17.5 19a5 5 0 0 0-2-4" /></g>,
  assets: <g {...P}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></g>,
  people: <g {...P}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></g>,
  audit: <g {...P}><path d="M12 7v5l3 2" /><circle cx="12" cy="12" r="8.5" /></g>,
  settings: <g {...P}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></g>,
  platform: <g {...P}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></g>,
};

/** The admin's left rail. On a phone it folds into a menu button. */
export default function Rail({ items, user }: { items: RailItem[]; user: { name: string; email: string; roles: string } }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const on = (href: string) => (href === '/admin' ? path === '/admin' : path === href || path.startsWith(href + '/'));
  // The most specific match wins (Contacts lives under Email).
  const active = items.filter((i) => on(i.href)).sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const groups = [...new Set(items.map((i) => i.group))];
  return (
    <aside className={open ? 'adr open' : 'adr'}>
      <div className="adr-head">
        <Link href="/admin" className="adr-brand" onClick={() => setOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="31" fill="#fff" /><path d="M20 36 Q36 50 52 36" fill="none" stroke="#141433" strokeWidth="4" strokeLinecap="round" /></svg>
          <span>cypher <small>admin</small></span>
        </Link>
        <button type="button" className="adr-toggle" aria-expanded={open} aria-controls="adr-nav" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <nav id="adr-nav" className="adr-nav" aria-label="Admin">
        {groups.map((g) => (
          <div key={g} className="adr-group">
            {g !== 'main' && <span className="adr-gl">{g}</span>}
            {items.filter((i) => i.group === g).map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className={active === i.href ? 'on' : undefined}
                aria-current={active === i.href ? 'page' : undefined}
                onClick={() => setOpen(false)}
                {...(i.external ? { target: '_self' } : {})}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">{ICONS[i.icon]}</svg>
                {i.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="adr-me">
        <span className="adr-av" aria-hidden="true">{(user.name || user.email).slice(0, 1).toUpperCase()}</span>
        <span className="adr-who">
          <b>{user.name || user.email}</b>
          <small>{user.roles}</small>
        </span>
        <form method="post" action="/api/admin/logout">
          <button type="submit" className="adr-out">Sign out</button>
        </form>
      </div>
    </aside>
  );
}

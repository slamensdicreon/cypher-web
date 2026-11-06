import Link from 'next/link';

/** The admin's top navigation, shared by every admin page. */
export default function AdminNav({ on }: { on: 'dashboard' | 'drip' | 'contacts' }) {
  const items = [
    { key: 'dashboard', href: '/admin', label: 'Dashboard' },
    { key: 'drip', href: '/admin/drip', label: 'Email sequences' },
    { key: 'contacts', href: '/admin/drip/contacts', label: 'Contacts' },
  ] as const;
  return (
    <nav className="ad-nav" aria-label="Admin">
      {items.map((i) => (
        <Link key={i.key} href={i.href} className={i.key === on ? 'on' : undefined} aria-current={i.key === on ? 'page' : undefined}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

/** The message a form action redirects back with. */
export function Banner({ msg }: { msg?: string }) {
  if (!msg) return null;
  const bad = /^(That didn’t work|Nothing sent|No email column|Choose a CSV|That file)/.test(msg);
  return <p className={bad ? 'ad-banner bad' : 'ad-banner'} role="status">{msg}</p>;
}

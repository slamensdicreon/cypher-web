import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Rail, { type RailItem } from '@/components/admin/Rail';
import { currentSession } from '@/lib/auth/request';
import { ROLE_LABEL, can, type Area } from '@/lib/auth/roles';

export const metadata: Metadata = { title: 'Admin | Cypher', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Every admin screen sits in this shell: the rail on the left (only what your roles allow), the page on the right. */
const ITEMS: (RailItem & { area: Area })[] = [
  { href: '/admin', label: 'Home', icon: 'home', group: 'main', area: 'analytics' },
  { href: '/admin/drip', label: 'Email', icon: 'email', group: 'Marketing', area: 'email' },
  { href: '/admin/drip/contacts', label: 'Contacts', icon: 'contacts', group: 'Marketing', area: 'email' },
  { href: '/postcards', label: 'Campaign assets', icon: 'assets', group: 'Marketing', area: 'assets' },
  { href: '/admin/people', label: 'People', icon: 'people', group: 'Admin', area: 'people' },
  { href: '/admin/audit', label: 'Audit log', icon: 'audit', group: 'Admin', area: 'audit' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings', group: 'Admin', area: 'settings' },
];

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const s = await currentSession();
  if (!s) redirect('/admin/sign-in');
  const items = ITEMS.filter((i) => can(s.user.roles, i.area)).map(({ area: _a, ...i }) => i);
  return (
    <div className="adm">
      <Rail items={items} user={{ name: s.user.name, email: s.user.email, roles: s.user.roles.map((r) => ROLE_LABEL[r]).join(', ') || 'No role' }} />
      <div className="adm-main">{children}</div>
    </div>
  );
}

/**
 * Who may do what in the admin. A person holds one or more roles; each role grants read or write on
 * areas of the admin. Shared by the server (every check) and the pages (what to show).
 */

export const ROLES = ['owner', 'platform', 'marketing', 'sales', 'viewer'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  owner: 'Owner',
  platform: 'Platform',
  marketing: 'Marketing',
  sales: 'Sales',
  viewer: 'Viewer',
};

export const ROLE_NOTE: Record<Role, string> = {
  owner: 'Everything, including people, settings and deleting data.',
  platform: 'Launchworks customers: organizations, licenses, usage, support access and product settings.',
  marketing: 'The website, email, marketing plans, assets and analytics.',
  sales: 'The CRM, proposals and analytics.',
  viewer: 'Reads everything except people, settings and the platform. Changes nothing.',
};

export const AREAS = ['people', 'settings', 'audit', 'platform', 'crm', 'email', 'site', 'plans', 'analytics', 'assets'] as const;
export type Area = (typeof AREAS)[number];
export type Level = 'read' | 'write';

const ALL_WRITE = Object.fromEntries(AREAS.map((a) => [a, 'write'])) as Record<Area, Level>;

const GRANTS: Record<Role, Partial<Record<Area, Level>>> = {
  owner: ALL_WRITE,
  platform: { platform: 'write', analytics: 'read', audit: 'read' },
  marketing: { site: 'write', email: 'write', plans: 'write', assets: 'write', analytics: 'read', crm: 'read' },
  sales: { crm: 'write', analytics: 'read', assets: 'read', email: 'read' },
  viewer: { crm: 'read', email: 'read', site: 'read', plans: 'read', analytics: 'read', assets: 'read' },
};

export const isRole = (v: unknown): v is Role => typeof v === 'string' && (ROLES as readonly string[]).includes(v);

/** Can someone with these roles do this? Write implies read. */
export function can(roles: readonly string[], area: Area, level: Level = 'read'): boolean {
  return roles.some((r) => {
    if (!isRole(r)) return false;
    const g = GRANTS[r][area];
    return g === 'write' || (g === 'read' && level === 'read');
  });
}

/** The area an admin address belongs to, for the request gate. Unknown admin paths need Owner. */
export function areaFor(path: string): Area {
  if (path.startsWith('/postcards') || path.startsWith('/admin/assets')) return 'assets';
  if (path.startsWith('/admin/drip')) return 'email';
  if (path.startsWith('/admin/people')) return 'people';
  if (path.startsWith('/admin/settings')) return 'settings';
  if (path.startsWith('/admin/audit')) return 'audit';
  if (path.startsWith('/admin/platform')) return 'platform';
  if (path.startsWith('/admin/crm')) return 'crm';
  if (path === '/admin' || path === '/admin/') return 'analytics';
  return 'settings';
}

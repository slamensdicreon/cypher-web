import 'server-only';
import type { User } from './auth/session';

/**
 * Launchworks, the platform, reached server to server for the /admin/platform screens. The key
 * (LAUNCHWORKS_ADMIN_KEY) is read only here, on the server, and never reaches a browser. Every call
 * names the person acting, by the email our sign-in verified; the platform re-checks on each call that
 * they're an Icreon Director and records their name. Contract: icreon-claude
 * docs/architecture/admin-console-api.md.
 */

const base = () => (process.env.LAUNCHWORKS_API_URL || '').trim().replace(/\/+$/, '');
const key = () => (process.env.LAUNCHWORKS_ADMIN_KEY || '').trim();

export const platformConfigured = () => Boolean(base() && key());

/** A refusal from the platform, with a message written for people. */
export class PlatformError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function platform<T>(as: Pick<User, 'email' | 'name'>, method: Method, path: string, body?: unknown): Promise<T> {
  if (!platformConfigured()) throw new PlatformError(503, 'unset', 'The platform isn’t connected here (no Launchworks key).');
  let res: Response;
  try {
    res = await fetch(`${base()}${path}`, {
      method,
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
      headers: {
        authorization: `Bearer ${key()}`,
        accept: 'application/json',
        'x-lw-organization': 'org-icreon',
        'x-lw-actor-email': as.email,
        ...(as.name ? { 'x-lw-actor-name': encodeURIComponent(as.name.slice(0, 120)) } : {}),
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    throw new PlatformError(502, 'unreachable', `The platform didn’t answer (${(err as Error).message}).`);
  }
  const json = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } | string; message?: string } | null;
  if (!res.ok) {
    // Most refusals are { error: { code, message } }; a few older routes answer { error, message }.
    const e = json?.error;
    const code = typeof e === 'string' ? e : e?.code;
    const message = typeof e === 'string' ? json?.message : e?.message;
    throw new PlatformError(res.status, code ?? 'error', message ?? `The platform answered ${res.status}.`);
  }
  return json as T;
}

/** A plain-text answer (the knowledge export). */
export async function platformText(as: Pick<User, 'email' | 'name'>, path: string): Promise<string> {
  if (!platformConfigured()) throw new PlatformError(503, 'unset', 'The platform isn’t connected here (no Launchworks key).');
  const res = await fetch(`${base()}${path}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
    headers: { authorization: `Bearer ${key()}`, 'x-lw-organization': 'org-icreon', 'x-lw-actor-email': as.email, ...(as.name ? { 'x-lw-actor-name': encodeURIComponent(as.name.slice(0, 120)) } : {}) },
  });
  if (!res.ok) throw new PlatformError(res.status, 'error', `The platform answered ${res.status}.`);
  return res.text();
}

/** Where people use what the admin grants (support access happens in the Control Center). */
export const controlCenterUrl = () => base() || 'https://launchworks-one.vercel.app';

// ---------------------------------------------------------------- shapes (from the contract)

export type Standing = 'unlimited' | 'none' | 'upcoming' | 'active' | 'ended';
export type Org = {
  id: string; name: string; slug: string; createdAt: string;
  directors: number; watchers: number; invitations: number; projects: number; running: number;
  usage: { usd: number; tokens: number; hours: number; sandboxMinutes: number };
  license: { standing: Standing; used: number; entities?: string[]; playbooks?: string[]; projectsIncluded?: number; startsAt?: string; endsAt?: string; purgedAt?: string | null };
};
export type Terms = { entities: string[]; playbooks: string[]; projectsIncluded: number; startsAt: string; endsAt: string };
export type LicenseView = {
  license: (Terms & { suspended: { projects: string[] } | null; purgedAt: string | null }) | null;
  history: { at: string; by: string; kind: 'granted' | 'changed' | 'suspended' | 'resumed'; license: Terms }[];
};
export type Usage = {
  organization: { id: string; name: string } | string;
  totals: { claudeUsd: number; claudeTokens: number; sandboxMinutes: number; toolMinutes: number; vercelDeployments: number; vercelBuildMinutes: number };
  projects: { projectId: string; name: string; status: string; claude: { usd: number; tokens: number; hours: number }; toolMinutes: Record<string, number>; vercel: { hostingProject: string | null; deployments: number; failed: number; buildMinutes: number } | null; vercelNote: string | null }[];
  cachedForMinutes: number;
};
export type Playbook = { id: string; name: string; version: string; description: string; platform: { id: string; name: string }; roles?: { role: string; name: string }[] };

export const CATEGORIES = {
  media: 'Media sources', tool: 'Tool problems', retry: 'Retries after rejection', ownership: 'Ownership and missing work',
  naming: 'Naming and structure', content: 'Content within the Blueprint', access: 'Access and permissions', scope: 'Scope',
  release: 'Releases, gates and budget', other: 'Other',
} as const;
export type Category = keyof typeof CATEGORIES;
export type Rule = {
  id: string; ref: string; status: 'proposed' | 'active' | 'retired'; category: Category;
  scope: { kind: 'project' | 'playbook' | 'platform'; id: string }; when: string; then: string; roles: string[];
  sources: { projectId: string; escalationId: string; title: string; answer: string | null }[];
  author: 'director' | 'cypher'; version: number; applied: number; overridden: number; flagged: boolean; createdAt: string; updatedAt: string;
};
export type HistoryItem = { at: string; kind: string; detail: Record<string, unknown> };
export type Entry = {
  id: string; ref: string; kind: 'lesson' | 'procedure' | 'gap'; status: 'proposed' | 'active' | 'retired';
  scope: { kind: 'global' | 'platform' | 'playbook' | 'role' | 'project'; id: string }; title: string; text: string;
  roles: string[]; operations: string[]; templates: string[]; tags: string[];
  evidence: { projectId: string | null; ref: string; label: string }[]; author: 'seed' | 'director' | 'cypher';
  source: { doc: string | null; projectId: string | null; phase: number | null } | null; version: number; used: number; createdAt: string; updatedAt: string;
};
export type KnowledgeList = { entries: Entry[]; effects: { id: string; tasks: number; failed: number; flagged: boolean }[] };
export type InForce = {
  playbook: { id: string; name: string; version: string }; platform: { id: string; name: string }; roles: { role: string; name: string }[];
  rules: Rule[]; entries: { id: string; ref: string; kind: 'lesson' | 'procedure'; title: string; text: string; scope: Entry['scope']; roles: string[]; used: number; updatedAt: string }[];
  gaps: { id: string; ref: string; title: string; text: string }[]; pending: { knowledge: number; rules: number };
};
export type Diagnostics = {
  services: { key: string; label: string; status: 'ok' | 'degraded' | 'down' | 'unknown'; detail: string; checkedAt: string | null }[];
  projects: { projectId: string; name: string; status: string; orchestrator: { status: 'ok' | 'stalled' | 'ended' | 'unknown'; detail: string }; attention: string[] }[];
};
export type Recommendation = {
  kind: 'knowledge' | 'rule'; id: string; ref: string; label: string; action: 'approve' | 'edit' | 'reject'; reason: string;
  edit: { title?: string; text?: string; when?: string; then?: string; scope?: { kind: string; id: string }; roles?: string[] } | null; duplicateOf: string | null;
};
export type Applied = { approved: number; edited: number; rejected: number; failed: { id: string; error: string }[] };

/** The by-line of a platform record: "workos:user_…" or "github:octo" without its prefix. */
export const byName = (subject: string) => subject.replace(/^[a-z]+:/, '');

export const STANDING: Record<Standing, string> = { unlimited: 'No license needed', none: 'No license', upcoming: 'Starts later', active: 'Active', ended: 'Ended' };
export const ICREON = 'org-icreon';

/** Is this person an Icreon Director on the platform (and so allowed into the platform screens)? */
export async function platformMe(as: Pick<User, 'email' | 'name'>): Promise<{ ok: true; name: string } | { ok: false; code: string; message: string }> {
  try {
    const me = await platform<{ name?: string; login?: string }>(as, 'GET', '/admin/me');
    return { ok: true, name: me.name || me.login || as.email };
  } catch (err) {
    const e = err as PlatformError;
    return { ok: false, code: e.code ?? 'error', message: e.message };
  }
}

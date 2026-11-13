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
  const json = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
  if (!res.ok) throw new PlatformError(res.status, json?.error?.code ?? 'error', json?.error?.message ?? `The platform answered ${res.status}.`);
  return json as T;
}

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

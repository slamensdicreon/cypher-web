import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { can, type Area, type Level } from './roles';
import { SESSION_COOKIE, sessionFromToken, type Session } from './session';

/** The request-bound side of sign-in: reading the cookie, and gating pages and routes by role. */

/** The signed-in session for this request, or null. */
export async function currentSession(): Promise<Session | null> {
  return sessionFromToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages: the signed-in person, sent to the sign-in page if needed, and shown "not found" without the role. */
export async function requireUser(area: Area, level: Level = 'read', next = '/admin'): Promise<Session> {
  const s = await currentSession();
  if (!s) redirect(`/admin/sign-in?next=${encodeURIComponent(next)}`);
  if (!can(s.user.roles, area, level)) redirect('/admin?msg=' + encodeURIComponent('That part of the admin isn’t in your role.'));
  return s;
}

/** For routes: the session if it may do this, else null (the route answers 404). */
export async function apiUser(area: Area, level: Level = 'read'): Promise<Session | null> {
  const s = await currentSession();
  return s && can(s.user.roles, area, level) ? s : null;
}


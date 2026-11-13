import { NextResponse } from 'next/server';
import { audit } from '@/lib/audit';
import { isRole, type Role } from '@/lib/auth/roles';
import { apiUser, revokeAll, sendInvite } from '@/lib/auth/session';
import { invite, ownersAfter, person, update } from '@/lib/people';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** People changes. Owners only, with a fresh sign-in; every change goes in the audit log. */
export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const s = await apiUser('people', 'write');
  if (!s) return new Response('Not found', { status: 404 });
  const { action } = await params;
  const back = (msg: string) => NextResponse.redirect(new URL(`/admin/people?msg=${encodeURIComponent(msg)}`, req.url), 303);
  if (!s.fresh) return NextResponse.redirect(new URL(`/admin/sign-in?confirm=1&next=${encodeURIComponent('/admin/people')}`, req.url), 303);
  const f = await req.formData();
  const str = (k: string) => (typeof f.get(k) === 'string' ? (f.get(k) as string).trim() : '');
  const roles = f.getAll('roles').filter(isRole) as Role[];
  const id = Number(str('id')) || 0;

  try {
    switch (action) {
      case 'invite': {
        const email = str('email');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return back('That didn’t work: that isn’t an email address.');
        if (!roles.length) return back('That didn’t work: choose at least one role.');
        const { user, isNew } = await invite(email, str('name'), roles, s.user.id);
        if (!isNew) return back(`${user.email} already has an account. Change their roles below.`);
        await sendInvite(user, s.user, req.headers);
        await audit(s, { action: 'people.invite', entity: 'user', entityId: user.id, summary: `Invited ${user.email} as ${roles.join(', ')}`, after: { email: user.email, roles } }, req.headers);
        return back(`Invitation sent to ${user.email}.`);
      }
      case 'update': {
        const p = await person(id);
        if (!p) return back('That didn’t work: no such person.');
        if (!roles.length) return back('That didn’t work: choose at least one role. To remove access, deactivate them.');
        if ((await ownersAfter(id, roles, p.status)) < 1) return back('That didn’t work: there must always be at least one active Owner.');
        await update(id, { roles, name: str('name') });
        if (p.roles.join() !== roles.join()) await revokeAll(id);
        await audit(s, { action: 'people.update', entity: 'user', entityId: id, summary: `Changed ${p.email}: ${roles.join(', ')}`, before: { name: p.name, roles: p.roles }, after: { name: str('name'), roles } }, req.headers);
        return back(`Saved ${p.email}.${p.roles.join() !== roles.join() && id !== s.user.id ? ' Their sessions were ended, so the new roles apply at once.' : ''}`);
      }
      case 'deactivate':
      case 'reactivate': {
        const p = await person(id);
        if (!p) return back('That didn’t work: no such person.');
        const status = action === 'deactivate' ? 'disabled' : 'active';
        if (action === 'deactivate' && id === s.user.id) return back('That didn’t work: you can’t deactivate yourself.');
        if ((await ownersAfter(id, p.roles, status)) < 1) return back('That didn’t work: there must always be at least one active Owner.');
        await update(id, { status });
        if (status === 'disabled') await revokeAll(id);
        await audit(s, { action: `people.${action}`, entity: 'user', entityId: id, summary: `${action === 'deactivate' ? 'Deactivated' : 'Reactivated'} ${p.email}` }, req.headers);
        return back(`${action === 'deactivate' ? 'Deactivated' : 'Reactivated'} ${p.email}.`);
      }
      case 'resend': {
        const p = await person(id);
        if (!p || p.status !== 'active') return back('That didn’t work: no such active person.');
        await sendInvite(p, s.user, req.headers);
        await audit(s, { action: 'people.resend', entity: 'user', entityId: id, summary: `Re-sent the invitation to ${p.email}` }, req.headers);
        return back(`Invitation re-sent to ${p.email}.`);
      }
      case 'signout': {
        const p = await person(id);
        if (!p) return back('That didn’t work: no such person.');
        await revokeAll(id);
        await audit(s, { action: 'people.signout', entity: 'user', entityId: id, summary: `Signed ${p.email} out everywhere` }, req.headers);
        return back(`${p.email} is signed out everywhere.`);
      }
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    console.error('[people]', action, err);
    return back(`That didn’t work: ${(err as Error).message.slice(0, 160)}`);
  }
}


import 'server-only';
import { isRole, type Role } from './auth/roles';
import { normalEmail, type User } from './auth/session';
import { migrate, sql } from './store';

/** The people who can sign in to the admin. */
export type Person = User & {
  createdAt: Date;
  lastSignInAt: Date | null;
  invitedBy: string | null;
  sessions: number;
  /** The latest invitation or sign-in email: when, which Resend email, or why it didn't go. */
  lastLink: { at: Date; purpose: string; emailId: string | null; emailError: string | null; used: boolean } | null;
};

const db = () => {
  if (!sql) throw new Error('No database is connected.');
  return sql;
};

export async function people(): Promise<Person[]> {
  await migrate();
  const rows = await db()<
    {
      id: string; email: string; name: string; roles: string[]; status: string; createdAt: Date; lastSignInAt: Date | null; invitedBy: string | null; sessions: string;
      linkAt: Date | null; linkPurpose: string | null; linkEmailId: string | null; linkEmailError: string | null; linkUsed: boolean | null;
    }[]
  >`
    select u.id, u.email, u.name, u.roles, u.status, u.created_at, u.last_sign_in_at,
           coalesce(nullif(i.name, ''), i.email) as invited_by,
           (select count(*) from sessions s where s.user_id = u.id and s.revoked_at is null and s.expires_at > now()) as sessions,
           l.created_at as link_at, l.purpose as link_purpose, l.email_id as link_email_id, l.email_error as link_email_error, (l.used_at is not null) as link_used
    from users u left join users i on i.id = u.invited_by
    left join lateral (select * from login_links where user_id = u.id order by created_at desc limit 1) l on true
    order by (u.status = 'active') desc, u.created_at`;
  return rows.map(({ linkAt, linkPurpose, linkEmailId, linkEmailError, linkUsed, ...r }) => ({
    ...r,
    id: Number(r.id),
    roles: r.roles.filter(isRole),
    sessions: Number(r.sessions),
    lastLink: linkAt ? { at: linkAt, purpose: linkPurpose ?? '', emailId: linkEmailId, emailError: linkEmailError, used: Boolean(linkUsed) } : null,
  }));
}

export async function person(id: number): Promise<Person | null> {
  return (await people()).find((p) => p.id === id) ?? null;
}

export async function invite(emailRaw: string, name: string, roles: Role[], by: number): Promise<{ user: User; isNew: boolean }> {
  await migrate();
  const email = normalEmail(emailRaw);
  const [r] = await db()`
    insert into users (email, name, roles, invited_by) values (${email}, ${name.trim().slice(0, 80)}, ${roles}, ${by})
    on conflict (lower(email)) do nothing
    returning id, email, name, roles, status`;
  if (r) return { user: { id: Number(r.id), email: r.email, name: r.name, roles: r.roles, status: r.status }, isNew: true };
  const [e] = await db()`select id, email, name, roles, status from users where lower(email) = ${email}`;
  return { user: { id: Number(e.id), email: e.email, name: e.name, roles: e.roles, status: e.status }, isNew: false };
}

export async function update(id: number, v: { name?: string; roles?: Role[]; status?: 'active' | 'disabled' }): Promise<void> {
  await migrate();
  await db()`
    update users set
      name = coalesce(${v.name === undefined ? null : v.name.trim().slice(0, 80)}, name),
      roles = coalesce(${v.roles ?? null}, roles),
      status = coalesce(${v.status ?? null}, status)
    where id = ${id}`;
}

/** How many active Owners there would be if this person had these roles and status. */
export async function ownersAfter(id: number, roles: Role[], status: string): Promise<number> {
  const all = await people();
  return all.filter((p) => (p.id === id ? status === 'active' && roles.includes('owner') : p.status === 'active' && p.roles.includes('owner'))).length;
}

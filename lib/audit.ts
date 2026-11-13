import 'server-only';
import { clientIp, keyedHash } from './keys';
import { migrate, sql } from './store';
import type { Session } from './auth/session';

/**
 * The audit log: every change made in the admin, by whom. Writing it never breaks the action it
 * records; a failure is logged and the action carries on.
 */
export type AuditEntry = {
  action: string;
  entity?: string;
  entityId?: string | number;
  summary?: string;
  before?: unknown;
  after?: unknown;
};

export async function audit(session: Session | null, e: AuditEntry, headers?: Headers): Promise<void> {
  if (!sql) return;
  try {
    await migrate();
    const actor = session ? `${session.user.name || session.user.email}${session.method === 'pin' ? ' (PIN)' : ''}` : 'system';
    await sql`
      insert into audit_log (user_id, actor, action, entity, entity_id, summary, before, after, ip_hash)
      values (${session?.user.id ?? null}, ${actor}, ${e.action}, ${e.entity ?? ''}, ${String(e.entityId ?? '')},
              ${(e.summary ?? '').slice(0, 500)}, ${e.before === undefined ? null : sql.json(e.before as never)},
              ${e.after === undefined ? null : sql.json(e.after as never)}, ${headers ? keyedHash(`admin|${clientIp(headers)}`) : ''})`;
  } catch (err) {
    console.error('[audit] failed to record', e.action, err);
  }
}

export type AuditRow = { id: number; at: Date; actor: string; action: string; entity: string; entityId: string; summary: string; before: unknown; after: unknown };

export async function auditLog(opts: { entity?: string; entityId?: string; userId?: number; q?: string; limit?: number } = {}): Promise<AuditRow[]> {
  if (!sql) return [];
  await migrate();
  const q = (opts.q || '').trim();
  return sql<AuditRow[]>`
    select id::int as id, at, actor, action, entity, entity_id, summary, before, after from audit_log
    where true
      ${opts.entity ? sql`and entity = ${opts.entity}` : sql``}
      ${opts.entityId ? sql`and entity_id = ${opts.entityId}` : sql``}
      ${opts.userId ? sql`and user_id = ${opts.userId}` : sql``}
      ${q ? sql`and (summary ilike ${'%' + q + '%'} or actor ilike ${'%' + q + '%'} or action ilike ${'%' + q + '%'})` : sql``}
    order by at desc limit ${Math.min(opts.limit ?? 200, 1000)}`;
}

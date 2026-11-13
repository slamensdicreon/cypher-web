import 'server-only';
import type { Sql } from 'postgres';
import { MIGRATIONS, type Migration } from './migrations';

/** One lock id for every schema change, so instances starting together take turns. */
const LOCK = 7420261100;

/**
 * Applies every migration that hasn't run, in order, in one transaction under an advisory lock, so a
 * failed migration leaves nothing half-applied. Safe to call from every cold start: after the first call in an instance it's a no-op.
 */
export async function applyMigrations(sql: Sql, list: Migration[] = MIGRATIONS): Promise<string[]> {
  const applied: string[] = [];
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(${LOCK})`;
    await tx`create table if not exists schema_migrations (id text primary key, applied_at timestamptz not null default now())`;
    const done = new Set((await tx<{ id: string }[]>`select id from schema_migrations`).map((r) => r.id));
    for (const m of list) {
      if (done.has(m.id)) continue;
      await tx.unsafe(m.sql);
      await tx`insert into schema_migrations (id) values (${m.id})`;
      applied.push(m.id);
    }
  });
  return applied;
}

let ready: Promise<unknown> | null = null;

/** Memoised per instance; a failure clears the memo so the next request retries. */
export function ensureSchema(sql: Sql): Promise<unknown> {
  ready ??= applyMigrations(sql).catch((err) => {
    ready = null;
    throw err;
  });
  return ready;
}

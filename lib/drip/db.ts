import 'server-only';
import { migrate, sql } from '../store';

/**
 * The drip tables. Contacts (uploaded or entered), sequences of steps, enrollments of contacts in
 * sequences, every send, and the delivery events Resend reports back. Defined in lib/db/migrations.ts.
 */

export function db() {
  if (!sql) throw new Error('No database is connected.');
  return sql;
}

/** The drip tables are part of the schema (lib/db/migrations.ts); this just makes sure it's applied. */
export function dripReady(): Promise<unknown> {
  db();
  return migrate();
}

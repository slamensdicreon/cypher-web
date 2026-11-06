import 'server-only';
import { migrate, sql } from '../store';

/**
 * The drip tables. Contacts (uploaded or entered), sequences of steps, enrollments of contacts in
 * sequences, every send, and the delivery events Resend reports back. Created on first use.
 */

let ready: Promise<unknown> | null = null;

export function db() {
  if (!sql) throw new Error('No database is connected.');
  return sql;
}

export function dripReady(): Promise<unknown> {
  const s = db();
  ready ??= migrate()
    .then(() =>
      s.begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(7420261114)`;
        await tx`
          create table if not exists contacts (
            id bigserial primary key,
            email text not null,
            first_name text not null default '',
            last_name text not null default '',
            company text not null default '',
            title text not null default '',
            lists text[] not null default '{}',
            status text not null default 'active',
            created_at timestamptz not null default now(),
            unsubscribed_at timestamptz,
            unsub_send_id bigint
          )`;
        await tx`create unique index if not exists contacts_email on contacts (lower(email))`;
        await tx`
          create table if not exists sequences (
            id serial primary key,
            name text not null,
            status text not null default 'draft',
            created_at timestamptz not null default now()
          )`;
        await tx`
          create table if not exists steps (
            id serial primary key,
            sequence_id int not null references sequences(id) on delete cascade,
            position int not null,
            delay_days int not null default 0,
            subject text not null default '',
            preheader text not null default '',
            body text not null default '',
            cta_label text not null default '',
            cta_url text not null default '',
            updated_at timestamptz not null default now()
          )`;
        await tx`alter table steps add column if not exists send_on date`;
        await tx`
          create table if not exists enrollments (
            id bigserial primary key,
            contact_id bigint not null references contacts(id) on delete cascade,
            sequence_id int not null references sequences(id) on delete cascade,
            next_position int not null default 1,
            next_send_at timestamptz,
            status text not null default 'active',
            exit_reason text,
            last_error text,
            created_at timestamptz not null default now(),
            unique (contact_id, sequence_id)
          )`;
        await tx`create index if not exists enrollments_due on enrollments (status, next_send_at)`;
        await tx`
          create table if not exists drip_sends (
            id bigserial primary key,
            enrollment_id bigint not null references enrollments(id) on delete cascade,
            contact_id bigint not null,
            sequence_id int not null,
            step_id int not null,
            position int not null,
            email text not null,
            resend_id text,
            status text not null default 'queued',
            error text,
            created_at timestamptz not null default now(),
            sent_at timestamptz,
            delivered_at timestamptz,
            opened_at timestamptz,
            clicked_at timestamptz,
            bounced_at timestamptz,
            complained_at timestamptz,
            unique (enrollment_id, step_id)
          )`;
        await tx`create index if not exists drip_sends_resend on drip_sends (resend_id)`;
        await tx`
          create table if not exists drip_events (
            id bigserial primary key,
            send_id bigint not null,
            type text not null,
            url text,
            at timestamptz not null default now()
          )`;
      }),
    )
    .catch((err) => {
      ready = null;
      throw err;
    });
  return ready;
}

/**
 * The database schema, as an ordered list of migrations. Each runs once, in order, inside one
 * transaction, and is recorded in `schema_migrations`; lib/db/schema.ts applies whatever hasn't run.
 *
 * Rules: never edit or reorder a migration that has shipped; add a new one. Write each so it's safe
 * on a database that already has the change (`if not exists`), because 0001 baselines tables that
 * production created before migrations existed.
 */
export type Migration = { id: string; sql: string };

export const MIGRATIONS: Migration[] = [
  {
    id: '0001_baseline',
    sql: `
      -- The site form: every attempt, accepted or declined.
      create table if not exists submissions (
        id bigserial primary key,
        created_at timestamptz not null default now(),
        email text not null,
        domain text not null,
        company text not null,
        outcome text not null,
        level smallint,
        interest text,
        source text not null default '',
        ua text not null default '',
        ip_hash text not null default '',
        internal_sent_at timestamptz,
        confirmation_sent_at timestamptz,
        email_error text
      );
      alter table submissions add column if not exists site text not null default '';
      alter table submissions add column if not exists wants text not null default '';
      create index if not exists submissions_ip_recent on submissions (ip_hash, created_at);
      create index if not exists submissions_email on submissions (lower(email), created_at);

      -- First-party analytics: no cookies, no IP addresses; visitor is a keyed hash that changes daily.
      create table if not exists events (
        id bigserial primary key,
        at timestamptz not null default now(),
        kind text not null,
        path text not null default '',
        ref text not null default '',
        card text not null default '',
        utm text not null default '',
        country text not null default '',
        device text not null default '',
        visitor text not null default ''
      );
      create index if not exists events_at on events (at);
      create index if not exists events_kind_at on events (kind, at);

      -- Sign-in attempts, for the lockout.
      create table if not exists admin_attempts (
        ip_hash text not null,
        at timestamptz not null default now(),
        ok boolean not null
      );
      create index if not exists admin_attempts_ip on admin_attempts (ip_hash, at);

      -- Email sequences.
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
      );
      create unique index if not exists contacts_email on contacts (lower(email));
      create table if not exists sequences (
        id serial primary key,
        name text not null,
        status text not null default 'draft',
        created_at timestamptz not null default now()
      );
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
      );
      alter table steps add column if not exists send_on date;
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
      );
      create index if not exists enrollments_due on enrollments (status, next_send_at);
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
      );
      create index if not exists drip_sends_resend on drip_sends (resend_id);
      create table if not exists drip_events (
        id bigserial primary key,
        send_id bigint not null,
        type text not null,
        url text,
        at timestamptz not null default now()
      );
    `,
  },
  {
    id: '0002_people_and_audit',
    sql: `
      -- The people who can sign in to the admin. Email is the identity; roles say what they may do.
      create table if not exists users (
        id bigserial primary key,
        email text not null,
        name text not null default '',
        roles text[] not null default '{}',
        status text not null default 'active',
        invited_by bigint references users(id) on delete set null,
        created_at timestamptz not null default now(),
        last_sign_in_at timestamptz
      );
      create unique index if not exists users_email on users (lower(email));

      -- One-time sign-in links. Only a hash of the token is kept, so a database leak can't sign anyone in.
      create table if not exists login_links (
        id bigserial primary key,
        user_id bigint not null references users(id) on delete cascade,
        token_hash text not null unique,
        purpose text not null default 'sign_in',
        next text not null default '/admin',
        created_at timestamptz not null default now(),
        expires_at timestamptz not null,
        used_at timestamptz,
        ip_hash text not null default ''
      );
      create index if not exists login_links_user on login_links (user_id, created_at);

      -- Sessions, stored so they can be listed and revoked. Only a hash of the cookie value is kept.
      create table if not exists sessions (
        id bigserial primary key,
        user_id bigint not null references users(id) on delete cascade,
        token_hash text not null unique,
        created_at timestamptz not null default now(),
        last_seen_at timestamptz not null default now(),
        expires_at timestamptz not null,
        fresh_until timestamptz not null,
        revoked_at timestamptz,
        method text not null default 'link',
        ua text not null default '',
        ip_hash text not null default ''
      );
      create index if not exists sessions_user on sessions (user_id, expires_at);

      -- Every change made in the admin: who, what, to which record, and the values before and after.
      create table if not exists audit_log (
        id bigserial primary key,
        at timestamptz not null default now(),
        user_id bigint references users(id) on delete set null,
        actor text not null default '',
        action text not null,
        entity text not null default '',
        entity_id text not null default '',
        summary text not null default '',
        before jsonb,
        after jsonb,
        ip_hash text not null default ''
      );
      create index if not exists audit_log_at on audit_log (at desc);
      create index if not exists audit_log_entity on audit_log (entity, entity_id, at desc);
      create index if not exists audit_log_user on audit_log (user_id, at desc);

      -- Settings edited in the admin (sender, postal address and so on), one row per key.
      create table if not exists settings (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz not null default now(),
        updated_by bigint references users(id) on delete set null
      );
    `,
  },
];

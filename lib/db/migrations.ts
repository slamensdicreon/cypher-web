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
  {
    id: '0003_link_delivery',
    sql: `
      -- Which email carried a sign-in link or invitation, so the admin can ask Resend whether it arrived.
      alter table login_links add column if not exists email_id text;
      alter table login_links add column if not exists email_error text;
    `,
  },
  {
    id: '0004_crm',
    sql: `
      -- Companies: one per business domain.
      create table if not exists companies (
        id bigserial primary key,
        name text not null,
        domain text not null default '',
        website text not null default '',
        size text not null default '',
        industry text not null default '',
        platform text not null default '',
        notes text not null default '',
        owner_id bigint references users(id) on delete set null,
        source text not null default '',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
      create unique index if not exists companies_domain on companies (lower(domain)) where domain <> '';
      create index if not exists companies_name on companies (lower(name));

      -- Contacts are shared with email marketing; the CRM adds these.
      alter table contacts add column if not exists company_id bigint references companies(id) on delete set null;
      alter table contacts add column if not exists phone text not null default '';
      alter table contacts add column if not exists linkedin text not null default '';
      alter table contacts add column if not exists owner_id bigint references users(id) on delete set null;
      alter table contacts add column if not exists source text not null default '';
      alter table contacts add column if not exists updated_at timestamptz not null default now();
      create index if not exists contacts_company on contacts (company_id);

      -- The pipeline. Kind says what a stage means: still open, won, lost, or parked for later.
      create table if not exists pipeline_stages (
        id text primary key,
        label text not null,
        position int not null,
        kind text not null default 'open'
      );
      insert into pipeline_stages (id, label, position, kind) values
        ('new', 'New lead', 1, 'open'),
        ('qualified', 'Qualified', 2, 'open'),
        ('demo_booked', 'Demo booked', 3, 'open'),
        ('demo_shown', 'Demo shown', 4, 'open'),
        ('proposal_sent', 'Proposal sent', 5, 'open'),
        ('negotiating', 'Negotiating', 6, 'open'),
        ('won', 'Won', 7, 'won'),
        ('lost', 'Lost', 8, 'lost'),
        ('nurture', 'Nurture', 9, 'nurture')
      on conflict (id) do nothing;

      create table if not exists deals (
        id bigserial primary key,
        title text not null,
        company_id bigint references companies(id) on delete set null,
        primary_contact_id bigint references contacts(id) on delete set null,
        stage text not null default 'new' references pipeline_stages(id),
        value numeric(12, 2),
        expected_close date,
        owner_id bigint references users(id) on delete set null,
        outcomes text[] not null default '{}',
        level smallint,
        source text not null default '',
        next_step text not null default '',
        next_step_at date,
        lost_reason text not null default '',
        submission_id bigint,
        score int not null default 0,
        score_reasons jsonb not null default '[]',
        scored_at timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now(),
        stage_changed_at timestamptz not null default now(),
        closed_at timestamptz
      );
      create index if not exists deals_stage on deals (stage, updated_at desc);
      create index if not exists deals_company on deals (company_id);
      create index if not exists deals_owner on deals (owner_id);

      create table if not exists deal_contacts (
        deal_id bigint not null references deals(id) on delete cascade,
        contact_id bigint not null references contacts(id) on delete cascade,
        role text not null default '',
        primary key (deal_id, contact_id)
      );

      -- The timeline: notes, calls, meetings, emails, stage changes, form submissions.
      create table if not exists activities (
        id bigserial primary key,
        at timestamptz not null default now(),
        kind text not null,
        user_id bigint references users(id) on delete set null,
        actor text not null default '',
        company_id bigint references companies(id) on delete cascade,
        contact_id bigint references contacts(id) on delete cascade,
        deal_id bigint references deals(id) on delete cascade,
        subject text not null default '',
        body text not null default '',
        meta jsonb not null default '{}'
      );
      create index if not exists activities_deal on activities (deal_id, at desc);
      create index if not exists activities_company on activities (company_id, at desc);
      create index if not exists activities_contact on activities (contact_id, at desc);

      create table if not exists tasks (
        id bigserial primary key,
        title text not null,
        notes text not null default '',
        due_at timestamptz,
        done_at timestamptz,
        owner_id bigint references users(id) on delete set null,
        created_by bigint references users(id) on delete set null,
        company_id bigint references companies(id) on delete cascade,
        contact_id bigint references contacts(id) on delete cascade,
        deal_id bigint references deals(id) on delete cascade,
        created_at timestamptz not null default now()
      );
      create index if not exists tasks_owner on tasks (owner_id, done_at, due_at);
      create index if not exists tasks_deal on tasks (deal_id);

      -- Backfill, once: companies, contacts and deals from the accepted sign-ups so far.
      insert into companies (domain, name, source, created_at)
      select lower(domain),
             coalesce((array_agg(nullif(company, '') order by created_at desc) filter (where company <> ''))[1], lower(domain)),
             coalesce((array_agg(source order by created_at) filter (where source <> ''))[1], ''),
             min(created_at)
      from submissions where outcome = 'ok' and domain <> '' group by lower(domain)
      on conflict do nothing;

      -- ...and a company for every business domain already in the email contacts.
      insert into companies (domain, name, created_at)
      select d,
             coalesce((array_agg(company order by created_at desc) filter (where company <> ''))[1], initcap(split_part(d, '.', 1))),
             min(created_at)
      from (select lower(split_part(email, '@', 2)) as d, company, created_at from contacts where position('@' in email) > 1) c
      group by d
      on conflict do nothing;

      insert into contacts (email, company, source, created_at)
      select distinct on (lower(email)) lower(email), company, source, created_at
      from submissions where outcome = 'ok' order by lower(email), created_at
      on conflict do nothing;

      update contacts c set company_id = co.id
      from companies co
      where c.company_id is null and co.domain <> '' and co.domain = lower(split_part(c.email, '@', 2));

      insert into deals (title, company_id, primary_contact_id, stage, outcomes, level, source, submission_id, created_at, updated_at, stage_changed_at)
      select co.name || ' · ' || coalesce(nullif(l.wants, ''), 'See it on your site'),
             co.id, ct.id, 'new',
             case when l.wants = '' then '{}'::text[] else string_to_array(l.wants, ', ') end,
             l.level, l.source, l.id, f.created_at, l.created_at, f.created_at
      from (select lower(domain) as d, min(created_at) as created_at from submissions where outcome = 'ok' group by lower(domain)) f
      join lateral (select * from submissions s where s.outcome = 'ok' and lower(s.domain) = f.d order by s.created_at desc limit 1) l on true
      join companies co on co.domain = f.d
      left join contacts ct on lower(ct.email) = lower(l.email)
      where not exists (select 1 from deals x where x.company_id = co.id);

      insert into activities (at, kind, actor, company_id, contact_id, deal_id, subject, body, meta)
      select s.created_at, 'form', 'Website', co.id, ct.id, d.id,
             'Asked to see it on their site',
             concat_ws(' · ', nullif(s.site, ''), nullif(s.wants, ''), nullif(s.interest, '')),
             jsonb_build_object('submission_id', s.id, 'source', s.source, 'site', s.site, 'wants', s.wants, 'level', s.level)
      from submissions s
      join companies co on co.domain = lower(s.domain)
      left join contacts ct on lower(ct.email) = lower(s.email)
      left join deals d on d.company_id = co.id
      where s.outcome = 'ok'
        and not exists (select 1 from activities a where a.kind = 'form' and (a.meta->>'submission_id')::bigint = s.id);
    `,
  },
  {
    id: '0005_demo_requests',
    sql: `
      -- The site's form asks for a demo now: who, which platform, and when suits them.
      alter table submissions add column if not exists kind text not null default 'interest';
      alter table submissions add column if not exists name text not null default '';
      alter table submissions add column if not exists platform text not null default '';
      alter table submissions add column if not exists times text not null default '';
      alter table submissions add column if not exists tz text not null default '';
      alter table submissions add column if not exists page text not null default '';
      -- Which button was pressed, for clicks on the site's calls to action.
      alter table events add column if not exists label text not null default '';
    `,
  },
];

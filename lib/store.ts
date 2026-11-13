import 'server-only';
import postgres from 'postgres';
import { ensureSchema } from './db/schema';

/** What the form decided about a submission. Only `ok` is a company put forward. */
export type Outcome = 'ok' | 'sitecore' | 'vendor' | 'personal' | 'bad';

export type Submission = {
  email: string;
  domain: string;
  company: string;
  outcome: Outcome;
  level: number | null;
  interest: string | null;
  source: string;
  /** The site they want Cypher to look at, and what they want done (build, migrate, personalize, optimize). */
  site: string;
  wants: string;
  ua: string;
  ipHash: string;
};

export type Row = {
  id: number;
  createdAt: Date;
  email: string;
  domain: string;
  company: string;
  outcome: Outcome;
  level: number | null;
  interest: string | null;
  source: string;
  site: string;
  wants: string;
  internalSentAt: Date | null;
  confirmationSentAt: Date | null;
  emailError: string | null;
};

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
export const hasStore = Boolean(url);

/**
 * One small pool per function instance. `prepare: false` keeps it working through Neon's
 * pooled (PgBouncer) connection string, which is what the Vercel integration sets as DATABASE_URL.
 */
export const sql = hasStore
  ? postgres(url, { max: 3, idle_timeout: 20, prepare: false, transform: postgres.camel, onnotice: () => {} })
  : null;

/** Creates or updates the tables on first use (lib/db/migrations.ts). Idempotent and memoised. */
export function migrate(): Promise<unknown> {
  if (!sql) return Promise.resolve();
  return ensureSchema(sql);
}

/** Saves a submission and returns its id. Without a database it goes to the server log instead. */
export async function save(s: Submission): Promise<number | null> {
  if (!sql) {
    console.log('[interest]', JSON.stringify(s));
    return null;
  }
  await migrate();
  const [row] = await sql<{ id: string }[]>`
    insert into submissions (email, domain, company, outcome, level, interest, source, site, wants, ua, ip_hash)
    values (${s.email}, ${s.domain}, ${s.company}, ${s.outcome}, ${s.level}, ${s.interest},
            ${s.source}, ${s.site}, ${s.wants}, ${s.ua}, ${s.ipHash})
    returning id`;
  return Number(row.id);
}

/** False once a network has submitted `limit` times in the last `windowMinutes`. */
export async function underLimit(ipHash: string, limit = 20, windowMinutes = 60): Promise<boolean> {
  if (!sql || !ipHash) return true;
  try {
    await migrate();
    const [{ n }] = await sql<{ n: string }[]>`
      select count(*) as n from submissions
      where ip_hash = ${ipHash} and created_at > now() - make_interval(mins => ${windowMinutes})`;
    return Number(n) < limit;
  } catch (err) {
    console.error('[interest] rate limit check failed', err);
    return true;
  }
}

/**
 * Whether this address was already sent a confirmation within the window. Keeps someone from
 * using the form to send repeated mail to an address that isn't theirs.
 */
export async function confirmedRecently(email: string, windowHours = 24): Promise<boolean> {
  if (!sql) return false;
  const [{ n }] = await sql<{ n: string }[]>`
    select count(*) as n from submissions
    where lower(email) = lower(${email}) and confirmation_sent_at > now() - make_interval(hours => ${windowHours})`;
  return Number(n) > 0;
}

/** How many distinct companies have been put forward so far. */
export async function companiesSoFar(): Promise<number | null> {
  if (!sql) return null;
  const [{ n }] = await sql<{ n: string }[]>`
    select count(distinct domain) as n from submissions where outcome = 'ok'`;
  return Number(n);
}

/** Records what happened to the emails for a submission. */
export async function markEmails(
  id: number,
  r: { internal: boolean; confirmation: boolean; error: string | null },
): Promise<void> {
  if (!sql) return;
  await sql`
    update submissions set
      internal_sent_at = case when ${r.internal} then now() else internal_sent_at end,
      confirmation_sent_at = case when ${r.confirmation} then now() else confirmation_sent_at end,
      email_error = ${r.error}
    where id = ${id}`;
}

/** Every submission, newest first; `outcome: 'ok'` for only the companies put forward. */
export async function all(opts: { outcome?: Outcome } = {}): Promise<Row[]> {
  if (!sql) return [];
  await migrate();
  return sql<Row[]>`
    select id::int as id, created_at, email, domain, company, outcome, level, interest, source, site, wants,
           internal_sent_at, confirmation_sent_at, email_error
    from submissions
    ${opts.outcome ? sql`where outcome = ${opts.outcome}` : sql``}
    order by created_at desc`;
}

import 'server-only';
import { hasStore, migrate, sql, type Row } from './store';

/**
 * What the admin shows. A "visit" is one person on one day: visitors are a hash that changes
 * daily, so a person can't be followed across days, and days are counted in US Eastern time.
 */

const TZ = 'America/New_York';

export type Count = { label: string; n: number };
export type Day = { day: string; visits: number; views: number };
export type CardStat = { card: string; scans: number; ok: number; declined: number };

export type Dashboard = {
  days: number;
  daily: Day[];
  visits: number;
  views: number;
  started: number;
  flips: number;
  approves: number;
  ok: number;
  declined: number;
  allTime: { ok: number; declined: number; visits: number };
  sources: Count[];
  countries: Count[];
  devices: Count[];
  pages: Count[];
};

const num = (v: unknown) => Number(v ?? 0);

export async function dashboard(days: number): Promise<Dashboard | null> {
  if (!hasStore || !sql) return null;
  await migrate();
  const db = sql;
  const since = db`now() - make_interval(days => ${days})`;
  const dayVisitor = db`((at at time zone ${TZ})::date || ':' || visitor)`;

  const [daily, totals, subs, allTime, sources, countries, devices, pages] = await Promise.all([
    db<{ day: string; visits: string; views: string }[]>`
      with d as (
        select generate_series((now() at time zone ${TZ})::date - ${days - 1}::int, (now() at time zone ${TZ})::date, interval '1 day')::date as day
      )
      select to_char(d.day, 'YYYY-MM-DD') as day, coalesce(v.visits, 0) as visits, coalesce(v.views, 0) as views
      from d left join (
        select (at at time zone ${TZ})::date as day, count(distinct visitor) as visits, count(*) as views
        from events where kind = 'view' and at > ${since} group by 1
      ) v on v.day = d.day
      order by d.day`,
    db<Record<string, string>[]>`
      select
        count(distinct ${dayVisitor}) filter (where kind = 'view') as visits,
        count(*) filter (where kind = 'view') as views,
        count(distinct ${dayVisitor}) filter (where kind = 'form_start') as started,
        count(*) filter (where kind = 'card_flip') as flips,
        count(*) filter (where kind = 'card_approve') as approves
      from events where at > ${since}`,
    db<{ outcome: string; n: string }[]>`
      select outcome, count(*) as n from submissions where created_at > ${since} group by outcome`,
    db<Record<string, string>[]>`
      select
        (select count(*) from submissions where outcome = 'ok') as ok,
        (select count(*) from submissions where outcome <> 'ok') as declined,
        (select count(distinct ${dayVisitor}) from events where kind = 'view') as visits`,
    db<{ label: string; n: string }[]>`
      select case when card <> '' then 'Postcard QR' when utm <> '' then 'utm: ' || utm when ref <> '' then ref else 'Direct' end as label,
        count(distinct ${dayVisitor}) as n
      from events where kind = 'view' and at > ${since} group by 1 order by n desc limit 8`,
    db<{ label: string; n: string }[]>`
      select coalesce(nullif(country, ''), '??') as label, count(distinct ${dayVisitor}) as n
      from events where kind = 'view' and at > ${since} group by 1 order by n desc limit 8`,
    db<{ label: string; n: string }[]>`
      select coalesce(nullif(device, ''), 'Unknown') as label, count(distinct ${dayVisitor}) as n
      from events where kind = 'view' and at > ${since} group by 1 order by n desc`,
    db<{ label: string; n: string }[]>`
      select path as label, count(*) as n from events where kind = 'view' and at > ${since} group by 1 order by n desc limit 8`,
  ]);

  const t = totals[0] ?? {};
  const by = Object.fromEntries(subs.map((s) => [s.outcome, num(s.n)]));
  const counts = (rows: { label: string; n: string }[]) => rows.map((r) => ({ label: r.label, n: num(r.n) }));

  return {
    days,
    daily: daily.map((d) => ({ day: d.day, visits: num(d.visits), views: num(d.views) })),
    visits: num(t.visits),
    views: num(t.views),
    started: num(t.started),
    flips: num(t.flips),
    approves: num(t.approves),
    ok: by.ok ?? 0,
    declined: Object.entries(by).filter(([k]) => k !== 'ok').reduce((a, [, v]) => a + v, 0),
    allTime: { ok: num(allTime[0]?.ok), declined: num(allTime[0]?.declined), visits: num(allTime[0]?.visits) },
    sources: counts(sources),
    countries: counts(countries),
    devices: counts(devices),
    pages: counts(pages),
  };
}

/**
 * How each printed card does: scans (visits that came in on its QR code) and the sign-ups that named it,
 * over the last `days` days, or all time when days is 0. Shown with the print run in Campaign assets.
 */
export async function cardStats(days: number): Promise<{ cards: CardStat[]; scans: number; visits: number } | null> {
  if (!hasStore || !sql) return null;
  await migrate();
  const db = sql;
  const since = () => (days ? db`now() - make_interval(days => ${days})` : db`'-infinity'::timestamptz`);
  const dayVisitor = () => db`((at at time zone ${TZ})::date || ':' || visitor)`;
  const [scans, subs, totals] = await Promise.all([
    db<{ card: string; n: string }[]>`
      select card, count(distinct ${dayVisitor()}) as n from events where kind = 'view' and card <> '' and at > ${since()} group by card`,
    db<{ card: string; ok: string; declined: string }[]>`
      select source as card, count(*) filter (where outcome = 'ok') as ok, count(*) filter (where outcome <> 'ok') as declined
      from submissions where source <> '' and created_at > ${since()} group by source`,
    db<{ scans: string; visits: string }[]>`
      select count(distinct ${dayVisitor()}) filter (where card <> '') as scans, count(distinct ${dayVisitor()}) as visits
      from events where kind = 'view' and at > ${since()}`,
  ]);
  const map = new Map<string, CardStat>();
  for (const r of scans) map.set(r.card, { card: r.card, scans: num(r.n), ok: 0, declined: 0 });
  for (const r of subs) {
    const c = map.get(r.card) ?? { card: r.card, scans: 0, ok: 0, declined: 0 };
    c.ok = num(r.ok);
    c.declined = num(r.declined);
    map.set(r.card, c);
  }
  return { cards: [...map.values()], scans: num(totals[0]?.scans), visits: num(totals[0]?.visits) };
}

export type Tab = 'all' | 'ok' | 'declined' | 'vendor' | 'sitecore' | 'personal';
export const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Everyone' },
  { key: 'ok', label: 'Put forward' },
  { key: 'declined', label: 'Declined' },
  { key: 'vendor', label: 'Vendors' },
  { key: 'sitecore', label: 'Sitecore' },
  { key: 'personal', label: 'Personal email' },
];

/** Submissions for the admin table, newest first, filtered by tab and a search on email or company. */
export async function submissions(tab: Tab, q: string, limit = 500): Promise<{ rows: Row[]; counts: Record<Tab, number> }> {
  const empty = { all: 0, ok: 0, declined: 0, vendor: 0, sitecore: 0, personal: 0 };
  if (!hasStore || !sql) return { rows: [], counts: empty };
  await migrate();
  const db = sql;
  const like = `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
  const search = q ? db`and (email ilike ${like} or company ilike ${like} or domain ilike ${like})` : db``;
  const filter =
    tab === 'all' ? db`` : tab === 'declined' ? db`and outcome <> 'ok'` : db`and outcome = ${tab}`;
  const [rows, counts] = await Promise.all([
    db<Row[]>`
      select id::int as id, created_at, email, domain, company, outcome, level, interest, source, site, wants,
             kind, name, platform, times, tz, page, internal_sent_at, confirmation_sent_at, email_error
      from submissions where true ${filter} ${search}
      order by created_at desc limit ${limit}`,
    db<{ outcome: string; n: string }[]>`select outcome, count(*) as n from submissions where true ${search} group by outcome`,
  ]);
  const c = { ...empty };
  for (const r of counts) {
    const n = num(r.n);
    c.all += n;
    if (r.outcome === 'ok') c.ok += n;
    else {
      c.declined += n;
      if (r.outcome === 'vendor' || r.outcome === 'sitecore' || r.outcome === 'personal') c[r.outcome] += n;
    }
  }
  return { rows, counts: c };
}

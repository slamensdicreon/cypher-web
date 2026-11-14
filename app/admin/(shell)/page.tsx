import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { Banner } from '@/components/admin/AdminNav';
import { dashboard, submissions, TABS, type Count, type Dashboard, type Tab } from '@/lib/adminData';
import { snapshot } from '@/lib/crm/data';
import type { Row } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Admin | Cypher',
  robots: { index: false, follow: false },
};


const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (a: number, b: number) => (!b ? '–' : !a ? '0%' : `${((a / b) * 100).toFixed(a / b < 0.1 ? 1 : 0)}%`);
const when = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d);
const shortDay = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }).format(new Date(`${iso}T00:00:00Z`));

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
/** Big amounts for a tile: $1.1M, $240K. */
const short = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : n >= 1e4 ? `$${Math.round(n / 1e3)}K` : money(n));

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="ad-tile">
      <span className="ad-tl">{label}</span>
      <b>{value}</b>
      {note && <span className="ad-tn">{note}</span>}
    </div>
  );
}

/** Visits per day: one series, so no legend; each bar's exact numbers on hover and in the table below. */
function DailyChart({ data }: { data: Dashboard['daily'] }) {
  const W = 720;
  const H = 200;
  const pad = { l: 36, r: 8, t: 12, b: 26 };
  const max = Math.max(4, ...data.map((d) => d.visits));
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const bw = (W - pad.l - pad.r) / data.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / top);
  const labelEvery = Math.ceil(data.length / 7);
  return (
    <figure className="ad-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Visits per day over the last ${data.length} days`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y(i * step)} y2={y(i * step)} className="ad-grid" />
            <text x={pad.l - 8} y={y(i * step) + 4} className="ad-axis" textAnchor="end">{i * step}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * bw;
          const h = Math.max(0, y(0) - y(d.visits));
          return (
            <g key={d.day} className="ad-bar">
              <rect x={x} y={pad.t} width={bw} height={H - pad.t - pad.b} className="ad-hit">
                <title>{`${shortDay(d.day)}: ${d.visits} visits, ${d.views} page views`}</title>
              </rect>
              {h > 0 && (
                <path
                  d={`M${x + 1} ${y(0)} V${y(d.visits) + Math.min(4, h)} q0 -${Math.min(4, h)} ${Math.min(4, h)} -${Math.min(4, h)} H${x + bw - 1 - Math.min(4, h)} q${Math.min(4, h)} 0 ${Math.min(4, h)} ${Math.min(4, h)} V${y(0)} Z`}
                  className="ad-mark"
                />
              )}
              {(i % labelEvery === 0 || i === data.length - 1) && (
                <text x={x + bw / 2} y={H - 8} className="ad-axis" textAnchor="middle">{shortDay(d.day)}</text>
              )}
            </g>
          );
        })}
      </svg>
      <details className="ad-table-view">
        <summary>Show as a table</summary>
        <table>
          <thead><tr><th>Day</th><th>Visits</th><th>Page views</th></tr></thead>
          <tbody>{data.map((d) => <tr key={d.day}><td>{shortDay(d.day)}</td><td>{d.visits}</td><td>{d.views}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}

function Ranked({ title, rows, empty = 'Nothing yet.' }: { title: string; rows: Count[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <section className="ad-card">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="ad-empty">{empty}</p>
      ) : (
        <ul className="ad-rank">
          {rows.map((r) => (
            <li key={r.label}>
              <span className="ad-rl">{r.label}</span>
              <span className="ad-rb"><i style={{ width: `${(r.n / max) * 100}%` }} /></span>
              <b>{fmt(r.n)}</b>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Funnel({ d }: { d: Dashboard }) {
  const steps = [
    { label: 'Visits', n: d.visits },
    { label: 'Started the form', n: d.started },
    { label: 'Signed up', n: d.ok },
  ];
  const max = Math.max(1, d.visits);
  return (
    <section className="ad-card">
      <h3>From visit to sign-up</h3>
      <ul className="ad-rank ad-funnel">
        {steps.map((s, i) => (
          <li key={s.label}>
            <span className="ad-rl">{s.label}</span>
            <span className="ad-rb"><i style={{ width: `${(s.n / max) * 100}%` }} /></span>
            <b>{fmt(s.n)}{i > 0 && <small> {pct(s.n, steps[i - 1].n)}</small>}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}

type Snap = Awaited<ReturnType<typeof snapshot>>;

/** The pipeline at a glance: open deals by stage, what closed in the range, and your tasks. */
function Pipeline({ p, days }: { p: Snap; days: number }) {
  const max = Math.max(1, ...p.byStage.map((s) => s.n));
  return (
    <section className="ad-card">
      <div className="ad-people-head">
        <h3>Pipeline</h3>
        <Link className="ad-btn small" href="/admin/crm">Open the pipeline</Link>
      </div>
      <ul className="ad-rank">
        {p.byStage.map((s) => (
          <li key={s.id}>
            <span className="ad-rl">{s.label}</span>
            <span className="ad-rb"><i style={{ width: `${(s.n / max) * 100}%` }} /></span>
            <b>{fmt(s.n)}{s.value ? <small> {money(s.value)}</small> : null}</b>
          </li>
        ))}
      </ul>
      <p className="ad-fine dash-foot">
        Last {days} days: {fmt(p.won)} won{p.wonValue ? ` (${money(p.wonValue)})` : ''}, {fmt(p.lost)} lost.{' '}
        <Link href="/admin/crm/tasks">{p.myOverdue ? `${fmt(p.myOverdue)} of your tasks overdue` : `${fmt(p.myDue)} of your tasks due this week`}</Link>.
      </p>
    </section>
  );
}

const OUTCOME: Record<string, string> = { ok: 'Put forward', vendor: 'Vendor', sitecore: 'Sitecore', personal: 'Personal email' };

function Emails({ r }: { r: Row }) {
  if (r.outcome !== 'ok') return <span className="ad-dim">None sent</span>;
  return (
    <span title={r.emailError ?? undefined}>
      {r.internalSentAt ? 'Team ✓' : 'Team ✗'} · {r.confirmationSentAt ? 'Them ✓' : 'Them ✗'}
      {r.emailError && <span className="ad-warn"> · error</span>}
    </span>
  );
}

function People({ tab, q, rows, counts }: { tab: Tab; q: string; rows: Row[]; counts: Record<Tab, number> }) {
  const href = (t: Tab) => `/admin?${new URLSearchParams({ ...(t !== 'all' ? { tab: t } : {}), ...(q ? { q } : {}) })}#people`;
  return (
    <section className="ad-card ad-wide" id="people">
      <div className="ad-people-head">
        <h3>Demo requests and sign-ups</h3>
        <a className="ad-btn" href={`/api/admin/export?tab=${tab}`}>Download CSV</a>
      </div>
      <nav className="ad-tabs" aria-label="Filter submissions">
        {TABS.map((t) => (
          <Link key={t.key} href={href(t.key)} className={t.key === tab ? 'on' : undefined} aria-current={t.key === tab ? 'page' : undefined}>
            {t.label} <span>{fmt(counts[t.key])}</span>
          </Link>
        ))}
      </nav>
      <form className="ad-search" method="get" action="/admin#people">
        {tab !== 'all' && <input type="hidden" name="tab" value={tab} />}
        <input type="search" name="q" defaultValue={q} placeholder="Search email, company or domain" aria-label="Search submissions" />
        <button className="ad-btn" type="submit">Search</button>
      </form>
      {rows.length === 0 ? (
        <p className="ad-empty">{q ? 'No one matches that search.' : 'No one here yet.'}</p>
      ) : (
        <div className="ad-scroll">
          <table className="ad-tbl">
            <thead>
              <tr><th>When (ET)</th><th>Company</th><th>Email</th><th>Result</th><th>Platform</th><th>Times that suit</th><th>Site</th><th>Wants</th><th>How badly</th><th>Source</th><th>Emails</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="nw">{when(new Date(r.createdAt))}</td>
                  <td><b>{r.company}</b></td>
                  <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td><span className={`ad-pill ${r.outcome === 'ok' ? 'ok' : 'no'}`}>{OUTCOME[r.outcome] ?? r.outcome}</span></td>
                  <td>{r.platform || <span className="ad-dim">–</span>}</td>
                  <td className="ad-line">{r.times ? <>{r.times}{r.tz ? <><br /><span className="ad-dim">{r.tz.replace(/_/g, ' ')}</span></> : null}</> : <span className="ad-dim">–</span>}</td>
                  <td>{r.site ? <a href={/^https?:\/\//.test(r.site) ? r.site : `https://${r.site}`} target="_blank" rel="noreferrer noopener">{r.site.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a> : <span className="ad-dim">–</span>}</td>
                  <td>{r.wants || <span className="ad-dim">–</span>}</td>
                  <td>{r.interest ?? <span className="ad-dim">–</span>}</td>
                  <td>{r.source || <span className="ad-dim">direct</span>}</td>
                  <td className="nw"><Emails r={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

type Search = { tab?: string; q?: string; days?: string; msg?: string };

/** Home: the evergreen picture. Traffic and where it comes from, the sign-up funnel, and the pipeline. */
export default async function Admin({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const s = await requireUser('analytics', 'read', '/admin');

  const days = [7, 14, 30].includes(Number(sp.days)) ? Number(sp.days) : 14;
  const tab = (TABS.some((t) => t.key === sp.tab) ? sp.tab : 'all') as Tab;
  const q = (sp.q ?? '').slice(0, 80);
  const crm = can(s.user.roles, 'crm');
  const [d, people, pipe] = await Promise.all([dashboard(days), submissions(tab, q), crm ? snapshot(days, s.user.id).catch(() => null) : Promise.resolve(null)]);

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Home</h1>
          <p>The site, sign-ups and the pipeline, last {days} days, US Eastern time. A visit is one person on one day.</p>
        </div>
        <div className="ad-controls">
          <nav className="ad-range" aria-label="Date range">
            {[7, 14, 30].map((n) => (
              <Link key={n} href={`/admin?days=${n}`} className={n === days ? 'on' : undefined} aria-current={n === days ? 'page' : undefined}>
                {n} days
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <Banner msg={sp.msg} />

      {!d ? (
        <p className="ad-empty">No database is connected.</p>
      ) : (
        <>
          <div className="ad-tiles">
            <Tile label="Visits" value={fmt(d.visits)} note={`${fmt(d.allTime.visits)} all time`} />
            <Tile label="Page views" value={fmt(d.views)} />
            <Tile label="Started the form" value={fmt(d.started)} note={pct(d.started, d.visits) + ' of visits'} />
            <Tile label="Sign-ups" value={fmt(d.ok)} note={`${pct(d.ok, d.visits)} of visits · ${fmt(d.declined)} declined`} />
            {pipe ? (
              <>
                <Tile label="New deals" value={fmt(pipe.newDeals)} note={`${fmt(pipe.open)} open now`} />
                <Tile label="In play" value={short(pipe.openValue)} note={`${money(pipe.openValue)} in open deals`} />
              </>
            ) : (
              <>
                <Tile label="Declined" value={fmt(d.declined)} note={`${fmt(d.allTime.declined)} all time`} />
                <Tile label="All-time sign-ups" value={fmt(d.allTime.ok)} />
              </>
            )}
          </div>

          <section className="ad-card ad-wide">
            <h3>Visits per day</h3>
            <DailyChart data={d.daily} />
          </section>

          <div className="ad-grid2">
            <Funnel d={d} />
            {pipe && <Pipeline p={pipe} days={days} />}
            <section className="ad-card">
              <h3>Decision cards</h3>
              <ul className="ad-rank">
                <li><span className="ad-rl">Turned over (Reject)</span><b>{fmt(d.flips)}</b></li>
                <li><span className="ad-rl">Approved</span><b>{fmt(d.approves)}</b></li>
              </ul>
            </section>
            <Ranked title="Where visits come from" rows={d.sources} />
            <Ranked title="From AI answer engines" rows={d.ai} empty="None yet. ChatGPT, Perplexity, Copilot, Gemini and Claude show up here when they send someone." />
            <Ranked title="Countries" rows={d.countries} />
            <Ranked title="Devices" rows={d.devices} />
            <Ranked title="Pages" rows={d.pages} />
          </div>

          <p className="ad-fine dash-foot">Postcard scans and how each printed card does are in <Link href="/admin/assets/postcards">Campaign assets › Postcards</Link>.</p>
        </>
      )}

      <People tab={tab} q={q} rows={people.rows} counts={people.counts} />
    </main>
  );
}

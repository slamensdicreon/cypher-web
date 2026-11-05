import type { Metadata } from 'next';
import Link from 'next/link';
import { Resting } from '@/components/SiteHeader';
import { adminConfigured, isAdmin } from '@/lib/admin';
import { dashboard, submissions, TABS, type Count, type Dashboard, type Tab } from '@/lib/adminData';
import { USE_CASES } from '@/lib/postcards';
import type { Row } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Admin | Cypher',
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  pin: 'That’s not it.',
  locked: 'Too many wrong tries from this network. Wait fifteen minutes.',
  unset: 'ADMIN_PIN isn’t set on the server.',
};

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (a: number, b: number) => (!b ? '–' : !a ? '0%' : `${((a / b) * 100).toFixed(a / b < 0.1 ? 1 : 0)}%`);
const when = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d);
const shortDay = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }).format(new Date(`${iso}T00:00:00Z`));

/** Every card's place and version, by id, for the postcard table. */
const CARD_INFO = new Map(
  USE_CASES.flatMap((u) =>
    u.cards.map((c, i) => [c.id, { place: u.place, version: u.cards.length === 2 ? (i ? 'B' : 'A') : `${u.n}${i + 1}`, line: c.line }] as const),
  ),
);

function Login({ error }: { error?: string }) {
  return (
    <main className="ad-login">
      <form className="ad-pin" method="post" action="/api/admin/login">
        <Resting size={40} />
        <h1>Admin</h1>
        <label htmlFor="pin">PIN</label>
        <input id="pin" name="pin" type="password" inputMode="numeric" autoComplete="current-password" required autoFocus />
        {error && ERRORS[error] && <p className="ad-err" role="alert">{ERRORS[error]}</p>}
        <button className="btn" type="submit" disabled={!adminConfigured()}>Enter</button>
      </form>
    </main>
  );
}

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
    { label: 'Put forward', n: d.ok },
  ];
  const max = Math.max(1, d.visits);
  return (
    <section className="ad-card">
      <h3>From visit to put forward</h3>
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

function Cards({ d }: { d: Dashboard }) {
  const rows = [...CARD_INFO.keys()].map((id) => d.cards.find((c) => c.card === id) ?? { card: id, scans: 0, ok: 0, declined: 0 });
  const other = d.cards.filter((c) => !CARD_INFO.has(c.card));
  rows.sort((a, b) => b.scans - a.scans || b.ok - a.ok || a.card.localeCompare(b.card));
  return (
    <section className="ad-card ad-wide">
      <h3>Postcards</h3>
      <div className="ad-scroll">
        <table className="ad-tbl">
          <thead>
            <tr><th>Card</th><th>Where</th><th>Line</th><th className="r">Scans</th><th className="r">Put forward</th><th className="r">Declined</th><th className="r">Scan → put forward</th></tr>
          </thead>
          <tbody>
            {[...rows, ...other].map((c) => {
              const info = CARD_INFO.get(c.card);
              return (
                <tr key={c.card} className={c.scans || c.ok ? undefined : 'ad-dim'}>
                  <td><b>{c.card}</b>{info && <span className="ad-v"> {info.version}</span>}</td>
                  <td>{info?.place ?? 'Unknown card'}</td>
                  <td className="ad-line">{info?.line ?? ''}</td>
                  <td className="r">{fmt(c.scans)}</td>
                  <td className="r">{fmt(c.ok)}</td>
                  <td className="r">{fmt(c.declined)}</td>
                  <td className="r">{pct(c.ok, c.scans)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
        <h3>Everyone who filled in the form</h3>
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
              <tr><th>When (ET)</th><th>Company</th><th>Email</th><th>Result</th><th>How badly</th><th>Card</th><th>Emails</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="nw">{when(new Date(r.createdAt))}</td>
                  <td><b>{r.company}</b></td>
                  <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td><span className={`ad-pill ${r.outcome === 'ok' ? 'ok' : 'no'}`}>{OUTCOME[r.outcome] ?? r.outcome}</span></td>
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

type Search = { e?: string; tab?: string; q?: string; days?: string };

/** The hidden admin: PIN first, then the form fills and the traffic. Not linked, not indexed. */
export default async function Admin({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  if (!(await isAdmin())) return <Login error={sp.e} />;

  const days = [7, 14, 30].includes(Number(sp.days)) ? Number(sp.days) : 14;
  const tab = (TABS.some((t) => t.key === sp.tab) ? sp.tab : 'all') as Tab;
  const q = (sp.q ?? '').slice(0, 80);
  const [d, people] = await Promise.all([dashboard(days), submissions(tab, q)]);

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Admin</h1>
          <p>Last {days} days, US Eastern time. A visit is one person on one day.</p>
        </div>
        <div className="ad-controls">
          <nav className="ad-range" aria-label="Date range">
            {[7, 14, 30].map((n) => (
              <Link key={n} href={`/admin?days=${n}`} className={n === days ? 'on' : undefined} aria-current={n === days ? 'page' : undefined}>
                {n} days
              </Link>
            ))}
          </nav>
          <form method="post" action="/api/admin/logout">
            <button className="ad-btn" type="submit">Sign out</button>
          </form>
        </div>
      </header>

      {!d ? (
        <p className="ad-empty">No database is connected.</p>
      ) : (
        <>
          <div className="ad-tiles">
            <Tile label="Visits" value={fmt(d.visits)} note={`${fmt(d.allTime.visits)} all time`} />
            <Tile label="Page views" value={fmt(d.views)} />
            <Tile label="Postcard scans" value={fmt(d.scans)} note={pct(d.scans, d.visits) + ' of visits'} />
            <Tile label="Started the form" value={fmt(d.started)} />
            <Tile label="Put forward" value={fmt(d.ok)} note={`${pct(d.ok, d.visits)} of visits · ${fmt(d.allTime.ok)} all time`} />
            <Tile label="Declined" value={fmt(d.declined)} note={`${fmt(d.allTime.declined)} all time`} />
          </div>

          <section className="ad-card ad-wide">
            <h3>Visits per day</h3>
            <DailyChart data={d.daily} />
          </section>

          <div className="ad-grid2">
            <Funnel d={d} />
            <section className="ad-card">
              <h3>Decision cards</h3>
              <ul className="ad-rank">
                <li><span className="ad-rl">Turned over (Reject)</span><b>{fmt(d.flips)}</b></li>
                <li><span className="ad-rl">Approved</span><b>{fmt(d.approves)}</b></li>
              </ul>
            </section>
            <Ranked title="Where visits come from" rows={d.sources} />
            <Ranked title="Countries" rows={d.countries} />
            <Ranked title="Devices" rows={d.devices} />
            <Ranked title="Pages" rows={d.pages} />
          </div>

          <Cards d={d} />
        </>
      )}

      <People tab={tab} q={q} rows={people.rows} counts={people.counts} />
    </main>
  );
}

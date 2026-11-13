import type { Metadata } from 'next';
import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { requireUser } from '@/lib/auth/request';
import { loadSettings } from '@/lib/settings';
import { checks } from '@/lib/drip/config';
import { TEMPLATES } from '@/lib/drip/render';
import { sequences } from '@/lib/drip/stats';
import { hasStore } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Email sequences | Cypher', robots: { index: false, follow: false } };

const fmt = (n: number) => n.toLocaleString('en-US');
const rate = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '–');
const STATUS: Record<string, string> = { draft: 'Draft', active: 'Live', paused: 'Paused' };

export default async function Drip({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireUser('email', 'read', '/admin/drip');
  await loadSettings();
  const { msg } = await searchParams;
  const list = hasStore ? await sequences() : [];
  const setup = checks();
  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Email sequences</h1>
          <p>Branded drip emails through Resend. One send run a day; contacts leave a sequence when they put their company forward, unsubscribe, bounce or complain.</p>
        </div>
        <form method="post" action="/api/admin/drip/run">
          <input type="hidden" name="back" value="/admin/drip" />
          <button className="ad-btn" type="submit">Send due now</button>
        </form>
      </header>
      <Banner msg={msg} />

      <section className="ad-card ad-wide">
        <h3>Setup</h3>
        <ul className="ad-checks">
          {setup.map((c) => (
            <li key={c.key} className={c.ok ? 'ok' : 'todo'}>
              <b>{c.ok ? '✓' : '!'}</b>
              <span>
                <strong>{c.label}</strong>
                {!c.ok && <small>{c.fix}</small>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ad-card ad-wide">
        <div className="ad-people-head">
          <h3>Sequences</h3>
          <form method="post" action="/api/admin/drip/create-sequence" className="ad-test">
            <input className="ad-input" name="name" required maxLength={120} placeholder="Name, e.g. Symposium attendees" aria-label="New sequence name" />
            <select className="ad-input ad-select" name="template" defaultValue="symposium" aria-label="Start from">
              {Object.entries(TEMPLATES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
            </select>
            <button className="ad-btn primary" type="submit">New sequence</button>
          </form>
        </div>
        {list.length === 0 ? (
          <p className="ad-empty">No sequences yet. Start one from a template: the emails come written in the Cypher voice, ready to edit and preview.</p>
        ) : (
          <div className="ad-scroll">
            <table className="ad-tbl">
              <thead>
                <tr><th>Sequence</th><th>Status</th><th className="r">Emails</th><th className="r">In progress</th><th className="r">Finished</th><th className="r">Sent</th><th className="r">Opened</th><th className="r">Clicked</th><th className="r">Put forward</th></tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td><Link href={`/admin/drip/${s.id}`}><b>{s.name}</b></Link></td>
                    <td><span className={`ad-pill ${s.status === 'active' ? 'ok' : 'no'}`}>{STATUS[s.status] ?? s.status}</span></td>
                    <td className="r">{s.steps}</td>
                    <td className="r">{fmt(s.active)}</td>
                    <td className="r">{fmt(s.completed + s.exited)}</td>
                    <td className="r">{fmt(s.sent)}</td>
                    <td className="r">{rate(s.opened, s.delivered || s.sent)}</td>
                    <td className="r">{rate(s.clicked, s.delivered || s.sent)}</td>
                    <td className="r">{fmt(s.converted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { requireUser } from '@/lib/auth/request';
import { contacts } from '@/lib/drip/stats';
import { hasStore } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lists | Cypher', robots: { index: false, follow: false } };

const STATUSES = [
  { key: '', label: 'Everyone', count: 'all' },
  { key: 'active', label: 'Active', count: 'active' },
  { key: 'unsubscribed', label: 'Unsubscribed', count: 'unsubscribed' },
  { key: 'bounced', label: 'Bounced', count: 'bounced' },
  { key: 'complained', label: 'Spam complaints', count: 'complained' },
] as const;

export default async function Contacts({ searchParams }: { searchParams: Promise<{ msg?: string; q?: string; status?: string; list?: string }> }) {
  await requireUser('email', 'read', '/admin/drip/contacts');
  const sp = await searchParams;
  const q = (sp.q ?? '').slice(0, 80);
  const status = STATUSES.some((s) => s.key === sp.status) ? sp.status ?? '' : '';
  const list = (sp.list ?? '').slice(0, 60);
  const data = hasStore ? await contacts({ q, status, list }) : { rows: [], counts: { all: 0 } as Record<string, number>, lists: [] };
  const href = (o: Record<string, string>) => `/admin/drip/contacts?${new URLSearchParams(Object.entries({ q, status, list, ...o }).filter(([, v]) => v))}`;

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Lists</h1>
          <p>Upload a CSV, then enroll contacts in a sequence. Unsubscribes, bounces and spam complaints are kept, so nobody is emailed again by re-uploading them.</p>
        </div>
      </header>
      <Banner msg={sp.msg} />

      <section className="ad-card ad-wide">
        <h3>Upload a list</h3>
        <form method="post" action="/api/admin/drip/import" encType="multipart/form-data" className="ad-form ad-upload">
          <input type="hidden" name="back" value="/admin/drip/contacts" />
          <label className="ad-field">
            <span>CSV file</span>
            <input className="ad-input" type="file" name="file" accept=".csv,text/csv" required />
          </label>
          <label className="ad-field">
            <span>List name <small>(to enroll this upload on its own)</small></span>
            <input className="ad-input" name="list" maxLength={60} placeholder="e.g. Symposium 2026" />
          </label>
          <label className="ad-check"><input type="checkbox" name="skip_declined" defaultChecked /> Skip vendor, Sitecore and personal email addresses (the same rules as the form)</label>
          <button className="ad-btn primary" type="submit">Upload</button>
        </form>
        <p className="ad-hint">Needs an email column. First name, last name (or one name column), company and title are picked up by their usual headers, like the Symposium attendee report’s FIRST NAME, LAST NAME, COMPANY NAME, JOB TITLE and EMAIL. Uploading someone again updates them.</p>
      </section>

      <section className="ad-card ad-wide">
        <nav className="ad-tabs" aria-label="Filter contacts">
          {STATUSES.map((s) => (
            <Link key={s.label} href={href({ status: s.key })} className={s.key === status ? 'on' : undefined}>
              {s.label} <span>{(data.counts[s.count] ?? 0).toLocaleString('en-US')}</span>
            </Link>
          ))}
        </nav>
        <form className="ad-search" method="get" action="/admin/drip/contacts">
          {status && <input type="hidden" name="status" value={status} />}
          <select className="ad-input ad-select" name="list" defaultValue={list} aria-label="List">
            <option value="">All lists</option>
            {data.lists.map((l) => <option key={l.list} value={l.list}>{l.list} ({l.n})</option>)}
          </select>
          <input type="search" name="q" defaultValue={q} placeholder="Search name, email or company" aria-label="Search contacts" />
          <button className="ad-btn" type="submit">Search</button>
        </form>
        {data.rows.length === 0 ? (
          <p className="ad-empty">{q || list || status ? 'No one matches.' : 'No contacts yet. Upload a CSV above.'}</p>
        ) : (
          <div className="ad-scroll">
            <table className="ad-tbl">
              <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Title</th><th>Lists</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {data.rows.map((c) => (
                  <tr key={c.id}>
                    <td><b>{[c.firstName, c.lastName].filter(Boolean).join(' ') || '–'}</b></td>
                    <td>{c.email}</td>
                    <td>{c.company || '–'}</td>
                    <td>{c.title || '–'}</td>
                    <td>{c.lists.join(', ') || '–'}</td>
                    <td><span className={`ad-pill ${c.status === 'active' ? 'ok' : 'no'}`}>{c.status}</span></td>
                    <td>
                      {(c.status === 'active' || c.status === 'unsubscribed') && (
                        <form method="post" action="/api/admin/drip/contact-status">
                          <input type="hidden" name="contact" value={c.id} />
                          <input type="hidden" name="back" value="/admin/drip/contacts" />
                          <input type="hidden" name="status" value={c.status === 'active' ? 'unsubscribed' : 'active'} />
                          <button className="ad-btn ghost small" type="submit">{c.status === 'active' ? 'Unsubscribe' : 'Resubscribe'}</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.rows.length >= 300 && <p className="ad-hint">Showing the newest 300. Search or filter to find others.</p>}
          </div>
        )}
      </section>
    </main>
  );
}

import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { when } from '@/components/admin/crm/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { contacts } from '@/lib/crm/data';

/** The people: the same contacts email marketing uses, seen as sales records. */
export default async function People({ searchParams }: { searchParams: Promise<{ msg?: string; q?: string }> }) {
  const s = await requireUser('crm', 'read', '/admin/crm/contacts');
  const sp = await searchParams;
  const q = (sp.q ?? '').slice(0, 80);
  const rows = await contacts({ q, limit: 300 });
  const writable = can(s.user.roles, 'crm', 'write');

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Contacts</h1>
          <p>The same people email marketing sends to. An unsubscribe there stops email from here too.</p>
        </div>
      </header>
      <Banner msg={sp.msg} />

      {writable && (
        <details className="ad-card ad-wide crm-new">
          <summary>Add a contact</summary>
          <form method="post" action="/api/admin/crm/create-contact" className="ad-form">
            <div className="ad-row2">
              <label className="ad-field"><span>Email</span><input className="ad-input" name="email" type="email" required /></label>
              <label className="ad-field"><span>Title</span><input className="ad-input" name="title" maxLength={120} /></label>
            </div>
            <div className="ad-row2">
              <label className="ad-field"><span>First name</span><input className="ad-input" name="first_name" maxLength={80} /></label>
              <label className="ad-field"><span>Last name</span><input className="ad-input" name="last_name" maxLength={80} /></label>
            </div>
            <p className="ad-fine">They join their company by email domain when we know it; you can change it on their page.</p>
            <div className="ad-actions"><button className="ad-btn primary" type="submit">Add</button></div>
          </form>
        </details>
      )}

      <section className="ad-card ad-wide">
        <form className="ad-search" method="get" action="/admin/crm/contacts">
          <input type="search" name="q" defaultValue={q} placeholder="Search name, email, company or title" aria-label="Search contacts" />
          <button className="ad-btn" type="submit">Search</button>
        </form>
        {rows.length === 0 ? (
          <p className="ad-empty">{q ? 'No one matches.' : 'No contacts yet.'}</p>
        ) : (
          <div className="ad-scroll">
            <table className="ad-tbl">
              <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Title</th><th>Owner</th><th>Status</th><th>Added</th></tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td><Link href={`/admin/crm/contacts/${c.id}`}><b>{[c.firstName, c.lastName].filter(Boolean).join(' ') || '–'}</b></Link></td>
                    <td><Link href={`/admin/crm/contacts/${c.id}`}>{c.email}</Link></td>
                    <td>{c.companyId ? <Link href={`/admin/crm/companies/${c.companyId}`}>{c.companyName}</Link> : <span className="ad-dim">–</span>}</td>
                    <td>{c.title || <span className="ad-dim">–</span>}</td>
                    <td>{c.ownerName ?? <span className="ad-dim">–</span>}</td>
                    <td><span className={`ad-pill ${c.status === 'active' ? 'ok' : 'bad'}`}>{c.status}</span></td>
                    <td className="nw">{when(c.createdAt, false)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {rows.length === 300 && <p className="ad-fine">Showing the first 300. Search to narrow it down.</p>}
      </section>
    </main>
  );
}

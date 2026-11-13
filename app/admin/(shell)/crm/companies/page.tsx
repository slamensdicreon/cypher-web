import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { when } from '@/components/admin/crm/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { companies } from '@/lib/crm/data';

/** Every company we know: from the website form, the attendee lists, or added by hand. */
export default async function Companies({ searchParams }: { searchParams: Promise<{ msg?: string; q?: string }> }) {
  const s = await requireUser('crm', 'read', '/admin/crm/companies');
  const sp = await searchParams;
  const q = (sp.q ?? '').slice(0, 80);
  const rows = await companies({ q, limit: 300 });
  const writable = can(s.user.roles, 'crm', 'write');

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Companies</h1>
          <p>Everyone who signed up on the site or came in on a list, grouped by company. Open one for its people, deals and history.</p>
        </div>
      </header>
      <Banner msg={sp.msg} />

      {writable && (
        <details className="ad-card ad-wide crm-new">
          <summary>Add a company</summary>
          <form method="post" action="/api/admin/crm/create-company" className="ad-form">
            <input type="hidden" name="back" value="/admin/crm/companies" />
            <div className="ad-row2">
              <label className="ad-field"><span>Name</span><input className="ad-input" name="name" required maxLength={120} /></label>
              <label className="ad-field"><span>Domain <small>if we have it already, you’ll go to that one</small></span><input className="ad-input" name="domain" placeholder="contoso.com" /></label>
            </div>
            <div className="ad-row2">
              <label className="ad-field"><span>Platform</span><input className="ad-input" name="platform" placeholder="Sitecore, AEM, Optimizely, Contentful…" maxLength={60} /></label>
              <label className="ad-field"><span>Industry</span><input className="ad-input" name="industry" maxLength={80} /></label>
            </div>
            <div className="ad-actions"><button className="ad-btn primary" type="submit">Add</button></div>
          </form>
        </details>
      )}

      <section className="ad-card ad-wide">
        <form className="ad-search" method="get" action="/admin/crm/companies">
          <input type="search" name="q" defaultValue={q} placeholder="Search name or domain" aria-label="Search companies" />
          <button className="ad-btn" type="submit">Search</button>
        </form>
        {rows.length === 0 ? (
          <p className="ad-empty">{q ? 'Nothing matches.' : 'No companies yet.'}</p>
        ) : (
          <div className="ad-scroll">
            <table className="ad-tbl">
              <thead><tr><th>Company</th><th>Domain</th><th>Platform</th><th className="r">People</th><th className="r">Open deals</th><th>Owner</th><th>Added</th></tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td><Link href={`/admin/crm/companies/${c.id}`}><b>{c.name}</b></Link></td>
                    <td>{c.domain || <span className="ad-dim">–</span>}</td>
                    <td>{c.platform || <span className="ad-dim">–</span>}</td>
                    <td className="r">{c.contacts}</td>
                    <td className="r">{c.openDeals || <span className="ad-dim">0</span>}</td>
                    <td>{c.ownerName ?? <span className="ad-dim">–</span>}</td>
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

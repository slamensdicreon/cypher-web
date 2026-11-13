import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Banner } from '@/components/admin/AdminNav';
import { ActivityForm, DealList, OwnerSelect, TaskForm, TaskList, Timeline, when } from '@/components/admin/crm/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { company, contacts, dealsFor, owners, stages, tasks, timeline } from '@/lib/crm/data';

/** One company: its people, its deals, and everything that has happened with any of them. */
export default async function CompanyPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  const s = await requireUser('crm', 'read', `/admin/crm/companies/${raw}`);
  if (!Number.isInteger(id)) notFound();
  const c = await company(id);
  if (!c) notFound();
  const sp = await searchParams;
  const back = `/admin/crm/companies/${id}`;
  const [all, deals, people, items, todo, team] = await Promise.all([
    stages(),
    dealsFor({ companyId: id }),
    contacts({ companyId: id, limit: 200 }),
    timeline({ companyId: id }),
    tasks({ companyId: id, scope: 'open' }),
    owners(),
  ]);
  const writable = can(s.user.roles, 'crm', 'write');

  return (
    <main className="wrap ad crm-record">
      <p className="crm-crumbs"><Link href="/admin/crm/companies">Companies</Link></p>
      <header className="ad-top">
        <div>
          <h1>{c.name}</h1>
          <p className="crm-facts">
            {c.domain && <a href={`https://${c.domain}`} target="_blank" rel="noreferrer">{c.domain}</a>}
            {c.platform && <span>Runs {c.platform}</span>}
            {c.industry && <span>{c.industry}</span>}
            <span>{c.ownerName ?? 'Unassigned'}</span>
            <span>{people.length} {people.length === 1 ? 'person' : 'people'}</span>
          </p>
        </div>
      </header>
      <Banner msg={sp.msg} />

      <div className="crm-cols">
        <div className="crm-main">
          <section className="ad-card">
            <h3>Deals</h3>
            <DealList deals={deals} stages={all} />
            {writable && (
              <details className="crm-inline">
                <summary className="ad-btn small">Open a deal</summary>
                <form method="post" action="/api/admin/crm/create-deal" className="ad-form">
                  <input type="hidden" name="company_id" value={c.id} />
                  <input type="hidden" name="company_name" value={c.name} />
                  <div className="ad-row2">
                    <label className="ad-field"><span>Title</span><input className="ad-input" name="title" placeholder={`${c.name} · Migrate`} maxLength={160} /></label>
                    <label className="ad-field"><span>Value</span><input className="ad-input" name="value" inputMode="decimal" placeholder="USD" /></label>
                  </div>
                  {people.length > 0 && (
                    <label className="ad-field"><span>Main contact</span>
                      <select className="ad-input" name="contact_id" defaultValue={people[0].id}>
                        {people.map((p) => <option key={p.id} value={p.id}>{[p.firstName, p.lastName].filter(Boolean).join(' ') || p.email}</option>)}
                      </select>
                    </label>
                  )}
                  <div className="ad-actions"><button className="ad-btn primary" type="submit">Open the deal</button></div>
                </form>
              </details>
            )}
          </section>

          <section className="ad-card">
            <h3>Tasks</h3>
            <TaskList items={todo} back={back} owners links={deals.length > 1} />
            {writable && <TaskForm r={{ companyId: c.id, back }} owners={team} me={s.user.id} />}
          </section>

          <section className="ad-card">
            <h3>Timeline</h3>
            {writable && <ActivityForm r={{ companyId: c.id, back }} />}
            <Timeline items={items} showDeal={deals.length > 1} />
          </section>
        </div>

        <aside className="crm-side">
          <section className="ad-card">
            <h3>People</h3>
            {people.length === 0 ? (
              <p className="ad-empty">Nobody yet.</p>
            ) : (
              <ul className="crm-others">
                {people.map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/crm/contacts/${p.id}`}>{[p.firstName, p.lastName].filter(Boolean).join(' ') || p.email}</Link>
                    {p.title && <span className="ad-dim"> · {p.title}</span>}
                    {p.status !== 'active' && <span className="ad-dim"> · {p.status}</span>}
                  </li>
                ))}
              </ul>
            )}
            {writable && (
              <details className="crm-inline">
                <summary className="ad-btn small">Add a person</summary>
                <form method="post" action="/api/admin/crm/create-contact" className="ad-form">
                  <input type="hidden" name="company_id" value={c.id} />
                  <input type="hidden" name="back" value={back} />
                  <label className="ad-field"><span>Email</span><input className="ad-input" name="email" type="email" required placeholder={c.domain ? `name@${c.domain}` : 'name@company.com'} /></label>
                  <div className="ad-row2">
                    <label className="ad-field"><span>First name</span><input className="ad-input" name="first_name" maxLength={80} /></label>
                    <label className="ad-field"><span>Last name</span><input className="ad-input" name="last_name" maxLength={80} /></label>
                  </div>
                  <label className="ad-field"><span>Title</span><input className="ad-input" name="title" maxLength={120} /></label>
                  <div className="ad-actions"><button className="ad-btn primary" type="submit">Add</button></div>
                </form>
              </details>
            )}
          </section>

          {writable && (
            <section className="ad-card">
              <h3>Details</h3>
              <form method="post" action="/api/admin/crm/update-company" className="ad-form">
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="back" value={back} />
                <label className="ad-field"><span>Name</span><input className="ad-input" name="name" defaultValue={c.name} maxLength={120} /></label>
                <div className="ad-row2">
                  <label className="ad-field"><span>Domain</span><input className="ad-input" name="domain" defaultValue={c.domain} /></label>
                  <label className="ad-field"><span>Platform</span><input className="ad-input" name="platform" defaultValue={c.platform} maxLength={60} /></label>
                </div>
                <div className="ad-row2">
                  <label className="ad-field"><span>Industry</span><input className="ad-input" name="industry" defaultValue={c.industry} maxLength={80} /></label>
                  <label className="ad-field"><span>Size</span><input className="ad-input" name="size" defaultValue={c.size} maxLength={40} placeholder="e.g. 1,000–5,000" /></label>
                </div>
                <label className="ad-field"><span>Website</span><input className="ad-input" name="website" defaultValue={c.website} maxLength={200} /></label>
                <label className="ad-field"><span>Owner</span><OwnerSelect owners={team} value={c.ownerId} /></label>
                <label className="ad-field"><span>Notes</span><textarea className="ad-input" name="notes" rows={4} defaultValue={c.notes} /></label>
                <div className="ad-actions"><button className="ad-btn primary" type="submit">Save</button></div>
              </form>
            </section>
          )}
          <p className="ad-fine">Added {when(c.createdAt)}{c.source ? ` from ${c.source}` : ''}.</p>
        </aside>
      </div>
    </main>
  );
}

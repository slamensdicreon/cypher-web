import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Banner } from '@/components/admin/AdminNav';
import { ActivityForm, DealList, EmailForm, OwnerSelect, TaskForm, TaskList, Timeline, when } from '@/components/admin/crm/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { contact, dealsFor, fullName, owners, stages, tasks, timeline } from '@/lib/crm/data';

/** One person: their deals, tasks, and every touch, including the campaign emails they were sent. */
export default async function ContactPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  const s = await requireUser('crm', 'read', `/admin/crm/contacts/${raw}`);
  if (!Number.isInteger(id)) notFound();
  const c = await contact(id);
  if (!c) notFound();
  const sp = await searchParams;
  const back = `/admin/crm/contacts/${id}`;
  const [all, deals, items, todo, team] = await Promise.all([stages(), dealsFor({ contactId: id }), timeline({ contactId: id }), tasks({ contactId: id, scope: 'open' }), owners()]);
  const writable = can(s.user.roles, 'crm', 'write');
  const name = fullName(c);

  return (
    <main className="wrap ad crm-record">
      <p className="crm-crumbs"><Link href="/admin/crm/contacts">Contacts</Link>{c.companyId && <> / <Link href={`/admin/crm/companies/${c.companyId}`}>{c.companyName}</Link></>}</p>
      <header className="ad-top">
        <div>
          <h1>{name}</h1>
          <p className="crm-facts">
            {c.title && <span>{c.title}</span>}
            <a href={`mailto:${c.email}`}>{c.email}</a>
            {c.phone && <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}>{c.phone}</a>}
            {c.linkedin && <a href={c.linkedin.startsWith('http') ? c.linkedin : `https://${c.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>}
            <span className={`ad-pill ${c.status === 'active' ? 'ok' : 'bad'}`}>{c.status}</span>
          </p>
        </div>
        {writable && c.status === 'active' && <EmailForm contactId={c.id} back={back} to={c.firstName || c.email} />}
      </header>
      <Banner msg={sp.msg} />

      <div className="crm-cols">
        <div className="crm-main">
          <section className="ad-card">
            <h3>Deals</h3>
            <DealList deals={deals} stages={all} />
          </section>
          <section className="ad-card">
            <h3>Tasks</h3>
            <TaskList items={todo} back={back} owners />
            {writable && <TaskForm r={{ contactId: c.id, back }} owners={team} me={s.user.id} />}
          </section>
          <section className="ad-card">
            <h3>Timeline</h3>
            {writable && <ActivityForm r={{ contactId: c.id, back }} />}
            <Timeline items={items} showDeal />
          </section>
        </div>

        <aside className="crm-side">
          {writable ? (
            <section className="ad-card">
              <h3>Details</h3>
              <form method="post" action="/api/admin/crm/update-contact" className="ad-form">
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="back" value={back} />
                <div className="ad-row2">
                  <label className="ad-field"><span>First name</span><input className="ad-input" name="first_name" defaultValue={c.firstName} maxLength={80} /></label>
                  <label className="ad-field"><span>Last name</span><input className="ad-input" name="last_name" defaultValue={c.lastName} maxLength={80} /></label>
                </div>
                <label className="ad-field"><span>Title</span><input className="ad-input" name="title" defaultValue={c.title} maxLength={120} /></label>
                <div className="ad-row2">
                  <label className="ad-field"><span>Phone</span><input className="ad-input" name="phone" defaultValue={c.phone} maxLength={40} /></label>
                  <label className="ad-field"><span>LinkedIn</span><input className="ad-input" name="linkedin" defaultValue={c.linkedin} maxLength={200} /></label>
                </div>
                <label className="ad-field"><span>Owner</span><OwnerSelect owners={team} value={c.ownerId} /></label>
                <div className="ad-actions"><button className="ad-btn primary" type="submit">Save</button></div>
              </form>
            </section>
          ) : null}
          <section className="ad-card">
            <h3>Email marketing</h3>
            <p>{c.lists.length ? `On ${c.lists.join(', ')}.` : 'Not on a list.'}</p>
            <p className="ad-fine">Added {when(c.createdAt)}{c.source ? ` from ${c.source}` : ''}. Campaign sends show on the timeline.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}

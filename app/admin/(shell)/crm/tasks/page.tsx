import Link from 'next/link';
import { Banner } from '@/components/admin/AdminNav';
import { TaskForm, TaskList } from '@/components/admin/crm/parts';
import { requireUser } from '@/lib/auth/request';
import { can } from '@/lib/auth/roles';
import { owners, tasks } from '@/lib/crm/data';

type Search = { msg?: string; who?: string; scope?: string };
const SCOPES = [
  { key: 'open', label: 'To do' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'done', label: 'Done' },
] as const;

/** What needs doing: yours by default, everyone's on request. */
export default async function Tasks({ searchParams }: { searchParams: Promise<Search> }) {
  const s = await requireUser('crm', 'read', '/admin/crm/tasks');
  const sp = await searchParams;
  const everyone = sp.who === 'all';
  const scope = SCOPES.find((x) => x.key === sp.scope)?.key ?? 'open';
  const [items, overdue, team] = await Promise.all([
    tasks({ ownerId: everyone ? undefined : s.user.id, scope }),
    tasks({ ownerId: everyone ? undefined : s.user.id, scope: 'overdue' }),
    owners(),
  ]);
  const writable = can(s.user.roles, 'crm', 'write');
  const qs = (p: Partial<Search>) => {
    const v = { who: everyone ? 'all' : '', scope: scope === 'open' ? '' : scope, ...p };
    const u = new URLSearchParams(Object.entries(v).filter(([, x]) => x) as [string, string][]).toString();
    return `/admin/crm/tasks${u ? `?${u}` : ''}`;
  };
  const back = qs({});

  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>Tasks</h1>
          <p>{overdue.length ? `${overdue.length} overdue. ` : ''}Tasks on a deal, company or person show on that record too.</p>
        </div>
        <div className="ad-controls">
          <nav className="ad-range" aria-label="Whose tasks">
            <Link href={qs({ who: '' })} className={!everyone ? 'on' : undefined}>Mine</Link>
            <Link href={qs({ who: 'all' })} className={everyone ? 'on' : undefined}>Everyone</Link>
          </nav>
        </div>
      </header>
      <Banner msg={sp.msg} />

      <section className="ad-card ad-wide">
        <nav className="ad-tabs" aria-label="Which tasks">
          {SCOPES.map((x) => (
            <Link key={x.key} href={qs({ scope: x.key === 'open' ? '' : x.key })} className={x.key === scope ? 'on' : undefined}>
              {x.label}{x.key === 'overdue' && overdue.length ? <span>{overdue.length}</span> : null}
            </Link>
          ))}
        </nav>
        <TaskList items={items} back={back} owners={everyone} />
        {writable && scope !== 'done' && <TaskForm r={{ back }} owners={team} me={s.user.id} />}
      </section>
    </main>
  );
}

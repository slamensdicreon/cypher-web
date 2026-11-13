import { NextResponse } from 'next/server';
import { audit } from '@/lib/audit';
import { apiUser } from '@/lib/auth/request';
import { CATEGORIES, PlatformError, platform, type Applied, type Org, type Playbook, type Recommendation, type Rule, type Entry } from '@/lib/platform';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Every change on the Launchworks screens posts here and goes to the platform server to server, as the
 * person signed in. Changes that reach live projects need the confirmation box and a sign-in from the
 * last 15 minutes; each one is recorded by name on the platform and in the audit log here.
 */
export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const s = await apiUser('platform', 'write');
  if (!s) return new Response('Not found', { status: 404 });
  const { action } = await params;
  const json = (req.headers.get('content-type') || '').includes('application/json');
  const body: Record<string, unknown> = json ? await req.json().catch(() => ({})) : Object.fromEntries(await req.formData().catch(() => new FormData()));
  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '');
  const on = (k: string) => body[k] === 'on' || body[k] === true;
  const list = (k: string) => str(k).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 30);
  const backRaw = str('back');
  const back = /^\/admin\/platform(\/[\w/.-]*)?(\?[\w=&%.:-]*)?$/.test(backRaw) ? backRaw : '/admin/platform';
  const as = s.user;

  const done = (msg: string, to = back) => {
    if (json) return NextResponse.json({ ok: !msg.startsWith('That didn’t work'), msg });
    const u = new URL(to, req.url);
    u.searchParams.set('msg', msg);
    return NextResponse.redirect(new URL(u.pathname + u.search, req.url), 303);
  };
  const log = (summary: string, entity: string, entityId: string, after?: unknown) =>
    audit(s, { action: `platform.${action}`, entity, entityId, summary, after }, req.headers);

  // Live changes: a ticked confirmation and a fresh sign-in.
  const live = async () => {
    if (!json && !on('confirm')) return done('That didn’t work: tick the box to confirm. This changes live projects.');
    if (!s.fresh) {
      if (json) return NextResponse.json({ ok: false, fresh: false, msg: 'Sign in again to confirm it’s you (changes to live projects need a sign-in from the last 15 minutes).' }, { status: 401 });
      return NextResponse.redirect(new URL(`/admin/sign-in?confirm=1&next=${encodeURIComponent(back)}`, req.url), 303);
    }
    return null;
  };
  const scope = (v: string) => {
    const i = v.indexOf(':');
    return i > 0 ? { kind: v.slice(0, i), id: v.slice(i + 1) } : null;
  };
  const id = encodeURIComponent(str('id'));

  try {
    switch (action) {
      // ---------------------------------------------------------------- organizations
      case 'create-org': {
        if (str('name').length < 2) return done('That didn’t work: give the organization a name (2 to 80 characters).');
        const r = await platform<{ organization: Org; invited: { email: string; emailSent: boolean; detail: string | null } | null }>(as, 'POST', '/admin/organizations', {
          name: str('name').slice(0, 80),
          ...(str('slug') ? { slug: str('slug').slice(0, 40) } : {}),
          ...(str('director_email') ? { directorEmail: str('director_email') } : {}),
        });
        await log(`Created organization “${r.organization.name}”`, 'organization', r.organization.id, { invited: r.invited?.email ?? null });
        const inv = r.invited
          ? r.invited.emailSent
            ? ` ${r.invited.email} is invited as its first Director (open 7 days).`
            : ` The invitation to ${r.invited.email} didn’t send${r.invited.detail ? ` (${r.invited.detail})` : ''}, but it stands for 7 days: they sign in to Launchworks with that address.`
          : '';
        return done(`Created ${r.organization.name}. You’re its kickoff Director; the customer can’t remove you for three months.${inv}`, `/admin/platform/organizations/${encodeURIComponent(r.organization.id)}`);
      }
      case 'save-license': {
        const stop = await live();
        if (stop) return stop;
        const catalog = await platform<Playbook[]>(as, 'GET', '/playbooks');
        const entities = [...new Set(catalog.map((p) => p.platform.id))].filter((e) => on(`entity_${e}`));
        // A playbook counts only on a licensed platform: drop the others before saving.
        const playbooks = catalog.filter((p) => entities.includes(p.platform.id) && on(`playbook_${p.id}`)).map((p) => p.id);
        const startsAt = str('starts') ? new Date(`${str('starts')}T00:00:00Z`).toISOString() : '';
        const endsAt = str('ends') ? new Date(`${str('ends')}T23:59:59Z`).toISOString() : '';
        const included = Math.max(0, Math.floor(Number(str('projects_included')) || 0));
        const r = await platform<{ reconciled: { action: 'none' | 'suspended' | 'resumed'; projects: string[] } }>(as, 'PUT', `/admin/organizations/${id}/license`, {
          entities, playbooks, projectsIncluded: included, startsAt, endsAt,
        });
        const n = r.reconciled.projects.length;
        const what =
          r.reconciled.action === 'suspended' ? ` ${n} project${n === 1 ? '' : 's'} paused: outside the license now (${r.reconciled.projects.join(', ')}).`
          : r.reconciled.action === 'resumed' ? ` ${n} project${n === 1 ? '' : 's'} resumed (${r.reconciled.projects.join(', ')}).`
          : ' No running project changed.';
        await log(`Saved the license of ${str('id')}${what}`, 'organization', str('id'), { entities, playbooks, projectsIncluded: included, startsAt, endsAt, reconciled: r.reconciled });
        return done(`License saved.${what}`);
      }
      case 'support': {
        const stop = await live();
        if (stop) return stop;
        const hours = Math.min(72, Math.max(1, Math.floor(Number(str('hours')) || 4)));
        const role = str('role') === 'director' ? 'director' : 'watcher';
        const r = await platform<{ organization: { name?: string } | string; role: string; expiresAt: string }>(as, 'POST', `/admin/organizations/${id}/support`, { hours, role });
        const name = typeof r.organization === 'string' ? r.organization : r.organization?.name ?? str('id');
        await log(`Gave themselves ${hours}h support access to ${name} as ${role}`, 'organization', str('id'), r);
        const until = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(r.expiresAt));
        return done(`You’re a ${role === 'director' ? 'Director' : 'Watcher'} in ${name} until ${until} ET. Use it in Launchworks: account menu, then ${name}.`);
      }
      // ---------------------------------------------------------------- rules
      case 'rule-create': {
        const status = str('status') === 'active' ? 'active' : 'proposed';
        if (status === 'active') {
          const stop = await live();
          if (stop) return stop;
        }
        const sc = scope(str('scope'));
        if (!sc) return done('That didn’t work: choose where the rule applies.');
        const category = str('category') in CATEGORIES ? str('category') : 'other';
        const r = await platform<Rule>(as, 'POST', '/rules', { when: str('when'), then: str('then'), category, scope: sc, roles: list('roles'), status });
        await log(`Created rule ${r.ref} (${status})`, 'rule', r.id, { when: r.when, then: r.then });
        return done(`${r.ref} saved as ${status}.`);
      }
      case 'rule-edit': {
        if (str('was') === 'active') {
          const stop = await live();
          if (stop) return stop;
        }
        const r = await platform<Rule>(as, 'PUT', `/rules/${id}`, {
          ...(str('when') ? { when: str('when') } : {}),
          ...(str('then') ? { then: str('then') } : {}),
          ...(str('category') in CATEGORIES ? { category: str('category') } : {}),
        });
        await log(`Edited rule ${r.ref} (version ${r.version})`, 'rule', r.id, { when: r.when, then: r.then });
        return done(`${r.ref} saved as version ${r.version}.`);
      }
      case 'rule-activate':
      case 'rule-retire': {
        const stop = await live();
        if (stop) return stop;
        const r = await platform<Rule>(as, 'POST', `/rules/${id}/${action === 'rule-activate' ? 'activate' : 'retire'}`);
        await log(`${action === 'rule-activate' ? 'Activated' : 'Retired'} rule ${r.ref}`, 'rule', r.id);
        return done(`${r.ref} is ${r.status}.`);
      }
      case 'rule-harvest': {
        const r = await platform<{ proposed: Rule[] }>(as, 'POST', `/projects/${encodeURIComponent(str('project_id'))}/rules/harvest`, {});
        await log(`Proposed ${r.proposed.length} rule(s) from project ${str('project_id')}`, 'project', str('project_id'));
        return done(r.proposed.length ? `${r.proposed.length} rule${r.proposed.length === 1 ? '' : 's'} proposed. Approve the ones that hold.` : 'No new causes to propose: each repeated answer already has a rule.');
      }
      // ---------------------------------------------------------------- knowledge
      case 'knowledge-create': {
        const status = str('status') === 'active' ? 'active' : 'proposed';
        if (status === 'active') {
          const stop = await live();
          if (stop) return stop;
        }
        const sc = scope(str('scope'));
        if (!sc) return done('That didn’t work: choose where it applies.');
        const kind = ['lesson', 'procedure', 'gap'].includes(str('kind')) ? str('kind') : 'lesson';
        const e = await platform<Entry>(as, 'POST', '/knowledge', { kind, title: str('title'), text: str('text'), scope: sc, roles: list('roles'), tags: list('tags'), status });
        await log(`Created ${kind} ${e.ref} (${status})`, 'knowledge', e.id, { title: e.title });
        return done(`${e.ref} saved as ${status}.`);
      }
      case 'knowledge-edit': {
        if (str('was') === 'active') {
          const stop = await live();
          if (stop) return stop;
        }
        const e = await platform<Entry>(as, 'PUT', `/knowledge/${id}`, {
          ...(['lesson', 'procedure', 'gap'].includes(str('kind')) ? { kind: str('kind') } : {}),
          ...(str('title') ? { title: str('title') } : {}),
          ...(str('text') ? { text: str('text') } : {}),
          ...('tags' in body ? { tags: list('tags') } : {}),
        });
        await log(`Edited ${e.ref} (version ${e.version})`, 'knowledge', e.id, { title: e.title });
        return done(`${e.ref} saved as version ${e.version}.`);
      }
      case 'knowledge-approve':
      case 'knowledge-activate':
      case 'knowledge-reject':
      case 'knowledge-retire': {
        const stop = await live();
        if (stop) return stop;
        const verb = action.slice('knowledge-'.length);
        const e = await platform<Entry>(as, 'POST', `/knowledge/${id}/${verb}`);
        const past = { approve: 'Approved', activate: 'Activated', reject: 'Rejected', retire: 'Retired' }[verb as 'approve'];
        await log(`${past} ${e.ref}`, 'knowledge', e.id);
        return done(`${e.ref} is ${e.status}.`);
      }
      case 'proposals-sort': {
        const stop = await live();
        if (stop) return stop;
        const r = await platform<{ available: boolean; recommendations: Recommendation[] }>(as, 'POST', '/proposals/sort', {});
        await log(`Asked Cypher to sort ${r.recommendations.length} proposal(s)`, 'proposals', 'all');
        return NextResponse.json({ ok: true, ...r });
      }
      case 'proposals-apply': {
        const stop = await live();
        if (stop) return stop;
        const decisions = Array.isArray(body.decisions) ? body.decisions.slice(0, 200) : [];
        if (!decisions.length) return done('That didn’t work: nothing to apply.');
        const r = await platform<Applied>(as, 'POST', '/proposals/apply', { decisions });
        await log(`Applied proposals: ${r.approved} approved, ${r.edited} edited, ${r.rejected} rejected, ${r.failed.length} failed`, 'proposals', 'all', r);
        return NextResponse.json({ ok: true, msg: `${r.approved} approved, ${r.edited} approved with changes, ${r.rejected} rejected.${r.failed.length ? ` ${r.failed.length} failed: ${r.failed.map((f) => f.error).join('; ')}` : ''}` });
      }
      // ---------------------------------------------------------------- diagnostics
      case 'watchdog': {
        const stop = await live();
        if (stop) return stop;
        const r = await platform<unknown>(as, 'GET', '/portfolio/watchdog');
        await log('Ran the watchdog', 'portfolio', 'watchdog', r);
        return done(`The watchdog ran. ${summarize(r)}`);
      }
      case 'test-email': {
        const stop = await live();
        if (stop) return stop;
        const pid = str('project_id');
        const r = await platform<{ sent: boolean; id?: string }>(as, 'POST', `/projects/${encodeURIComponent(pid)}/operator/test-email`, {});
        await log(`Sent the Operator test email for ${pid}`, 'project', pid, r);
        return done(r.sent ? `Test email sent${r.id ? ` (${r.id})` : ''}.` : 'The platform didn’t send it.');
      }
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    const e = err as PlatformError;
    if (!(err instanceof PlatformError)) console.error('[platform]', action, err);
    if (json) return NextResponse.json({ ok: false, code: e.code ?? 'error', msg: `That didn’t work: ${e.message}` }, { status: e.status && e.status >= 400 ? e.status : 500 });
    return done(`That didn’t work: ${e.message}`);
  }
}

/** A short line from whatever the watchdog reports (its shape is the platform's to change). */
function summarize(r: unknown): string {
  if (!r || typeof r !== 'object') return '';
  const parts = Object.entries(r as Record<string, unknown>)
    .map(([k, v]) => (Array.isArray(v) ? `${k}: ${v.length}` : typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && v.length < 60) ? `${k}: ${v}` : null))
    .filter(Boolean)
    .slice(0, 6);
  return parts.join(' · ');
}

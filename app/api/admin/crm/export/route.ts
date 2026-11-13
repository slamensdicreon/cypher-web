import { audit } from '@/lib/audit';
import { apiUser } from '@/lib/auth/request';
import { pipeline, stages } from '@/lib/crm/data';
import { csvResponse, recordsCsv } from '@/lib/csv';
import { hasStore } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Every deal as a CSV, behind the admin session. ?who=me for your own. */
export async function GET(req: Request) {
  const s = await apiUser('crm');
  if (!s) return new Response('Not found', { status: 404 });
  if (!hasStore) return new Response('No database is connected.', { status: 501 });
  const mine = new URL(req.url).searchParams.get('who') === 'me';
  const [all, deals] = await Promise.all([stages(), pipeline({ ownerId: mine ? s.user.id : undefined })]);
  const label = (id: string) => all.find((x) => x.id === id)?.label ?? id;
  const rows = deals.map((d) => ({
    id: d.id,
    deal: d.title,
    stage: label(d.stage),
    value: d.value ?? '',
    score: d.score,
    company: d.companyName ?? '',
    domain: d.companyDomain ?? '',
    contact: d.contactName ?? '',
    email: d.contactEmail ?? '',
    owner: d.ownerName ?? '',
    outcomes: d.outcomes.join('; '),
    source: d.source,
    next_step: d.nextStep,
    next_step_at: d.nextStepAt ?? '',
    lost_reason: d.lostReason,
    created: new Date(d.createdAt).toISOString(),
    stage_changed: new Date(d.stageChangedAt).toISOString(),
    closed: d.closedAt ? new Date(d.closedAt).toISOString() : '',
  }));
  await audit(s, { action: 'crm.export', entity: 'deals', summary: `Exported ${rows.length} deals` }, req.headers);
  return csvResponse(recordsCsv(rows), 'cypher-pipeline');
}

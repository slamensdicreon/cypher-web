import { after, NextResponse } from 'next/server';
import { classify } from '@/lib/rules';
import { companyOf, domainOf } from '@/lib/company';
import { LEVELS, OUTCOMES } from '@/lib/config';
import { notify } from '@/lib/email';
import { recordLead } from '@/lib/crm/data';
import { clientIp, keyedHash } from '@/lib/keys';
import { companiesSoFar, confirmedRecently, markEmails, save, underLimit } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { email?: unknown; level?: unknown; source?: unknown; website?: unknown; site?: unknown; wants?: unknown };

/** A site address as typed (acme.com, www.acme.com/en, https://acme.com): kept short and plain. */
function cleanSite(v: unknown): string {
  if (typeof v !== 'string') return '';
  const t = v.trim().replace(/\s+/g, '').slice(0, 200);
  if (!t) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(u.hostname)) return '';
    return (u.hostname + (u.pathname === '/' ? '' : u.pathname)).toLowerCase().slice(0, 200);
  } catch {
    return '';
  }
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ status: 'bad' }, { status: 400 });
  }

  // A filled honeypot means a bot. Tell it everything went fine, and keep nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ status: 'ok', company: 'Your company' });
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
  const domain = domainOf(email);
  const kind = classify(domain);
  if (kind === 'bad') return NextResponse.json({ status: 'bad' });

  const ip = clientIp(req.headers);
  const ipHash = ip ? keyedHash(ip) : '';
  if (!(await underLimit(ipHash))) return NextResponse.json({ status: 'slow' }, { status: 429 });

  const raw = Number(body.level);
  const level = Number.isInteger(raw) && raw >= 0 && raw <= 3 ? raw : 1;
  const source =
    typeof body.source === 'string' ? body.source.replace(/[^a-z0-9.-]/gi, '').slice(0, 24) : '';
  const company = companyOf(domain);
  const ok = kind === 'ok';
  const site = cleanSite(body.site);
  const wants = Array.isArray(body.wants) ? OUTCOMES.filter((o) => (body.wants as unknown[]).includes(o)).join(', ') : '';

  // Every real attempt is kept, declined ones included, so the team can see who tried.
  let id: number | null;
  try {
    id = await save({
      email,
      domain,
      company,
      outcome: kind,
      level: ok ? level : null,
      interest: ok ? LEVELS[level] : null,
      source,
      site,
      wants,
      ua: (req.headers.get('user-agent') || '').slice(0, 200),
      ipHash,
    });
  } catch (err) {
    console.error('[interest] save failed', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }

  if (!ok) return NextResponse.json({ status: kind });

  // The CRM and the emails happen after the response, so the visitor never waits on them.
  after(async () => {
    try {
      await recordLead({ email, domain, company, site, wants, level, source, submissionId: id });
    } catch (err) {
      console.error('[interest] CRM lead failed', err);
    }
  });
  after(async () => {
    try {
      const [recent, soFar] = await Promise.all([confirmedRecently(email), companiesSoFar()]);
      const result = await notify(
        { id, email, domain, company, level, interest: LEVELS[level], source, site, wants },
        { confirm: !recent, soFar },
      );
      if (id !== null) await markEmails(id, result);
    } catch (err) {
      console.error('[interest] notify failed', err);
    }
  });

  return NextResponse.json({ status: 'ok', company });
}

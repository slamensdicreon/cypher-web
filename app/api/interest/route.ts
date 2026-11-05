import { createHmac } from 'node:crypto';
import { after, NextResponse } from 'next/server';
import { classify } from '@/lib/rules';
import { companyOf, domainOf } from '@/lib/company';
import { isClosed, LEVELS } from '@/lib/config';
import { notify } from '@/lib/email';
import { companiesSoFar, confirmedRecently, markEmails, save, underLimit } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { email?: unknown; level?: unknown; source?: unknown; website?: unknown };

/**
 * Networks are counted for the rate limit, but the address itself is never stored: only a keyed
 * hash, which can't be turned back into the address without the server's secret.
 */
const ipKey = process.env.IP_HASH_SECRET || process.env.ADMIN_KEY || 'cypher-web';
const hashIp = (ip: string) => createHmac('sha256', ipKey).update(ip).digest('hex').slice(0, 32);

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

  if (isClosed()) return NextResponse.json({ status: 'closed' });

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
  const domain = domainOf(email);
  const kind = classify(domain);
  if (kind === 'bad') return NextResponse.json({ status: 'bad' });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  const ipHash = ip ? hashIp(ip) : '';
  if (!(await underLimit(ipHash))) return NextResponse.json({ status: 'slow' }, { status: 429 });

  const raw = Number(body.level);
  const level = Number.isInteger(raw) && raw >= 0 && raw <= 3 ? raw : 1;
  const source =
    typeof body.source === 'string' ? body.source.replace(/[^a-z0-9-]/gi, '').slice(0, 12) : '';
  const company = companyOf(domain);
  const ok = kind === 'ok';

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
      ua: (req.headers.get('user-agent') || '').slice(0, 200),
      ipHash,
    });
  } catch (err) {
    console.error('[interest] save failed', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }

  if (!ok) return NextResponse.json({ status: kind });

  // Emails go out after the response, so the visitor never waits on them.
  after(async () => {
    try {
      const [recent, soFar] = await Promise.all([confirmedRecently(email), companiesSoFar()]);
      const result = await notify(
        { id, email, domain, company, level, interest: LEVELS[level], source },
        { confirm: !recent, soFar },
      );
      if (id !== null) await markEmails(id, result);
    } catch (err) {
      console.error('[interest] notify failed', err);
    }
  });

  return NextResponse.json({ status: 'ok', company });
}

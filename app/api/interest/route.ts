import { NextResponse } from 'next/server';
import { classify } from '@/lib/rules';
import { companyOf, domainOf } from '@/lib/company';
import { isClosed, LEVELS } from '@/lib/config';
import { save, underLimit } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { email?: unknown; level?: unknown; source?: unknown; website?: unknown };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ status: 'bad' }, { status: 400 });
  }

  // A filled honeypot means a bot. Tell it everything went fine.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ status: 'ok', company: 'Your company' });
  }

  if (isClosed()) return NextResponse.json({ status: 'closed' });

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
  const domain = domainOf(email);
  const kind = classify(domain);
  if (kind !== 'ok') return NextResponse.json({ status: kind });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (!(await underLimit(ip))) return NextResponse.json({ status: 'slow' }, { status: 429 });

  const raw = Number(body.level);
  const level = Number.isInteger(raw) && raw >= 0 && raw <= 3 ? raw : 1;
  const source =
    typeof body.source === 'string' ? body.source.replace(/[^a-z0-9-]/gi, '').slice(0, 12) : '';
  const company = companyOf(domain);

  try {
    await save({
      email,
      domain,
      company,
      level,
      interest: LEVELS[level],
      source,
      at: new Date().toISOString(),
      ua: (req.headers.get('user-agent') || '').slice(0, 200),
    });
  } catch (err) {
    console.error('[interest] save failed', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }

  return NextResponse.json({ status: 'ok', company });
}

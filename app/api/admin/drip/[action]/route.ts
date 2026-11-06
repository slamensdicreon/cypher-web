import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { parseCsv, toContacts } from '@/lib/drip/csv';
import { addStep, createSequence, deleteSequence, deleteStep, enroll, importContacts, runDue, saveStep, sendTest, setContactStatus, setSequence } from '@/lib/drip/engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/** Every drip change in the admin posts a form here; the reply is a redirect back with a message. */
export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  if (!(await isAdmin())) return new Response('Not found', { status: 404 });
  const { action } = await params;
  const f = await req.formData();
  const str = (k: string) => (typeof f.get(k) === 'string' ? (f.get(k) as string) : '');
  const num = (k: string) => Number(str(k)) || 0;
  const backRaw = str('back');
  const back = /^\/admin\/drip(\/[\w-]*)?(\?[\w=&%.-]*)?$/.test(backRaw) ? backRaw.split('?')[0] : '/admin/drip';
  const done = (msg: string, to = back, hash = '') => {
    const url = new URL(to, req.url);
    url.searchParams.set('msg', msg);
    return NextResponse.redirect(new URL(url.pathname + url.search + hash, req.url), 303);
  };

  try {
    switch (action) {
      case 'create-sequence': {
        const id = await createSequence(str('name').trim(), str('template'));
        return done('Sequence created. Edit the emails against the preview, send yourself a test, then enroll contacts.', `/admin/drip/${id}`);
      }
      case 'save-step':
        await saveStep(num('step'), {
          subject: str('subject'), preheader: str('preheader'), body: str('body'),
          cta_label: str('cta_label'), cta_url: str('cta_url'), delay_days: num('delay_days'), send_on: str('send_on'),
        });
        return done('Saved.', back, `#step-${num('step')}`);
      case 'add-step':
        await addStep(num('sequence'));
        return done('Step added at the end.');
      case 'delete-step':
        await deleteStep(num('step'));
        return done('Step deleted.');
      case 'sequence-status':
        await setSequence(num('sequence'), { status: str('status') });
        return done(str('status') === 'active' ? 'Sequence is live. Due emails go out with the next send run.' : 'Sequence paused. Nothing sends until you resume it.');
      case 'rename':
        await setSequence(num('sequence'), { name: str('name').trim() });
        return done('Renamed.');
      case 'delete-sequence':
        await deleteSequence(num('sequence'));
        return done('Sequence deleted.', '/admin/drip');
      case 'enroll': {
        const added = await enroll(num('sequence'), { list: str('list'), skipPutForward: str('skip_put_forward') === 'on' });
        return done(`${added.toLocaleString('en-US')} contact${added === 1 ? '' : 's'} enrolled.`);
      }
      case 'run': {
        const r = await runDue();
        if (r.blocked) return done(`Nothing sent. ${r.blocked}`);
        return done(`Send run done: ${r.sent} sent, ${r.failed} failed, ${r.exited} left their sequence, ${r.completed} finished.`);
      }
      case 'test':
        await sendTest(num('step'), str('to').trim());
        return done(`Test sent to ${str('to').trim()}.`, back, `#step-${num('step')}`);
      case 'contact-status':
        await setContactStatus(num('contact'), str('status') === 'active' ? 'active' : 'unsubscribed');
        return done('Contact updated.');
      case 'import': {
        const file = f.get('file');
        if (!(file instanceof File) || !file.size) return done('Choose a CSV file first.');
        if (file.size > 4_000_000) return done('That file is over 4 MB. Split it and upload the parts.');
        const { contacts, missingEmail, columns } = toContacts(parseCsv(await file.text()));
        if (missingEmail) return done(`No email column found. Columns seen: ${columns.slice(0, 8).join(', ') || 'none'}.`);
        const r = await importContacts(contacts, str('list'), str('skip_declined') === 'on');
        return done(`Imported: ${r.added} new, ${r.updated} updated, ${r.skipped} skipped (vendor, Sitecore or personal), ${r.invalid} invalid.`);
      }
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    console.error('[drip]', action, err);
    return done(`That didn’t work: ${(err as Error).message.slice(0, 200)}`);
  }
}

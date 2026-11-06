'use client';

import { useEffect, useRef, useState } from 'react';

type Step = { id: number; position: number; delayDays: number; subject: string; preheader: string; body: string; cta_label: string; cta_url: string };

/**
 * One email in a sequence: the copy on the left, and on the right the real email as it will
 * arrive (rendered on the server with sample merge data), at desktop or phone width.
 */
export default function StepEditor({ step, sequenceId, back, first }: { step: Step; sequenceId: number; back: string; first: boolean }) {
  const [v, setV] = useState({
    subject: step.subject, preheader: step.preheader, body: step.body, cta_label: step.cta_label, cta_url: step.cta_url, delay_days: String(step.delayDays),
  });
  const [preview, setPreview] = useState<{ subject: string; preheader: string; html: string } | null>(null);
  const [width, setWidth] = useState<'desktop' | 'phone'>('desktop');
  const frame = useRef<HTMLIFrameElement>(null);
  const dirty =
    v.subject !== step.subject || v.preheader !== step.preheader || v.body !== step.body || v.cta_label !== step.cta_label ||
    v.cta_url !== step.cta_url || v.delay_days !== String(step.delayDays);

  useEffect(() => {
    const t = setTimeout(async () => {
      const res = await fetch('/api/admin/drip/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, code: `d${sequenceId}s${step.position}` }),
      });
      if (res.ok) setPreview(await res.json());
    }, 250);
    return () => clearTimeout(t);
  }, [v, sequenceId, step.position]);

  const fit = () => {
    const doc = frame.current?.contentDocument;
    if (doc && frame.current) frame.current.style.height = `${doc.documentElement.scrollHeight + 4}px`;
  };

  const field = (k: keyof typeof v) => ({
    name: k,
    value: v[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((p) => ({ ...p, [k]: e.target.value })),
  });

  return (
    <div className="ad-split">
      <div>
        <form method="post" action="/api/admin/drip/save-step" className="ad-form">
          <input type="hidden" name="step" value={step.id} />
          <input type="hidden" name="back" value={back} />
          <label className="ad-field ad-inline">
            <span>{first ? 'Days after enrolling' : 'Days after the previous email'}</span>
            <input className="ad-input ad-num" type="number" min={0} max={365} {...field('delay_days')} />
          </label>
          <label className="ad-field">
            <span>Subject</span>
            <input className="ad-input" required maxLength={200} {...field('subject')} />
          </label>
          <label className="ad-field">
            <span>Preview line <small>(shown after the subject in the inbox)</small></span>
            <input className="ad-input" maxLength={200} {...field('preheader')} />
          </label>
          <label className="ad-field">
            <span>Message</span>
            <textarea className="ad-input ad-textarea" rows={12} {...field('body')} />
            <small className="ad-hint">
              Blank line for a new paragraph. **bold**, _italic_, [link](https://…), “- ” for a list. Merge fields: {'{{first_name|there}}'},
              {' {{company|your company}}'}, {'{{last_name}}'}, {'{{title}}'}; the part after | is used when the field is empty.
            </small>
          </label>
          <div className="ad-row2">
            <label className="ad-field">
              <span>Button text <small>(empty for no button)</small></span>
              <input className="ad-input" maxLength={60} {...field('cta_label')} />
            </label>
            <label className="ad-field">
              <span>Button link <small>(empty for the form)</small></span>
              <input className="ad-input" placeholder="https://www.ignoranceisbliss.ai/#join" {...field('cta_url')} />
            </label>
          </div>
          <div className="ad-actions">
            <button className="ad-btn primary" type="submit" disabled={!dirty}>{dirty ? 'Save changes' : 'Saved'}</button>
          </div>
        </form>
        <div className="ad-actions">
          <form method="post" action="/api/admin/drip/test" className="ad-test">
            <input type="hidden" name="step" value={step.id} />
            <input type="hidden" name="back" value={back} />
            <input className="ad-input" type="email" name="to" required placeholder="you@company.com" aria-label="Send a test to" />
            <button className="ad-btn" type="submit" title={dirty ? 'Save first: tests send the saved version' : undefined}>Send test</button>
          </form>
          <form method="post" action="/api/admin/drip/delete-step">
            <input type="hidden" name="step" value={step.id} />
            <input type="hidden" name="back" value={back} />
            <button className="ad-btn ghost" type="submit">Delete email</button>
          </form>
        </div>
        {dirty && <p className="ad-hint">Unsaved changes: the preview shows them, tests and sends use the saved version.</p>}
      </div>

      <div className="ad-preview">
        <div className="ad-preview-bar">
          <div className="ad-inbox">
            <b>{preview?.subject ?? v.subject}</b>
            <span>{preview?.preheader ?? v.preheader}</span>
          </div>
          <div className="ad-seg" role="group" aria-label="Preview width">
            <button type="button" className={width === 'desktop' ? 'on' : undefined} onClick={() => setWidth('desktop')}>Desktop</button>
            <button type="button" className={width === 'phone' ? 'on' : undefined} onClick={() => setWidth('phone')}>Phone</button>
          </div>
        </div>
        <div className="ad-frame" style={{ maxWidth: width === 'phone' ? 390 : '100%' }}>
          {preview ? (
            <iframe ref={frame} title={`Preview of email ${step.position}`} srcDoc={preview.html} sandbox="allow-same-origin" onLoad={fit} />
          ) : (
            <p className="ad-empty">Rendering the preview…</p>
          )}
        </div>
        <p className="ad-hint">Shown with sample data (Jane Doe, Northwind Traders). Each contact gets their own name and company.</p>
      </div>
    </div>
  );
}

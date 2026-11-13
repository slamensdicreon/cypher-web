'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Recommendation } from '@/lib/platform';

type Choice = 'approve' | 'edit' | 'reject' | 'skip';

/**
 * Every waiting proposal (lessons, procedures, gaps and rules, from every project) sorted by Cypher,
 * which calls Claude: slow, and it costs money, so it runs only from the button. The Director picks
 * per proposal and applies them together.
 */
export default function ProposalReview({ waiting }: { waiting: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState<'' | 'sort' | 'apply'>('');
  const [recs, setRecs] = useState<Recommendation[] | null>(null);
  const [available, setAvailable] = useState(true);
  const [pick, setPick] = useState<Record<string, Choice>>({});
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean; fresh?: boolean } | null>(null);
  const keyOf = (r: Recommendation) => `${r.kind}:${r.id}`;

  async function call(action: string, body: unknown) {
    const res = await fetch(`/api/admin/platform/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({ ok: false, msg: 'That didn’t work.' }));
    if (!j.ok) setMsg({ text: j.msg, bad: true, fresh: j.fresh === false });
    return j;
  }

  async function sort() {
    setBusy('sort');
    setMsg(null);
    const j = await call('proposals-sort', {});
    setBusy('');
    if (!j.ok) return;
    setRecs(j.recommendations);
    setAvailable(j.available);
    setPick(Object.fromEntries((j.recommendations as Recommendation[]).map((r) => [keyOf(r), j.available ? r.action : 'skip'])));
  }

  async function apply() {
    if (!recs) return;
    const decisions = recs
      .filter((r) => pick[keyOf(r)] && pick[keyOf(r)] !== 'skip')
      .map((r) => ({ kind: r.kind, id: r.id, action: pick[keyOf(r)], ...(pick[keyOf(r)] === 'edit' ? { edit: r.edit } : {}) }));
    if (!decisions.length) return setMsg({ text: 'Nothing chosen to apply.', bad: true });
    setBusy('apply');
    const j = await call('proposals-apply', { decisions });
    setBusy('');
    if (!j.ok) return;
    setMsg({ text: j.msg });
    setRecs(null);
    setConfirm(false);
    router.refresh();
  }

  return (
    <section className="ad-card ad-wide" id="proposals">
      <h3>Proposals <span className="ad-dim">· {waiting} waiting</span></h3>
      {msg && (
        <p className={`ad-banner${msg.bad ? ' bad' : ''}`} role="status">
          {msg.text} {msg.fresh && <a href={`/admin/sign-in?confirm=1&next=${encodeURIComponent('/admin/platform/knowledge')}`}>Sign in again</a>}
        </p>
      )}
      {!recs ? (
        <div className="lw-sortbar">
          <p className="ad-fine">Cypher reads every waiting proposal together, catching repeats and contradictions, and recommends approve, approve with changes, or reject. It calls Claude: it takes a while and costs money.</p>
          <button className="ad-btn primary" type="button" onClick={sort} disabled={busy !== '' || waiting === 0}>
            {busy === 'sort' ? 'Cypher is reading them…' : 'Sort them with Cypher'}
          </button>
        </div>
      ) : (
        <>
          {!available && <p className="ad-banner">No model is set up on the platform, so these are listed without recommendations. Choose for each.</p>}
          {recs.length === 0 ? <p className="ad-empty">Nothing is waiting.</p> : (
            <ul className="lw-recs">
              {recs.map((r) => {
                const k = keyOf(r);
                return (
                  <li key={k} className={`a-${pick[k]}`}>
                    <div className="lw-rec-head">
                      <span className="lw-ref">{r.ref}</span>
                      <span className="ad-pill no">{r.kind}</span>
                      <b>{r.label}</b>
                    </div>
                    {available && <p className="crm-tl-meta">Cypher: {r.action === 'edit' ? 'approve with changes' : r.action}. {r.reason}{r.duplicateOf ? ` Repeats ${r.duplicateOf}.` : ''}</p>}
                    {r.edit && (
                      <div className="lw-edit">
                        {r.edit.title && <p><b>Title:</b> {r.edit.title}</p>}
                        {r.edit.text && <p><b>Text:</b> {r.edit.text}</p>}
                        {r.edit.when && <p><b>When:</b> {r.edit.when}</p>}
                        {r.edit.then && <p><b>Then:</b> {r.edit.then}</p>}
                      </div>
                    )}
                    <div className="ad-seg crm-kinds" role="radiogroup" aria-label={`Decision on ${r.ref}`}>
                      {(['approve', ...(r.edit ? ['edit'] : []), 'reject', 'skip'] as Choice[]).map((c) => (
                        <label key={c}>
                          <input type="radio" name={k} checked={pick[k] === c} onChange={() => setPick({ ...pick, [k]: c })} />
                          <span>{c === 'edit' ? 'Approve changed' : c === 'skip' ? 'Leave it' : c[0].toUpperCase() + c.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="ad-actions">
            <label className="ad-check"><input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} /> <span>Confirm: approved entries and rules shape every future build on their scope</span></label>
            <button className="ad-btn primary" type="button" onClick={apply} disabled={!confirm || busy !== '' || !recs.length}>{busy === 'apply' ? 'Applying…' : 'Apply these decisions'}</button>
            <button className="ad-btn ghost" type="button" onClick={() => setRecs(null)}>Cancel</button>
          </div>
        </>
      )}
    </section>
  );
}

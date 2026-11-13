'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type DragEvent } from 'react';

export type BoardStage = { id: string; label: string; kind: string };
export type BoardDeal = {
  id: number;
  title: string;
  stage: string;
  companyName: string | null;
  contactName: string | null;
  value: number | null;
  ownerName: string | null;
  score: number;
  nextStep: string;
  nextStepAt: string | null;
  openTasks: number;
  daysInStage: number;
};

const money = (n: number | null) => (n === null ? '' : n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);
const heatClass = (n: number) => (n >= 60 ? 'hot' : n >= 35 ? 'warm' : 'cool');

/** The pipeline as columns. Drag a card to another column (or use its menu) to move the deal; Lost asks why. */
export default function Board({ stages, deals }: { stages: BoardStage[]; deals: BoardDeal[] }) {
  const router = useRouter();
  const [items, setItems] = useState(deals);
  const [over, setOver] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function move(id: number, stage: string) {
    const d = items.find((x) => x.id === id);
    if (!d || d.stage === stage) return;
    let lostReason = '';
    if (stages.find((s) => s.id === stage)?.kind === 'lost') {
      lostReason = window.prompt('Why was it lost?')?.trim() ?? '';
      if (!lostReason) return;
    }
    const prev = items;
    setItems(items.map((x) => (x.id === id ? { ...x, stage, daysInStage: 0 } : x)));
    const res = await fetch('/api/admin/crm/move-deal', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: String(id), stage, lost_reason: lostReason }),
    });
    const j = (await res.json().catch(() => ({ ok: false, msg: 'That didn’t work.' }))) as { ok: boolean; msg: string };
    if (!res.ok || !j.ok) {
      setItems(prev);
      setError(j.msg || 'That didn’t work.');
    } else {
      setError('');
      router.refresh();
    }
  }

  const onDrop = (stage: string) => (e: DragEvent) => {
    e.preventDefault();
    setOver(null);
    const id = Number(e.dataTransfer.getData('text/plain'));
    if (id) move(id, stage);
  };

  return (
    <>
      {error && <p className="ad-banner bad" role="alert">{error}</p>}
      <div className="crm-board">
        {stages.map((s) => {
          const col = items.filter((d) => d.stage === s.id);
          const total = col.reduce((a, d) => a + (d.value ?? 0), 0);
          return (
            <section
              key={s.id}
              className={`crm-col ${s.kind}${over === s.id ? ' over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(s.id);
              }}
              onDragLeave={() => setOver((o) => (o === s.id ? null : o))}
              onDrop={onDrop(s.id)}
              aria-label={s.label}
            >
              <header>
                <b>{s.label}</b>
                <span>
                  {col.length}
                  {total ? ` · ${money(total)}` : ''}
                </span>
              </header>
              <div className="crm-cards">
                {col.map((d) => (
                  <article key={d.id} className="crm-card" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(d.id))}>
                    <div className="crm-card-top">
                      <span className={`crm-heat ${heatClass(d.score)}`} title={`Lead score ${d.score}`}>
                        {d.score}
                      </span>
                      {d.value !== null && <span className="crm-val">{money(d.value)}</span>}
                    </div>
                    <Link href={`/admin/crm/deals/${d.id}`} className="crm-card-title" draggable={false}>
                      {d.companyName || d.title}
                    </Link>
                    <span className="crm-card-sub">{d.companyName ? d.title.replace(`${d.companyName} · `, '') : d.contactName}</span>
                    {d.nextStep && (
                      <span className="crm-next">
                        Next: {d.nextStep}
                        {d.nextStepAt ? ` · ${d.nextStepAt.slice(5)}` : ''}
                      </span>
                    )}
                    <div className="crm-card-foot">
                      <span>{d.ownerName ?? 'Unassigned'}</span>
                      <span>
                        {d.openTasks ? `${d.openTasks} task${d.openTasks === 1 ? '' : 's'} · ` : ''}
                        {d.daysInStage}d
                      </span>
                    </div>
                    <label className="crm-move">
                      <span className="sr">Move to</span>
                      <select value={d.stage} onChange={(e) => move(d.id, e.target.value)} aria-label={`Move ${d.companyName || d.title}`}>
                        {stages.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
                {!col.length && <p className="crm-empty">Nothing here.</p>}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

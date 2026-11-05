'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { companyOf, domainOf } from '@/lib/company';
import { isClosed } from '@/lib/config';
import { eye } from './eyeBus';

const LEVELS = [
  {
    word: 'Curious.', sub: 'Curious is a fine place to start. A worse place to stay.', tick: 'Curious',
    svg: '<circle cx="36" cy="36" r="31" fill="#141433"/><path d="M20 36 Q36 50 52 36" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>',
  },
  {
    word: 'Interested.', sub: 'So is everyone you’re competing with.', tick: 'Interested',
    svg: '<circle cx="36" cy="36" r="31" fill="#141433"/><path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/><circle cx="36" cy="36" r="5" fill="#ffffff"/>',
  },
  {
    word: 'We need this.', sub: 'Good. Needing it is the first qualification.', tick: 'Need it',
    svg: '<circle cx="36" cy="36" r="31" fill="#141433"/><path d="M16 36 Q36 16 56 36 Q36 56 16 36 Z" fill="#ffffff"/><circle cx="36" cy="36" r="9" fill="#141433"/>',
  },
  {
    word: 'Take our budget.', sub: 'Careful. We might.', tick: 'Take our budget',
    svg: '<circle cx="36" cy="36" r="31" fill="#e8553d"/><path d="M16 36 Q36 16 56 36 Q36 56 16 36 Z" fill="#ffffff"/><circle cx="36" cy="36" r="9.5" fill="#141433"/>',
  },
];

const NOTED = [
  'Curious. We’ll see if that’s enough.',
  'Interested. We’ll be the judge of how much.',
  'Needing it is the first qualification. You have it.',
  'Bold. We like bold. We’re still going to check.',
];

type ReplyKind = 'sitecore' | 'vendor' | 'personal' | 'bad' | 'slow' | 'error';
const REPLY: Record<ReplyKind, { bg: string; fg: string; accent: string; t: string; h: string; p: string; a: string }> = {
  sitecore: { bg: '#e8553d', fg: '#ffffff', accent: '#ffffff', t: 'An @sitecore.com address', h: 'Sitecore. Hi. We know it’s you.', p: 'We love you, and you know we love you. But you can’t put yourself forward for your own platform’s future with a card you found at your own conference. Come find us in the hallway. No form.', a: 'No hard feelings.' },
  vendor: { bg: '#1d1d45', fg: '#ffffff', accent: '#b7a6ff', t: 'A vendor address', h: 'We’d love to. You’d only use it to compete with us.', p: 'That’s your job, and we respect it. The twenty-five are the companies that sign invoices, not the ones that send them. Enjoy the conference.', a: 'Declined, with feeling.' },
  personal: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'A personal address', h: 'A personal address is a lovely way to stay anonymous.', p: 'It’s also a lovely way to not be selected. Use the one your company pays for. We’ll wait.', a: 'Try again with the work one.' },
  bad: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'That isn’t an email address', h: 'Cypher reads a lot of things. Not that.', p: 'Try the one your company pays for.', a: 'Try again.' },
  slow: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'Too many tries', h: 'Easy. We heard you.', p: 'Too many submissions from this network in the last hour. Try again later.', a: 'Try again later.' },
  error: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'That didn’t go through', h: 'Cypher blinked.', p: 'Your submission didn’t reach us. Check your connection and send it again.', a: 'Send it again.' },
};

type Phase =
  | { kind: 'form' }
  | { kind: 'reply'; reply: ReplyKind }
  | { kind: 'noted'; company: string; level: number }
  | { kind: 'closed' };

const STORE_KEY = 'iib-sent';

export default function InterestForm() {
  const [phase, setPhase] = useState<Phase>({ kind: 'form' });
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState(1);
  const [pop, setPop] = useState(false);
  const [sending, setSending] = useState(false);
  const website = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isClosed()) { setPhase({ kind: 'closed' }); return; }
    try {
      const prev = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (prev && prev.company) setPhase({ kind: 'noted', company: prev.company, level: prev.level ?? 1 });
    } catch { /* first visit */ }
  }, []);

  const domain = domainOf(email);
  const company = domain ? companyOf(domain) : '';
  const L = LEVELS[level];

  function onLevel(v: number) {
    setLevel(v);
    setPop(true);
    setTimeout(() => setPop(false), 220);
    if (v === 0) eye('squint', 700);
    else if (v === 1) eye('blink');
    else if (v === 2) eye('widen', 1200);
    else { eye('wake'); eye('double'); eye('widen', 1600); }
  }

  async function submit() {
    if (sending) return;
    if (isClosed()) { setPhase({ kind: 'closed' }); return; }
    setSending(true);
    const source = new URLSearchParams(window.location.search).get('c') || '';
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, level, source, website: website.current?.value || '' }),
      });
      const data = (await res.json().catch(() => ({ status: 'error' }))) as { status: string; company?: string };
      if (data.status === 'ok') {
        const c = data.company || company || 'your company';
        try { localStorage.setItem(STORE_KEY, JSON.stringify({ company: c, level })); } catch { /* private mode */ }
        eye('calm'); eye('double');
        setPhase({ kind: 'noted', company: c, level });
      } else if (data.status === 'closed') {
        setPhase({ kind: 'closed' });
      } else {
        const k = (['sitecore', 'vendor', 'personal', 'bad', 'slow'].includes(data.status) ? data.status : 'error') as ReplyKind;
        eye('calm'); eye('squint', 900);
        setPhase({ kind: 'reply', reply: k });
      }
    } catch {
      setPhase({ kind: 'reply', reply: 'error' });
    } finally {
      setSending(false);
    }
  }

  function reset() {
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    eye('wake');
    setEmail('');
    setPhase({ kind: 'form' });
  }

  if (phase.kind === 'closed') {
    return (
      <div className="card">
        <div className="reply" style={{ background: '#f6f5fc', color: '#141433' }}>
          <span className="t" style={{ color: '#6a6889' }}>November 13 has passed</span>
          <h3>Selection is closed.</h3>
          <p>Twenty-five companies are being built. If you’re one of them, you already know.</p>
        </div>
      </div>
    );
  }

  if (phase.kind === 'reply') {
    const r = REPLY[phase.reply];
    return (
      <div className="card">
        <div className="reply" style={{ background: r.bg, color: r.fg }}>
          <span className="t" style={{ color: r.accent }}>{r.t}</span>
          <h3>{r.h}</h3>
          <p>{r.p}</p>
          <span className="a" style={{ color: r.accent }}>{r.a}</span>
        </div>
        <button className="btn light" type="button" onClick={reset}>Try another address</button>
      </div>
    );
  }

  if (phase.kind === 'noted') {
    return (
      <div className="card">
        <div className="reply" style={{ background: '#141433', color: '#ffffff' }}>
          <span className="t" style={{ color: '#b7a6ff' }}>
            <svg width="24" height="24" viewBox="0 0 72 72" aria-hidden="true" dangerouslySetInnerHTML={{ __html: LEVELS[phase.level].svg }} />
            Put forward
          </span>
          <h3>Noted, {phase.company}.</h3>
          <p>{NOTED[phase.level]}</p>
          <p style={{ color: '#d6d0f5' }}>
            If {phase.company} is one of the twenty-five, you’ll hear from Cypher before November 13. If not, you won’t. Ignorance is bliss.
          </p>
        </div>
        <button className="btn light" type="button" onClick={reset}>Put forward a different address</button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
      <h2>Put your company forward.</h2>
      <label className="f" htmlFor="email">
        Work email
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@yourcompany.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => eye('focus')}
          onBlur={() => eye('unfocus')}
        />
        <span className="co" aria-live="polite">
          {company ? (<><span>Putting forward:</span> {company}</>) : null}
        </span>
      </label>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" ref={website} />
      </div>
      <div className="dial">
        <span className="q" id="dialq">How badly do you want this?</span>
        <div className="read" aria-live="polite">
          <svg viewBox="0 0 72 72" aria-hidden="true" className={pop ? 'pop' : undefined} dangerouslySetInnerHTML={{ __html: L.svg }} />
          <span className="t"><b>{L.word}</b><span>{L.sub}</span></span>
        </div>
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={level}
          aria-labelledby="dialq"
          aria-valuetext={L.tick}
          style={{ '--p': `${(level / 3) * 100}%` } as CSSProperties}
          onChange={(e) => onLevel(Number(e.target.value))}
        />
        <div className="ticks" aria-hidden="true">
          {LEVELS.map((x, i) => <span key={x.tick} className={i === level ? 'on' : undefined}>{x.tick}</span>)}
        </div>
      </div>
      <button className="btn" type="submit" disabled={sending}>{sending ? 'Cypher is reading…' : 'Get considered'}</button>
      <p className="small">If your company is selected, you’ll hear from Cypher. If not, you won’t.</p>
    </form>
  );
}

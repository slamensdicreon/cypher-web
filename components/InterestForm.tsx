'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { companyOf, domainOf } from '@/lib/company';
import { isClosed, NOTED } from '@/lib/config';
import { eye, eyeLook, eyeMood } from './eyeBus';
import { track } from '@/lib/track';
import LivingEye from './LivingEye';
import Morph from './Morph';

const LEVELS = [
  { word: 'Curious.', sub: 'Curious is a fine place to start. A worse place to stay.', tick: 'Curious' },
  { word: 'Interested.', sub: 'So is everyone you’re competing with.', tick: 'Interested' },
  { word: 'We need this.', sub: 'Good. Needing it is the first qualification.', tick: 'Need it' },
  { word: 'Take our budget.', sub: 'Careful. We might.', tick: 'Take our budget' },
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
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function InterestForm() {
  const [phase, setPhase] = useState<Phase>({ kind: 'form' });
  const [email, setEmail] = useState('');
  // The dial moves continuously under the finger and settles on a level when let go.
  const [raw, setRaw] = useState(1);
  const rawRef = useRef(1);
  const tween = useRef(0);
  const [sending, setSending] = useState(false);
  const website = useRef<HTMLInputElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const measure = useRef<CanvasRenderingContext2D | null>(null);
  const lastCompany = useRef('');
  const started = useRef(false);

  const level = Math.round(raw);
  const domain = domainOf(email);
  const company = domain ? companyOf(domain) : '';
  if (company) lastCompany.current = company;
  const L = LEVELS[level];

  useEffect(() => {
    if (isClosed()) { setPhase({ kind: 'closed' }); return; }
    try {
      const prev = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (prev && prev.company) setPhase({ kind: 'noted', company: prev.company, level: prev.level ?? 1 });
    } catch { /* first visit */ }
  }, []);

  // The moment a company is recognised, the eyes notice.
  const hadCompany = useRef(false);
  useEffect(() => {
    if (company && !hadCompany.current) eye('widen', 700);
    hadCompany.current = Boolean(company);
  }, [company]);

  useEffect(() => () => cancelAnimationFrame(tween.current), []);

  function react(v: number) {
    eyeMood(v / 3);
    if (v === 0) eye('squint', 700);
    else if (v === 1) eye('blink');
    else if (v === 2) eye('widen', 1200);
    else { eye('wake'); eye('double'); eye('widen', 1600); }
  }

  function moveTo(v: number) {
    const before = Math.round(rawRef.current);
    rawRef.current = v;
    setRaw(v);
    const after = Math.round(v);
    if (after !== before) react(after);
  }

  /** Glide the dial to a value, as if a soft spring were pulling it there. */
  function glideTo(to: number) {
    cancelAnimationFrame(tween.current);
    const from = rawRef.current;
    if (Math.abs(from - to) < 0.001) return;
    if (reducedMotion()) { moveTo(to); return; }
    const t0 = performance.now();
    const dur = 260 + Math.abs(to - from) * 60;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      moveTo(from + (to - from) * e);
      if (k < 1) tween.current = requestAnimationFrame(step);
    };
    tween.current = requestAnimationFrame(step);
  }

  const settle = () => glideTo(Math.round(rawRef.current));

  function onDialKey(e: KeyboardEvent<HTMLInputElement>) {
    const cur = Math.round(rawRef.current);
    const to =
      e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'PageDown' ? cur - 1
      : e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageUp' ? cur + 1
      : e.key === 'Home' ? 0
      : e.key === 'End' ? 3
      : null;
    if (to === null) return;
    e.preventDefault();
    glideTo(Math.max(0, Math.min(3, to)));
  }

  /** Point both eyes at the caret, so Cypher reads along as you type. */
  function lookAtCaret() {
    const el = input.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    measure.current ??= document.createElement('canvas').getContext('2d');
    const ctx = measure.current;
    if (!ctx) return;
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const caret = el.selectionStart ?? el.value.length;
    const w = ctx.measureText(el.value.slice(0, caret)).width;
    const r = el.getBoundingClientRect();
    const pl = parseFloat(cs.paddingLeft) || 0;
    eyeLook(Math.min(r.right - pl, r.left + pl + w - el.scrollLeft), r.top + r.height / 2);
  }

  async function submit() {
    if (sending) return;
    if (isClosed()) { setPhase({ kind: 'closed' }); return; }
    setSending(true);
    eye('scan', 1600);
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
        eye('calm'); eye('delight');
        setPhase({ kind: 'noted', company: c, level });
      } else if (data.status === 'closed') {
        setPhase({ kind: 'closed' });
      } else {
        const k = (['sitecore', 'vendor', 'personal', 'bad', 'slow'].includes(data.status) ? data.status : 'error') as ReplyKind;
        eye('calm'); eye('shake'); eye('squint', 900);
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

  let content: React.ReactNode;

  if (phase.kind === 'closed') {
    content = (
      <div className="card">
        <div className="reply" style={{ background: '#f6f5fc', color: '#141433' }}>
          <span className="t" style={{ color: '#6a6889' }}>November 13 has passed</span>
          <h3>Selection is closed.</h3>
          <p>Twenty-five companies are being built. If you’re one of them, you already know.</p>
        </div>
      </div>
    );
  } else if (phase.kind === 'reply') {
    const r = REPLY[phase.reply];
    content = (
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
  } else if (phase.kind === 'noted') {
    content = (
      <div className="card">
        <div className="reply" style={{ background: '#141433', color: '#ffffff' }}>
          <span className="t" style={{ color: '#b7a6ff' }}>
            <LivingEye variant="dial" level={phase.level} className="mini" />
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
  } else {
    content = (
      <form className="card" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        <h2>Put your company forward.</h2>
        <label className="f" htmlFor="email">
          Work email
          <input
            id="email"
            ref={input}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@yourcompany.com"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); requestAnimationFrame(lookAtCaret); }}
            onSelect={lookAtCaret}
            onFocus={() => { eye('focus'); lookAtCaret(); if (!started.current) { started.current = true; track('form_start'); } }}
            onBlur={() => eye('unfocus')}
          />
          <span className={company ? 'co on' : 'co'} aria-live="polite" aria-hidden={company ? undefined : true}>
            <span>Putting forward:</span> {company || lastCompany.current}
          </span>
        </label>
        <div className="hp" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" ref={website} />
        </div>
        <div className="dial">
          <span className="q" id="dialq">How badly do you want this?</span>
          <div className="read" aria-live="polite">
            <LivingEye variant="dial" level={raw} className="dialeye" />
            <span className="t" key={level}><b>{L.word}</b><span>{L.sub}</span></span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={0.001}
            value={raw}
            aria-labelledby="dialq"
            aria-valuetext={L.tick}
            style={{ '--p': `${(raw / 3) * 100}%` } as CSSProperties}
            onChange={(e) => { cancelAnimationFrame(tween.current); moveTo(Number(e.target.value)); }}
            onPointerUp={settle}
            onPointerCancel={settle}
            onTouchEnd={settle}
            onBlur={settle}
            onKeyDown={onDialKey}
          />
          <div className="ticks" aria-hidden="true">
            {LEVELS.map((x, i) => (
              <span key={x.tick} className={i === level ? 'on' : undefined} onClick={() => glideTo(i)}>{x.tick}</span>
            ))}
          </div>
        </div>
        <button className={sending ? 'btn busy' : 'btn'} type="submit" disabled={sending}>
          <span>{sending ? 'Cypher is reading…' : 'Get considered'}</span>
        </button>
        <p className="small">If your company is selected, you’ll hear from Cypher. If not, you won’t.</p>
      </form>
    );
  }

  const key = phase.kind === 'reply' ? `reply-${phase.reply}` : phase.kind;
  return <Morph k={key}>{content}</Morph>;
}

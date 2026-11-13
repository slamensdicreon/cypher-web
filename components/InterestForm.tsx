'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { companyOf, domainOf } from '@/lib/company';
import { NOTED, OUTCOMES } from '@/lib/config';
import { eye, eyeLook, eyeMood } from './eyeBus';
import { track } from '@/lib/track';
import { MAX_SLOTS, PARTS, PLATFORMS, dayLabel, nextWeekdays, type Part } from '@/lib/site';
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
  sitecore: { bg: '#e8553d', fg: '#ffffff', accent: '#ffffff', t: 'An @sitecore.com address', h: 'Sitecore. Hi. We know it’s you.', p: 'We love you, and you know we love you. But this form is for the companies that run on platforms, not the ones that make them. Write to cy@ignoranceisbliss.ai. No form.', a: 'No hard feelings.' },
  vendor: { bg: '#1d1d45', fg: '#ffffff', accent: '#b7a6ff', t: 'A vendor address', h: 'We’d love to. You’d only use it to compete with us.', p: 'That’s your job, and we respect it. This is for the companies that sign invoices, not the ones that send them.', a: 'Declined, with feeling.' },
  personal: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'A personal address', h: 'A personal address is a lovely way to stay anonymous.', p: 'It’s also a lovely way to never hear back. Use the one your company pays for. We’ll wait.', a: 'Try again with the work one.' },
  bad: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'That isn’t an email address', h: 'Cypher reads a lot of things. Not that.', p: 'Try the one your company pays for.', a: 'Try again.' },
  slow: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'Too many tries', h: 'Easy. We heard you.', p: 'Too many submissions from this network in the last hour. Try again later.', a: 'Try again later.' },
  error: { bg: '#f6f5fc', fg: '#141433', accent: '#6a6889', t: 'That didn’t go through', h: 'Cypher blinked.', p: 'Your submission didn’t reach us. Check your connection and send it again.', a: 'Send it again.' },
};

type Phase =
  | { kind: 'form' }
  | { kind: 'reply'; reply: ReplyKind }
  | { kind: 'noted'; company: string; level: number; site: string };

const STORE_KEY = 'iib-demo';
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function InterestForm() {
  const [phase, setPhase] = useState<Phase>({ kind: 'form' });
  const [email, setEmail] = useState('');
  const [site, setSite] = useState('');
  const [wants, setWants] = useState<string[]>([]);
  // The demo: who, on which platform, and when suits them (in their own time zone).
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('');
  const [otherPlatform, setOtherPlatform] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [tz, setTz] = useState('');
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

  // Dates and the time zone are the visitor's own, so they're worked out in the browser.
  useEffect(() => {
    setDays(nextWeekdays(6));
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch { /* old browser */ }
  }, []);

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (prev && prev.company) setPhase({ kind: 'noted', company: prev.company, level: prev.level ?? 1, site: prev.site ?? '' });
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
    setSending(true);
    eye('scan', 1600);
    // A postcard's code wins; otherwise the campaign that brought them (utm_source), so social shows up by name.
    const q = new URLSearchParams(window.location.search);
    const source = q.get('c') || q.get('utm_source') || '';
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, site, wants, level, source, website: website.current?.value || '',
          name, platform: platform === 'other' ? otherPlatform : platform, times: slots, tz, page: window.location.pathname,
        }),
      });
      const data = (await res.json().catch(() => ({ status: 'error' }))) as { status: string; company?: string };
      if (data.status === 'ok') {
        const c = data.company || company || 'your company';
        const where = site.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
        try { localStorage.setItem(STORE_KEY, JSON.stringify({ company: c, level, site: where })); } catch { /* private mode */ }
        eye('calm'); eye('delight');
        setPhase({ kind: 'noted', company: c, level, site: where });
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
    setSite('');
    setWants([]);
    setName('');
    setPlatform('');
    setOtherPlatform('');
    setSlots([]);
    setPhase({ kind: 'form' });
  }

  let content: React.ReactNode;

  if (phase.kind === 'reply') {
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
            Your demo
          </span>
          <h3>You’re on the list, {phase.company}.</h3>
          <p>{NOTED[phase.level]}</p>
          <p style={{ color: '#d6d0f5' }}>
            We’ll confirm one of your times within one business day, with a calendar invite. In the demo, you watch Cypher work on {phase.site || `${phase.company}’s site`}. Ignorance is bliss.
          </p>
        </div>
        <button className="btn light" type="button" onClick={reset}>Book another</button>
      </div>
    );
  } else {
    content = (
      <form className="card" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        <h2>Book a demo.</h2>
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
            <span>For:</span> {company || lastCompany.current}
          </span>
        </label>
        <label className="f" htmlFor="name">
          <span>Your name <span className="opt">optional</span></span>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="First and last"
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => eye('focus')}
            onBlur={() => eye('unfocus')}
          />
        </label>
        <label className="f" htmlFor="site">
          Your site
          <input
            id="site"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="yourcompany.com"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            onFocus={() => eye('focus')}
            onBlur={() => eye('unfocus')}
          />
        </label>
        <fieldset className="wants">
          <legend>Your platform</legend>
          <div className="chips">
            {[...PLATFORMS, 'other'].map((p) => {
              const on = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  className={on ? 'chip on' : 'chip'}
                  aria-pressed={on}
                  onClick={() => { setPlatform(on ? '' : p); eye(on ? 'blink' : 'widen', 500); }}
                >
                  {p === 'other' ? 'Something else' : p}
                </button>
              );
            })}
          </div>
          {platform === 'other' && (
            <input
              className="other"
              type="text"
              aria-label="Which platform?"
              placeholder="Which one? AEM, Drupal, Contentstack…"
              maxLength={60}
              value={otherPlatform}
              onChange={(e) => setOtherPlatform(e.target.value)}
            />
          )}
        </fieldset>
        <fieldset className="wants">
          <legend>What should it do?</legend>
          <div className="chips">
            {OUTCOMES.map((o) => {
              const on = wants.includes(o);
              return (
                <button
                  key={o}
                  type="button"
                  className={on ? 'chip on' : 'chip'}
                  aria-pressed={on}
                  onClick={() => { setWants((w) => (on ? w.filter((x) => x !== o) : [...w, o])); eye(on ? 'blink' : 'widen', 500); }}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="wants slots">
          <legend>When suits you? <span className="opt">pick up to {MAX_SLOTS}</span></legend>
          <div className="slot-grid">
            {days.map((d) => (
              <div className="slot-day" key={d}>
                <span>{dayLabel(d)}</span>
                {(Object.keys(PARTS) as Part[]).map((p) => {
                  const k = `${d}|${p}`;
                  const on = slots.includes(k);
                  const full = !on && slots.length >= MAX_SLOTS;
                  return (
                    <button
                      key={k}
                      type="button"
                      className={on ? 'chip on' : 'chip'}
                      aria-pressed={on}
                      aria-label={`${dayLabel(d)}, ${PARTS[p].toLowerCase()}`}
                      disabled={full}
                      onClick={() => { setSlots((s) => (on ? s.filter((x) => x !== k) : [...s, k])); eye(on ? 'blink' : 'widen', 400); }}
                    >
                      {PARTS[p]}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {tz && <p className="small">In your time zone ({tz.replace(/_/g, ' ')}). Mornings 9 to 12, afternoons 1 to 5.</p>}
        </fieldset>
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
          <span>{sending ? 'Cypher is reading…' : 'Book my demo'}</span>
        </button>
        <p className="small">Any enterprise platform. Your work email, so we know it’s really yours. In the demo, Cypher works on your site while you watch.</p>
      </form>
    );
  }

  const key = phase.kind === 'reply' ? `reply-${phase.reply}` : phase.kind;
  return <Morph k={key}>{content}</Morph>;
}

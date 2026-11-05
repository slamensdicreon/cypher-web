'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { eye } from './eyeBus';
import { track } from '@/lib/track';

type Decision = {
  n: string;
  /** What Cypher did, in three words: the card's header. */
  did: string;
  h: string;
  p: string;
  /** The back: a pithy line, and the technical reason it isn't a boast. */
  back: string;
  proof: string;
};

const DECISIONS: Decision[] = [
  {
    n: '01',
    did: 'repriced the build',
    h: 'We broke what a build costs. Permanently.',
    p: 'Which is why we’re being quiet about it.',
    back: 'We didn’t round down. We metered it.',
    proof: 'Every step of every run is metered to the cent, the way it’s billed, against a hard budget per specialist. $512 is what the meter read at the end. The $400,000+ is the quote it replaced.',
  },
  {
    n: '02',
    did: 'assembled the team',
    h: 'Twenty-one specialists. One mind running all of them. No invoice you’d recognize.',
    p: 'It plans it, builds it, checks it, and fixes what it finds before you find it. You make three decisions. That’s the job now.',
    back: 'Twenty-one roles. One record of everything.',
    proof: 'Every action passes one gateway that checks what that specialist is allowed to touch, then writes it to an append-only log. Over 225,000 events so far. Replay any build, step by step.',
  },
  {
    n: '03',
    did: 'upgraded your team',
    h: 'It doesn’t replace your team. It makes them unfair.',
    p: 'Every company that gets this first will look like it hired a hundred people. It didn’t.',
    back: 'It checks its own work. Harder than you would.',
    proof: 'Every page is screenshotted at three breakpoints and diffed pixel by pixel against the original, then audited with axe-core and Lighthouse, before anyone on your team looks at it.',
  },
  {
    n: '04',
    did: 'learned something new',
    h: 'It gets smarter every build. Your agency doesn’t.',
    p: 'It learns a lesson once and never bills you for it again.',
    back: 'It never asks twice. We checked.',
    proof: 'Every answer becomes a rule: versioned, reviewable, and applied to every build after. Its own playbook has shipped four new versions in a single night, mid-build.',
  },
];

const Mark = () => (
  <svg width="22" height="22" viewBox="0 0 72 72" aria-hidden="true">
    <circle cx="36" cy="36" r="31" fill="#e8553d" />
    <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
    <circle cx="36" cy="36" r="7" fill="#141433" />
  </svg>
);

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);
const Turn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * The four points as decisions waiting in Cypher. Reject turns the card over to show the proof;
 * Approve sends it away, and the rest close up behind it.
 */
export default function Decisions() {
  const [gone, setGone] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [approving, setApproving] = useState<string | null>(null);
  const [said, setSaid] = useState('');
  const grid = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLElement>());
  const before = useRef<{ rects: Map<string, DOMRect>; height: number } | null>(null);
  const focusAfter = useRef<string | null>(null);

  const visible = DECISIONS.filter((d) => !gone.includes(d.n));

  // FLIP: the cards that stay glide into their new places, and the grid eases to its new height.
  useLayoutEffect(() => {
    const prev = before.current;
    before.current = null;
    const g = grid.current;
    if (focusAfter.current && g) {
      g.querySelector<HTMLElement>(focusAfter.current)?.focus({ preventScroll: true });
      focusAfter.current = null;
    }
    if (!prev || !g || reducedMotion()) return;
    const h = g.getBoundingClientRect().height;
    if (Math.abs(h - prev.height) > 1) {
      g.animate([{ height: `${prev.height}px` }, { height: `${h}px` }], { duration: 560, easing: 'cubic-bezier(.2,.9,.25,1)' });
    }
    cards.current.forEach((el, n) => {
      const was = prev.rects.get(n);
      if (!was) return;
      const now = el.getBoundingClientRect();
      const dx = was.left - now.left;
      const dy = was.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: 640,
        easing: 'cubic-bezier(.2,.9,.3,1.15)',
      });
    });
  }, [gone]);

  function flip(n: string, on: boolean) {
    setFlipped((f) => (on ? [...f, n] : f.filter((x) => x !== n)));
    if (on) track('card_flip', { decision: n });
    eye(on ? 'squint' : 'blink', 600);
    setSaid(on ? 'Card turned over. The proof is showing.' : 'Card turned back.');
    // Keep the keyboard where the eyes are: on the face that just turned toward you.
    setTimeout(() => {
      cards.current.get(n)?.querySelector<HTMLElement>(on ? '.dback .dbtn.turn' : '.dfront .dbtn.reject')?.focus({ preventScroll: true });
    }, reducedMotion() ? 0 : 320);
  }

  async function approve(n: string) {
    if (approving) return;
    setApproving(n);
    eye('double');
    track('card_approve', { decision: n });
    const el = cards.current.get(n);
    const left = visible.filter((d) => d.n !== n);
    if (el && !reducedMotion()) {
      await wait(260);
      const r = el.getBoundingClientRect();
      const g = grid.current!;
      before.current = {
        rects: new Map(left.map((d) => [d.n, cards.current.get(d.n)!.getBoundingClientRect()])),
        height: g.getBoundingClientRect().height,
      };
      el.style.zIndex = '2';
      await el.animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: 'translateY(-10px) scale(1.02)', opacity: 1, offset: 0.25 },
          { transform: `translateY(${-Math.min(160, r.height * 0.5)}px) scale(.86) rotate(-3deg)`, opacity: 0 },
        ],
        { duration: 520, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' },
      ).finished;
    }
    const next = left[0];
    const face = next && flipped.includes(next.n) ? '.dback' : '.dfront';
    focusAfter.current = next ? `[data-n="${next.n}"] ${face} .dbtn.approve` : '.dempty .dbtn';
    setSaid(left.length ? `Approved. ${left.length} left.` : 'Approved. Nothing left to decide.');
    setApproving(null);
    setGone((g) => [...g, n]);
  }

  function restore() {
    eye('wake');
    setFlipped([]);
    focusAfter.current = '[data-n="01"] .dfront .dbtn.approve';
    setSaid('All four are back.');
    setGone([]);
  }

  return (
    <div className="decisions" ref={grid}>
      {visible.map((d) => {
        const on = flipped.includes(d.n);
        const done = approving === d.n;
        return (
          <article
            key={d.n}
            data-n={d.n}
            className="dcard"
            ref={(el) => {
              if (el) cards.current.set(d.n, el);
              else cards.current.delete(d.n);
            }}
          >
            <div className={on ? 'dflip on' : 'dflip'}>
              <div className="dface dfront" inert={on} aria-hidden={on || undefined}>
                <div className="dh">
                  <Mark />
                  <b>Cypher</b>
                  <span>{d.did}</span>
                  <span className="dn">{d.n}</span>
                </div>
                <h2>{d.h}</h2>
                <p>{d.p}</p>
                <div className="da">
                  <button type="button" className="dbtn reject" onClick={() => flip(d.n, true)} aria-label={`Reject: turn card ${d.n} over for the proof`}>
                    <Cross />Reject
                  </button>
                  <button type="button" className={done ? 'dbtn approve done' : 'dbtn approve'} onClick={() => approve(d.n)} aria-label={`Approve card ${d.n}`}>
                    <Check />{done ? 'Approved' : 'Approve'}
                  </button>
                </div>
              </div>
              <div className="dface dback" inert={!on} aria-hidden={!on || undefined}>
                <div className="dh">
                  <Mark />
                  <b>Cypher</b>
                  <span>shows its work</span>
                  <span className="dn">{d.n}</span>
                </div>
                <h3>{d.back}</h3>
                <p>{d.proof}</p>
                <div className="da">
                  <button type="button" className="dbtn turn" onClick={() => flip(d.n, false)} aria-label={`Turn card ${d.n} back`}>
                    <Turn />Turn back
                  </button>
                  <button type="button" className={done ? 'dbtn approve done' : 'dbtn approve'} onClick={() => approve(d.n)} aria-label={`Fair enough: approve card ${d.n}`}>
                    <Check />{done ? 'Approved' : 'Fair enough'}
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
      {visible.length === 0 && (
        <div className="dempty">
          <Mark />
          <h2>Inbox zero.</h2>
          <p>Four calls, four approvals, no meetings. That’s the job now.</p>
          <button type="button" className="dbtn reject" onClick={restore}>
            <Turn />Bring them back
          </button>
        </div>
      )}
      <span className="sr" aria-live="polite">{said}</span>
    </div>
  );
}

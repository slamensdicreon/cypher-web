'use client';

import { useEffect, useRef } from 'react';
import type { EyeAction } from './eyeBus';

/** The hero eye: a mind of its own, plus a few reactions the page can trigger. */
export default function Eye() {
  const svgRef = useRef<SVGSVGElement>(null);
  const lookRef = useRef<SVGGElement>(null);
  const openRef = useRef<SVGGElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const eyeEl = svgRef.current!, look = lookRef.current!, openG = openRef.current!;
    const pupil = pupilRef.current!, halo = haloRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    let alive = true;
    let raf = 0;

    const frame = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      look.style.transform = `translate(${(cur.x * 9).toFixed(2)}px, ${(cur.y * 7).toFixed(2)}px)`;
      raf = requestAnimationFrame(frame);
    };
    if (!reduced) raf = requestAnimationFrame(frame);

    const shut = async (ms: number) => { eyeEl.classList.add('blink'); await wait(ms); eyeEl.classList.remove('blink'); };
    const blink = async (double = false) => { if (reduced) return; await shut(150); if (double) { await wait(170); await shut(140); } };
    const squint = async (ms = 700) => { if (reduced) return; openG.style.transform = 'scaleY(.62)'; await wait(ms); openG.style.transform = ''; };
    const widen = async (ms = 900) => { if (reduced) return; pupil.setAttribute('r', '9.5'); await wait(ms); pupil.setAttribute('r', '7'); };
    const glance = async (x: number, y: number, hold = 1200) => { target.x = x; target.y = y; await wait(hold); };
    const roll = async () => {
      for (let i = 0; i <= 14; i++) { const a = (i / 14) * Math.PI * 2; target.x = Math.cos(a); target.y = Math.sin(a) * 0.8; await wait(60); }
      target.x = 0; target.y = 0;
    };

    const moves: Array<() => Promise<void>> = [
      () => blink(false), () => blink(false), () => blink(true),
      () => glance(Math.random() * 2 - 1, (Math.random() * 2 - 1) * 0.7, 900 + Math.random() * 1600),
      () => glance(0, 0, 1400),
      async () => { await glance(Math.random() < 0.5 ? -1 : 1, -0.2, 700); await glance(0, 0, 600); },
      () => squint(650), () => widen(900), () => roll(),
      async () => { await glance(0, 0.9, 500); await blink(false); await glance(0, 0, 400); },
      async () => { await glance(-1, 0.3, 600); await glance(1, 0.3, 600); await glance(0, 0, 500); },
      async () => { await squint(300); await blink(true); },
    ];

    (async () => {
      while (alive) {
        if (!reduced && !document.hidden) {
          const m = moves[Math.floor(Math.random() * moves.length)];
          try { await m(); } catch { /* keep living */ }
        }
        await wait(600 + Math.random() * 1800);
      }
    })();

    let last = window.scrollY;
    const onScroll = () => {
      const d = window.scrollY - last;
      last = window.scrollY;
      if (Math.abs(d) > 40) { target.x = 0; target.y = d > 0 ? 0.9 : -0.6; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onAction = (e: Event) => {
      const { action, ms } = ((e as CustomEvent).detail || {}) as { action: EyeAction; ms?: number };
      switch (action) {
        case 'blink': blink(false); break;
        case 'double': blink(true); break;
        case 'squint': squint(ms); break;
        case 'widen': widen(ms); break;
        case 'calm': halo.classList.add('calm'); break;
        case 'wake': halo.classList.remove('calm'); break;
        case 'focus': target.x = 0.6; target.y = 0.9; widen(ms ?? 1200); break;
        case 'unfocus': target.x = 0; target.y = 0; break;
      }
    };
    window.addEventListener('cypher:eye', onAction);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('cypher:eye', onAction);
    };
  }, []);

  return (
    <div className="eyewrap">
      <span className="halo breathe" ref={haloRef} aria-hidden="true" />
      <span className="eye-well" aria-hidden="true" />
      <svg className="eye" ref={svgRef} viewBox="0 0 72 72" role="img" aria-label="Cypher is watching">
        <circle cx="36" cy="36" r="31" fill="#e8553d" />
        <g className="look" ref={lookRef}>
          <g className="open" ref={openRef}>
            <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
            <circle id="pupil" ref={pupilRef} cx="36" cy="36" r="7" fill="#141433" />
          </g>
          <path className="lid" d="M18 36 Q36 40 54 36" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

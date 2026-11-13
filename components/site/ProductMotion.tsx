'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SHOTS } from '@/lib/product';

/** The Floor at work, looping quietly. With reduced motion it holds still on its poster. */
export function FloorLoop({ caption }: { caption?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, []);
  return (
    <figure className="pf floor">
      <div className="pf-bar" aria-hidden="true"><i /><i /><i /><span>The Floor</span></div>
      <div className="pf-screen">
        <video ref={ref} src="/product/floor.mp4" poster="/product/floor.jpg" muted loop playsInline preload="metadata" aria-label="The Floor: Cypher’s specialists at work, picking up tasks and handing them on." />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** One project, two ways to see it: a sentence from Cypher, or the whole console. */
export function BlissEverything() {
  const [mode, setMode] = useState<'bliss' | 'everything'>('bliss');
  const s = SHOTS[mode];
  return (
    <div className="be">
      <div className="be-switch" role="tablist" aria-label="How much do you want to see?">
        {(['bliss', 'everything'] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className={mode === m ? 'on' : undefined} onClick={() => setMode(m)}>
            {m === 'bliss' ? 'Bliss' : 'Everything'}
          </button>
        ))}
      </div>
      <p className="be-note">{mode === 'bliss' ? 'One sentence: where it stands, and the two things that are yours.' : 'The whole console: phases, gates, tasks, the team, the budget.'}</p>
      <figure className="pf">
        <div className="pf-bar" aria-hidden="true"><i /><i /><i /><span>{mode === 'bliss' ? 'Bliss' : 'Everything'}</span></div>
        <div className="pf-screen">
          <Image key={mode} src={s.src} width={s.w} height={s.h} alt={s.alt} sizes="(min-width: 1100px) 1000px, 100vw" />
        </div>
      </figure>
    </div>
  );
}

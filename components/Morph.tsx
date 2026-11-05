'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Holds the form card while its content changes (form, reply, confirmation): the height glides
 * from the old content to the new, and the new content rises in, one piece after another.
 */
export default function Morph({ k, children }: { k: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const height = useRef(0);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => {
      height.current = el.getBoundingClientRect().height;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = ref.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (first.current || reduced) {
      first.current = false;
      height.current = el.getBoundingClientRect().height;
      return;
    }
    const from = height.current;
    const to = el.getBoundingClientRect().height;
    if (from && Math.abs(from - to) > 1) {
      el.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: 560,
        easing: 'cubic-bezier(.2,.9,.25,1)',
      });
    }
    el.querySelectorAll(':scope > .card > *').forEach((child, i) => {
      (child as HTMLElement).animate(
        [
          { opacity: 0, transform: 'translateY(12px) scale(.985)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 520, delay: 40 + i * 55, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'backwards' },
      );
    });
    height.current = to;
  }, [k]);

  return (
    <div className="morph" ref={ref}>
      {children}
    </div>
  );
}

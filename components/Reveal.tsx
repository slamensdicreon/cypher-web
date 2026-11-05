'use client';

import { useEffect } from 'react';

const SELECTOR = [
  '.dcard',
  '.beat',
  '.proof',
  '.pillar',
  '.proofclose p',
  '.cred',
  '.plhead',
  '.day',
  '.weeknote',
  '.join .copy',
  '.join .morph',
  '.end > *',
].join(',');

/**
 * Lets the page's pieces rise softly into place as they scroll into view, siblings a beat apart.
 * Only what starts below the fold is hidden, and only once JavaScript is running, so nothing is
 * ever invisible without it.
 */
export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fold = window.innerHeight;
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
      (el) => el.getBoundingClientRect().top > fold * 0.92,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('in');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const el of els) {
      const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => els.includes(c as HTMLElement)) : [];
      el.style.setProperty('--d', `${Math.min(5, Math.max(0, sibs.indexOf(el))) * 70}ms`);
      el.classList.add('rv');
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return null;
}

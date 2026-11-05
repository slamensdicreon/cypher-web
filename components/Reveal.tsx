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
    const show = (el: Element) => {
      el.classList.add('in');
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && show(e.target)),
      { rootMargin: '0px 0px -6% 0px' },
    );
    // At the bottom of the page there is nothing left to scroll, so anything still waiting shows.
    const atEnd = () => {
      if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 80) return;
      els.forEach((el) => !el.classList.contains('in') && show(el));
      window.removeEventListener('scroll', atEnd);
    };
    window.addEventListener('scroll', atEnd, { passive: true });
    for (const el of els) {
      const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => els.includes(c as HTMLElement)) : [];
      el.style.setProperty('--d', `${Math.min(5, Math.max(0, sibs.indexOf(el))) * 70}ms`);
      el.classList.add('rv');
      io.observe(el);
    }
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', atEnd);
    };
  }, []);
  return null;
}

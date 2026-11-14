'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CtaLink from '@/components/site/CtaLink';
import { Arrow, Cross, EyeMark } from '@/components/site/Marks';

const ITEMS = [
  { href: '/', name: 'Home', line: 'Your whole marketing roadmap, live in a week.' },
  { href: '/how-it-works', name: 'How it works', line: 'Here’s how we work together. You stay in charge of the brand.' },
  { href: '/playbooks', name: 'Playbooks', line: 'Pick an outcome. There’s a playbook for it.' },
  { href: '/platforms', name: 'Platforms', line: 'Sitecore, Optimizely, Contentful, or whatever you run.' },
  { href: '/answers', name: 'Answers', line: 'Straight answers to what marketers ask about builds, migrations and launches.' },
] as const;

/**
 * The right of the header: the line, and the menu button. The menu opens full screen on the
 * shell's ink: the pages as big links, the page you're on marked with a coral dot, and the one
 * thing that's yours, a demo. Escape or Close shuts it; the page behind doesn't scroll.
 */
export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const path = usePathname() || '/';
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const button = opener.current;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closer.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener('keydown', onKey);
      button?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="bl-top-r">
      <span className="bl-spoon">there is no spoon.</span>
      <button ref={opener} type="button" className="bl-burger" aria-expanded={open} aria-controls="site-menu" aria-label="Open the menu" onClick={() => setOpen(true)}>
        <span className="bl-burger-word" aria-hidden="true">Menu</span>
        <span className="bl-burger-icon" aria-hidden="true"><i /><i /></span>
      </button>

      {open && (
        <div id="site-menu" className="bl-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="bl-menu-in">
            <div className="bl-menu-top">
              <Link className="bl-mark" href="/" aria-label="Cypher, home" onClick={close}>
                <EyeMark state="resting" size={30} tone="shell" />cypher
              </Link>
              <div className="bl-top-r">
                <span className="bl-spoon">there is no spoon.</span>
                <button ref={closer} type="button" className="bl-burger bl-close" aria-label="Close the menu" onClick={close}>
                  <span className="bl-burger-word" aria-hidden="true">Close</span>
                  <span className="bl-close-x" aria-hidden="true"><Cross /></span>
                </button>
              </div>
            </div>

            <div className="bl-menu-body">
              <nav className="bl-menu-nav" aria-label="Site">
                <ol>
                  {ITEMS.map((it) => {
                    const here = it.href === '/' ? path === '/' : path.startsWith(it.href);
                    return (
                      <li key={it.href}>
                        <Link className="bl-menu-link" href={it.href} aria-current={here ? 'page' : undefined} onClick={close}>
                          <span className="bl-menu-text">
                            <span className="bl-menu-name">{it.name}{here && <span className="bl-menu-dot" aria-hidden="true" />}</span>
                            <span className="bl-menu-line">{it.line}</span>
                          </span>
                          <span className="bl-menu-arrow" aria-hidden="true"><Arrow /></span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <aside className="bl-menu-card" aria-label="Book a demo">
                <span className="bl-halo bl-halo-menu"><EyeMark state="needs" size={60} /></span>
                <p className="bl-menu-voice">One thing is yours: <b>see it on your site.</b></p>
                <p className="bl-menu-sub">Thirty minutes. I’ll rebuild your homepage on your platform while you watch.</p>
                {/* Closes after the link has counted the click and started the navigation. */}
                <span className="bl-menu-cta" onClick={close}>
                  <CtaLink href="/demo" label="menu" className="bl-btn bl-btn-white">Book a demo</CtaLink>
                </span>
              </aside>
            </div>

            <div className="bl-menu-foot">
              <span>Ignorance is bliss.</span>
              <span className="bl-menu-legal">
                <Link href="/glossary" onClick={close}>Glossary</Link>
                <Link href="/resources" onClick={close}>Checklists</Link>
                <Link href="/terms" onClick={close}>Terms of Use</Link>
                <Link href="/privacy" onClick={close}>Privacy</Link>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

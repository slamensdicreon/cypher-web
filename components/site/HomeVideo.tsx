'use client';

import { useEffect, useRef, useState } from 'react';

type Cut = { src: string; poster: string };

/** Under the hood, 42 seconds, silent: the 16:9 cut on wide screens, the square cut on phones. */
const WIDE: Cut = { src: '/video/under-the-hood-1080.mp4', poster: '/video/under-the-hood.jpg' };
const SQUARE: Cut = { src: '/video/under-the-hood-square.mp4', poster: '/video/under-the-hood-square.jpg' };
const PHONE = '(max-width: 699px)';

/**
 * The home page's video. Only the cut for this screen is loaded; until it is, the frame shows that
 * cut's poster from CSS, so nothing loads twice. It loops without sound, always has a pause button
 * (anything that moves for more than five seconds needs one), and doesn't start on its own for
 * people who prefer less motion.
 */
export default function HomeVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [cut, setCut] = useState<Cut | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const pick = () => setCut(mq.matches ? SQUARE : WIDE);
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !cut) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.play().catch(() => setPlaying(false));
  }, [cut]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure className="bl-video">
      {cut && (
        <video
          key={cut.src}
          ref={ref}
          src={cut.src}
          poster={cut.poster}
          muted
          loop
          playsInline
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label="Under the hood: the eye dives into the Floor, where Cypher’s twenty-one specialists work; Bliss and Everything; a screen for every part of a build; it plans it, builds it, checks it and fixes it; you make three decisions."
        />
      )}
      <button type="button" className="bl-video-toggle" onClick={toggle} aria-label={playing ? 'Pause the video' : 'Play the video'}>
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
        )}
        <span>{playing ? 'Pause' : 'Play'}</span>
      </button>
    </figure>
  );
}

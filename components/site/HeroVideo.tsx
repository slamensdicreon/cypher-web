'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The home page's opening: Under the hood, silent, on a loop. A lighter file on phones, a pause
 * button always (anything that moves for more than five seconds needs one), and no autoplay for
 * people who prefer less motion: they get the poster and a play button.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(window.matchMedia('(max-width: 700px)').matches ? '/video/under-the-hood-540.mp4' : '/video/under-the-hood-1080.mp4');
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [src]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <figure className="hero-video">
      <video
        ref={ref}
        src={src ?? undefined}
        poster="/video/under-the-hood.jpg"
        muted
        loop
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Under the hood: the eye dives into the Floor, where Cypher's twenty-one specialists work; Bliss and Everything; a screen for every part of a build; it plans it, builds it, checks it and fixes it; you make three decisions."
      />
      <button type="button" className="hv-toggle" onClick={toggle} aria-label={playing ? 'Pause the video' : 'Play the video'}>
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

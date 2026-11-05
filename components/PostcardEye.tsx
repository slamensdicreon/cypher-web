'use client';

import { useRef } from 'react';
import LivingEye from './LivingEye';

/** The hero eye at postcard scale: halo, well and the living eye; a still one for print. */
export default function PostcardEye() {
  const halo = useRef<HTMLSpanElement>(null);
  return (
    <div className="pc-eye">
      <span className="halo" ref={halo} aria-hidden="true" />
      <span className="pc-well" aria-hidden="true" />
      <LivingEye variant="hero" className="pc-live" halo={halo} />
      <svg className="pc-static" viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="36" cy="36" r="31" fill="#e8553d" />
        <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
        <circle cx="36" cy="36" r="7" fill="#141433" />
      </svg>
    </div>
  );
}

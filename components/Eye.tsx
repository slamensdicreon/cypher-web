'use client';

import { useRef } from 'react';
import LivingEye from './LivingEye';

/** The hero eye: the halo, the well, and the living eye itself. */
export default function Eye() {
  const halo = useRef<HTMLSpanElement>(null);
  return (
    <div className="eyewrap">
      <span className="halo" ref={halo} aria-hidden="true" />
      <span className="eye-well" aria-hidden="true" />
      <LivingEye variant="hero" className="eye" label="Cypher is watching" halo={halo} />
    </div>
  );
}

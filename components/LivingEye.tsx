'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { EyeEngine, HERO_GEO, dialGeo, draw, rest } from '@/lib/eyeEngine';

type Props = {
  /** `hero`: the coral eye with a mind of its own. `dial`: the interest dial, morphing by level. */
  variant: 'hero' | 'dial';
  /** For the dial: the level, continuous from 0 to 3. */
  level?: number;
  className?: string;
  /** Accessible name; without one the eye is decorative. */
  label?: string;
  /** The hero's halo, which breathes and follows the ball. */
  halo?: RefObject<HTMLElement | null>;
};

/**
 * One eye, drawn flat and moved by springs (see lib/eyeEngine.ts). The first frame is rendered
 * on the server at rest; after that the engine writes the attributes directly, every frame.
 */
export default function LivingEye({ variant, level = 1, className, label, halo }: Props) {
  const clipId = `eye${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  // Frozen: React must not overwrite what the engine draws on later renders.
  const [first] = useState(() => draw(rest(variant === 'hero' ? HERO_GEO : dialGeo(level))));
  const svg = useRef<SVGSVGElement>(null);
  const ball = useRef<SVGEllipseElement>(null);
  const look = useRef<SVGGElement>(null);
  const almond = useRef<SVGPathElement>(null);
  const clip = useRef<SVGPathElement>(null);
  const pupil = useRef<SVGEllipseElement>(null);
  const engine = useRef<EyeEngine | null>(null);
  const levelRef = useRef(level);
  levelRef.current = level;

  useEffect(() => {
    const e = new EyeEngine(
      {
        svg: svg.current!,
        ball: ball.current!,
        look: look.current!,
        almond: almond.current!,
        clip: clip.current!,
        pupil: pupil.current!,
        halo: halo?.current,
      },
      variant === 'hero' ? { geo: HERO_GEO, wander: 'hero' } : { level: levelRef.current, wander: 'dial' },
    );
    engine.current = e;
    return () => e.destroy();
  }, [variant, halo]);

  useEffect(() => {
    engine.current?.setLevel(level);
  }, [level]);

  return (
    <svg
      ref={svg}
      className={className}
      viewBox="0 0 72 72"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <clipPath id={clipId}>
          <path ref={clip} d={first.d} />
        </clipPath>
      </defs>
      <ellipse ref={ball} cx="36" cy="36" rx="31" ry="31" fill={first.bg} transform={first.ballT} />
      <g ref={look} transform={first.lookT}>
        <path
          ref={almond}
          d={first.d}
          fill="#ffffff"
          fillOpacity={first.fo}
          stroke="#ffffff"
          strokeWidth={first.sw}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <g clipPath={`url(#${clipId})`}>
          <ellipse ref={pupil} cx="0" cy="0" rx={first.pr} ry={first.pr} fill={first.pc} transform={first.pupilT} />
        </g>
      </g>
    </svg>
  );
}

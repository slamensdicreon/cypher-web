import { HERO_GEO, draw, type RGB } from '@/lib/eyeEngine';
import type { EyeState } from '@/lib/postcards';

/**
 * The eye, frozen in one pose, for print. Drawn by the same function as the living eye, so a
 * still card is exactly a frame the live one could hold.
 */
export default function StaticEye({ id, state, ball, pupil }: { id: string; state: EyeState; ball: RGB; pupil: RGB }) {
  const d = draw({
    geo: { ...HERO_GEO, bg: ball, pc: pupil },
    gx: state.gx,
    gy: state.gy,
    open: state.open,
    pr: state.pr,
    bx: state.gx * 0.45,
    by: state.gy * 0.45,
    bvx: 0,
    bvy: 0,
  });
  const clip = `eye-${id}`;
  return (
    <svg className="pc-svg" viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <path d={d.d} />
        </clipPath>
      </defs>
      <ellipse cx="36" cy="36" rx="31" ry="31" fill={d.bg} transform={d.ballT} />
      <g transform={d.lookT}>
        <path d={d.d} fill="#ffffff" fillOpacity={d.fo} stroke="#ffffff" strokeWidth={d.sw} strokeLinejoin="round" strokeLinecap="round" />
        <g clipPath={`url(#${clip})`}>
          <ellipse cx="0" cy="0" rx={d.pr} ry={d.pr} fill={d.pc} transform={d.pupilT} />
        </g>
      </g>
    </svg>
  );
}

import { ImageResponse } from 'next/og';
import { EYE_COLORS, THEMES } from './cardStyle';
import { HERO_GEO, draw } from './eyeEngine';
import { EYE, USE_CASES, type Postcard } from './postcards';
import { fonts } from './shareImage';

/** A card as a square social ad: 1080 × 1080 PNG, the size Instagram, LinkedIn, Facebook and X take. */

export const AD_SIZE = 1080;
export const AD_CARDS: Postcard[] = USE_CASES.flatMap((u) => u.cards);
export const adFile = (id: string) => `cypher-${id}.png`;
export const idFromFile = (file: string) => file.replace(/^cypher-/, '').replace(/\.png$/, '');

/** The headline gets smaller as it gets longer, so every ad keeps the same rhythm. */
const lineSize = (line: string) => (line.length <= 40 ? 96 : line.length <= 52 ? 86 : line.length <= 62 ? 78 : 70);

function Eye({ c, size }: { c: Postcard; size: number }) {
  const t = THEMES[c.theme];
  const { ball, pupil } = EYE_COLORS[c.theme];
  const s = EYE[c.eye];
  const d = draw({ geo: { ...HERO_GEO, bg: ball, pc: pupil }, gx: s.gx, gy: s.gy, open: s.open, pr: s.pr, bx: s.gx * 0.45, by: s.gy * 0.45, bvx: 0, bvy: 0 });
  const inner = size * 0.68;
  return (
    <div style={{ width: size, height: size, borderRadius: 9999, background: t.halo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: size * 0.78, height: size * 0.78, borderRadius: 9999, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={inner} height={inner} viewBox="0 0 72 72">
          <defs>
            <clipPath id="lid">
              <path d={d.d} />
            </clipPath>
          </defs>
          <ellipse cx="36" cy="36" rx="31" ry="31" fill={d.bg} transform={d.ballT} />
          <g transform={d.lookT}>
            <path d={d.d} fill="#ffffff" fillOpacity={d.fo} stroke="#ffffff" strokeWidth={d.sw} strokeLinejoin="round" strokeLinecap="round" />
            <g clipPath="url(#lid)">
              <ellipse cx="0" cy="0" rx={d.pr} ry={d.pr} fill={d.pc} transform={d.pupilT} />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export async function socialAd(c: Postcard) {
  const t = THEMES[c.theme];
  const size = lineSize(c.line);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: t.bg, color: t.fg, fontFamily: 'Jakarta', padding: '84px 92px 80px' }}>
        <Eye c={c} size={330} />
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 64, fontSize: size, fontWeight: 800, lineHeight: 1.02, letterSpacing: -size * 0.045 }}>
          {c.line}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 28, fontSize: 46, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.1, color: t.pay }}>
          {c.payoff}
        </div>
        <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -2 }}>cypher</span>
            <span style={{ fontSize: 30, fontWeight: 500, color: t.muted, marginTop: 6 }}>ignoranceisbliss.ai</span>
          </div>
          <span style={{ display: 'flex', fontSize: 30, fontWeight: 500, color: t.muted, textAlign: 'right', maxWidth: 580, justifyContent: 'flex-end' }}>
            {c.kicker}
          </span>
        </div>
      </div>
    ),
    { width: AD_SIZE, height: AD_SIZE, fonts: await fonts() },
  );
}

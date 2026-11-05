import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/** The link preview: what Slack, LinkedIn, X, iMessage, WhatsApp and Teams show when the site is shared. */

export const SHARE_ALT = 'Ignorance is bliss. Cypher’s eye, watching. Twenty-five companies, selected, not sold to.';
export const SHARE_SIZE = { width: 1200, height: 630 };

const INK = '#141433';
const CORAL = '#e8553d';
const SOFT = '#d6d0f5';
const MUTED = '#b7a6ff';

async function fonts() {
  const dir = join(process.cwd(), 'assets', 'fonts');
  const [medium, extraBold] = await Promise.all([
    readFile(join(dir, 'PlusJakartaSans-Medium.ttf')),
    readFile(join(dir, 'PlusJakartaSans-ExtraBold.ttf')),
  ]);
  return [
    { name: 'Jakarta', data: medium, weight: 500 as const, style: 'normal' as const },
    { name: 'Jakarta', data: extraBold, weight: 800 as const, style: 'normal' as const },
  ];
}

/** The eye, glancing toward the words: the halo, the ink well, the coral ball, the almond, the pupil. */
function EyeMark({ size }: { size: number }) {
  const well = size * 0.82;
  const ball = size * 0.6;
  return (
    <div style={{ width: size, height: size, borderRadius: 9999, background: 'rgba(232,85,61,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: well, height: well, borderRadius: 9999, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={ball} height={ball} viewBox="0 0 72 72">
          <circle cx="36.8" cy="36" r="31" fill={CORAL} />
          <path d="M22 35 Q40.5 19.5 58.5 35 Q40.5 50.5 22 35 Z" fill="#ffffff" />
          <circle cx="44.5" cy="35" r="7.4" fill={INK} />
        </svg>
      </div>
    </div>
  );
}

export async function shareImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: INK, color: '#ffffff', fontFamily: 'Jakarta', padding: '0 80px 0 64px', position: 'relative' }}>
        <EyeMark size={430} />
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 64, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 800, letterSpacing: -1.2, marginBottom: 30 }}>
            <svg width="34" height="34" viewBox="0 0 72 72" style={{ marginRight: 12 }}>
              <circle cx="36" cy="36" r="31" fill="#ffffff" />
              <path d="M20 36 Q36 50 52 36" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
            </svg>
            cypher
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 800, lineHeight: 0.98, letterSpacing: -4.4 }}>
            <span>Ignorance is</span>
            <span>bliss.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 31, fontWeight: 500, lineHeight: 1.3, color: SOFT, marginTop: 30, letterSpacing: -0.4 }}>
            <span>We’re not selling it.</span>
            <div style={{ display: 'flex' }}>
              We’re<span style={{ color: CORAL, fontWeight: 800, margin: '0 7px' }}>choosing</span>who gets it.
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 20, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: MUTED, marginTop: 40 }}>
            Twenty-five companies · Closes Nov 13
          </div>
        </div>
      </div>
    ),
    { ...SHARE_SIZE, fonts: await fonts() },
  );
}

/** The home-screen and iMessage icon: the eye on ink. */
export function appleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: INK }}>
        <svg width="140" height="140" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="31" fill={CORAL} />
          <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
          <circle cx="36" cy="36" r="7" fill={INK} />
        </svg>
      </div>
    ),
    { width: 180, height: 180 },
  );
}

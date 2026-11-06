import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/** The link preview: what Slack, LinkedIn, X, iMessage, WhatsApp and Teams show when the site is shared. */

export const SHARE_ALT = 'Cypher’s eye, glancing at the words: You weren’t supposed to find this. But since you did.';
export const SHARE_SIZE = { width: 1200, height: 630 };

const INK = '#141433';
const CORAL = '#e8553d';
const MUTED = '#b7a6ff';

/** The site's typeface, for images rendered on the server. */
export async function fonts() {
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
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -3.4 }}>
            <span>You weren’t</span>
            <span>supposed to</span>
            <span>find this.</span>
          </div>
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 800, letterSpacing: -0.8, color: CORAL, marginTop: 22 }}>But since you did.</div>
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 500, color: MUTED, marginTop: 40 }}>ignoranceisbliss.ai</div>
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

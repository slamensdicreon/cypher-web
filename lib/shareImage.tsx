import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * The link preview: what Slack, LinkedIn, X, iMessage, WhatsApp and Teams show when a page is
 * shared. It looks like the site: the light ground, the eye in its halo, and the page's own line in
 * Cypher's voice (light, then bold).
 */

export const SHARE_ALT = 'Cypher’s eye beside the words: Your whole marketing roadmap, live in a week. You make three decisions.';
export const PAGE_ALT = 'Cypher’s eye beside the page’s headline.';
export const SHARE_SIZE = { width: 1200, height: 630 };

const INK = '#141433';
const BLISS = '#f6f5fc';
const CORAL = '#e8553d';
const HALO = '#fbd9d1';
const TEXT_3 = '#6a6889';

/** The site's typeface, for images rendered on the server. */
export async function fonts() {
  const dir = join(process.cwd(), 'assets', 'fonts');
  const [light, medium, bold, extraBold] = await Promise.all(
    ['Light', 'Medium', 'Bold', 'ExtraBold'].map((w) => readFile(join(dir, `PlusJakartaSans-${w}.ttf`))),
  );
  return [
    { name: 'Jakarta', data: light, weight: 300 as const, style: 'normal' as const },
    { name: 'Jakarta', data: medium, weight: 500 as const, style: 'normal' as const },
    { name: 'Jakarta', data: bold, weight: 700 as const, style: 'normal' as const },
    { name: 'Jakarta', data: extraBold, weight: 800 as const, style: 'normal' as const },
  ];
}

/** The eye that needs a word, in its halo, glancing toward the words. */
function HaloEye({ size }: { size: number }) {
  const well = size * 0.8;
  const ball = size * 0.56;
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: 9999, background: HALO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: well, height: well, borderRadius: 9999, background: BLISS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={ball} height={ball} viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="31" fill={CORAL} />
          <path d="M20 36 Q39 20.5 57 36 Q39 51.5 20 36 Z" fill="#ffffff" />
          <circle cx="43" cy="36" r="7.2" fill={INK} />
        </svg>
      </div>
    </div>
  );
}

/** The wordmark: the resting eye beside the word, in ink. */
function Wordmark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 800, letterSpacing: -1.3, color: INK }}>
      <svg width="34" height="34" viewBox="0 0 72 72" style={{ marginRight: 12 }}>
        <circle cx="36" cy="36" r="31" fill={INK} />
        <path d="M20 36 Q36 50 52 36" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      </svg>
      cypher
    </div>
  );
}

/** The line gets smaller as it gets longer, so every preview keeps the same rhythm. */
const lineSize = (chars: number) => (chars <= 50 ? 66 : chars <= 72 ? 58 : chars <= 96 ? 50 : chars <= 124 ? 44 : 38);

/** One preview: the eye on the left, the wordmark, the line (light, then bold) and the footer on the right. */
async function preview({ light, bold, foot }: { light: string; bold: string; foot: string }) {
  const size = lineSize(light.length + bold.length);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', background: BLISS, color: INK, fontFamily: 'Jakarta', padding: '0 76px 0 64px' }}>
        <HaloEye size={360} />
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 60, flex: 1, minWidth: 0 }}>
          <Wordmark />
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 34, fontSize: size, lineHeight: 1.06, letterSpacing: -size * 0.035 }}>
            {light && <span style={{ fontWeight: 300 }}>{light}</span>}
            {bold && <span style={{ fontWeight: 700, marginTop: light ? 6 : 0 }}>{bold}</span>}
          </div>
          <div style={{ display: 'flex', fontSize: 23, fontWeight: 500, color: TEXT_3, marginTop: 38 }}>{foot}</div>
        </div>
      </div>
    ),
    { ...SHARE_SIZE, fonts: await fonts() },
  );
}

/** The site's preview: the homepage's line. */
export function shareImage() {
  return preview({ light: 'Your whole marketing roadmap, live in a week.', bold: 'You make three decisions.', foot: 'Sitecore · Optimizely · Contentful  ·  ignoranceisbliss.ai' });
}

/** A page's preview: its own headline, so a shared link says what the page is about. */
export function pageImage(h1: { light: string; bold: string }, foot = 'ignoranceisbliss.ai') {
  return preview({ light: h1.light, bold: h1.bold, foot });
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

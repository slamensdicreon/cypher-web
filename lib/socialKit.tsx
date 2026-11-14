import { ImageResponse } from 'next/og';
import { fonts } from './shareImage';

/**
 * The social profile banners, drawn from code so they always say what the site says: the light
 * ground, the eye in its halo, and one message in Cypher's voice (light, then bold). Every network
 * gets its size, with the words inside the area that network never covers or crops.
 */

const INK = '#141433';
const BLISS = '#f6f5fc';
const CORAL = '#e8553d';
const HALO = '#fbd9d1';
const TEXT_3 = '#6a6889';

export type Variant = 'brand' | 'outcomes' | 'proof' | 'dayone';

export const VARIANTS: Record<Variant, { label: string; light: string[]; bold: string[]; sub: string }> = {
  brand: { label: 'Brand', light: ['Your whole marketing roadmap,', 'live in a week.'], bold: ['You make three decisions.'], sub: 'Sitecore · Optimizely · Contentful · or whatever you run' },
  outcomes: { label: 'Outcomes', light: ['Launch. Migrate.'], bold: ['Personalize. Optimize.'], sub: 'On the platform you already run. Your team edits it on day one.' },
  proof: { label: 'Proof', light: ['$400,000+ quoted.'], bold: ['$512 to run.'], sub: 'The cost of the run, not the price of Cypher.' },
  dayone: { label: 'Day one', light: ['Your team edits it'], bold: ['on day one.'], sub: 'No ticket. No developer. No change orders.' },
};

/**
 * Each network: its size, and the box the words and the eye sit in (left of the box clears the
 * profile photo where a network puts one over the banner; YouTube's box is its safe area for TVs,
 * desktops and phones).
 */
export const NETWORKS = [
  { key: 'linkedin-company', net: 'LinkedIn company page', w: 1128, h: 191, box: { x: 300, y: 18, w: 790, h: 155 }, variants: ['brand', 'outcomes', 'proof', 'dayone'] },
  { key: 'linkedin-personal', net: 'LinkedIn personal profile', w: 1584, h: 396, box: { x: 400, y: 44, w: 1130, h: 308 }, variants: ['brand', 'outcomes', 'proof', 'dayone'] },
  { key: 'x-header', net: 'X header', w: 1500, h: 500, box: { x: 380, y: 70, w: 1060, h: 360 }, variants: ['brand', 'outcomes', 'proof', 'dayone'] },
  { key: 'youtube', net: 'YouTube channel art', w: 2560, h: 1440, box: { x: 507, y: 508, w: 1546, h: 423 }, variants: ['brand'] },
  { key: 'facebook-cover', net: 'Facebook cover', w: 1640, h: 624, box: { x: 420, y: 90, w: 1110, h: 444 }, variants: ['brand'] },
  { key: 'bluesky-banner', net: 'Bluesky banner', w: 3000, h: 1000, box: { x: 760, y: 170, w: 2060, h: 660 }, variants: ['brand'] },
] as const satisfies readonly { key: string; net: string; w: number; h: number; box: { x: number; y: number; w: number; h: number }; variants: readonly Variant[] }[];

export type Network = (typeof NETWORKS)[number];

/** The file name for one banner, e.g. cypher-x-header-proof-1500x500.png (Brand has no variant word). */
export const bannerFile = (n: Network, v: Variant) => `cypher-${n.key}${v === 'brand' ? '' : `-${v}`}-${n.w}x${n.h}.png`;

export const BANNERS = NETWORKS.flatMap((n) => n.variants.map((v) => ({ n, v: v as Variant, file: bannerFile(n, v as Variant) })));

export async function banner(n: Network, v: Variant) {
  const m = VARIANTS[v];
  const { box } = n;
  // The eye takes at most a third of the box; the words get the rest.
  const eye = Math.round(Math.min(box.h, box.w * 0.3));
  const textW = box.w - eye - Math.round(box.h * 0.16);
  const lines = [...m.light, ...m.bold];
  const mark = Math.round(Math.min(box.h * 0.085, 40 * (box.h / 300)));
  const sub = Math.round(Math.min(box.h * 0.062, textW / (m.sub.length * 0.5)));
  const gap = box.h * 0.06;
  // Every line on one line, and the whole stack inside the box.
  const byWidth = textW / (Math.max(...lines.map((l) => l.length)) * 0.56);
  const byHeight = (box.h * 0.94 - mark * 1.2 - sub * 1.3 - gap * 2) / (lines.length * 1.06);
  const title = Math.floor(Math.min(box.h * 0.2, byWidth, byHeight));
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: BLISS, fontFamily: 'Jakarta', color: INK, position: 'relative' }}>
        <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: textW }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: mark, fontWeight: 800, letterSpacing: -mark * 0.045 }}>
              <svg width={mark * 1.1} height={mark * 1.1} viewBox="0 0 72 72" style={{ marginRight: mark * 0.35 }}>
                <circle cx="36" cy="36" r="31" fill={INK} />
                <path d="M20 36 Q36 50 52 36" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              </svg>
              cypher
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: gap, fontSize: title, lineHeight: 1.06, letterSpacing: -title * 0.035 }}>
              {m.light.map((l) => <span key={l} style={{ fontWeight: 300, whiteSpace: 'nowrap' }}>{l}</span>)}
              {m.bold.map((l) => <span key={l} style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{l}</span>)}
            </div>
            <div style={{ display: 'flex', marginTop: gap, fontSize: sub, fontWeight: 500, color: TEXT_3 }}>{m.sub}</div>
          </div>
          <div style={{ width: eye, height: eye, flexShrink: 0, borderRadius: 9999, background: HALO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: eye * 0.8, height: eye * 0.8, borderRadius: 9999, background: BLISS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={eye * 0.56} height={eye * 0.56} viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="31" fill={CORAL} />
                <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
                <circle cx="36" cy="36" r="7" fill={INK} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: n.w, height: n.h, fonts: await fonts() },
  );
}

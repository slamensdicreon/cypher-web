import { ImageResponse } from 'next/og';
import { EYE_COLORS, THEMES } from './cardStyle';
import { HERO_GEO, draw } from './eyeEngine';
import { EYE, type Postcard } from './postcards';
import { fonts } from './shareImage';

/**
 * The square social ads: 1080 × 1080 PNG, the size Instagram, LinkedIn, Facebook and X take. They
 * speak to the marketer the site speaks to, in the campaign's colours, each with a post to go with
 * it. The printed postcards keep their own copy; these are separate.
 */

export const AD_SIZE = 1080;

/** One ad: the card, the post to publish with it, and the page it links to. */
export type Ad = Postcard & { caption: string; link: string };

const ad = (id: string, theme: Ad['theme'], eye: keyof typeof EYE, line: string, payoff: string, kicker: string, link: string, caption: string): Ad => ({ id, theme, eye, line, payoff, kicker, link, caption });
const SITE = 'ignoranceisbliss.ai';

export const AD_GROUPS: { name: string; note: string; ads: Ad[] }[] = [
  {
    name: 'The line',
    note: 'What Cypher is for a marketer: the whole roadmap, three decisions, editing on day one.',
    ads: [
      ad('sa-roadmap', 'coral', 'stare', 'Your whole marketing roadmap. Live in a week.', 'You make three decisions.', 'Sitecore · Optimizely · Contentful', '/',
        `The new site. The campaign pages. The personalization you paid for and never switched on. Cypher builds it on your platform, your team edits it on day one, and you make about three decisions. ${SITE}`),
      ad('sa-decisions', 'ink', 'think', 'Three decisions. Not three hundred.', 'Everything technical, handled.', 'Each one with Cypher’s pick and a deadline.', '/how-it-works',
        `You approve the plan, answer the questions only a marketer can answer, and say when it goes live. Everything else is settled and on the record. ${SITE}/how-it-works`),
      ad('sa-dayone', 'lavender', 'wide', 'Your team edits it on day one.', 'No ticket. No developer.', 'Built in your platform, the way you work.', '/how-it-works',
        `Every page is built in your platform, the way your team already works. Change a headline, swap an image, launch a variant. No ticket required. ${SITE}/how-it-works`),
    ],
  },
  {
    name: 'Outcomes',
    note: 'One playbook each, linked to its page on the site.',
    ads: [
      ad('sa-personalize', 'iris', 'side', 'The personalization you paid for. Switched on.', 'Finally.', 'Audiences, variants and tests, checked first.', '/playbooks/personalization',
        `Audiences, page variants and A/B/n tests, set up in your platform and checked before you see them. ${SITE}/playbooks/personalization`),
      ad('sa-migrate', 'white', 'squint', 'Move platforms. Keep every URL.', 'Every page checked against the original.', 'Migrations, nothing left behind.', '/playbooks/migration',
        `Old platform to new, or six sites into one. Every redirect kept, every page checked against the original, before you sign off. ${SITE}/playbooks/migration`),
      ad('sa-queue', 'violet', 'roll', 'No dev queue. No change orders.', 'No waiting for next quarter.', 'Playbooks, not projects.', '/playbooks',
        `Your annual roadmap, in a week: the new site Monday, the campaign pages Tuesday, the migration Wednesday, personalization Thursday. ${SITE}/playbooks`),
    ],
  },
  {
    name: 'Proof',
    note: 'The one number we use, always with its qualifier, and the demo.',
    ads: [
      ad('sa-512', 'coral', 'wide', '$400,000+ quoted. $512 to run.', 'Think what the rest of your budget could do.', 'The cost of the run, not the price.', '/',
        `One build an agency quoted at $400,000+ cost $512 to run. That’s the cost of the run, not the price of Cypher. ${SITE}`),
      ad('sa-demo', 'ink', 'qr', 'Watch it rebuild your homepage.', 'Thirty minutes. No slides.', 'Book a demo at ignoranceisbliss.ai', '/demo',
        `Thirty minutes. Cypher rebuilds your homepage on your platform while you watch. Sitecore, Optimizely, Contentful or whatever you run. ${SITE}/demo`),
    ],
  },
];

export const AD_CARDS: Ad[] = AD_GROUPS.flatMap((g) => g.ads);
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

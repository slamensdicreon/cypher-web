/* The Cypher social kit: avatars and profile banners, each a pure function of its spec. render.mjs
 * screenshots every spec at its exact pixel size. The eye is the site's own (lib/eyeEngine.ts). */
const INK = '#141433', CORAL = '#e8553d', WHITE = '#ffffff', LAV = '#b7a6ff', LAVBG = '#dcd6f6', VIOLET = '#2c2c5a';

function eye({ x, y, d, bg, ball = [232, 85, 61], pupil = [20, 20, 51], halo = 'rgba(232,85,61,.3)', pose = {} }) {
  const p = { gx: 0, gy: 0, open: 1, pr: 7, bx: 0, by: 0, bvx: 0, bvy: 0, ...pose };
  p.bx = p.gx * 0.45; p.by = p.gy * 0.45;
  const dr = draw({ geo: { ...HERO_GEO, bg: ball, pc: pupil }, ...p });
  const id = 'c' + Math.random().toString(36).slice(2, 7);
  return `<div class="eye" style="left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;background:${halo}">
    <div class="well" style="background:${bg}"></div>
    <svg viewBox="0 0 72 72"><defs><clipPath id="${id}"><path d="${dr.d}"/></clipPath></defs>
    <ellipse cx="36" cy="36" rx="31" ry="31" fill="${dr.bg}" transform="${dr.ballT}"/>
    <g transform="${dr.lookT}"><path d="${dr.d}" fill="#fff" fill-opacity="${dr.fo}" stroke="#fff" stroke-width="${dr.sw}" stroke-linejoin="round" stroke-linecap="round"/>
    <g clip-path="url(#${id})"><ellipse cx="0" cy="0" rx="${dr.pr}" ry="${dr.pr}" fill="${dr.pc}" transform="${dr.pupilT}"/></g></g></svg></div>`;
}
const resting = (s, disc, lid) => `<svg width="${s}" height="${s}" viewBox="0 0 72 72" style="flex:none"><circle cx="36" cy="36" r="31" fill="${disc}"/><path d="M20 36 Q36 50 52 36" fill="none" stroke="${lid}" stroke-width="4" stroke-linecap="round"/></svg>`;
const grid = (gap, op = 0.5) => `<div style="position:absolute;inset:0;opacity:${op};background-image:radial-gradient(rgba(183,166,255,.2) ${gap * 0.035}px,transparent ${gap * 0.04}px);background-size:${gap}px ${gap}px"></div>`;

/** The banner lines: the brand line first, then two alternates. */
const COPY = {
  brand: { head: [['Ignorance', WHITE], ['is bliss.', CORAL]], sub: 'Twenty-one specialists and the mind that runs them. Websites, portals and migrations, built and handed over running.' },
  proof: { head: [['$400,000+ quoted.', WHITE], ['$512 to run.', CORAL]], sub: 'The cost of the run, not the price. Twenty-one specialists and the mind that runs them.' },
  learn: { head: [['It’s smarter than', WHITE], ['it was this morning.', CORAL]], sub: 'Every build rewrites its own playbook. It never asks the same question twice.' },
};

const SPECS = {
  // profile pictures: everything important inside the circle a platform crops to
  'avatar-ink': { w: 1000, h: 1000, kind: 'avatar', bg: INK },
  'avatar-coral': { w: 1000, h: 1000, kind: 'avatar', bg: CORAL, ball: [20, 20, 51], pupil: [232, 85, 61], halo: 'rgba(20,20,51,.22)' },
  'avatar-white': { w: 1000, h: 1000, kind: 'avatar', bg: WHITE, halo: 'rgba(232,85,61,.24)' },
  // profile banners; box is the area that survives the avatar overlap and mobile crops
  'linkedin-company': { w: 1128, h: 191, kind: 'banner', box: [230, 22, 1098, 169] },
  'linkedin-personal': { w: 1584, h: 396, kind: 'banner', box: [470, 44, 1534, 352] },
  'x-header': { w: 1500, h: 500, kind: 'banner', box: [330, 84, 1440, 416] },
  'youtube': { w: 2560, h: 1440, kind: 'banner', box: [507, 509, 2053, 931] },
  'facebook-cover': { w: 1640, h: 624, kind: 'banner', box: [330, 96, 1450, 528] },
  'bluesky-banner': { w: 3000, h: 1000, kind: 'banner', box: [700, 150, 2820, 850] },
};

function avatar(s) {
  const W = s.w;
  return { bg: s.bg, html: (s.bg === INK ? grid(W / 18, 0.35) : '') + eye({ x: W / 2, y: W / 2, d: W * 0.8, bg: s.bg, ball: s.ball, pupil: s.pupil, halo: s.halo }) };
}

function banner(s, variant) {
  const [x0, y0, x1, y1] = s.box, bw = x1 - x0, bh = y1 - y0;
  const c = COPY[variant];
  const d = Math.min(bh * 0.98, bw * 0.3); // the eye
  const ex = x1 - d / 2, ey = y0 + bh / 2;
  const tw = bw - d - bh * 0.25; // the text column
  // the whole column (label, two lines, the sub line on taller banners, the pill) fits the box
  const hs = Math.min(bh / (bh > 200 ? 4.6 : 3.6), tw / (variant === 'brand' ? 5.2 : 8.6));
  const ss = Math.max(hs * 0.3, 12);
  const glow = `<div style="position:absolute;left:${ex - d}px;top:${ey - d}px;width:${d * 2}px;height:${d * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(232,85,61,.22),rgba(232,85,61,0) 62%)"></div>`;
  const text = `<div style="position:absolute;left:${x0}px;top:${y0}px;width:${tw}px;height:${bh}px;display:flex;flex-direction:column;justify-content:center">
    <div style="display:flex;align-items:center;gap:${hs * 0.18}px;font-size:${hs * 0.3}px;font-weight:800;letter-spacing:-.04em;color:${WHITE};margin-bottom:${hs * 0.22}px">${resting(hs * 0.34, WHITE, INK)}cypher</div>
    ${c.head.map(([t, col]) => `<div style="font-size:${hs}px;font-weight:800;line-height:1.0;letter-spacing:-.045em;color:${col};white-space:nowrap">${t}</div>`).join('')}
    ${bh > 200 ? `<div style="margin-top:${hs * 0.28}px;font-size:${ss}px;font-weight:500;line-height:1.3;color:${LAV};max-width:${tw * 0.95}px">${c.sub}</div>` : ''}
    <div style="margin-top:${hs * 0.26}px"><span style="display:inline-block;padding:${ss * 0.38}px ${ss * 0.8}px;border-radius:999px;background:${WHITE};color:${INK};font-size:${Math.max(ss * 0.9, 11)}px;font-weight:800;letter-spacing:-.01em">ignoranceisbliss.ai</span></div></div>`;
  return { bg: INK, html: grid(Math.max(28, s.h / 12)) + glow + text + eye({ x: ex, y: ey, d, bg: INK }) };
}

window.render = (name, variant = 'brand', guides = false) => {
  const s = SPECS[name];
  const a = document.getElementById('a');
  a.style.width = s.w + 'px'; a.style.height = s.h + 'px';
  const r = s.kind === 'avatar' ? avatar(s) : banner(s, variant);
  a.style.background = r.bg;
  const g = guides && s.box ? `<div style="position:absolute;left:${s.box[0]}px;top:${s.box[1]}px;width:${s.box[2] - s.box[0]}px;height:${s.box[3] - s.box[1]}px;outline:2px dashed #00ff88"></div>` : '';
  const circle = guides && s.kind === 'avatar' ? `<div style="position:absolute;inset:0;border-radius:50%;outline:3px dashed #00ff88"></div>` : '';
  a.innerHTML = r.html + g + circle;
  return { w: s.w, h: s.h };
};
window.SPECS = SPECS;

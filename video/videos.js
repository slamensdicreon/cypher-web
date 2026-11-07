/* Cypher social videos: every frame is a pure function of time, so a render is exact and repeatable.
 * The eye is drawn by lib/eyeEngine.ts (bundled as eye.js) and driven by the same kind of damped
 * springs as the live eye on the site. Guardrails: $512 is the cost of a run, never the price;
 * no Icreon branding; every market figure carries its source on screen. */

const INK = '#141433', CORAL = '#e8553d', WHITE = '#ffffff', LAV = '#b7a6ff', LAVBG = '#dcd6f6', VIOLET = '#2c2c5a', RUST = '#a8321d', MUTED = '#6a6889';
const INK_RGB = [20, 20, 51], CORAL_RGB = [232, 85, 61];

// ---------- timing ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const p = (t, a, b) => clamp((t - a) / (b - a));
const eo = (x) => 1 - Math.pow(1 - x, 3);
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const expo = (x) => (x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2);
const back = (x) => { const c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const lerp = (a, b, x) => a + (b - a) * x;
const fmt = (n) => Math.round(n).toLocaleString('en-US');

// ---------- frame geometry ----------
let W = 1080, H = 1920, U = 1, FT = 0, F = 1350;
function geometry() {
  W = innerWidth; H = innerHeight;
  F = Math.min(H, 1350);
  // On tall screens the composition sits a little low of centre, clear of the platform's top bar.
  FT = (H - F) / 2 + (H > F ? Math.min(90, (H - F) / 4) : 0);
  U = Math.min(W / 1080, F / 1350);
}
const u = (n) => `${(n * U).toFixed(2)}px`;
/** A y position inside the safe frame, 0 (top) to 1 (bottom). */
const fy = (f) => FT + f * F;

// ---------- type ----------
/** Words rise out of a mask one after another. `segs` is a string or [text, colour] pairs. */
function words(segs, t, t0, { size = 90, color = WHITE, st = 0.055, dur = 0.5, weight = 800, lh = 1.02, ls = -0.045 } = {}) {
  const list = (typeof segs === 'string' ? [[segs, color]] : segs).flatMap(([s, c]) => s.split(' ').filter(Boolean).map((w) => [w, c]));
  const html = list.map(([w, c], i) => {
    const x = eo(p(t, t0 + i * st, t0 + i * st + dur));
    return `<span class="wm"><span style="color:${c};transform:translateY(${((1 - x) * 112).toFixed(1)}%)">${w}</span></span>`;
  }).join(' ');
  return `<div style="font-size:${u(size)};font-weight:${weight};line-height:${lh};letter-spacing:${ls}em">${html}</div>`;
}
/** Fades and lifts a group away from `t1`. */
function out(t, t1, html, d = 0.3) {
  if (t1 == null) return html;
  const x = eio(p(t, t1, t1 + d));
  if (x >= 1) return '';
  return `<div style="opacity:${1 - x};transform:translateY(${u(-28 * x)})">${html}</div>`;
}
function block(top, html, extra = '') {
  return `<div class="blk" style="top:${top}px;${extra}">${html}</div>`;
}
/** A number that slams in: scale overshoot from `t0`. */
function slam(t, t0, html, from = 1.25) {
  const x = p(t, t0, t0 + 0.45);
  const s = x <= 0 ? from : lerp(from, 1, back(x));
  const o = clamp((t - t0) / 0.08);
  return `<div style="transform-origin:0 70%;transform:scale(${s.toFixed(4)});opacity:${o}">${html}</div>`;
}

// ---------- the eye ----------
/** Deterministic PRNG for micro-saccades. */
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/**
 * Simulates the eye's springs once for the whole video. `keys` are {t, gx, gy, open, pr} targets
 * (any field may be omitted to keep the last), `blinks` are times.
 */
function simulateEye(keys, blinks, dur, fps) {
  const dt = 1 / 600, steps = Math.ceil(dur / dt) + 1, every = Math.round(1 / fps / dt);
  const S = (x, k, z) => ({ x, v: 0, k, z });
  const step = (s, target, k = s.k, z = s.z) => { const w = Math.sqrt(k); s.v += (k * (target - s.x) - 2 * z * w * s.v) * dt; s.x += s.v * dt; };
  const k0 = keys[0];
  const gx = S(k0.gx ?? 0, 520, 0.6), gy = S(k0.gy ?? 0, 520, 0.6), bx = S(0, 90, 0.5), by = S(0, 90, 0.5), op = S(k0.open ?? 1, 300, 0.85), pr = S(k0.pr ?? 7, 180, 0.42);
  const r = rng(7);
  let target = { gx: 0, gy: 0, open: 1, pr: 7, ...k0 }, ki = 0, jx = 0, jy = 0, nextJ = 0.5;
  const frames = [];
  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    while (ki + 1 < keys.length && keys[ki + 1].t <= t) { ki++; target = { ...target, ...keys[ki] }; }
    if (t >= nextJ) { jx = (r() - 0.5) * 0.07; jy = (r() - 0.5) * 0.05; nextJ = t + 0.45 + r() * 0.6; }
    const blinking = blinks.some((b) => t >= b && t < b + 0.075);
    const oT = blinking ? 0 : target.open;
    step(gx, target.gx + jx); step(gy, target.gy + jy);
    step(bx, gx.x * 0.45); step(by, gy.x * 0.45);
    if (oT < op.x) step(op, oT, 1500, 0.95); else step(op, oT, 260, 0.8);
    step(pr, target.pr);
    if (i % every === 0) frames.push({ gx: gx.x, gy: gy.x, open: Math.max(0, op.x), pr: pr.x, bx: bx.x, by: by.x, bvx: bx.v * 3, bvy: by.v * 3 });
  }
  return frames;
}
let FPS = 30;
const poseCache = {};
function pose(v, t) {
  poseCache[v.id] ??= simulateEye(v.eye.keys, v.eye.blinks, v.dur, FPS);
  const f = poseCache[v.id];
  return f[Math.min(f.length - 1, Math.round(t * FPS))];
}
/** The eye: halo, well (the page colour), the ball and almond drawn by the site's own engine. */
function eyeEl(ps, { x, y, size, bg, ball = CORAL_RGB, pupil = INK_RGB, halo = 'rgba(232,85,61,.3)', scale = 1 }) {
  const d = draw({ geo: { ...HERO_GEO, bg: ball, pc: pupil }, ...ps });
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  const s = size * U;
  return `<div class="eye" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;background:${halo};transform:scale(${scale})">
    <div class="well" style="background:${bg}"></div>
    <svg viewBox="0 0 72 72"><defs><clipPath id="${id}"><path d="${d.d}"/></clipPath></defs>
      <ellipse cx="36" cy="36" rx="31" ry="31" fill="${d.bg}" transform="${d.ballT}"/>
      <g transform="${d.lookT}"><path d="${d.d}" fill="#fff" fill-opacity="${d.fo}" stroke="#fff" stroke-width="${d.sw}" stroke-linejoin="round" stroke-linecap="round"/>
      <g clip-path="url(#${id})"><ellipse cx="0" cy="0" rx="${d.pr}" ry="${d.pr}" fill="${d.pc}" transform="${d.pupilT}"/></g></g>
    </svg></div>`;
}
/** Eye that starts big in the middle and settles top-left, as on the cards. */
function travelEye(v, t, t0, t1, { bg, big = 520, small = 260, ...rest }) {
  const x = eio(p(t, t0, t1));
  const size = lerp(big, small, x);
  const cx = lerp(W / 2, 96 * U + (small * U) / 2, x);
  const cy = lerp(H / 2, fy(0.1) + (small * U) / 2, x);
  return eyeEl(pose(v, t), { x: cx, y: cy, size, bg, ...rest });
}

// ---------- end card ----------
function wordmark(size, color = WHITE, mark = WHITE, smile = INK) {
  return `<div style="display:flex;align-items:center;font-size:${u(size)};font-weight:800;letter-spacing:-.04em;color:${color}">
    <svg width="${size * 1.1 * U}" height="${size * 1.1 * U}" viewBox="0 0 72 72" style="margin-right:${u(size * 0.36)}"><circle cx="36" cy="36" r="31" fill="${mark}"/><path d="M20 36 Q36 50 52 36" fill="none" stroke="${smile}" stroke-width="4" stroke-linecap="round"/></svg>cypher</div>`;
}
function endCard(v, t, t0, { head = [['Twenty-five companies.', WHITE], ['Not twenty-six.', CORAL]] } = {}) {
  const lt = t - t0;
  const appear = (d, html) => { const x = eo(p(lt, d, d + 0.55)); return `<div style="opacity:${x};transform:translateY(${u(30 * (1 - x))})">${html}</div>`; };
  const eye = eyeEl(pose(v, t), { x: W / 2, y: fy(0.2), size: 330, bg: INK, scale: lerp(0.6, 1, back(p(lt, 0, 0.5))) });
  const body = `<div style="text-align:center">
      ${appear(0.15, `<div style="display:flex;justify-content:center">${wordmark(56)}</div>`)}
      <div style="height:${u(56)}"></div>
      ${head.map(([txt, c], i) => words([[txt, c]], lt, 0.35 + i * 0.22, { size: 96, st: 0.07 })).join('')}
      <div style="height:${u(52)}"></div>
      ${appear(0.95, `<div style="font-size:${u(50)};color:${LAV};letter-spacing:-.02em">ignoranceisbliss.ai</div>`)}
      ${appear(1.15, `<div style="font-size:${u(34)};font-weight:500;color:${LAV};opacity:.8;margin-top:${u(14)}">Selection closes Friday, November 13.</div>`)}
    </div>`;
  return { bg: INK, html: eye + block(fy(0.38), body, 'text-align:center') };
}

/** A hard cut with a quick colour wipe from below between two scene renders. */
function wipe(t, t0, a, b, d = 0.22) {
  if (t < t0) return a();
  const x = eio(p(t, t0, t0 + d));
  const B = b();
  if (x >= 1) return B;
  const A = a();
  return { bg: A.bg, html: `<div class="layer" style="background:${A.bg}">${A.html}</div><div class="layer" style="background:${B.bg};clip-path:inset(${((1 - x) * 100).toFixed(2)}% 0 0 0)">${B.html}</div>` };
}

// ================= the videos =================
const VIDEOS = {};

/* 1. The receipt: $400,000+ rolls down to $512. */
VIDEOS.receipt = {
  id: 'receipt', title: 'The receipt', dur: 15,
  eye: {
    keys: [{ t: 0, gx: 0, gy: 0, open: 0, pr: 7 }, { t: 0.45, open: 1 }, { t: 1.25, gx: -0.9, gy: 0.1 }, { t: 1.8, gx: 0, gy: 0 },
      { t: 2.6, gx: 0.55, gy: 0.75 }, { t: 4.3, gx: 0.7, gy: 0.85, pr: 6.2 }, { t: 6.4, gx: 0.45, gy: 0.7, open: 1.08, pr: 9.6 },
      { t: 7.4, open: 1, pr: 7.4 }, { t: 9.0, gx: 0.8, gy: 0.1, open: 0.55, pr: 6.4 }, { t: 11, gx: 0, gy: 0.05, open: 1, pr: 7.2 }],
    blinks: [3.4, 8.2, 12.9],
  },
  frame(t) {
    if (t >= 10.8) return wipe(t, 10.8, () => this.main(t), () => endCard(this, t, 11.0));
    return this.main(t);
  },
  main(t) {
    const eye = travelEye(this, t, 1.9, 2.5, { bg: INK });
    const top = fy(0.43);
    const rolling = p(t, 4.9, 6.4);
    const val = lerp(400000, 512, expo(rolling));
    const done = t >= 6.4;
    const num = `${'$'}${fmt(val)}${rolling < 0.2 ? '<span style="opacity:' + (1 - rolling * 5) + '">+</span>' : ''}`;
    const strike = t < 4.9 ? `<div style="position:absolute;left:-2%;top:52%;height:${u(18)};background:${CORAL};width:${(eio(p(t, 4.1, 4.45)) * 104).toFixed(1)}%;border-radius:${u(9)}"></div>` : '';
    const labelA = out(t, 4.75, words('An agency quoted', t, 2.4, { size: 56, color: LAV, weight: 800, ls: -0.02 }), 0.2);
    const labelB = t >= 4.85 ? words('Cypher ran it for', t, 4.9, { size: 56, color: LAV, ls: -0.02 }) : '';
    const bigColor = done ? CORAL : WHITE;
    const big = t < 2.7 ? '' : slam(t, done ? 6.4 : 2.7, `<div class="tight" style="position:relative;display:inline-block;font-size:${u(186)};color:${bigColor};font-variant-numeric:tabular-nums">${num}${strike}</div>`, done ? 1.18 : 1.12);
    const l1 = out(t, 8.8, words([['The cost of the run.', WHITE]], t, 7.0, { size: 76 }) + words([['Not the price.', CORAL]], t, 7.45, { size: 76 }));
    const l2 = t >= 9.0 ? words([['We have the receipts.', WHITE]], t, 9.1, { size: 76 }) : '';
    return {
      bg: INK,
      html: eye + block(top, `<div style="position:relative;height:${u(70)}">${labelA}${labelB ? `<div style="position:absolute;inset:0">${labelB}</div>` : ''}</div>${big}<div style="height:${u(44)}"></div><div style="position:relative">${l1}<div style="position:absolute;top:0;left:0;right:0">${l2}</div></div>`),
    };
  },
};

/* 2. You weren't supposed to see this. */
VIDEOS.unseen = {
  id: 'unseen', title: 'You weren’t supposed to see this', dur: 15,
  eye: {
    keys: [{ t: 0, gx: 0, gy: 0.1, open: 0, pr: 7 }, { t: 1.55, open: 1.1, pr: 9.8, gy: 0 }, { t: 2.3, open: 1, pr: 7.2 },
      { t: 2.45, gx: -1, gy: 0.15 }, { t: 2.95, gx: 1, gy: 0.15 }, { t: 3.45, gx: 0, gy: 0 }, { t: 4.0, gx: 0.5, gy: 0.8 },
      { t: 6.0, gx: 0.6, gy: -0.7 }, { t: 7.0, gx: 0.5, gy: 0.8 }, { t: 7.9, gx: -0.95, gy: 0.05, open: 0.72, pr: 6.6 },
      { t: 10.3, gx: 0, gy: 0, open: 1, pr: 7.4 }],
    blinks: [5.1, 9.6, 13.4],
  },
  frame(t) {
    if (t >= 11.8) return wipe(t, 11.8, () => this.main(t), () => endCard(this, t, 12.0, { head: [['Look closer.', WHITE]] }));
    return this.main(t);
  },
  main(t) {
    const top = fy(0.43);
    // typed hook under the closed eye, then the eye moves up and the story runs
    const eye = travelEye(this, t, 3.5, 4.1, { bg: INK, big: 460 });
    const hook = 'You weren’t supposed to see this.';
    const n = Math.floor(clamp((t - 0.25) / 1.35) * hook.length);
    const curOn = t < 2.0 ? Math.floor(t * 2.4) % 2 === 0 || n < hook.length : false;
    const typed = `<div class="tight" style="font-size:${u(76)};color:${WHITE};text-align:center">${hook.slice(0, n)}<span class="cur" style="background:${curOn ? CORAL : 'transparent'}"></span></div>`;
    const hookEl = out(t, 3.35, typed);
    const hookBlock = t < 3.7 ? block(fy(0.78), hookEl, 'text-align:center') : '';
    const s1 = t >= 3.9 ? out(t, 5.75, words('All week, you’ll hear what AI might do someday.', t, 4.1, { size: 84 })) : '';
    const s2 = t >= 5.9 ? out(t, 7.65, words([['Something here', WHITE], ['already does it.', CORAL]], t, 6.0, { size: 96 })) : '';
    const no = (txt, t0) => words(txt, t, t0, { size: 96, color: t0 < 9 ? WHITE : CORAL });
    const s3 = t >= 7.8 ? out(t, 10.1, no('No booth.', 7.9) + no('No keynote.', 8.45) + no('No announcement.', 9.0)) : '';
    const s4 = t >= 10.25 ? words([['Twenty-five companies', WHITE], ['get it.', CORAL]], t, 10.35, { size: 96 }) : '';
    return { bg: INK, html: eye + hookBlock + block(top, `<div style="position:relative">${s1}<div style="position:absolute;top:0;left:0;right:0">${s2}</div><div style="position:absolute;top:0;left:0;right:0">${s3}</div><div style="position:absolute;top:0;left:0;right:0">${s4}</div></div>`) };
  },
};

/* 3. The numbers: hard colour cuts, one fact per beat. */
const NUM_SCENES = [
  { t: 0.0, bg: CORAL, n: 21, big: '21', fg: INK, line: [['specialists.', WHITE]] },
  { t: 1.9, bg: INK, eye: true, big: '1', fg: CORAL, line: [['mind runs them.', WHITE]] },
  { t: 3.8, bg: LAVBG, n: 3, big: '3', fg: INK, line: [['decisions.', INK], ['Yours.', RUST]] },
  { t: 5.7, bg: WHITE, big: '0', fg: CORAL, line: [['change orders.', INK]] },
  { t: 7.6, bg: VIOLET, big: '1 week.', fg: WHITE, size: 230, line: [['Your annual roadmap.', LAV]] },
  { t: 9.5, bg: CORAL, n: 225000, big: '225,000', fg: INK, size: 210, line: [['events logged.', WHITE], ['Replay any of them.', INK]] },
];
VIDEOS.numbers = {
  id: 'numbers', title: 'The numbers', dur: 15.5,
  eye: {
    keys: [{ t: 0, gx: 0, gy: 0, open: 1, pr: 7 }, { t: 2.0, gx: 0.5, gy: 0.75 }, { t: 3.0, gx: 0, gy: 0, pr: 8.6 }, { t: 3.6, pr: 7 },
      { t: 11.7, gx: 0, gy: 0, open: 1, pr: 7.4 }, { t: 13.2, gx: -0.6, gy: 0.2 }, { t: 13.8, gx: 0, gy: 0 }],
    blinks: [2.7, 12.6, 14.6],
  },
  scene(i, t) {
    const s = NUM_SCENES[i];
    const lt = t - s.t;
    const size = s.size ?? 420;
    let txt = s.big;
    if (s.n != null) txt = fmt(lerp(0, s.n, eo(p(lt, 0.05, 0.55))));
    const big = slam(t, s.t + 0.06, `<div class="tight" style="font-size:${u(size)};color:${s.fg};font-variant-numeric:tabular-nums">${txt}</div>`, 1.22);
    const line = words(s.line, lt, 0.35, { size: 92, st: 0.08 });
    const eye = s.eye ? eyeEl(pose(this, t), { x: 96 * U + 130 * U, y: fy(0.12) + 130 * U, size: 260, bg: INK }) : '';
    return { bg: s.bg, html: eye + block(fy(s.eye ? 0.42 : 0.3), big + `<div style="height:${u(20)}"></div>` + line) };
  },
  frame(t) {
    if (t >= 11.5) return wipe(t, 11.5, () => this.scene(5, t), () => endCard(this, t, 11.7));
    let i = 0;
    while (i + 1 < NUM_SCENES.length && NUM_SCENES[i + 1].t <= t) i++;
    if (i === 0) return this.scene(0, t);
    return wipe(t, NUM_SCENES[i].t, () => this.scene(i - 1, t), () => this.scene(i, t), 0.16);
  },
};

/* 4. The math: Forrester's numbers on screen, with sources. */
VIDEOS.math = {
  id: 'math', title: 'The math', dur: 17.5,
  eye: {
    keys: [{ t: 0, gx: 0.62, gy: -0.68, open: 1, pr: 6.8 }, { t: 2.4, gx: 0.55, gy: 0.75, pr: 7 }, { t: 6.0, gx: 0.7, gy: 0.85, open: 0.9 },
      { t: 7.9, gx: 0.12, gy: -0.95, open: 0.92 }, { t: 9.0, gx: 0.55, gy: 0.75, open: 1 }, { t: 10.2, open: 1.08, pr: 9.6 },
      { t: 11.4, gx: 0.78, gy: 0.08, open: 0.55, pr: 6.4 }, { t: 13.2, gx: 0, gy: 0, open: 1, pr: 7.2 }],
    blinks: [1.6, 5.2, 9.4, 15.9],
  },
  frame(t) {
    if (t >= 13.0) return wipe(t, 13.0, () => this.main(t), () => endCard(this, t, 13.2));
    return this.main(t);
  },
  main(t) {
    const eye = eyeEl(pose(this, t), { x: 96 * U + 120 * U, y: fy(0.1) + 120 * U, size: 240, bg: WHITE, halo: 'rgba(232,85,61,.24)' });
    const top = fy(0.38);
    const label = (s, t0) => words(s, t, t0, { size: 52, color: MUTED, ls: -0.02 });
    const fig = (s, t0, c = INK, size = 190) => slam(t, t0, `<div class="tight" style="font-size:${u(size)};color:${c};font-variant-numeric:tabular-nums">${s}</div>`, 1.12);
    const src = (s, t0, t1) => out(t, t1, `<div style="opacity:${eo(p(t, t0, t0 + 0.4))};font-size:${u(29)};font-weight:500;line-height:1.35;color:${MUTED}">${s}</div>`);
    let main = '', caption = '';
    if (t < 2.5) main = out(t, 2.3, words([['What does an XM Cloud migration', INK], ['cost?', CORAL]], t, 0.2, { size: 104 }), 0.2);
    else if (t < 5.9) {
      const v = lerp(0, 258500, eo(p(t, 2.75, 3.4)));
      main = out(t, 5.7, label('Forrester priced a plain lift-and-shift at', 2.55) + `<div style="height:${u(18)}"></div>` + fig('$' + fmt(v), 2.75) + `<div style="height:${u(26)}"></div>` + words([['Not a redesign.', RUST], ['The same site, moved.', INK]], t, 3.7, { size: 64 }), 0.2);
      caption = src('Source: Forrester, The Total Economic Impact of Sitecore XM Cloud, July 2025. Commissioned by Sitecore.', 3.0, 5.7);
    } else if (t < 9.9) {
      const v = lerp(0, 5000, eo(p(t, 6.15, 6.8)));
      main = out(t, 9.7, label('One insurer, 23 sites, moved in', 5.95) + `<div style="height:${u(18)}"></div>` + fig(fmt(v) + ' hours', 6.15, INK, 170) + `<div style="height:${u(26)}"></div>` + words([['At partner rates:', INK], ['$750K to $1.25M.', RUST]], t, 7.4, { size: 64 }), 0.2);
      caption = src('Hours: customer-reported, Forrester TEI, July 2025. Dollars: our estimate at $150–$250 an hour.', 6.4, 9.7);
    } else {
      main = label('Cypher’s run, for a build an agency quoted at $400,000+:', 10.0) + `<div style="height:${u(18)}"></div>` + fig('$512.', 10.25, CORAL, 230) + `<div style="height:${u(26)}"></div>` + words([['The cost of the run.', INK], ['Not the price.', RUST]], t, 11.0, { size: 64 });
    }
    return { bg: WHITE, html: eye + block(top, main) + block(fy(0.8), caption) };
  },
};

// ---------- entry point for the renderer ----------
window.VIDEOS = VIDEOS;
window.renderFrame = (id, t, fps = 30) => {
  FPS = fps;
  geometry();
  const v = VIDEOS[id];
  const r = v.frame(t);
  const st = document.getElementById('stage');
  st.style.setProperty('--u', U + 'px');
  st.style.background = r.bg;
  st.innerHTML = r.html;
};

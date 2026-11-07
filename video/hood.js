/* 5. Under the hood: the eye hops up to the glass, blinks, widens, and the camera dives through the
 * pupil onto the Floor, where the twenty-one specialists are replaying their work around Cypher.
 * Then the product, one screen per beat, and the CTA. The screens are real captures of the platform
 * running against its simulator (assets/hood); the Floor is its own replay, recorded frame by frame. */

const FLOOR_BG = '#171635';
const FLOOR = { w: 2396, h: 852, frames: 168, cx: 0.5, cy: 0.468 };
/** Where Cypher's mark is (its height on the footage, 0..1) in each frame: he keeps dashing up to the Director. */
const CYPHER_Y = [0.454,0.454,0.451,0.439,0.421,0.402,0.385,0.369,0.348,0.327,0.306,0.284,0.263,0.242,0.221,0.199,0.178,0.159,0.147,0.141,0.144,0.156,0.173,0.192,0.212,0.233,0.253,0.266,0.271,0.274,0.276,0.276,0.277,0.277,0.277,0.270,0.257,0.239,0.220,0.200,0.179,0.159,0.146,0.140,0.137,0.136,0.135,0.135,0.142,0.155,0.173,0.192,0.212,0.233,0.254,0.275,0.296,0.318,0.339,0.360,0.381,0.402,0.424,0.438,0.446,0.450,0.451,0.452,0.453,0.450,0.439,0.423,0.404,0.384,0.363,0.342,0.321,0.300,0.279,0.258,0.237,0.215,0.194,0.173,0.163,0.168,0.181,0.199,0.219,0.239,0.260,0.281,0.302,0.323,0.345,0.366,0.387,0.408,0.429,0.442,0.448,0.451,0.452,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.451,0.442,0.427,0.408,0.388,0.368,0.347,0.326,0.305,0.284,0.263,0.241,0.220,0.199,0.178,0.158,0.147,0.141,0.138,0.137,0.136,0.136,0.136,0.141,0.154,0.171,0.190,0.210,0.231,0.252,0.260,0.270,0.281,0.294,0.310,0.329,0.353];
const SHOTS = [
  // label, file, focus point for the push-in, label colour
  { t: 8.9, d: 1.1, label: 'Plan.', img: 'plan', fx: 0, fy: 0.2, c: CORAL },
  { t: 10.0, d: 1.1, label: 'Team.', img: 'team', fx: 0, fy: 0.9, c: LAV },
  { t: 11.1, d: 1.1, label: 'Bliss.', img: 'bliss', fx: 0.55, fy: 0.3, c: WHITE },
  { t: 12.2, d: 1.1, label: 'Everything.', img: 'everything', fx: 0.25, fy: 0.15, c: CORAL },
  { t: 13.3, d: 1.1, label: 'Workbench.', img: 'workbench', fx: 0, fy: 0.15, c: LAV },
  { t: 14.4, d: 0.75, label: 'Needs you.', img: 'needs', fx: 0.3, fy: 0.75, c: WHITE },
  { t: 15.15, d: 0.75, label: 'What’s next.', img: 'next', fx: 0, fy: 0.2, c: CORAL },
  { t: 15.9, d: 0.75, label: 'Every task.', img: 'tasks', fx: 0, fy: 0.2, c: LAV },
  { t: 16.65, d: 0.42, label: 'Decisions.', img: 'decisions', fx: 0.4, fy: 0.4, c: WHITE, fast: true },
  { t: 17.07, d: 0.42, label: 'Every move.', img: 'activity', fx: 0.4, fy: 0.3, c: CORAL, fast: true },
  { t: 17.49, d: 0.41, label: 'Receipts.', img: 'scorecard', fx: 0.3, fy: 0.2, c: LAV, fast: true },
];
/** What it does, one word-slam per beat, in the site's own words. */
const VERBS = [
  { t: 17.9, txt: [['Plans it.', INK]], bg: CORAL },
  { t: 18.45, txt: [['Builds it.', INK]], bg: LAVBG },
  { t: 19.0, txt: [['Checks it.', INK]], bg: WHITE },
  { t: 19.55, txt: [['Fixes it.', WHITE]], bg: VIOLET },
  { t: 20.1, txt: [['Before you', WHITE], ['find it.', CORAL]], bg: INK },
  { t: 21.0, txt: [['You make', WHITE], ['three decisions.', CORAL]], bg: INK, size: 150 },
];
const CTA = 22.4;
const ASPECT = { needs: 2480 / 1320, next: 1720 / 900, tasks: 2390 / 1680, plan: 1476 / 1460, team: 2334 / 1610, bliss: 2480 / 1280, everything: 2550 / 1800, workbench: 2020 / 1560, decisions: 2550 / 660, activity: 2550 / 1800, scorecard: 2400 / 1800 };

/** 16:9 and wider get their own composition: screens on the right, labels on the left. */
const land = () => W > H * 1.3;

/** A decaying shake from `t0`: [dx, dy] in px. */
function shake(t, t0, amp = 14, d = 0.28) {
  const x = (t - t0) / d;
  if (x < 0 || x > 1) return [0, 0];
  const a = amp * U * (1 - x) * (1 - x);
  return [Math.sin(x * 52) * a, Math.cos(x * 41) * a * 0.7];
}
/** A white flash from `t0`. */
const flash = (t, t0, peak = 0.5, d = 0.14) => {
  const x = (t - t0) / d;
  return x < 0 || x > 1 ? 0 : peak * (1 - x);
};

VIDEOS.hood = {
  id: 'hood', title: 'Under the hood', dur: 30,
  eye: {
    keys: [{ t: 0, gx: -0.7, gy: 0.2, open: 0.9, pr: 7 }, { t: 0.3, gx: 0, gy: 0, open: 1 }, { t: 1.95, open: 1.12, pr: 10.5 },
      { t: 2.2, pr: 12 }, { t: 2.9, open: 1, pr: 7.2 }, { t: 22.5, gx: 0, gy: 0, open: 1, pr: 7.4 }, { t: 23.5, gx: 0.3, gy: 0.85 },
      { t: 25.1, gx: 0.2, gy: 0.9, open: 1.12, pr: 10 }, { t: 25.85, open: 1, pr: 7.4, gx: 0.15, gy: 0.95 }, { t: 27.1, gx: 0, gy: 0 },
      { t: 28.4, gx: -0.8, gy: 0.1 }, { t: 28.9, gx: 0, gy: 0 }],
    blinks: [1.62, 26.7, 28.2, 29.5],
  },

  frame(t) {
    if (t < 2.75) return this.intro(t);
    if (t < 3.15) return this.dive(t);
    if (t < 8.9) return this.floor(t);
    if (t < 17.9) return this.shots(t);
    if (t < CTA) return this.verbs(t);
    return this.cta(t);
  },

  /** Where the eye is: size, centre and squash, through two hops toward the camera. */
  eyeAt(t) {
    const hop = (t0, d, s0, s1) => {
      const q = (t - t0) / d;
      if (q < -0.18) return { s: s0, y: 0, sx: 1, sy: 1, done: false };
      if (q < 0) { const a = Math.sin(((q + 0.18) / 0.18) * Math.PI); return { s: s0, y: 0, sx: 1 + 0.12 * a, sy: 1 - 0.14 * a, done: false }; } // crouch
      if (q <= 1) { const st = Math.sin(q * Math.PI); return { s: lerp(s0, s1, eio(q)), y: -st * 130, sx: 1 - 0.08 * st, sy: 1 + 0.1 * st, done: false }; } // air
      if (q < 1.3) { const a = Math.sin(((q - 1) / 0.3) * Math.PI); return { s: s1, y: 0, sx: 1 + 0.14 * a, sy: 1 - 0.16 * a, done: true }; } // land
      return { s: s1, y: 0, sx: 1, sy: 1, done: true };
    };
    const h1 = hop(0.5, 0.42, 200, 380);
    const h = h1.done && t >= 1.0 ? hop(1.05, 0.42, 380, 640) : h1;
    return h;
  },

  eyeHtml(t, extraScale = 1, origin = '50% 50%') {
    const e = this.eyeAt(t);
    const [sx, sy] = shake(t, 1.95, 10, 0.3);
    const cx = W / 2 + sx, cy = H / 2 + e.y * U + sy;
    const el = eyeEl(pose(this, t), { x: cx, y: cy, size: e.s, bg: INK });
    return `<div class="layer" style="transform-origin:${origin};transform:scale(${extraScale})"><div class="layer" style="transform-origin:${cx}px ${cy + (e.s * U) / 2}px;transform:scale(${e.sx},${e.sy})">${el}</div></div>`;
  },

  intro(t) {
    const kicker = t > 0.2 && t < 1.9 ? `<div style="position:absolute;left:0;right:0;top:${fy(0.86)}px;text-align:center;font-size:${u(34)};font-weight:500;letter-spacing:.32em;color:${LAV};opacity:${eo(p(t, 0.2, 0.6)) * (1 - p(t, 1.6, 1.9))}">UNDER THE HOOD</div>` : '';
    // From 2.25s the camera dives into the pupil.
    const z = t < 2.25 ? 1 : Math.pow(2, 10 * p(t, 2.25, 2.75) * 0.55) ;
    return { bg: INK, html: this.eyeHtml(t, z, `${W / 2}px ${H / 2}px`) + kicker };
  },

  /** Through the pupil: the Floor opens as a circle from the centre, already zoomed on Cypher. */
  dive(t) {
    const z = Math.pow(2, 10 * 0.55) * (1 + 4 * p(t, 2.75, 3.15));
    const r = eio(p(t, 2.75, 3.12)) * Math.hypot(W, H) * 0.6;
    const back = `<div class="layer" style="background:${INK}">${this.eyeHtml(t, z, `${W / 2}px ${H / 2}px`)}</div>`;
    const fl = this.floor(t);
    return { bg: INK, html: back + `<div class="layer" style="background:${FLOOR_BG};clip-path:circle(${r.toFixed(1)}px at 50% 50%)">${fl.html}</div>` };
  },

  floor(t) {
    const ft = Math.max(0, t - 3.25);
    const n = Math.min(FLOOR.frames, Math.max(1, 1 + Math.floor(ft * 30)));
    // Camera: tight on Cypher, then a fast pull back, then a slow drift toward the Engineering pod.
    const pull = expo(p(t, 2.75, 5.0)) * 0.5 + eo(p(t, 2.75, 5.0)) * 0.5;
    const hOnScreen = lerp(5200, 1020, pull) * U * lerp(1, 0.88, eio(p(t, 5.0, 8.9)));
    const scale = hOnScreen / FLOOR.h;
    const fx = t < 7.0 ? lerp(FLOOR.cx, 0.64, eio(p(t, 4.6, 7.0))) : lerp(0.64, 0.38, eio(p(t, 7.0, 8.9)));
    // the camera rides with Cypher while it is close, then lets him go
    const fyy = lerp(CYPHER_Y[n - 1], 0.47, pull);
    const anchorY = H * 0.46;
    const left = W / 2 - fx * FLOOR.w * scale, top = anchorY - fyy * FLOOR.h * scale;
    const img = `<img src=".cache/floor/f_${String(n).padStart(4, '0')}.jpg" style="position:absolute;left:${left}px;top:${top}px;width:${FLOOR.w * scale}px;height:${FLOOR.h * scale}px">`;
    const fade = `<div class="layer" style="background:linear-gradient(180deg,${FLOOR_BG} 0%,rgba(23,22,53,0) 22%,rgba(23,22,53,0) 58%,${FLOOR_BG}ee 80%,${FLOOR_BG} 100%)"></div>`;
    const beat = (txt, t0, t1, c = WHITE) => (t >= t0 - 0.02 && t < t1 ? slam(t, t0, words(txt, t, t0, { size: 110, color: c, st: 0.04, dur: 0.3 }), 1.15) : '');
    const lines = beat('21 specialists.', 3.5, 4.7) + beat('One floor.', 4.7, 5.9) + beat([['Working', WHITE], ['together.', CORAL]], 5.9, 7.1) + beat([['Every move,', WHITE], ['on the record.', LAV]], 7.1, 8.9);
    const fl = flash(t, 3.5, 0.18) + flash(t, 4.7, 0.14) + flash(t, 5.9, 0.14) + flash(t, 7.1, 0.14);
    return {
      bg: FLOOR_BG,
      html: img + fade + block(fy(0.76), lines) + (fl ? `<div class="layer" style="background:#fff;opacity:${fl}"></div>` : ''),
    };
  },

  shots(t) {
    const L = land();
    const maxW = L ? W * 0.6 : 1010 * U, cardTop = fy(0.2), maxH = L ? H - 150 * U : Math.min(960 * U, H - cardTop - (H > F ? 400 : 40) * U);
    let html = '';
    let fl = 0, sh = [0, 0];
    const cur = SHOTS.reduce((k, s, i) => (t >= s.t ? i : k), 0);
    SHOTS.forEach((s, i) => {
      if (i > cur || i < cur - 1) return;
      const ar = ASPECT[s.img];
      let w = maxW, h = w / ar;
      if (h > maxH) h = maxH;
      const lt = t - s.t;
      const dropD = s.fast ? 0.2 : 0.3;
      const x = p(lt, 0, dropD);
      const dir = i % 2 ? 1 : -1;
      let ty = lerp(-H * 0.9, 0, x < 1 ? back(x) : 1), rot = lerp(9 * dir, 0, eo(x)), sc = lerp(1.12, 1, eo(x)), op = 1;
      if (i === cur - 1) {
        // the card underneath sinks and dims as the next lands
        const y = eio(p(t, SHOTS[cur].t, SHOTS[cur].t + dropD));
        ty = 240 * U * y; sc = lerp(1, 0.86, y); op = lerp(1, 0.25, y); rot = -4 * dir * y;
      }
      const push = 1 + (s.fast ? 0.18 : 0.42) * eio(p(lt, dropD * 0.8, s.d + 0.25));
      const cx = L ? W - 90 * U - w / 2 : W / 2, cy = L ? H / 2 : cardTop + h / 2;
      html += `<div style="position:absolute;left:${cx - w / 2}px;top:${cy - h / 2}px;width:${w}px;height:${h}px;border-radius:${u(26)};overflow:hidden;opacity:${op};
        transform:translateY(${ty}px) rotate(${rot}deg) scale(${sc});box-shadow:0 ${u(40)} ${u(90)} rgba(0,0,0,.55),0 0 0 1px rgba(183,166,255,.22)">
        <img src="assets/hood/${s.img}.jpg" style="width:100%;height:100%;object-fit:cover;object-position:top;transform-origin:${s.fx * 100}% ${s.fy * 100}%;transform:scale(${push})"></div>`;
      if (i === cur) {
        const lab = slam(t, s.t + dropD * 0.6, `<div class="tight" style="font-size:${u(s.label.length > 10 ? 132 : 160)};color:${s.c}">${s.label}</div>`, 1.35);
        html += L ? `<div style="position:absolute;left:${u(96)};width:${W * 0.3}px;top:${H / 2 - 70 * U}px">${lab.replace(/font-size:[^;]+;/, `font-size:${u(s.label.length > 10 ? 112 : 150)};`)}</div>` : block(fy(0.035), lab);
        fl = flash(t, s.t + dropD, s.fast ? 0.3 : 0.4);
        sh = shake(t, s.t + dropD, s.fast ? 10 : 16);
      }
    });
    const grid = `<div class="layer" style="opacity:.5;background-image:radial-gradient(rgba(183,166,255,.18) 1.2px,transparent 1.3px);background-size:${u(36)} ${u(36)}"></div>`;
    return { bg: INK, html: grid + `<div class="layer" style="transform:translate(${sh[0]}px,${sh[1]}px)">${html}</div>` + (fl ? `<div class="layer" style="background:#fff;opacity:${fl}"></div>` : '') };
  },

  verbs(t) {
    const scene = (i) => {
      const v = VERBS[i];
      const lines = v.txt.map(([txt, c]) => `<div class="tight" style="font-size:${u((v.size ?? 172) * (land() ? 1.35 : 1))};color:${c}">${txt}</div>`).join('');
      const [sx, sy] = shake(t, v.t + 0.06, 16);
      return { bg: v.bg, html: `<div class="layer" style="transform:translate(${sx}px,${sy}px)">${block(fy(land() ? 0.3 : 0.36), slam(t, v.t + 0.04, lines, 1.3))}</div>` };
    };
    let i = 0;
    while (i + 1 < VERBS.length && VERBS[i + 1].t <= t) i++;
    if (i === 0) return wipe(t, VERBS[0].t, () => this.shots(VERBS[0].t - 0.001), () => scene(0), 0.16);
    return wipe(t, VERBS[i].t, () => scene(i - 1), () => scene(i), 0.14);
  },

  cta(t) {
    const C = CTA;
    // the last line falls away as the eye pops back in
    const away = eio(p(t, C, C + 0.35));
    const last = away < 1 ? `<div class="layer" style="opacity:${1 - away};transform:scale(${1 - 0.4 * away})">${this.verbs(C - 0.001).html}</div>` : '';
    const eyeS = lerp(0, 1, back(p(t, C + 0.1, C + 0.55)));
    const L = land();
    const eye = eyeEl(pose(this, t), L ? { x: W * 0.25, y: H / 2, size: 560, bg: INK, scale: eyeS } : { x: W / 2, y: fy(0.15), size: 300, bg: INK, scale: eyeS });
    const [sx, sy] = shake(t, C + 2.7, 18, 0.35);
    const cs = land() ? 172 : 150;
    const lines = words('See it on', t, C + 0.7, { size: cs, st: 0.06 }) + words('your site', t, C + 1.0, { size: cs, st: 0.06 }) + words('today.', t, C + 1.3, { size: cs, st: 0.06 });
    const lit = t >= C + 2.65 ? slam(t, C + 2.7, `<div class="tight" style="font-size:${u(cs)};color:${CORAL}">Literally.</div>`, 1.5) : '';
    const pin = eo(p(t, C + 3.45, C + 3.85));
    const pulse = 1 + 0.06 * Math.max(0, Math.sin(p(t, C + 5.3, C + 5.8) * Math.PI));
    const pill = `<div style="display:inline-block;margin-top:${u(50)};padding:${u(22)} ${u(40)};border-radius:999px;background:${WHITE};color:${INK};font-size:${u(46)};letter-spacing:-.02em;opacity:${pin};transform-origin:0 50%;transform:translateY(${u(24 * (1 - pin))}) scale(${pulse})">ignoranceisbliss.ai</div>`;
    const fl = flash(t, C + 2.7, 0.45, 0.16);
    return {
      bg: INK,
      html: last + `<div class="layer" style="transform:translate(${sx}px,${sy}px)">${eye}${L ? `<div style="position:absolute;left:${W * 0.47}px;right:${u(96)};top:${H * 0.17}px">${lines + lit + pill}</div>` : block(fy(0.33), lines + lit + pill)}</div>` + (fl ? `<div class="layer" style="background:#fff;opacity:${fl}"></div>` : ''),
    };
  },
};

/* 5. Under the hood, cut to a 42-second track (about 103 BPM). Every cue below is a hit in that track:
 *
 *   0.0  quiet intro            "UNDER THE HOOD"
 *   1.29 first hit              the eye pops in; hops land on 2.12 and 2.57; blink; widen on 2.88
 *   2.95 into the punch (3.24)  the camera dives through the pupil onto Cypher on the Floor
 *   3.6  groove                 the Floor: 21 specialists, one floor, every move on the record
 *   7.72 groove, second half    the two modes, explained: Bliss, then the dial flips on 10.09 to Everything
 *  12.90 lift, a hit per beat   one screen per beat: plan, team, workbench, what's next, every task...
 *  18.15 snare roll             five flash cuts
 *  19.5  break                  "So what does it actually do?"
 *  22.23 drop                   Plans it. Builds it. Checks it. Fixes it. Before you find it.
 *  28.32                        You make / three / decisions. That's the job now.
 *  31.0  bass drops out         the eye returns: See it on your site today.
 *  32.98 biggest hit            Literally.
 *  33.56                        ignoranceisbliss.ai
 *  37.64 / 38.23 / 38.53         Cypher swallows the screen: it inhales the words, gulps, and lunges until its pupil is all there is
 *  39.5  outro                  in the dark, the resting eye and the address; fade.
 *
 * The screens are real captures of the platform running against its simulator (assets/hood); the
 * Floor is its own replay, recorded frame by frame. */

const FLOOR_BG = '#171635';
const FLOOR = { w: 2396, h: 852, frames: 168 };
/** Where Cypher's mark is (its height on the footage, 0..1) in each frame: he keeps dashing up to the Director. */
const CYPHER_Y = [0.454,0.454,0.451,0.439,0.421,0.402,0.385,0.369,0.348,0.327,0.306,0.284,0.263,0.242,0.221,0.199,0.178,0.159,0.147,0.141,0.144,0.156,0.173,0.192,0.212,0.233,0.253,0.266,0.271,0.274,0.276,0.276,0.277,0.277,0.277,0.270,0.257,0.239,0.220,0.200,0.179,0.159,0.146,0.140,0.137,0.136,0.135,0.135,0.142,0.155,0.173,0.192,0.212,0.233,0.254,0.275,0.296,0.318,0.339,0.360,0.381,0.402,0.424,0.438,0.446,0.450,0.451,0.452,0.453,0.450,0.439,0.423,0.404,0.384,0.363,0.342,0.321,0.300,0.279,0.258,0.237,0.215,0.194,0.173,0.163,0.168,0.181,0.199,0.219,0.239,0.260,0.281,0.302,0.323,0.345,0.366,0.387,0.408,0.429,0.442,0.448,0.451,0.452,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.453,0.451,0.442,0.427,0.408,0.388,0.368,0.347,0.326,0.305,0.284,0.263,0.241,0.220,0.199,0.178,0.158,0.147,0.141,0.138,0.137,0.136,0.136,0.136,0.141,0.154,0.171,0.190,0.210,0.231,0.252,0.260,0.270,0.281,0.294,0.310,0.329,0.353];

const ASPECT = { needs: 2480 / 1320, next: 1720 / 900, tasks: 2390 / 1680, plan: 1476 / 1460, team: 2334 / 1610, bliss: 2480 / 1280, everything: 2550 / 1800, workbench: 2020 / 1560, decisions: 2550 / 660, activity: 2550 / 1800, scorecard: 2400 / 1800 };

const B = 0.58; // one beat
const SHOTS = [
  { label: 'Plan.', img: 'plan', fx: 0, fy: 0.2, c: CORAL },
  { label: 'Team.', img: 'team', fx: 0, fy: 0.9, c: LAV },
  { label: 'Workbench.', img: 'workbench', fx: 0, fy: 0.15, c: WHITE },
  { label: 'What’s next.', img: 'next', fx: 0, fy: 0.2, c: CORAL },
  { label: 'Every task.', img: 'tasks', fx: 0, fy: 0.2, c: LAV },
  { label: 'Decisions.', img: 'decisions', fx: 0.4, fy: 0.4, c: WHITE },
  { label: 'Yours.', img: 'bliss', fx: 0.55, fy: 0.3, c: CORAL },
  { label: 'Every move.', img: 'activity', fx: 0.4, fy: 0.3, c: LAV },
  { label: 'Receipts.', img: 'scorecard', fx: 0.3, fy: 0.2, c: WHITE },
].map((s, i) => ({ ...s, t: 12.9 + i * B, d: B, fast: true }));
const ROLL = [18.15, 18.45, 18.74, 19.03, 19.32];
const ROLL_IMG = ['everything', 'plan', 'team', 'activity', 'needs'];
const VERBS = [
  { t: 22.23, txt: [['Plans it.', INK]], bg: CORAL },
  { t: 23.66, txt: [['Builds it.', INK]], bg: LAVBG },
  { t: 24.24, txt: [['Checks it.', INK]], bg: WHITE, punch: 24.56 },
  { t: 25.99, txt: [['Fixes it.', WHITE]], bg: VIOLET },
  { t: 26.83, txt: [['Before you', WHITE], ['find it.', CORAL]], bg: INK },
  { t: 28.32, txt: [['You make', WHITE]], bg: INK, size: 150, more: [[28.91, 'three', CORAL], [29.21, 'decisions.', CORAL]] },
  { t: 29.78, txt: [['That’s the', INK], ['job now.', INK]], bg: CORAL, punch: 30.37 },
];
const CTA = 31.0;

/** 16:9 and wider get their own composition: screens on the right, words on the left. */
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
const whiteout = (o) => (o > 0 ? `<div class="layer" style="background:#fff;opacity:${o}"></div>` : '');
const grid = () => `<div class="layer" style="opacity:.5;background-image:radial-gradient(rgba(183,166,255,.18) 1.2px,transparent 1.3px);background-size:${u(36)} ${u(36)}"></div>`;
/** A screenshot as a floating card. */
function card(img, { x, y, w, h, push = 1, fx = 0, fy = 0, extra = '' }) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${u(26)};overflow:hidden;${extra};box-shadow:0 ${u(40)} ${u(90)} rgba(0,0,0,.55),0 0 0 1px rgba(183,166,255,.22)">
    <img src="assets/hood/${img}.jpg" style="width:100%;height:100%;object-fit:cover;object-position:top;transform-origin:${fx * 100}% ${fy * 100}%;transform:scale(${push})"></div>`;
}

VIDEOS.hood = {
  id: 'hood', title: 'Under the hood', dur: 42.15,
  eye: {
    keys: [{ t: 0, gx: -0.7, gy: 0.2, open: 1, pr: 7 }, { t: 1.55, gx: 0, gy: 0 }, { t: 2.88, open: 1.12, pr: 10.5 }, { t: 3.0, pr: 12 },
      { t: 3.6, open: 1, pr: 7.2 }, { t: 19.6, gx: 0, gy: 0, open: 1, pr: 7.2 }, { t: 20.35, gx: 0.35, gy: 0.85 }, { t: 21.7, gx: 0, gy: 0, open: 1.1, pr: 9.5 },
      { t: 22.2, open: 1, pr: 7.2 }, { t: 31.1, gx: 0, gy: 0 }, { t: 31.5, gx: 0.5, gy: 0.7 }, { t: 32.98, open: 1.12, pr: 10.2 },
      { t: 33.7, open: 1, pr: 7.4, gx: 0.4, gy: 0.85 }, { t: 35.32, gx: 0, gy: 0, open: 1.1, pr: 9.6 }, { t: 36.2, open: 1, pr: 7.4 },
      { t: 36.7, gx: 0.45, gy: 0.8 }, { t: 37.5, open: 1.15, pr: 11 }, { t: 38.15, gx: 0, gy: 0 }, { t: 38.45, open: 1.12, pr: 12.5 }],
    blinks: [2.7, 34.6, 38.25],
  },

  frame(t) {
    let r;
    if (t < 3.24) r = this.intro(t);
    else if (t < 3.6) r = this.dive(t);
    else if (t < 7.72) r = this.floor(t);
    else if (t < 12.9) r = wipe(t, 7.72, () => this.floor(7.719), () => this.modes(t), 0.2);
    else if (t < 18.12) r = this.shots(t);
    else if (t < 19.5) r = this.roll(t);
    else if (t < 22.23) r = this.question(t);
    else if (t < CTA) r = this.verbs(t);
    else r = this.cta(t);
    return r;
  },

  // ---------- 0 to 3.6: the eye, the hops, the dive ----------
  eyeAt(t) {
    const hop = (t0, d, s0, s1) => {
      const q = (t - t0) / d;
      if (q < -0.35) return { s: s0, y: 0, sx: 1, sy: 1, done: false };
      if (q < 0) { const a = Math.sin(((q + 0.35) / 0.35) * Math.PI); return { s: s0, y: 0, sx: 1 + 0.12 * a, sy: 1 - 0.14 * a, done: false }; }
      if (q <= 1) { const st = Math.sin(q * Math.PI); return { s: lerp(s0, s1, eio(q)), y: -st * 130, sx: 1 - 0.08 * st, sy: 1 + 0.1 * st, done: false }; }
      if (q < 1.35) { const a = Math.sin(((q - 1) / 0.35) * Math.PI); return { s: s1, y: 0, sx: 1 + 0.14 * a, sy: 1 - 0.16 * a, done: true }; }
      return { s: s1, y: 0, sx: 1, sy: 1, done: true };
    };
    const pop = back(p(t, 1.29, 1.55));
    const h1 = hop(1.75, 0.37, 200, 380);
    const h = t >= 2.17 ? hop(2.25, 0.32, 380, 640) : h1;
    return { ...h, s: h.s * (t < 1.6 ? pop : 1) };
  },
  eyeHtml(t, zoom = 1) {
    const e = this.eyeAt(t);
    const [sx, sy] = shake(t, 2.88, 10, 0.3);
    const cx = W / 2 + sx, cy = H / 2 + e.y * U + sy;
    const el = e.s > 0.5 ? eyeEl(pose(this, t), { x: cx, y: cy, size: e.s, bg: INK }) : '';
    return `<div class="layer" style="transform-origin:${W / 2}px ${H / 2}px;transform:scale(${zoom})"><div class="layer" style="transform-origin:${cx}px ${cy + (e.s * U) / 2}px;transform:scale(${e.sx},${e.sy})">${el}</div></div>`;
  },
  intro(t) {
    const k = eo(p(t, 0.25, 0.8)) * (1 - p(t, 1.15, 1.4));
    const kicker = k > 0 ? `<div style="position:absolute;left:0;right:0;top:${H / 2 - 20 * U}px;text-align:center;font-size:${u(36)};font-weight:500;letter-spacing:.32em;color:${LAV};opacity:${k};transform:scale(${lerp(0.96, 1.04, p(t, 0.25, 1.4))})">UNDER THE HOOD</div>` : '';
    const z = t < 2.95 ? 1 : Math.pow(2, 10 * p(t, 2.95, 3.24) * 0.55);
    return { bg: INK, html: this.eyeHtml(t, z) + kicker + whiteout(flash(t, 1.29, 0.12)) };
  },
  dive(t) {
    const z = Math.pow(2, 10 * 0.55) * (1 + 4 * p(t, 3.24, 3.6));
    const r = eio(p(t, 3.24, 3.56)) * Math.hypot(W, H) * 0.6;
    return { bg: INK, html: `<div class="layer" style="background:${INK}">${this.eyeHtml(t, z)}</div><div class="layer" style="background:${FLOOR_BG};clip-path:circle(${r.toFixed(1)}px at 50% 50%)">${this.floor(t).html}</div>` };
  },

  // ---------- 3.6 to 7.7: the Floor ----------
  floor(t) {
    const n = Math.min(FLOOR.frames, Math.max(1, 1 + Math.floor(Math.max(0, t - 3.35) * 30)));
    const pull = expo(p(t, 3.24, 5.4)) * 0.5 + eo(p(t, 3.24, 5.4)) * 0.5;
    const hOnScreen = lerp(5200, 1020, pull) * U * lerp(1, 0.9, eio(p(t, 5.4, 7.72)));
    const scale = hOnScreen / FLOOR.h;
    const fx = lerp(0.5, 0.62, eio(p(t, 5.0, 7.72)));
    const fyy = lerp(CYPHER_Y[n - 1], 0.47, pull); // the camera rides with Cypher while it is close
    const left = W / 2 - fx * FLOOR.w * scale, top = H * 0.46 - fyy * FLOOR.h * scale;
    const img = `<img src=".cache/floor/f_${String(n).padStart(4, '0')}.jpg" style="position:absolute;left:${left}px;top:${top}px;width:${FLOOR.w * scale}px;height:${FLOOR.h * scale}px">`;
    const fade = `<div class="layer" style="background:linear-gradient(180deg,${FLOOR_BG} 0%,rgba(23,22,53,0) 22%,rgba(23,22,53,0) 58%,${FLOOR_BG}ee 80%,${FLOOR_BG} 100%)"></div>`;
    const beat = (txt, t0, t1, c = WHITE) => (t >= t0 - 0.02 && t < t1 ? slam(t, t0, words(txt, t, t0, { size: 110, color: c, st: 0.04, dur: 0.3 }), 1.15) : '');
    const lines = beat('21 specialists.', 4.2, 5.36) + beat('One floor.', 5.36, 6.52) + beat([['Every move,', WHITE], ['on the record.', LAV]], 6.52, 7.8);
    return { bg: FLOOR_BG, html: img + fade + block(fy(0.76), lines) + whiteout(flash(t, 4.2, 0.16) + flash(t, 5.36, 0.12) + flash(t, 6.52, 0.12)) };
  },

  // ---------- 7.7 to 12.9: Bliss and Everything, explained ----------
  modes(t) {
    const L = land();
    const flip = 10.09;
    const k = eio(p(t, flip - 0.08, flip + 0.16)); // the dial's knob
    const everything = t >= flip + 0.04;
    // the dial, as in the product's top bar
    const dw = 620 * U, dh = 100 * U, seg = dw / 2;
    const dx = L ? 96 * U : W / 2 - dw / 2, dy = L ? H * 0.16 : fy(0.015);
    const din = back(p(t, 7.75, 8.1));
    const dial = `<div style="position:absolute;left:${dx}px;top:${dy}px;width:${dw}px;height:${dh}px;border-radius:999px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(183,166,255,.28);transform:scale(${din});transform-origin:${L ? '0' : '50%'} 50%">
      <div style="position:absolute;top:${6 * U}px;bottom:${6 * U}px;left:${6 * U + k * (seg - 0 * U)}px;width:${seg - 12 * U}px;border-radius:999px;background:#fff"></div>
      <div style="position:absolute;inset:0;display:flex;font-size:${u(38)};font-weight:700;letter-spacing:-.01em">
        <div style="flex:1;display:grid;place-items:center;color:${k < 0.5 ? INK : LAV}">Bliss</div>
        <div style="flex:1;display:grid;place-items:center;color:${k >= 0.5 ? INK : LAV}">Everything</div></div></div>`;
    // the words
    const titleSize = L ? 150 : 170, lineSize = L ? 58 : 62;
    const say = (txt, t0) => words(txt, t, t0, { size: lineSize, color: LAV, weight: 500, st: 0.035, ls: -0.02, lh: 1.15 });
    const text = !everything
      ? out(t, flip - 0.12, slam(t, 7.85, `<div class="tight" style="font-size:${u(titleSize)};color:${WHITE}">Bliss.</div>`, 1.25) + `<div style="height:${u(22)}"></div>` + say('One sentence from Cypher.', 8.24) + say('Only what’s yours, with its pick.', 9.0), 0.12)
      : slam(t, flip + 0.06, `<div class="tight" style="font-size:${u(titleSize)};color:${CORAL}">Everything.</div>`, 1.25) + `<div style="height:${u(22)}"></div>` + say('Every table, metric and log.', 10.58) + say('One flick away. Never forced.', 11.4);
    const textTop = L ? dy + dh + 60 * U : fy(0.115);
    const textEl = L ? `<div style="position:absolute;left:${u(96)};width:${W * 0.36}px;top:${textTop}px">${text}</div>` : block(textTop, text);
    // the screen: the same moment in both faces, turned over on the flip
    const img = everything ? 'everything' : 'needs';
    const ar = ASPECT[img];
    const cw = L ? W * 0.55 : 1010 * U;
    const top = L ? 0 : fy(0.44);
    const maxH = L ? H - 160 * U : H - top - (H > F ? 380 : 40) * U;
    const ch = Math.min(cw / ar, maxH);
    const cx = L ? W - 90 * U - cw : W / 2 - cw / 2, cy = L ? H / 2 - ch / 2 : top;
    const cin = p(t, 7.8, 8.15);
    const turn = t < flip ? 0 : t < flip + 0.1 ? 90 * p(t, flip, flip + 0.1) : 90 * (1 - eo(p(t, flip + 0.1, flip + 0.32)));
    const push = everything ? 1 + 0.14 * eio(p(t, flip + 0.3, 12.9)) : 1 + 0.12 * eio(p(t, 8.2, flip));
    const scr = card(img, { x: cx, y: cy + (1 - back(cin)) * H * 0.6, w: cw, h: ch, push, fx: everything ? 0.25 : 0.45, fy: 0.15,
      extra: `opacity:${clamp(cin * 3)};transform:perspective(${u(2400)}) rotateY(${turn.toFixed(2)}deg)` });
    const [sx, sy] = shake(t, flip + 0.1, 14);
    const [px, py] = shake(t, 12.26, 8);
    return { bg: INK, html: grid() + `<div class="layer" style="transform:translate(${sx + px}px,${sy + py}px)">${scr}${dial}${textEl}</div>` + whiteout(flash(t, flip + 0.1, 0.3)) };
  },

  // ---------- 12.9 to 18.1: a screen per beat ----------
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
      const lt = t - s.t, dropD = 0.18;
      const x = p(lt, 0, dropD);
      const dir = i % 2 ? 1 : -1;
      let ty = lerp(-H * 0.9, 0, x < 1 ? back(x) : 1), rot = lerp(9 * dir, 0, eo(x)), sc = lerp(1.12, 1, eo(x)), op = 1;
      if (i === cur - 1) {
        const y = eio(p(t, SHOTS[cur].t, SHOTS[cur].t + dropD));
        ty = 240 * U * y; sc = lerp(1, 0.86, y); op = lerp(1, 0.25, y); rot = -4 * dir * y;
      }
      const push = 1 + 0.22 * eio(p(lt, dropD * 0.8, s.d + 0.2));
      const cx = L ? W - 90 * U - w / 2 : W / 2, cy = L ? H / 2 : cardTop + h / 2;
      html += card(s.img, { x: cx - w / 2, y: cy - h / 2, w, h, push, fx: s.fx, fy: s.fy, extra: `opacity:${op};transform:translateY(${ty}px) rotate(${rot}deg) scale(${sc})` });
      if (i === cur) {
        const size = L ? (s.label.length > 8 ? 108 : 150) : s.label.length > 10 ? 132 : 160;
        const lab = slam(t, s.t + 0.05, `<div class="tight" style="font-size:${u(size)};color:${s.c}">${s.label}</div>`, 1.35);
        html += L ? `<div style="position:absolute;left:${u(96)};width:${W * 0.3}px;top:${H / 2 - 70 * U}px">${lab}</div>` : block(fy(0.035), lab);
        fl = flash(t, s.t + dropD, 0.32);
        sh = shake(t, s.t + dropD, 12);
      }
    });
    return { bg: INK, html: grid() + `<div class="layer" style="transform:translate(${sh[0]}px,${sh[1]}px)">${html}</div>` + whiteout(fl) };
  },

  // ---------- 18.1 to 19.5: the snare roll, five flash cuts ----------
  roll(t) {
    let i = 0;
    while (i + 1 < ROLL.length && ROLL[i + 1] <= t) i++;
    if (t < ROLL[0]) return this.shots(t);
    const lt = t - ROLL[i];
    const z = 1.15 + 0.25 * eo(p(lt, 0, 0.3)) + i * 0.05;
    const [sx, sy] = shake(t, ROLL[i], 18, 0.2);
    const img = `<img src="assets/hood/${ROLL_IMG[i]}.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${['30% 10%', '0 20%', '0 80%', '40% 30%', '40% 40%'][i]};transform:translate(${sx}px,${sy}px) scale(${z.toFixed(3)});filter:saturate(1.15)">`;
    return { bg: INK, html: img + `<div class="layer" style="background:rgba(20,20,51,.25)"></div>` + whiteout(flash(t, ROLL[i], 0.55, 0.1)) };
  },

  // ---------- 19.5 to 22.2: the break ----------
  question(t) {
    const L = land();
    const ein = back(p(t, 19.6, 19.95));
    const eye = eyeEl(pose(this, t), L ? { x: W * 0.25, y: H / 2, size: 420, bg: INK, scale: ein } : { x: W / 2, y: fy(0.16), size: 300, bg: INK, scale: ein });
    const q = words('So what does it', t, 20.29, { size: L ? 120 : 130, st: 0.09, dur: 0.6 }) + words([['actually do?', CORAL]], t, 20.75, { size: L ? 120 : 130, st: 0.09, dur: 0.6 });
    const [sx, sy] = shake(t, 21.55, 6, 0.6);
    const qEl = L ? `<div style="position:absolute;left:${W * 0.45}px;right:${u(96)};top:${H * 0.32}px">${q}</div>` : block(fy(0.38), q);
    return { bg: INK, html: `<div class="layer" style="transform:translate(${sx}px,${sy}px)">${eye}${qEl}</div>` };
  },

  // ---------- 22.2 to 31: the drop ----------
  verbs(t) {
    const L = land();
    const scene = (i) => {
      const v = VERBS[i];
      const size = (v.size ?? 172) * (L ? 1.35 : 1);
      let lines = v.txt.map(([txt, c]) => `<div class="tight" style="font-size:${u(size)};color:${c}">${txt}</div>`).join('');
      if (v.more) lines += v.more.map(([t0, txt, c]) => (t >= t0 ? slam(t, t0, `<div class="tight" style="font-size:${u(size)};color:${c}">${txt}</div>`, 1.4) : `<div class="tight" style="font-size:${u(size)};visibility:hidden">${txt}</div>`)).join('');
      let [sx, sy] = shake(t, v.t + 0.04, 16);
      let pz = 1;
      for (const [t0] of v.more ?? []) { const [a, b] = shake(t, t0, 14); sx += a; sy += b; }
      if (v.punch) { const [a, b] = shake(t, v.punch, 20); sx += a; sy += b; pz = 1 + 0.06 * (1 - eo(p(t, v.punch, v.punch + 0.25))) * (t >= v.punch ? 1 : 0); }
      const fl = flash(t, v.t, 0.25) + (v.punch ? flash(t, v.punch, 0.35) : 0) + (v.more ?? []).reduce((a, [t0]) => a + flash(t, t0, 0.2), 0);
      return { bg: v.bg, html: `<div class="layer" style="transform:translate(${sx}px,${sy}px) scale(${pz})">${block(fy(L ? 0.26 : 0.34), slam(t, v.t + 0.02, lines, 1.3))}</div>` + whiteout(fl) };
    };
    let i = 0;
    while (i + 1 < VERBS.length && VERBS[i + 1].t <= t) i++;
    if (i === 0) return wipe(t, VERBS[0].t, () => this.question(VERBS[0].t - 0.001), () => scene(0), 0.12);
    return wipe(t, VERBS[i].t, () => scene(i - 1), () => scene(i), 0.12);
  },

  // ---------- 31 to the end: the CTA ----------
  cta(t) {
    const C = CTA, L = land();
    const away = eio(p(t, C, C + 0.3));
    const last = away < 1 ? `<div class="layer" style="opacity:${1 - away};transform:scale(${1 - 0.4 * away})">${this.verbs(C - 0.001).html}</div>` : '';
    if (t >= 39.2) return this.signoff(t);
    // where the eye is: its CTA spot, then (from the lunge on 38.53) the middle of the frame
    const home = L ? { x: W * 0.25, y: H / 2, size: 560 } : { x: W / 2, y: fy(0.15), size: 300 };
    const go = eio(p(t, 38.45, 38.75));
    const ex = lerp(home.x, W / 2, go), ey = lerp(home.y, H / 2, go);
    const gulp = Math.sin(clamp((t - 38.23) / 0.28) * Math.PI); // a squash on the gulp
    const eyeS = back(p(t, C + 0.02, C + 0.4)) * (1 + 0.12 * eo(p(t, 37.5, 37.9)));
    const eye = eyeEl(pose(this, t), { x: ex, y: ey, size: home.size, bg: INK, scale: eyeS });
    const lunge = t < 38.6 ? 1 : Math.pow(2, 10 * Math.pow(p(t, 38.6, 39.2), 1.6) * 0.62);
    const eyeLayer = `<div class="layer" style="transform-origin:${ex}px ${ey}px;transform:scale(${lunge}) scale(${1 + 0.16 * gulp},${1 - 0.16 * gulp})">${eye}</div>`;
    const cs = L ? 172 : 150;
    const lines = words('See it on', t, C + 0.25, { size: cs, st: 0.06 }) + words('your site', t, C + 0.6, { size: cs, st: 0.06 }) + words('today.', t, 32.1, { size: cs, st: 0.06 });
    const lit = t >= 32.93 ? slam(t, 32.98, `<div class="tight" style="font-size:${u(cs)};color:${CORAL}">Literally.</div>`, 1.5) : '';
    const pin = eo(p(t, 33.56, 33.9));
    const pulse = 1 + 0.08 * (t >= 33.88 ? 1 - eo(p(t, 33.88, 34.15)) : 0) + 0.06 * Math.max(0, Math.sin(p(t, 36.15, 36.6) * Math.PI));
    const pill = `<div style="display:inline-block;margin-top:${u(50)};padding:${u(22)} ${u(40)};border-radius:999px;background:${WHITE};color:${INK};font-size:${u(46)};letter-spacing:-.02em;opacity:${pin};transform-origin:0 50%;transform:translateY(${u(24 * (1 - pin))}) scale(${pulse})">ignoranceisbliss.ai</div>`;
    const body = lines + lit + pill;
    const bodyEl = L ? `<div style="position:absolute;left:${W * 0.47}px;right:${u(96)};top:${H * 0.15}px">${body}</div>` : block(fy(0.33), body);
    // the inhale on 37.64: everything is pulled into the eye, spinning, shrinking to its pupil
    const suck = Math.pow(p(t, 37.64, 38.22), 2.2);
    const words_ = suck < 1 ? `<div class="layer" style="transform-origin:${home.x}px ${home.y}px;transform:scale(${1 - suck}) rotate(${-38 * suck}deg);opacity:${1 - Math.pow(suck, 3)}">${bodyEl}</div>` : '';
    let [sx, sy] = shake(t, 32.98, 18, 0.35);
    for (const h of [33.88, 35.32]) { const [a2, b2] = shake(t, h, 5, 0.2); sx += a2; sy += b2; }
    { const [a2, b2] = shake(t, 38.23, 12, 0.25); sx += a2; sy += b2; }
    return {
      bg: INK,
      html: last + `<div class="layer" style="transform:translate(${sx}px,${sy}px)">${words_}${eyeLayer}</div>` + whiteout(flash(t, 32.98, 0.5, 0.16) + flash(t, 33.88, 0.12)),
    };
  },

  /** Swallowed: in the dark, the resting eye (nothing needs you) and the address, then a fade. */
  signoff(t) {
    const L = land();
    const a = eo(p(t, 39.6, 40.1)), b = eo(p(t, 39.9, 40.4)), c = eo(p(t, 40.15, 40.65));
    const rest = { gx: 0, gy: 0, open: 0, pr: 7, bx: 0, by: 0, bvx: 0, bvy: 0 };
    const eye = eyeEl(rest, { x: W / 2, y: H / 2 - 130 * U, size: 190, bg: INK, scale: lerp(0.7, 1, a) });
    const text = `<div style="position:absolute;left:0;right:0;top:${H / 2 + 10 * U}px;text-align:center">
      <div style="font-size:${u(L ? 46 : 50)};color:${WHITE};letter-spacing:-.02em;opacity:${b};transform:translateY(${u(16 * (1 - b))})">ignoranceisbliss.ai</div>
      <div style="margin-top:${u(16)};font-size:${u(34)};font-weight:500;color:${LAV};opacity:${c * 0.9}">Ignorance is bliss.</div></div>`;
    const end = p(t, 41.5, 42.15);
    return { bg: INK, html: `<div style="opacity:${a}">${eye}</div>` + text + (end > 0 ? `<div class="layer" style="background:${INK};opacity:${end}"></div>` : '') };
  },
};

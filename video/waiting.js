/* 6. Waiting on you. A 22.5-second cut to a reference track (about 94 BPM; times are the video's, the
 * track's silent lead-in trimmed). The pain: builds don't stall on the work, they stall waiting on the
 * client, while someone circles back. The answer is the decision card, close up, from the platform:
 * only what's yours, with Cypher's pick, a deadline, and "If you say nothing". Silence is an answer.
 *
 *   0.44              the eye opens, bored, tapping its foot
 *   2.29 2.65         Your build / isn't late.
 *   3.34 3.83         It's waiting. / On you.
 *   5.98 .. 9.87      the chasers pile up, one per stab: Just circling back. Need your sign-off. ...
 *  10.57 10.81        Cypher / doesn't wait.
 *  11.29  drop        the pile blows away; Cypher dances. Only what's yours.  Three things, max.
 *  12.89              With its pick.            (the decision card: Cypher's pick)
 *  13.75              And a deadline.           (DECIDE · BEFORE 10:13)
 *  15.44 16.41        Say nothing? / It goes ahead.   (If you say nothing: ..., at 10:13)
 *  17.58 18.01        Silence / is an answer.
 *  18.86 19.61        The build / never waits.  (a spin)
 *  20.05  beat out    Handled.
 *  20.56 .. 21.54     See it on your site. / Today. / Literally.
 *
 * Every claim is the product's own: three is the limit for what is yours (design system §2); each
 * decision carries Cypher's verdict and pick and "If you say nothing: A, at 2:24" (§10); defaults
 * apply after the playbook's deadlines (docs/mock-backend.md). Close-ups from assets/says. */

const SAYS_P = 0.6385; // one beat
const SAYS_T0 = 0.46; // the beat grid (the drop lands on it at 11.30)

/** The chasers, one per stab. x and y are fractions of the frame (portrait); rot in degrees. */
const CHASERS = [
  { t: 5.98, txt: 'Just circling back.', who: 'Account manager · Mon', x: 0.36, y: 0.48, rot: -4 },
  { t: 6.44, txt: 'Need your sign-off.', who: 'Project lead · Tue', x: 0.62, y: 0.58, rot: 3 },
  { t: 6.94, txt: 'Quick call?', who: 'Agency · Wed', x: 0.3, y: 0.68, rot: -2 },
  { t: 7.35, txt: 'Blocked: waiting on client.', who: 'Status report · Thu', x: 0.55, y: 0.78, rot: 4 },
  { t: 8.82, txt: 'Per my last email.', who: 'Account manager · Fri', x: 0.66, y: 0.42, rot: 5 },
  { t: 9.25, txt: 'Following up on the follow-up.', who: 'Project lead · Mon', x: 0.42, y: 0.88, rot: -3 },
  { t: 9.67, txt: 'Any update?', who: 'Agency · Tue', x: 0.7, y: 0.7, rot: -5 },
  { t: 9.87, txt: 'Bumping this.', who: 'Account manager · Wed', x: 0.33, y: 0.56, rot: 6 },
];

/** The features, each a headline and a close-up of the product with the part that matters ringed. */
const FEATS = [
  { t: 11.29, bg: CORAL, ink: true, head: [[11.29, 'Only what’s yours.', INK]], sub: [12.46, 'Three things, max.', INK], voice: true },
  { t: 12.89, bg: INK, head: [[12.89, 'With its pick.', WHITE]], img: 'pick', ar: 1030 / 434, push: 1.15, mark: { x0: 0.0, x1: 0.99, y0: 0.4, y1: 0.67 } },
  { t: 13.75, bg: VIOLET, head: [[13.75, 'And a deadline.', WHITE]], img: 'deadline', ar: 1324 / 672, push: 1.5, origin: [0, 0], mark: { x0: 0.035, x1: 0.36, y0: 0.07, y1: 0.18 } },
  { t: 15.44, bg: INK, head: [[15.44, 'Say nothing?', WHITE], [16.41, 'It goes ahead.', CORAL]], silence: true },
  { t: 17.58, bg: WHITE, big: true, head: [[17.58, 'Silence', INK], [18.01, 'is an answer.', CORAL]] },
  { t: 18.86, bg: INK, big: true, head: [[18.86, 'The build', WHITE], [19.61, 'never waits.', CORAL]] },
];
const SAYS_HITS = [0.44, 2.29, 3.83, 10.81, 11.29, 12.89, 13.75, 15.44, 16.41, 17.58, 18.01, 18.86, 20.56, 21.54];

function saysKeys() {
  const k = [
    { t: 0, gx: 0, gy: 0.2, open: 0, pr: 7 }, { t: 0.44, open: 0.42, gy: 0.2 }, // half asleep
    { t: 2.29, gx: 0.3, gy: 0.75, open: 0.5 }, { t: 3.83, gx: 0, gy: 0, open: 0.55 },
    { t: 5.98, gx: -0.6, gy: 0.7, open: 0.55 }, { t: 6.94, gx: 0.12, gy: -0.95, open: 0.9 }, { t: 7.35, gx: 0.6, gy: 0.7, open: 0.5 },
    { t: 8.82, gx: 0.7, gy: 0.4, open: 0.5 }, { t: 9.87, gx: 0.1, gy: -0.95, open: 0.92 }, { t: 10.3, gx: 0, gy: 0, open: 0.5 },
    { t: 10.57, open: 1.14, pr: 10.5 }, { t: 10.81, open: 0.6, pr: 7 },
  ];
  for (let i = 0, b = 11.3; b < 20.0; b += SAYS_P, i++) k.push({ t: b, gx: i % 2 ? 0.5 : -0.5, gy: 0.45, open: 0.78, pr: 7.4 });
  k.push({ t: 17.58, gx: 0, gy: 0, open: 1.1, pr: 9.5 }, { t: 18.3, open: 0.6, pr: 7 }, { t: 18.86, gx: 0, gy: 0, open: 1 },
    { t: 20.05, gx: 0, gy: 0, open: 0.55, pr: 7 }, { t: 20.56, open: 1.1, pr: 10 }, { t: 21.0, open: 0.62, pr: 7.2 });
  return k.sort((a, b) => a.t - b.t);
}

/** How much Cypher is dancing: tapping its foot while it waits, full out from the drop, still on "Handled." */
const energy = (t) => (t < 0.44 ? 0 : t < 11.29 ? 0.22 : t < 20.05 ? 1 : t < 20.56 ? 0 : 0.5);

function dance(t) {
  const e = energy(t);
  const x = (t - SAYS_T0) / SAYS_P, bi = Math.floor(x), bp = x - bi;
  const air = Math.pow(Math.sin(Math.PI * bp), 1.3);
  const land = 1 - clamp(bp / 0.16);
  const sway = Math.sin((Math.PI * (bi + bp)) / 2);
  let scale = 1;
  for (const h of SAYS_HITS) if (t >= h && t < h + 0.4) scale += 0.2 * (1 - eo(p(t, h, h + 0.4)));
  const spin = 360 * eio(p(t, 18.86, 19.4));
  return { dx: 60 * U * e * sway, dy: -110 * U * e * air, rot: 10 * e * sway + spin, sx: (1 + 0.16 * land * e) * (1 - 0.05 * air * e), sy: (1 - 0.18 * land * e) * (1 + 0.07 * air * e), scale, air };
}

VIDEOS.waiting = {
  id: 'waiting', title: 'Waiting on you', dur: 22.45,
  eye: { keys: saysKeys(), blinks: [1.6, 4.6, 8.3, 14.95, 21.54] },

  /** Cypher, dancing, with a shadow and (full out) motion trails. */
  cypher(t, { x, y, size, bg, ink = false, pop = 1 }) {
    const colours = ink ? { ball: INK_RGB, pupil: CORAL_RGB, halo: 'rgba(20,20,51,.2)' } : { halo: bg === WHITE ? 'rgba(232,85,61,.24)' : 'rgba(232,85,61,.3)' };
    const at = (d, op = 1) => `<div class="layer" style="opacity:${op};transform:translate(${d.dx}px,${d.dy}px)"><div class="layer" style="transform-origin:${x}px ${y + (size * U) / 2}px;transform:rotate(${d.rot}deg) scale(${d.sx * d.scale * pop},${d.sy * d.scale * pop})">${eyeEl(pose(this, t), { x, y, size, bg, ...colours })}</div></div>`;
    const d = dance(t);
    const shw = size * U * 0.62 * (1 - 0.35 * d.air) * pop;
    const shadow = `<div style="position:absolute;left:${x + d.dx * 0.6 - shw / 2}px;top:${y + (size * U) / 2 + 22 * U}px;width:${shw}px;height:${16 * U}px;border-radius:50%;background:${ink ? 'rgba(20,20,51,.28)' : bg === WHITE ? 'rgba(20,20,51,.18)' : 'rgba(0,0,0,.32)'};opacity:${(1 - 0.5 * d.air) * pop};filter:blur(${u(3)})"></div>`;
    const trails = energy(t) === 1 ? at(dance(t - 0.09), 0.14) + at(dance(t - 0.05), 0.24) : '';
    return shadow + trails + at(d);
  },

  /** Where Cypher stands in each format. */
  spot(big) {
    if (land()) return big ? { x: W * 0.24, y: H / 2, size: 460 } : { x: W * 0.15, y: H * 0.27, size: 260 };
    const sq = H <= F;
    return big ? { x: W / 2, y: fy(sq ? 0.2 : 0.16), size: sq ? 300 : 360 } : { x: W / 2, y: fy(sq ? 0.13 : 0.1), size: sq ? 200 : 240 };
  },

  frame(t) {
    let r;
    if (t < 11.29) r = this.wait(t);
    else if (t < 20.05) {
      let i = 0;
      while (i + 1 < FEATS.length && FEATS[i + 1].t <= t) i++;
      r = i === 0 ? wipe(t, 11.29, () => this.wait(11.289), () => this.feat(0, t), 0.1) : wipe(t, FEATS[i].t, () => this.feat(i - 1, t), () => this.feat(i, t), 0.1);
    } else r = wipe(t, 20.05, () => this.feat(FEATS.length - 1, 20.049), () => this.cta(t), 0.1);
    let sx = 0, sy = 0, fl = 0;
    for (const h of SAYS_HITS) { const [a, b] = shake(t, h, h >= 11.29 && h < 20 ? 16 : 9, 0.25); sx += a; sy += b; fl += flash(t, h, h >= 11.29 ? 0.28 : 0.16, 0.12); }
    const end = p(t, 22.15, 22.45);
    return { bg: r.bg, html: `<div class="layer" style="transform:translate(${sx}px,${sy}px)">${r.html}</div>` + whiteout(fl) + (end > 0 ? `<div class="layer" style="background:${INK};opacity:${end}"></div>` : '') };
  },

  // ---------- 0 to 11.3: the wait ----------
  wait(t) {
    const L = land();
    const sp = this.spot(true);
    const pop = back(p(t, 0.44, 0.75));
    const sz = L ? 130 : H <= F ? 118 : 150;
    const say = (segs) => segs.map(([t0, txt, c]) => (t < t0 ? `<div class="tight" style="font-size:${u(sz)};visibility:hidden">${txt}</div>` : slam(t, t0, `<div class="tight" style="font-size:${u(sz)};color:${c}">${txt}</div>`, 1.35))).join('');
    let lines = '';
    if (t >= 2.25 && t < 3.3) lines = say([[2.29, 'Your build', WHITE], [2.65, 'isn’t late.', WHITE]]);
    else if (t >= 3.3 && t < 6.2) lines = out(t, 5.85, say([[3.34, 'It’s waiting.', WHITE], [3.83, 'On you.', CORAL]]));
    const linesEl = L ? `<div style="position:absolute;left:${W * 0.46}px;right:${u(80)};top:${H * 0.3}px">${lines}</div>` : block(fy(H <= F ? 0.48 : 0.42), lines);
    // the chasers pile up, then blow away on the drop
    const blast = eio(p(t, 11.2, 11.5));
    const chasers = CHASERS.filter((c) => t >= c.t).map((c, i) => {
      const k = back(p(t, c.t, c.t + 0.25));
      const cx = L ? W * (0.36 + c.x * 0.6) : W * c.x, cy = L ? H * (0.12 + (c.y - 0.4) * 1.5) : fy(c.y);
      const bx = (cx - W / 2) * 2.2 * blast, by = (cy - H / 2) * 2.2 * blast;
      const light = i % 3 !== 1;
      return `<div style="position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%) translate(${bx}px,${by}px) rotate(${c.rot + 40 * blast * (i % 2 ? 1 : -1)}deg) scale(${k});opacity:${1 - blast};
        background:${light ? WHITE : VIOLET};color:${light ? INK : WHITE};border-radius:${u(30)};padding:${u(22)} ${u(30)};box-shadow:0 ${u(20)} ${u(50)} rgba(0,0,0,.45);white-space:nowrap">
        <div style="font-size:${u(L ? 44 : 56)};font-weight:700;letter-spacing:-.02em">${c.txt}</div>
        <div style="font-size:${u(L ? 26 : 30)};font-weight:500;opacity:.6;margin-top:${u(6)}">${c.who}</div></div>`;
    }).join('');
    // the turn
    const scrim = t >= 10.5 ? `<div class="layer" style="background:rgba(20,20,51,${0.72 * eo(p(t, 10.5, 10.75)) * (1 - blast)})"></div>` : '';
    const turnSz = L ? 160 : H <= F ? 130 : 160;
    const place = L ? (s) => `<div style="position:absolute;left:${W * 0.46}px;right:${u(80)};top:${H * 0.28}px">${s}</div>` : (s) => block(fy(H <= F ? 0.46 : 0.42), s);
    const turn = t >= 10.5 && t < 11.29 ? place(slam(t, 10.57, `<div class="tight" style="font-size:${u(turnSz)};color:${WHITE}">Cypher</div>`, 1.4) + (t >= 10.81 ? slam(t, 10.81, `<div class="tight" style="font-size:${u(turnSz)};color:${CORAL}">doesn’t wait.</div>`, 1.5) : '')) : '';
    const cy = t < 0.44 ? '' : this.cypher(t, { ...sp, bg: INK, pop });
    return { bg: INK, html: grid() + chasers + linesEl + scrim + turn + cy };
  },

  // ---------- 11.3 to 20: the features, close up ----------
  feat(i, t) {
    const f = FEATS[i], L = land(), sq = H <= F;
    const sp = this.spot(!!f.big);
    const hs = f.big ? (L ? 190 : sq ? 160 : 200) : L ? 120 : sq ? 112 : 136;
    const head = f.head.map(([t0, txt, c]) => (t < t0 ? `<div class="tight" style="font-size:${u(hs)};visibility:hidden">${txt}</div>` : slam(t, t0, `<div class="tight" style="font-size:${u(hs)};color:${c}">${txt}</div>`, 1.35))).join('');
    const sub = f.sub ? `<div style="margin-top:${u(18)};font-size:${u(L ? 54 : 60)};font-weight:700;letter-spacing:-.02em;color:${f.sub[2]};opacity:${eo(p(t, f.sub[0], f.sub[0] + 0.25))};transform:translateY(${u(20 * (1 - eo(p(t, f.sub[0], f.sub[0] + 0.25))))})">${f.sub[1]}</div>` : '';
    let shot = '';
    if (f.img) {
      // the close-up: a card that lands, then pushes in on the part that matters, which a coral ring finds
      const cw = L ? W * 0.5 : W - 2 * 70 * U;
      const ch = Math.min(cw / f.ar, L ? H * 0.6 : 600 * U);
      const cx = L ? W - 90 * U - cw : W / 2 - cw / 2, cy = L ? H / 2 - ch / 2 + 40 * U : fy(sq ? 0.56 : 0.6);
      const lt = t - f.t, inn = back(p(lt, 0.05, 0.3));
      const m = f.mark, mk = eo(p(lt, 0.35, 0.6));
      const push = 1 + ((f.push ?? 1.12) - 1) * eio(p(lt, 0.3, 1.1));
      const [ox, oy] = f.origin ? f.origin.map((v) => v * 100) : [((m.x0 + m.x1) / 2) * 100, ((m.y0 + m.y1) / 2) * 100];
      const ring = m.under
        ? `<div style="position:absolute;left:${m.x0 * 100}%;top:${m.y1 * 100}%;height:${u(10)};width:${(m.x1 - m.x0) * 100 * mk}%;background:${CORAL};border-radius:${u(5)}"></div>`
        : `<div style="position:absolute;left:${m.x0 * 100}%;top:${m.y0 * 100}%;width:${(m.x1 - m.x0) * 100}%;height:${(m.y1 - m.y0) * 100}%;border-radius:${u(18)};box-shadow:0 0 0 ${u(5)} ${CORAL},0 0 ${u(40)} rgba(232,85,61,.6);opacity:${mk};transform:scale(${lerp(1.25, 1, mk)})"></div>`;
      shot = `<div style="position:absolute;left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;border-radius:${u(24)};overflow:hidden;transform:translateY(${(1 - inn) * H * 0.5}px) rotate(${(1 - eo(p(lt, 0.05, 0.3))) * (i % 2 ? 5 : -5)}deg);box-shadow:0 ${u(36)} ${u(80)} rgba(0,0,0,.5),0 0 0 1px rgba(183,166,255,.25)">
        <div style="position:absolute;inset:0;transform-origin:${ox}% ${oy}%;transform:scale(${push})"><img src="assets/says/${f.img}.jpg" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block">${ring}</div></div>`;
    }
    if (f.voice) {
      // Cypher's sentence from the Bliss hero, set in the product's voice style: light, with what's yours in bold, underlined in coral
      const cw = L ? W * 0.5 : W - 2 * 70 * U;
      const cx = L ? W - 90 * U - cw : W / 2 - cw / 2, cy = L ? H * 0.22 : fy(sq ? 0.5 : 0.56);
      const lt = t - f.t, inn = back(p(lt, 0.05, 0.3)), mk = eo(p(lt, 0.4, 0.9));
      const vs = L ? 46 : sq ? 44 : 54;
      shot = `<div style="position:absolute;left:${cx}px;top:${cy}px;width:${cw}px;box-sizing:border-box;padding:${u(40)} ${u(44)};border-radius:${u(24)};background:#1d1c40;display:flex;gap:${u(30)};align-items:flex-start;transform:translateY(${(1 - inn) * H * 0.5}px) rotate(${(1 - eo(p(lt, 0.05, 0.3))) * -5}deg);box-shadow:0 ${u(36)} ${u(80)} rgba(0,0,0,.5),0 0 0 1px rgba(183,166,255,.25)">
        <div style="position:relative;flex:none;width:${u(110)};height:${u(110)}">${eyeEl({ gx: 0, gy: 0, open: 1, pr: 7, bx: 0, by: 0, bvx: 0, bvy: 0 }, { x: 55 * U, y: 55 * U, size: 110, bg: '#1d1c40' })}</div>
        <div style="font-size:${u(vs)};font-weight:500;line-height:1.16;letter-spacing:-.025em;color:${WHITE}">Components has just started. <span style="font-weight:800;padding-bottom:${u(4)};background:linear-gradient(${CORAL},${CORAL}) no-repeat left bottom/${(mk * 100).toFixed(1)}% ${u(7)}">Two things are yours, the first before 10:13,</span> and Emily is waiting on one of them. Everything else is on pace.</div></div>`;
    }
    if (f.silence) {
      // the foot of the decision card, set in its own words: defer, ask, and what happens if you say nothing
      const cw = L ? W * 0.5 : W - 2 * 70 * U;
      const cx = L ? W - 90 * U - cw : W / 2 - cw / 2, cy = L ? H * 0.34 : fy(sq ? 0.56 : 0.6);
      const lt = t - f.t, inn = back(p(lt, 0.05, 0.3)), mk = eo(p(t, 16.41, 16.7));
      shot = `<div style="position:absolute;left:${cx}px;top:${cy}px;width:${cw}px;box-sizing:border-box;padding:${u(36)} ${u(40)};border-radius:${u(24)};background:#1d1c40;transform:translateY(${(1 - inn) * H * 0.5}px) rotate(${(1 - eo(p(lt, 0.05, 0.3))) * 5}deg);box-shadow:0 ${u(36)} ${u(80)} rgba(0,0,0,.5),0 0 0 1px rgba(183,166,255,.25)">
        <div style="display:flex;gap:${u(34)};font-size:${u(L ? 32 : 36)};font-weight:500;color:${LAV}"><span>Defer half an hour</span><span>Ask Emily</span></div>
        <div style="position:relative;margin-top:${u(22)};padding:${u(16)} ${u(20)};margin-left:${u(-20)};margin-right:${u(-20)};font-size:${u(L ? 38 : 44)};font-weight:500;line-height:1.25;letter-spacing:-.015em;color:${WHITE}">If you say nothing: one rendering with two variants, at 10:13
          <div style="position:absolute;inset:0;border-radius:${u(16)};box-shadow:0 0 0 ${u(5)} ${CORAL},0 0 ${u(40)} rgba(232,85,61,.6);opacity:${mk};transform:scale(${lerp(1.15, 1, mk)})"></div></div></div>`;
    }
    const label = f.big ? '' : `<div style="font-size:${u(34)};font-weight:700;letter-spacing:.3em;color:${f.ink ? INK : LAV};opacity:.8;margin-bottom:${u(20)}">CYPHER</div>`;
    const body = label + head + sub;
    const textEl = L
      ? `<div style="position:absolute;width:${f.img ? W * 0.38 : W * 0.5}px;${f.big ? `left:${W * 0.46}px;top:${H * 0.3}px` : `left:${u(96)};top:${H * 0.45}px`}">${body}</div>`
      : block(fy(f.big ? (sq ? 0.48 : 0.42) : sq ? 0.26 : 0.22), body);
    return { bg: f.bg, html: (f.bg === INK ? grid() : '') + shot + textEl + this.cypher(t, { ...sp, bg: f.bg, ink: f.ink }) };
  },

  // ---------- 20 to the end ----------
  cta(t) {
    const L = land(), sq = H <= F;
    const sp = this.spot(true);
    const sz = L ? 130 : sq ? 120 : 150;
    const say = (segs) => segs.map(([t0, txt, c]) => (t < t0 ? `<div class="tight" style="font-size:${u(sz)};visibility:hidden">${txt}</div>` : slam(t, t0, `<div class="tight" style="font-size:${u(sz)};color:${c}">${txt}</div>`, 1.35))).join('');
    // Cypher's own voice, in its light weight: one word while the beat drops out
    const handled = t < 20.56 ? `<div style="font-size:${u(L ? 90 : 96)};font-weight:500;letter-spacing:-.025em;color:${LAV};opacity:${eo(p(t, 20.05, 20.15))}">Handled.</div>` : '';
    const lines = handled + (t >= 20.56 ? say([[20.56, 'See it on your site.', WHITE], [20.89, 'Today.', CORAL], [21.54, 'Literally.', CORAL]]) : '');
    const pin = eo(p(t, 21.2, 21.45));
    const pill = t >= 20.56 ? `<div style="display:inline-block;margin-top:${u(34)};padding:${u(20)} ${u(36)};border-radius:999px;background:${WHITE};color:${INK};font-size:${u(42)};letter-spacing:-.02em;opacity:${pin};transform:translateY(${u(20 * (1 - pin))})">ignoranceisbliss.ai</div>` : '';
    const textEl = L ? `<div style="position:absolute;left:${W * 0.46}px;right:${u(80)};top:${H * 0.12}px">${lines + pill}</div>` : block(fy(sq ? 0.4 : 0.36), lines + pill);
    return { bg: INK, html: grid() + textEl + this.cypher(t, { ...sp, bg: INK }) };
  },
};

/* 6. Cypher Says. A 22.5-second cut to a reference track (about 94 BPM; times below are the video's,
 * with the track's silent lead-in trimmed). Cypher dances on every beat and gives orders like the
 * playground game, each one a claim from the site:
 *
 *   0.44  first stab        the eye snaps open; it bobs, smug, on the beat
 *   2.29  / 2.65            "Cypher" / "says."
 *   3.83                    Skip the / discovery / workshop.         (on the beats)
 *   5.98  6.44  6.94  7.35  Fire / the / change / order.             (one word per stab)
 *   8.82  9.67  9.87        Roadmap? / Next / week.
 *  10.57 10.81              Now / watch.
 *  11.29  drop              $400,000?        the eye rolls; it dances full out from here
 *  12.89  big kick          Cute.
 *  13.75                    $512 to run it. (the cost of the run, not the price)
 *  15.44                    Three decisions. That's your job.
 *  17.58  18.01             21 specialists. Zero change orders.  a spin on 18.86
 *  20.05  the beat drops out: it freezes, stares
 *  20.20  20.56  20.89      See it on / your site. / Today.  then Literally. on 21.54, with a wink
 */

const SAYS_P = 0.6385; // one beat
const SAYS_T0 = 0.46; // the beat grid (the drop lands on it at 11.30)

/** The scenes: background, and the words that slam in, each on its own hit. */
const SAYS = [
  { t: 0, bg: INK, words: [] },
  { t: 2.29, bg: INK, title: true, words: [[2.29, 'Cypher', WHITE, 230], [2.65, 'says.', CORAL, 230]] },
  { t: 3.83, bg: INK, label: true, words: [[3.83, 'Skip the', WHITE], [4.28, 'discovery', WHITE], [4.92, 'workshop.', CORAL]] },
  { t: 5.98, bg: INK, label: true, words: [[5.98, 'Fire', WHITE, 200], [6.44, 'the', WHITE, 200], [6.94, 'change', WHITE, 200], [7.35, 'order.', CORAL, 200]] },
  { t: 8.82, bg: INK, label: true, words: [[8.82, 'Roadmap?', WHITE, 180], [9.67, 'Next', CORAL, 200], [9.87, 'week.', CORAL, 200]] },
  { t: 10.57, bg: INK, words: [[10.57, 'Now', WHITE, 250], [10.81, 'watch.', CORAL, 250]] },
  { t: 11.29, bg: CORAL, label: true, ink: true, words: [[11.29, '$400,000?', INK, 180]] },
  { t: 12.89, bg: INK, words: [[12.89, 'Cute.', CORAL, 280]] },
  { t: 13.75, bg: VIOLET, label: true, words: [[13.75, '$512', WHITE, 300], [14.49, 'to run it.', LAV, 110], [15.0, 'The cost of the run. Not the price.', LAV, 36, 500]] },
  { t: 15.44, bg: LAVBG, label: true, dark: true, words: [[15.44, 'Three', INK, 190], [15.77, 'decisions.', INK, 165], [16.41, 'That’s your job.', RUST, 96]] },
  { t: 17.58, bg: WHITE, label: true, dark: true, words: [[17.58, '21 specialists.', INK, 140], [18.01, 'Zero', CORAL, 200], [18.32, 'change orders.', CORAL, 140]] },
  { t: 20.05, bg: INK, cta: true, words: [[20.2, 'See it on', WHITE, 150], [20.56, 'your site.', WHITE, 150], [20.89, 'Today.', CORAL, 150]] },
];
/** Hits that get a flash and a shake. */
const SAYS_HITS = [0.44, 2.29, 2.65, 5.98, 7.35, 9.87, 10.81, 11.29, 12.89, 13.75, 15.44, 17.58, 18.01, 20.56, 21.54];

/** Eye cues: smug most of the time, darting on every beat once the drop hits. */
function saysKeys() {
  const k = [
    { t: 0, gx: 0, gy: 0, open: 0, pr: 7 }, { t: 0.44, open: 1.12, pr: 9.6 }, { t: 0.66, gx: -0.9, gy: 0.1, open: 1 },
    { t: 1.2, gx: 0, gy: 0, open: 0.62, pr: 7 }, { t: 2.29, gx: 0.2, gy: 0.6 }, { t: 3.6, gx: 0, gy: 0 },
    { t: 5.98, gx: -0.95, gy: 0.05, open: 0.74, pr: 6.6 }, { t: 7.35, gx: 0, gy: 0, open: 0.62, pr: 7 },
    { t: 8.82, gx: 0.12, gy: -0.95, open: 0.95 }, { t: 9.67, gx: 0, gy: 0, open: 0.6 },
    { t: 10.57, open: 1.12, pr: 10 }, { t: 10.81, open: 0.55, pr: 7 },
  ];
  // the dance: a glance to alternate sides on every beat of the drop
  for (let i = 0, b = 11.3; b < 20.0; b += SAYS_P, i++) k.push({ t: b, gx: i % 2 ? 0.55 : -0.55, gy: 0.08, open: 0.72, pr: 7.6 });
  k.push({ t: 11.9, gx: 0.1, gy: -0.95, open: 0.95 }, { t: 12.55, gx: 0, gy: 0, open: 0.72 }, { t: 12.89, gx: 0.2, gy: 0.05, open: 0.5, pr: 7 },
    { t: 13.75, gx: 0, gy: 0, open: 1.12, pr: 10.5 }, { t: 14.3, open: 0.72, pr: 7.6 }, { t: 18.86, gx: 0, gy: 0, open: 1 },
    { t: 20.05, gx: 0, gy: 0, open: 1, pr: 7 }, { t: 20.56, open: 1.12, pr: 10 }, { t: 21.0, open: 0.6, pr: 7.2 });
  return k.sort((a, b) => a.t - b.t);
}

/** How much Cypher is dancing: a smug bob in the intro, full out on the drop, frozen in the break. */
const energy = (t) => (t < 0.44 ? 0 : t < 11.29 ? 0.35 : t < 20.05 ? 1 : t < 20.56 ? 0 : 0.55);

/** The dance: a bounce that lands on every beat (squash), a sway over two beats, pulses on the hits, one spin. */
function dance(t) {
  const e = energy(t);
  const x = (t - SAYS_T0) / SAYS_P, bi = Math.floor(x), bp = x - bi;
  const air = Math.pow(Math.sin(Math.PI * bp), 1.3);
  const land = 1 - clamp(bp / 0.16);
  const sway = Math.sin((Math.PI * (bi + bp)) / 2);
  let scale = 1;
  for (const h of SAYS_HITS) if (t >= h && t < h + 0.4) scale += 0.22 * (1 - eo(p(t, h, h + 0.4)));
  const spin = 360 * eio(p(t, 18.86, 19.4));
  return {
    dx: 70 * U * e * sway,
    dy: -120 * U * e * air,
    rot: 10 * e * sway + spin,
    sx: (1 + 0.16 * land * e) * (1 - 0.05 * air * e),
    sy: (1 - 0.18 * land * e) * (1 + 0.07 * air * e),
    scale,
  };
}

VIDEOS.says = {
  id: 'says', title: 'Cypher Says', dur: 22.45,
  eye: { keys: saysKeys(), blinks: [3.34, 8.4, 14.95, 19.6, 21.54] },

  scene(i, t) {
    const s = SAYS[i], L = land();
    const ink = s.ink; // on coral the eye's colours swap
    // where Cypher stands
    let ex, ey, size;
    if (i === 0) { ex = W / 2; ey = H / 2; size = 520; }
    else if (L) { ex = W * 0.26; ey = H / 2; size = s.cta ? 560 : 500; }
    else { const sq = H <= F; ex = W / 2; ey = fy(sq ? 0.22 : 0.16); size = sq ? 330 : 380; }
    const intro = i === 1 ? eio(p(t, 2.1, 2.45)) : 1; // the eye rises from centre stage as the title lands
    if (i === 1 && !L) { const sq = H <= F; ex = W / 2; ey = lerp(H / 2, fy(sq ? 0.22 : 0.16), intro); size = lerp(520, sq ? 330 : 380, intro); }
    if (i === 1 && L) { ex = lerp(W / 2, W * 0.26, intro); ey = H / 2; size = lerp(520, 500, intro); }
    const d = dance(t);
    const colours = ink ? { ball: INK_RGB, pupil: CORAL_RGB, halo: 'rgba(20,20,51,.2)' } : { halo: s.bg === WHITE ? 'rgba(232,85,61,.24)' : s.bg === LAVBG ? 'rgba(232,85,61,.32)' : 'rgba(232,85,61,.3)' };
    const pop = i === 0 ? back(p(t, 0.44, 0.7)) : 1;
    const eyeAt = (dd, op = 1) => `<div class="layer" style="opacity:${op};transform:translate(${dd.dx}px,${dd.dy}px)"><div class="layer" style="transform-origin:${ex}px ${ey + (size * U) / 2}px;transform:rotate(${dd.rot}deg) scale(${dd.sx * dd.scale * pop},${dd.sy * dd.scale * pop})">${eyeEl(pose(this, t), { x: ex, y: ey, size, bg: s.bg, ...colours })}</div></div>`;
    // motion trails while it dances full out
    const trails = energy(t) === 1 ? eyeAt(dance(t - 0.09), 0.16) + eyeAt(dance(t - 0.05), 0.26) : '';
    // a shadow on the floor under it: smaller and fainter the higher it jumps
    const air = -d.dy / (120 * U || 1);
    const shw = size * U * 0.62 * (1 - 0.35 * air) * pop, shy = ey + (size * U) / 2 + 26 * U;
    const shadow = t < 0.44 || energy(t) === 0 && t > 20 ? '' : `<div style="position:absolute;left:${ex + d.dx * 0.6 - shw / 2}px;top:${shy - 9 * U}px;width:${shw}px;height:${18 * U}px;border-radius:50%;background:${ink ? 'rgba(20,20,51,.28)' : 'rgba(0,0,0,.32)'};opacity:${(1 - 0.5 * air) * pop};filter:blur(${u(3)})"></div>`;
    const eye = t < 0.44 ? '' : shadow + trails + eyeAt(d);
    // the words
    const L2 = L ? 0.82 : H <= F ? 0.78 : 1;
    const lines = s.words.map(([t0, txt, c, size2 = 160, wt = 800]) => {
      const sz = size2 * L2;
      if (t < t0) return `<div class="tight" style="font-size:${u(sz)};visibility:hidden">${txt}</div>`;
      const el = `<div class="tight" style="font-size:${u(sz)};font-weight:${wt};color:${c};${wt < 800 ? 'letter-spacing:-.01em;line-height:1.3;margin-top:' + u(14) : ''}">${txt}</div>`;
      return wt < 800 ? `<div style="opacity:${eo(p(t, t0, t0 + 0.3))}">${el}</div>` : slam(t, t0, el, 1.45);
    }).join('');
    const label = s.label ? `<div style="font-size:${u(38)};font-weight:700;letter-spacing:.3em;color:${s.ink || s.dark ? INK : LAV};opacity:${s.ink || s.dark ? 0.75 : 0.9};margin-bottom:${u(26)}">CYPHER SAYS:</div>` : '';
    let pill = '';
    if (s.cta) {
      const pin = eo(p(t, 21.2, 21.5));
      const lit = t >= 21.5 ? slam(t, 21.54, `<div class="tight" style="font-size:${u(150 * L2)};color:${CORAL}">Literally.</div>`, 1.5) : '';
      pill = lit + `<div style="display:inline-block;margin-top:${u(40)};padding:${u(22)} ${u(40)};border-radius:999px;background:${WHITE};color:${INK};font-size:${u(46)};letter-spacing:-.02em;opacity:${pin};transform:translateY(${u(24 * (1 - pin))})">ignoranceisbliss.ai</div>`;
    }
    const body = label + lines + pill;
    const textEl = L ? `<div style="position:absolute;left:${W * 0.5}px;right:${u(80)};top:${s.cta ? H * 0.12 : H * 0.22}px">${body}</div>` : block(fy(H <= F ? (s.cta ? 0.41 : 0.44) : s.title ? 0.44 : 0.4), body, s.title ? 'text-align:center' : '');
    // the Floor behind "21 specialists"
    let back_ = '';
    if (s.floor) {
      const n = 1 + (Math.floor((t - s.t) * 30) % 60);
      const sc = Math.max(W / FLOOR.w, H / FLOOR.h) * 1.15;
      back_ = `<img src=".cache/floor/f_${String(n).padStart(4, '0')}.jpg" style="position:absolute;left:${W / 2 - (FLOOR.w * sc) / 2}px;top:${H / 2 - (FLOOR.h * sc) / 2}px;width:${FLOOR.w * sc}px;height:${FLOOR.h * sc}px;opacity:.55"><div class="layer" style="background:linear-gradient(180deg,rgba(23,22,53,.2),rgba(23,22,53,.75))"></div>`;
    }
    return { bg: s.bg, html: back_ + (s.bg === INK || s.floor ? grid() : '') + textEl + eye };
  },

  frame(t) {
    let i = 0;
    while (i + 1 < SAYS.length && SAYS[i + 1].t <= t) i++;
    const r = i === 0 ? this.scene(0, t) : wipe(t, SAYS[i].t, () => this.scene(i - 1, t), () => this.scene(i, t), 0.1);
    let [sx, sy] = [0, 0], fl = 0;
    for (const h of SAYS_HITS) { const [a, b] = shake(t, h, h >= 11.29 && h < 20 ? 18 : 10, 0.25); sx += a; sy += b; fl += flash(t, h, h >= 11.29 ? 0.3 : 0.18, 0.12); }
    const end = p(t, 22.15, 22.45);
    return { bg: r.bg, html: `<div class="layer" style="transform:translate(${sx}px,${sy}px)">${r.html}</div>` + whiteout(fl) + (end > 0 ? `<div class="layer" style="background:${INK};opacity:${end}"></div>` : '') };
  },
};

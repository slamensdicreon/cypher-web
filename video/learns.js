/* 7. It asks once. A 15-second cut to a reference track (about 101 BPM): a roll that builds for 3.5s,
 * a heavy drop on 3.80, hard hits to a dead stop at 15.2. The story is self-learning, in the site's words:
 * agencies ask the same question every project and bill you for it; Cypher asks once, every answer
 * becomes a rule, every build rewrites its own playbook, it finishes smarter than it started. Name one
 * vendor who can say that. Grit: film grain, colour split on the hits, a rubber stamp, hard cuts.
 *
 *   0.88 1.75 2.48   Same question. / Every project. / Every invoice.
 *   3.23             the eye snaps open; 3.49 it squints
 *   3.80 4.23        drop: Cypher asks / once.
 *   5.25 6.15 6.58   Every answer / becomes a rule.  LEARNED. (stamp)
 *   7.62 8.50 8.94   Every build / rewrites / its own playbook.  (the playbook's version climbs behind)
 *   9.96 10.86 11.30 It finishes / smarter / than it started.
 *  12.32 13.21 13.64 Name one vendor / who can / say that.
 *  14.68             the eye, the wordmark, the address. Hard stop.
 */

const LEARN_HITS = [0.88, 1.75, 2.48, 3.23, 3.8, 4.23, 5.25, 6.15, 6.58, 7.62, 8.5, 8.94, 9.96, 10.86, 11.3, 12.32, 13.21, 13.64, 14.68];
const HEAVY = new Set([3.8, 4.23, 5.25, 6.58, 7.62, 8.5, 9.96, 10.86, 12.32, 13.64, 14.68]);
const LEARN = [
  { t: 0, bg: INK, lines: [[0.88, 'Same question.', WHITE, 116], [1.75, 'Every project.', WHITE, 116], [2.48, 'Every invoice.', CORAL, 116]] },
  { t: 3.8, bg: CORAL, ink: true, lines: [[3.8, 'Cypher asks', INK], [4.23, 'once.', WHITE, 300]] },
  { t: 5.25, bg: INK, lines: [[5.25, 'Every answer', WHITE], [6.15, 'becomes a rule.', CORAL]], stamp: 6.58 },
  { t: 7.62, bg: VIOLET, lines: [[7.62, 'Every build', WHITE], [8.5, 'rewrites', WHITE], [8.94, 'its own playbook.', LAV]], counter: true },
  { t: 9.96, bg: WHITE, lines: [[9.96, 'It finishes', INK], [10.86, 'smarter', CORAL, 210], [11.3, 'than it started.', INK]] },
  { t: 12.32, bg: INK, lines: [[12.32, 'Name one vendor', WHITE], [13.21, 'who can', WHITE], [13.64, 'say that.', CORAL, 200]] },
  { t: 14.68, bg: INK, end: true, lines: [] },
];

function learnKeys() {
  return [
    { t: 0, gx: 0, gy: 0, open: 0, pr: 7 }, { t: 2.94, open: 0.25 }, { t: 3.23, open: 1.14, pr: 10.5 }, { t: 3.49, open: 0.52, pr: 7, gx: 0.2 },
    { t: 3.8, open: 1.05, pr: 9, gx: 0, gy: 0 }, { t: 4.4, open: 0.6, pr: 7 }, { t: 5.25, gx: 0.3, gy: 0.75, open: 0.75 },
    { t: 6.58, gx: 0, gy: 0.2, open: 1.1, pr: 5.5 }, { t: 6.9, open: 0.6, pr: 7.2 },
    // scanning the playbook as it rewrites itself
    { t: 7.62, gx: -0.9, gy: 0.4, open: 0.9 }, { t: 7.92, gx: 0.9 }, { t: 8.22, gx: -0.9 }, { t: 8.5, gx: 0.9 }, { t: 8.8, gx: -0.9 }, { t: 9.1, gx: 0.9 }, { t: 9.4, gx: 0, gy: 0, open: 0.6 },
    { t: 9.96, gx: 0.2, gy: 0.7, open: 0.8 }, { t: 10.86, gx: 0, gy: 0, open: 1.1, pr: 9.6 }, { t: 11.5, open: 0.55, pr: 7 },
    { t: 12.32, gx: -0.95, gy: 0.05, open: 0.72, pr: 6.6 }, { t: 13.21, gx: 0.95 }, { t: 13.64, gx: 0, gy: 0, open: 0.5, pr: 7 },
    { t: 14.68, gx: 0, gy: 0, open: 1.1, pr: 9.5 },
  ];
}

/** A headbang on the heavy hits, a nod on the rest. */
function bang(t) {
  let dy = 0, rot = 0, sq = 0, scale = 1;
  LEARN_HITS.forEach((h, i) => {
    const x = (t - h) / (HEAVY.has(h) ? 0.34 : 0.24);
    if (x < 0 || x > 1) return;
    const k = Math.sin(x * Math.PI) * (1 - x);
    const amp = HEAVY.has(h) ? 1 : 0.45;
    dy += 70 * U * amp * k;
    rot += (i % 2 ? 9 : -9) * amp * k;
    sq += 0.2 * amp * (1 - x) * (x < 0.3 ? 1 : 0);
    scale += 0.18 * amp * (1 - eo(x));
  });
  return { dy, rot, sx: 1 + sq, sy: 1 - sq, scale };
}

VIDEOS.learns = {
  id: 'learns', title: 'It asks once', dur: 15.2,
  eye: { keys: learnKeys(), blinks: [5.9, 11.9, 14.92] },

  scene(i, t) {
    const s = LEARN[i], L = land(), sq = H <= F;
    // Cypher
    let ex, ey, size;
    if (s.end) { ex = W / 2; ey = H / 2 - 110 * U; size = L ? 420 : 380; }
    else if (L) { ex = W * 0.24; ey = H / 2; size = 440; }
    else { ex = W / 2; ey = fy(sq ? 0.18 : 0.14); size = sq ? 250 : 300; }
    const b = bang(t);
    const colours = s.ink ? { ball: INK_RGB, pupil: CORAL_RGB, halo: 'rgba(20,20,51,.22)' } : { halo: s.bg === WHITE ? 'rgba(232,85,61,.24)' : 'rgba(232,85,61,.32)' };
    const open = t >= 0.2;
    const pop = s.end ? back(p(t, 14.68, 14.9)) : 1;
    const eye = open ? `<div class="layer" style="transform:translateY(${b.dy}px)"><div class="layer" style="transform-origin:${ex}px ${ey + (size * U) / 2}px;transform:rotate(${b.rot}deg) scale(${b.sx * b.scale * pop},${b.sy * b.scale * pop})">${eyeEl(pose(this, t), { x: ex, y: ey, size, bg: s.bg, ...colours })}</div></div>` : '';
    // the words, with a colour split on each hit
    const sc = L ? 0.82 : sq ? 0.76 : 1;
    const split = (t0) => { const x = clamp((t - t0) / 0.14); return x >= 1 ? '' : `text-shadow:${u(-10 * (1 - x))} 0 rgba(255,40,90,.75),${u(10 * (1 - x))} 0 rgba(40,220,255,.75);`; };
    const lines = s.lines.map(([t0, txt, c, size2 = 150]) => {
      const fz = size2 * sc;
      if (t < t0) return `<div class="tight" style="font-size:${u(fz)};visibility:hidden">${txt}</div>`;
      const jit = t - t0 < 0.08 ? `translate(${u(((t0 * 97) % 7) - 3.5)},0)` : '';
      return slam(t, t0, `<div class="tight" style="font-size:${u(fz)};color:${c};${split(t0)}transform:${jit || 'none'}">${txt}</div>`, 1.5);
    }).join('');
    const textEl = L ? `<div style="position:absolute;left:${W * 0.46}px;right:${u(70)};top:${H * 0.24}px">${lines}</div>` : block(fy(sq ? 0.42 : 0.36), lines);
    // LEARNED: a rubber stamp
    let stamp = '';
    if (s.stamp && t >= s.stamp) {
      const x = p(t, s.stamp, s.stamp + 0.16);
      const scl = lerp(2.4, 1, eo(x));
      const sx = L ? W * 0.66 : W * 0.5, sy = L ? H * 0.8 : fy(sq ? 0.76 : 0.85);
      stamp = `<div style="position:absolute;left:${sx}px;top:${sy}px;transform:translate(-50%,-50%) rotate(-11deg) scale(${scl});opacity:${clamp(x * 3)};
        border:${u(10)} solid ${CORAL};border-radius:${u(18)};padding:${u(10)} ${u(34)};color:${CORAL};font-size:${u(L ? 120 : 130)};font-weight:800;letter-spacing:.04em;overflow:hidden">LEARNED.</div>`;
    }
    // the playbook's version, climbing behind the words
    let counter = '';
    if (s.counter) {
      const v = 1 + Math.floor(eio(p(t, 7.7, 9.9)) * 11);
      counter = `<div style="position:absolute;right:${u(40)};bottom:${L || sq ? u(30) : (H - fy(1.0)) + 'px'};${L ? '' : ''}text-align:right;line-height:.85;opacity:.9">
        <div style="font-size:${u(40)};font-weight:700;letter-spacing:.3em;color:${LAV}">PLAYBOOK</div>
        <div style="font-size:${u(L ? 220 : sq ? 190 : 240)};font-weight:800;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:${u(3)} ${LAV}">v${v}</div></div>`;
    }
    // the end: the wordmark and the address under the eye
    let end = '';
    if (s.end) {
      const a = eo(p(t, 14.72, 14.95));
      end = `<div style="position:absolute;left:0;right:0;top:${ey + (size * U) / 2 + 40 * U}px;text-align:center;opacity:${a};transform:translateY(${u(20 * (1 - a))})">
        <div style="display:flex;justify-content:center">${wordmark(96)}</div>
        <div style="display:inline-block;margin-top:${u(30)};padding:${u(20)} ${u(40)};border-radius:999px;background:${WHITE};color:${INK};font-size:${u(50)};letter-spacing:-.02em">ignoranceisbliss.ai</div></div>`;
    }
    // the address rides along through the drop
    const tagC = s.ink ? 'rgba(20,20,51,.7)' : s.bg === WHITE ? MUTED : LAV;
    const tag = t >= 3.8 && !s.end ? `<div style="position:absolute;left:${u(L ? 70 : 96)};bottom:${L ? u(40) + '' : (H - fy(1.0) + 10 * U) + 'px'};font-size:${u(30)};font-weight:700;letter-spacing:.06em;color:${tagC}">ignoranceisbliss.ai</div>` : '';
    return { bg: s.bg, html: counter + textEl + stamp + end + tag + eye };
  },

  frame(t) {
    let i = 0;
    while (i + 1 < LEARN.length && LEARN[i + 1].t <= t) i++;
    const r = i === 0 ? this.scene(0, t) : wipe(t, LEARN[i].t, () => this.scene(i - 1, t), () => this.scene(i, t), 0.06);
    let sx = 0, sy = 0, fl = 0, zoom = 1;
    for (const h of LEARN_HITS) {
      const heavy = HEAVY.has(h);
      const [a, b] = shake(t, h, heavy ? 22 : 10, heavy ? 0.3 : 0.2); sx += a; sy += b;
      fl += flash(t, h, heavy ? 0.42 : 0.2, 0.1);
      if (t >= h && t < h + 0.25) zoom += (heavy ? 0.06 : 0.025) * (1 - eo(p(t, h, h + 0.25)));
    }
    // film grain, moving every frame
    const f = Math.round(t * 30);
    const gx = (f * 137) % 512, gy = (f * 271) % 512;
    const grain = `<div class="layer" style="background:url(assets/learns/grain.png) ${-gx}px ${-gy}px;background-size:512px;mix-blend-mode:overlay;opacity:.22"></div>`;
    const vignette = `<div class="layer" style="background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,${r.bg === WHITE ? 0.14 : 0.35}) 100%)"></div>`;
    // the dark before the drop flickers on the roll
    const flick = t < 3.8 && t > 0.8 ? 0.06 * (Math.sin(t * 61) > 0.6 ? 1 : 0) : 0;
    // the grain texture as an <img> too, so the renderer waits for it before capturing (the stamp is masked with it)
    const preload = '<img src="assets/learns/grain.png" style="position:absolute;width:1px;height:1px;opacity:0">';
    return { bg: r.bg, html: preload + `<div class="layer" style="transform:translate(${sx}px,${sy}px) scale(${zoom})">${r.html}</div>` + vignette + grain + whiteout(fl + flick) };
  },
};

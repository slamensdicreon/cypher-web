/**
 * The eye as a small physics system. Flat shapes, real behaviour: every part is a damped spring,
 * so it accelerates, overshoots a little and settles, the way an eyeball in a socket does.
 *
 * - Gaze: fast saccades with a slight overshoot, smooth pursuit of the pointer, and micro-saccades
 *   while fixating, so it is never perfectly still.
 * - The ball (the red disc): follows the gaze with lag and squashes along its velocity, like
 *   something soft and heavy. Scrolling the page shakes it.
 * - Lids: close fast, open softly, sit lower when the eye looks down, and cover the pupil
 *   rather than squashing it.
 * - Pupil: springs when it dilates, foreshortens into an ellipse as it looks to the side, and
 *   drifts a touch in size (hippus).
 *
 * At rest the drawing is identical to the static design.
 */

export type RGB = readonly [number, number, number];

/** The shape of one eye: the disc, the almond (its corners and lid control points), the pupil. */
export type Geo = {
  bg: RGB;
  xl: number;
  xr: number;
  yT: number;
  yB: number;
  /** Almond fill opacity: 0 draws it as an outline. */
  fill: number;
  /** Almond stroke width. */
  sw: number;
  /** Pupil radius. */
  pr: number;
  pc: RGB;
  /** How much the eye can look around and blink: 0 for the closed, resting eye. */
  look: number;
};

const INK: RGB = [20, 20, 51];
const WHITE: RGB = [255, 255, 255];
const CORAL: RGB = [232, 85, 61];

/** The hero eye: a coral disc, a white almond, an ink pupil. */
export const HERO_GEO: Geo = { bg: CORAL, xl: 18, xr: 54, yT: 20, yB: 52, fill: 1, sw: 0, pr: 7, pc: INK, look: 1 };

/** The interest dial, one shape per level: resting, interested, need it, take our budget. */
const DIAL_GEO: Geo[] = [
  { bg: INK, xl: 20, xr: 52, yT: 50, yB: 50, fill: 0, sw: 4, pr: 0, pc: WHITE, look: 0 },
  { bg: INK, xl: 18, xr: 54, yT: 20, yB: 52, fill: 0, sw: 3.5, pr: 5, pc: WHITE, look: 1 },
  { bg: INK, xl: 16, xr: 56, yT: 16, yB: 56, fill: 1, sw: 0, pr: 9, pc: INK, look: 1 },
  { bg: CORAL, xl: 16, xr: 56, yT: 16, yB: 56, fill: 1, sw: 0, pr: 9.5, pc: INK, look: 1 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const n = (v: number) => Math.round(v * 100) / 100;
const rgb = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

/** The dial's shape at any point between levels, so dragging morphs it continuously. */
export function dialGeo(level: number): Geo {
  const c = clamp(level, 0, 3);
  const i = Math.min(2, Math.floor(c));
  const t = c - i;
  const a = DIAL_GEO[i];
  const b = DIAL_GEO[i + 1];
  return {
    bg: mix(a.bg, b.bg, t),
    xl: lerp(a.xl, b.xl, t),
    xr: lerp(a.xr, b.xr, t),
    yT: lerp(a.yT, b.yT, t),
    yB: lerp(a.yB, b.yB, t),
    fill: lerp(a.fill, b.fill, t),
    sw: lerp(a.sw, b.sw, t),
    pr: lerp(a.pr, b.pr, t),
    pc: mix(a.pc, b.pc, t),
    look: lerp(a.look, b.look, t),
  };
}

/** Everything that moves, at one instant. */
export type Pose = {
  geo: Geo;
  gx: number;
  gy: number;
  open: number;
  pr: number;
  bx: number;
  by: number;
  bvx: number;
  bvy: number;
};

export const rest = (geo: Geo): Pose => ({ geo, gx: 0, gy: 0, open: 1, pr: geo.pr, bx: 0, by: 0, bvx: 0, bvy: 0 });

export type Drawing = {
  bg: string;
  ballT: string;
  lookT: string;
  d: string;
  fo: number;
  sw: number;
  pupilT: string;
  pr: number;
  pc: string;
};

/** Where the lids meet when closed: a soft downward curve, as in the static design. */
const CLOSED = 40;
/** How far the ball travels, in viewBox units, per unit of lag. */
const BALL = 3;

/** Turns a pose into SVG attributes. Pure, so the server renders the same first frame. */
export function draw(p: Pose): Drawing {
  const g = p.geo;
  const L = g.look;
  const gx = p.gx * L;
  const gy = p.gy * L;
  const open = 1 - (1 - p.open) * L;

  // Lids: close toward the meeting curve; the upper lid follows the gaze down and up.
  const yT = CLOSED + (g.yT - CLOSED) * open + gy * 2.4 * open;
  const yB = CLOSED + (g.yB - CLOSED) * open + gy * 0.8 * open;
  // A closing lid thickens into the soft white line of the shut eye.
  const sw = lerp(g.sw, 4, clamp(1 - open, 0, 1));
  const d = `M${n(g.xl)} 36 Q36 ${n(yT)} ${n(g.xr)} 36 Q36 ${n(yB)} ${n(g.xl)} 36 Z`;

  // The almond rides on the ball and foreshortens as it turns away from the viewer.
  const tx = gx * 9 + p.bx * BALL;
  const ty = gy * 7 + p.by * BALL;
  const sx = 1 - 0.1 * Math.abs(gx);
  const sy = 1 - 0.08 * Math.abs(gy);
  const lookT = `translate(${n(tx)} ${n(ty)}) translate(36 36) scale(${n(sx * 1000) / 1000} ${n(sy * 1000) / 1000}) translate(-36 -36)`;

  // The pupil leads the almond a little (depth) and flattens along the direction it looks.
  const m = Math.min(1, Math.hypot(gx, gy));
  const ang = (Math.atan2(gy, gx) * 180) / Math.PI;
  const pupilT = `translate(${n(36 + gx * 2.4)} ${n(36 + gy * 1.8)}) rotate(${n(ang)}) scale(${n((1 - 0.22 * m) * 1000) / 1000} 1)`;

  // The ball squashes along its own velocity.
  const v = Math.hypot(p.bvx, p.bvy);
  const s = Math.min(0.13, v * 0.011);
  const ba = (Math.atan2(p.bvy, p.bvx) * 180) / Math.PI;
  const ballT = `translate(${n(p.bx * BALL)} ${n(p.by * BALL)}) translate(36 36) rotate(${n(ba)}) scale(${n((1 + s) * 1000) / 1000} ${n((1 - s * 0.8) * 1000) / 1000}) rotate(${n(-ba)}) translate(-36 -36)`;

  return { bg: rgb(g.bg), ballT, lookT, d, fo: n(g.fill), sw: n(sw), pupilT, pr: n(Math.max(0, p.pr)), pc: rgb(g.pc) };
}

/** A damped spring. `k` is stiffness, `z` the damping ratio (1 is critical, below 1 overshoots). */
class Spring {
  v = 0;
  t: number;
  constructor(public x: number, public k: number, public z: number) {
    this.t = x;
  }
  step(dt: number) {
    const w = Math.sqrt(this.k);
    this.v += (this.k * (this.t - this.x) - 2 * this.z * w * this.v) * dt;
    this.x += this.v * dt;
  }
  snap(x: number) {
    this.x = this.t = x;
    this.v = 0;
  }
}

export type EyeEls = {
  svg: SVGSVGElement;
  ball: SVGEllipseElement;
  look: SVGGElement;
  almond: SVGPathElement;
  clip: SVGPathElement;
  pupil: SVGEllipseElement;
  halo?: HTMLElement | null;
};

export type Wander = 'hero' | 'dial';

export type EyeAction =
  | 'blink'
  | 'double'
  | 'squint'
  | 'widen'
  | 'calm'
  | 'wake'
  | 'focus'
  | 'unfocus'
  | 'look'
  | 'scan'
  | 'shake'
  | 'delight'
  | 'mood';

export type EyeEvent = { action: EyeAction; ms?: number; x?: number; y?: number; v?: number };

const rand = Math.random;

export class EyeEngine {
  private gx = new Spring(0, 520, 0.5);
  private gy = new Spring(0, 520, 0.5);
  private bx = new Spring(0, 80, 0.28);
  private by = new Spring(0, 80, 0.28);
  private open = new Spring(1, 320, 0.62);
  private pr: Spring;
  private lv: Spring | null;
  private mood = new Spring(0, 30, 1);
  private fixed: Geo | null;

  private auto = { x: 0, y: 0 };
  private jit = { x: 0, y: 0 };
  private nextJit = 0;
  private forced: { x: number; y: number } | null = null;
  private hold: { x: number; y: number; until: number } | null = null;
  private pointer: { x: number; y: number; t: number } | null = null;
  private shut = false;
  private squintUntil = 0;
  private widenUntil = 0;
  private breath = 0;
  private clock = 0;

  private raf = 0;
  private last = 0;
  private visible = true;
  private alive = true;
  private reduced: boolean;
  private lastScroll = 0;
  private io: IntersectionObserver | null = null;
  private off: Array<() => void> = [];

  constructor(
    private els: EyeEls,
    opts: { geo?: Geo; level?: number; wander: Wander },
  ) {
    this.fixed = opts.geo ?? null;
    this.lv = opts.geo ? null : new Spring(opts.level ?? 1, 230, 0.5);
    this.pr = new Spring(this.geo().pr, 170, 0.4);
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onEye = (e: Event) => this.act((e as CustomEvent<EyeEvent>).detail);
    window.addEventListener('cypher:eye', onEye);
    this.off.push(() => window.removeEventListener('cypher:eye', onEye));

    if (this.reduced) {
      this.render();
      return;
    }

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && e.pressure === 0) return;
      this.pointer = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    this.off.push(() => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
    });

    // Scrolling moves the page under the eye; the soft ball lags behind it.
    this.lastScroll = window.scrollY;
    const onScroll = () => {
      const d = window.scrollY - this.lastScroll;
      this.lastScroll = window.scrollY;
      this.by.v += clamp(d * 0.35, -16, 16);
      if (opts.wander === 'hero' && Math.abs(d) > 40) this.auto = { x: 0, y: d > 0 ? 0.9 : -0.6 };
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.off.push(() => window.removeEventListener('scroll', onScroll));

    const onVis = () => (document.hidden ? this.stop() : this.start());
    document.addEventListener('visibilitychange', onVis);
    this.off.push(() => document.removeEventListener('visibilitychange', onVis));

    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.start();
      else this.stop();
    });
    this.io.observe(els.svg);

    this.start();
    this.live(opts.wander);
  }

  destroy() {
    this.alive = false;
    this.stop();
    this.io?.disconnect();
    this.off.forEach((f) => f());
  }

  /** The dial's level, continuous: the shape springs toward it. */
  setLevel(level: number) {
    if (!this.lv) return;
    if (this.reduced) {
      this.lv.snap(level);
      this.pr.snap(this.geo().pr);
      this.render();
      return;
    }
    this.lv.t = level;
  }

  private geo(): Geo {
    return this.fixed ?? dialGeo(this.lv!.x);
  }

  private start() {
    if (this.raf || this.reduced || !this.alive || !this.visible || document.hidden) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /** Where a point on the screen is, as a gaze direction from this eye's centre. */
  private dirTo(px: number, py: number): [number, number] {
    const r = this.els.svg.getBoundingClientRect();
    if (!r.width) return [0, 0];
    const dx = px - (r.left + r.width / 2);
    const dy = py - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy);
    if (d < 1) return [0, 0];
    const f = d / (d + r.width * 0.8);
    return [clamp((dx / d) * f, -1, 1), clamp((dy / d) * f * 1.1, -1, 1)];
  }

  private frame = (ts: number) => {
    this.raf = 0;
    if (!this.alive) return;
    const dt = Math.min(0.034, Math.max(0.001, (ts - this.last) / 1000));
    this.last = ts;
    this.clock += dt;
    const now = performance.now();

    // What to look at: a forced move, then something the page points at, then the pointer, then its own ideas.
    let tx = this.auto.x;
    let ty = this.auto.y;
    if (this.forced) [tx, ty] = [this.forced.x, this.forced.y];
    else if (this.hold && now < this.hold.until) [tx, ty] = this.dirTo(this.hold.x, this.hold.y);
    else if (this.pointer && now - this.pointer.t < 2600) [tx, ty] = this.dirTo(this.pointer.x, this.pointer.y);

    // Micro-saccades: a fixating eye is never perfectly still.
    if (now > this.nextJit) {
      this.jit = { x: (rand() - 0.5) * 0.09, y: (rand() - 0.5) * 0.07 };
      this.nextJit = now + 300 + rand() * 1500;
    }
    this.gx.t = clamp(tx + this.jit.x, -1, 1);
    this.gy.t = clamp(ty + this.jit.y, -1, 1);

    // Lids: shut fast, open soft, a little wider when startled.
    const wide = now < this.widenUntil;
    const openTarget = this.shut ? 0 : now < this.squintUntil ? 0.6 : wide ? 1.08 : 1;
    this.open.t = openTarget;
    if (openTarget < this.open.x) {
      this.open.k = 1600;
      this.open.z = 0.9;
    } else {
      this.open.k = 300;
      this.open.z = 0.6;
    }

    const geo = this.geo();
    const mood = this.mood.x;
    const hippus = geo.pr > 0 ? 0.14 * Math.sin(this.clock * 1.3) * Math.sin(this.clock * 0.53 + 1) : 0;
    this.pr.t = geo.pr * (wide ? 1.36 : 1) * (1 + 0.08 * mood) + hippus;

    // Two substeps keep the stiff springs stable on slow frames.
    const h = dt / 2;
    for (let i = 0; i < 2; i++) {
      this.gx.step(h);
      this.gy.step(h);
      this.bx.t = this.gx.x * geo.look;
      this.by.t = this.gy.x * geo.look;
      this.bx.step(h);
      this.by.step(h);
      this.open.step(h);
      this.pr.step(h);
      this.mood.step(h);
      this.lv?.step(h);
    }

    this.render(dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  private render(dt = 0) {
    const pose: Pose = {
      geo: this.geo(),
      gx: this.gx.x,
      gy: this.gy.x,
      open: this.open.x,
      pr: this.pr.x,
      bx: this.bx.x - this.gx.x * this.geo().look,
      by: this.by.x - this.gy.x * this.geo().look,
      bvx: this.bx.v,
      bvy: this.by.v,
    };
    // The ball sits where the gaze pulls it, plus whatever lag and wobble it carries.
    pose.bx += this.gx.x * 0.45;
    pose.by += this.gy.x * 0.45;
    const d = draw(pose);
    const { ball, look, almond, clip, pupil, halo } = this.els;
    ball.setAttribute('transform', d.ballT);
    ball.setAttribute('fill', d.bg);
    look.setAttribute('transform', d.lookT);
    almond.setAttribute('d', d.d);
    almond.setAttribute('fill-opacity', String(d.fo));
    almond.setAttribute('stroke-width', String(d.sw));
    clip.setAttribute('d', d.d);
    pupil.setAttribute('transform', d.pupilT);
    pupil.setAttribute('rx', String(d.pr));
    pupil.setAttribute('ry', String(d.pr));
    pupil.setAttribute('fill', d.pc);

    if (halo && !this.reduced) {
      const m = this.mood.x;
      this.breath += (dt * Math.PI * 2) / (4.5 - 1.8 * m);
      const sq = Math.min(0.06, Math.hypot(this.bx.v, this.by.v) * 0.004);
      const scale = 1 + (0.07 + 0.03 * m) * (0.5 - 0.5 * Math.cos(this.breath)) + sq;
      halo.style.transform = `translate(${n(pose.bx * 5)}px, ${n(pose.by * 5)}px) scale(${n(scale * 1000) / 1000})`;
      halo.style.setProperty('--mood', String(n(m)));
    }
  }

  private wait(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
  }

  private kick(vx: number, vy: number) {
    this.bx.v += vx;
    this.by.v += vy;
  }

  async blink(double = false) {
    if (this.reduced || this.geo().look < 0.5) return;
    this.shut = true;
    this.kick(0, 2.5);
    await this.wait(80);
    this.shut = false;
    if (double) {
      await this.wait(150);
      this.shut = true;
      await this.wait(70);
      this.shut = false;
    }
  }

  async squint(ms = 700) {
    this.squintUntil = performance.now() + ms;
    await this.wait(ms);
  }

  async widen(ms = 900) {
    this.widenUntil = performance.now() + ms;
    this.kick(0, -3);
    await this.wait(ms);
  }

  async glance(x: number, y: number, hold = 1200) {
    this.auto = { x, y };
    await this.wait(hold);
  }

  async roll() {
    for (let i = 0; i <= 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      this.auto = { x: Math.cos(a), y: Math.sin(a) * 0.8 };
      await this.wait(60);
    }
    this.auto = { x: 0, y: 0 };
  }

  /** Reading: quick saccades along a line, then a return sweep. */
  async scan(ms = 1400) {
    if (this.reduced) return;
    const end = performance.now() + ms;
    while (this.alive && performance.now() < end) {
      for (const x of [-0.6, -0.25, 0.1, 0.45]) {
        this.forced = { x, y: 0.3 };
        await this.wait(115);
      }
    }
    this.forced = null;
  }

  /** No. A head-shake, carried by the springs. */
  async shake() {
    if (this.reduced) return;
    for (const x of [0.6, -0.6, 0.45, -0.35, 0.15]) {
      this.forced = { x, y: 0.1 };
      this.kick(x * 6, 0);
      await this.wait(95);
    }
    this.forced = null;
  }

  async delight() {
    if (this.reduced) return;
    this.kick(0, -16);
    this.widen(900);
    await this.wait(260);
    await this.blink(true);
  }

  private act(e: EyeEvent | undefined) {
    if (!e) return;
    const halo = this.els.halo;
    switch (e.action) {
      case 'blink': this.blink(false); break;
      case 'double': this.blink(true); break;
      case 'squint': this.squint(e.ms); break;
      case 'widen': this.widen(e.ms); break;
      case 'calm': halo?.classList.add('calm'); break;
      case 'wake': halo?.classList.remove('calm'); break;
      case 'focus': this.widen(e.ms ?? 700); break;
      case 'unfocus': this.hold = null; break;
      case 'look':
        if (e.x !== undefined && e.y !== undefined) this.hold = { x: e.x, y: e.y, until: performance.now() + (e.ms ?? 1600) };
        break;
      case 'scan': this.scan(e.ms); break;
      case 'shake': this.shake(); break;
      case 'delight': this.delight(); break;
      case 'mood': this.mood.t = clamp(e.v ?? 0, 0, 1); break;
    }
  }

  /** A mind of its own. */
  private async live(wander: Wander) {
    const r = rand;
    const hero: Array<() => Promise<void>> = [
      () => this.blink(), () => this.blink(), () => this.blink(true),
      () => this.glance(r() * 2 - 1, (r() * 2 - 1) * 0.7, 900 + r() * 1600),
      () => this.glance(0, 0, 1400),
      async () => { await this.glance(r() < 0.5 ? -1 : 1, -0.2, 700); await this.glance(0, 0, 600); },
      () => this.squint(650), () => this.widen(900), () => this.roll(),
      async () => { await this.glance(0, 0.9, 500); await this.blink(); await this.glance(0, 0, 400); },
      async () => { await this.glance(-1, 0.3, 600); await this.glance(1, 0.3, 600); await this.glance(0, 0, 500); },
      async () => { this.squint(300); await this.wait(300); await this.blink(true); },
    ];
    const dial: Array<() => Promise<void>> = [
      () => this.blink(), () => this.blink(), () => this.blink(true),
      () => this.glance((r() * 2 - 1) * 0.6, (r() * 2 - 1) * 0.4, 700 + r() * 900),
      () => this.glance(0, 0, 900),
    ];
    const moves = wander === 'hero' ? hero : dial;
    while (this.alive) {
      if (this.visible && !document.hidden) {
        try {
          await moves[Math.floor(r() * moves.length)]();
        } catch {
          /* keep living */
        }
      }
      await this.wait(wander === 'hero' ? 600 + r() * 1800 : 1400 + r() * 2600);
    }
  }
}

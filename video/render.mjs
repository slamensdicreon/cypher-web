// Renders the Cypher social videos to MP4, frame by frame.
//
//   node video/render.mjs                      all videos, vertical (1080×1920) and square (1080×1080)
//   node video/render.mjs receipt              one video, both formats
//   node video/render.mjs receipt --stills 1,4.5,7   PNG stills at those seconds, to check a layout
//   --out <dir>   where the files go (default: video/out)
//
// Needs Playwright's Chromium and ffmpeg. Each frame is a pure function of time (videos.js), so
// renders are exact and repeatable.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, '..', 'package.json'));
const { chromium } = require('playwright');
const ts = require('typescript');

const FPS = 30;
const FORMATS = { vertical: [1080, 1920], square: [1080, 1080] };

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const outDir = resolve(opt('--out') ?? join(here, 'out'));
const stills = opt('--stills')?.split(',').map(Number);
const only = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const formats = opt('--format') ? [opt('--format')] : Object.keys(FORMATS);

// The eye, from the site's own engine: TypeScript to a plain script that defines draw() and HERO_GEO.
const src = readFileSync(join(here, '..', 'lib', 'eyeEngine.ts'), 'utf8');
const js = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } }).outputText;
const body = js.replace(/^export\s+/gm, '').replace(/^\s*export\s*\{\s*\};?\s*$/gm, '');
writeFileSync(join(here, 'eye.js'), `(() => {\n${body}\nwindow.draw = draw;\nwindow.HERO_GEO = HERO_GEO;\n})();\n`);

mkdirSync(outDir, { recursive: true });

// The Floor footage for "Under the hood", as numbered JPEG frames the player can show one at a time.
const floorDir = join(here, '.cache', 'floor');
if (!existsSync(join(floorDir, 'f_0001.jpg'))) {
  mkdirSync(floorDir, { recursive: true });
  const r = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', join(here, 'assets', 'hood', 'floor.mp4'), '-q:v', '2', join(floorDir, 'f_%04d.jpg')], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('could not extract the Floor frames');
}
const browser = await chromium.launch();

for (const format of formats) {
  const [w, h] = FORMATS[format];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
  await page.goto(pathToFileURL(join(here, 'player.html')).href);
  await page.evaluate(() => document.fonts.ready);
  const all = await page.evaluate(() => Object.values(window.VIDEOS).map((v) => ({ id: v.id, dur: v.dur })));
  const list = only.length ? all.filter((v) => only.includes(v.id)) : all;

  for (const v of list) {
    if (stills) {
      for (const t of stills) {
        await page.evaluate(([id, t, fps]) => window.renderFrame(id, t, fps), [v.id, t, FPS]);
        await page.evaluate(() => document.fonts.ready);
        const file = join(outDir, `${v.id}-${format}-${t}s.png`);
        await page.screenshot({ path: file });
        console.log(file);
      }
      continue;
    }
    const file = join(outDir, `cypher-${v.id}-${format}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((ok, fail) => ff.on('close', (c) => (c === 0 ? ok() : fail(new Error('ffmpeg exited ' + c)))));
    const frames = Math.round(v.dur * FPS);
    for (let f = 0; f < frames; f++) {
      await page.evaluate(([id, t, fps]) => window.renderFrame(id, t, fps), [v.id, f / FPS, FPS]);
      const png = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await done;
    // A cover image for each video: the frame where the hook lands.
    console.log(file, `${frames} frames`);
  }
  await page.close();
}
await browser.close();

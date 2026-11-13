// Renders the social kit: node brand/render.mjs [--guides] [--out dir]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, '..', 'package.json'));
const { chromium } = require('playwright');
const ts = require('typescript');
const args = process.argv.slice(2);
const guides = args.includes('--guides');
const out = resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : join(here, 'out'));
mkdirSync(out, { recursive: true });
const js = ts.transpileModule(readFileSync(join(here, '..', 'lib', 'eyeEngine.ts'), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } }).outputText;
writeFileSync(join(here, 'eye.js'), `(() => {\n${js.replace(/^export\s+/gm, '').replace(/^\s*export\s*\{\s*\};?\s*$/gm, '')}\nwindow.draw = draw;\nwindow.HERO_GEO = HERO_GEO;\n})();\n`);
const jobs = [
  ['avatar-ink'], ['avatar-coral'], ['avatar-white'],
  ['linkedin-company'], ['linkedin-personal'], ['x-header'], ['youtube'], ['facebook-cover'], ['bluesky-banner'],
  ['linkedin-company', 'proof'], ['linkedin-company', 'learn'], ['x-header', 'proof'], ['x-header', 'learn'], ['linkedin-personal', 'proof'], ['linkedin-personal', 'learn'],
];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 3000, height: 1500 } });
await p.goto(pathToFileURL(join(here, 'kit.html')).href);
await p.evaluate(() => document.fonts.ready);
for (const [name, variant = 'brand'] of jobs) {
  const { w, h } = await p.evaluate(([n, v, g]) => window.render(n, v, g), [name, variant, guides]);
  await p.evaluate(() => document.fonts.ready);
  const file = join(out, `cypher-${name}${variant !== 'brand' ? '-' + variant : ''}-${w}x${h}${guides ? '-guides' : ''}.png`);
  await p.locator('#a').screenshot({ path: file });
  console.log(file.split('/').pop());
}
await b.close();

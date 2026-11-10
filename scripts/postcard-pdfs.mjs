// Renders the print run to PDFs for the admin's downloads: one per card at trim (4.25 × 5.5 in) and with
// bleed (4.5 × 5.75 in), plus a ZIP of all of them, into assets/print/. Run it after changing a card:
//
//   ADMIN_PIN=… IP_HASH_SECRET=… npx next build && ADMIN_PIN=… IP_HASH_SECRET=… npx next start -p 3100
//   ADMIN_PIN=… IP_HASH_SECRET=… node scripts/postcard-pdfs.mjs [http://localhost:3100]
//
// The PIN and secret only sign a local session cookie (the same way lib/adminToken.ts does); use any
// values, as long as the server was started with the same ones.
import { createHmac } from 'node:crypto';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const { chromium } = require('playwright');
const { zipSync } = require('fflate');

const base = process.argv[2] ?? 'http://localhost:3100';
const pin = (process.env.ADMIN_PIN || '').trim();
if (!pin) throw new Error('Set ADMIN_PIN (the same value the server was started with).');
const key = createHmac('sha256', `cypher-admin:${pin}`).update(process.env.IP_HASH_SECRET || process.env.ADMIN_KEY || '').digest();
const exp = Date.now() + 3600_000;
const token = `${exp}.${createHmac('sha256', key).update(String(exp)).digest('hex')}`;

const out = join(root, 'assets', 'print');
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (/\.(pdf|zip)$/.test(f)) rmSync(join(out, f));

const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addCookies([{ name: 'cy_admin', value: token, url: base }]);
const page = await ctx.newPage();
const files = {};
for (const mode of ['trim', 'bleed']) {
  await page.goto(`${base}/postcards${mode === 'bleed' ? '?bleed=1' : ''}`, { waitUntil: 'networkidle' });
  const cards = await page.$$eval('.qcw', (els) => els.map((e) => e.dataset.file));
  if (!cards.length || cards.includes(undefined)) throw new Error('No cards on /postcards (is the server running, and signed in?)');
  for (const name of cards) {
    await page.goto(`${base}/postcards${mode === 'bleed' ? '?bleed=1' : ''}`, { waitUntil: 'networkidle' });
    await page.$$eval('.qcw', (els, keep) => els.forEach((e) => e.dataset.file !== keep && e.remove()), name);
    await page.emulateMedia({ media: 'print' });
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const file = `${name}-${mode}.pdf`;
    writeFileSync(join(out, file), pdf);
    files[`${mode}/${file}`] = new Uint8Array(pdf);
    console.log(file);
    await page.emulateMedia({ media: 'screen' });
  }
}
writeFileSync(join(out, 'cypher-postcards-print-run.zip'), zipSync(files, { level: 6 }));
console.log('cypher-postcards-print-run.zip');
await browser.close();

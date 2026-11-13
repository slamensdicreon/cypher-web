// Renders the print run to PDFs for the admin's downloads: one per card at trim (4.25 × 5.5 in) and with
// bleed (4.5 × 5.75 in), plus a ZIP of all of them, into public/admin/assets/files/print/. Run it after changing a card,
// against a local server and a local (or branch) database:
//
//   DATABASE_URL=… npx next build && DATABASE_URL=… npx next start -p 3100
//   DATABASE_URL=… node scripts/postcard-pdfs.mjs [http://localhost:3100]
//
// It signs in by writing a short-lived session for a throwaway "pdf-render" Owner straight into that
// database (the same shape lib/auth/session.ts uses), and removes it afterwards. Never point it at
// production.
import { createHash, randomBytes } from 'node:crypto';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const { chromium } = require('playwright');
const { zipSync } = require('fflate');
const postgres = require('postgres');

const base = process.argv[2] ?? 'http://localhost:3100';
const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl) throw new Error('Set DATABASE_URL (the same database the local server uses).');
const sql = postgres(dbUrl, { prepare: false, onnotice: () => {} });
const token = randomBytes(32).toString('base64url');
const [renderer] = await sql`
  insert into users (email, name, roles) values ('pdf-render@localhost', 'PDF render', ${['owner']})
  on conflict (lower(email)) do update set status = 'active' returning id`;
await sql`insert into sessions (user_id, token_hash, expires_at, fresh_until, method)
          values (${renderer.id}, ${createHash('sha256').update(token).digest('hex')}, now() + interval '1 hour', now(), 'script')`;

const out = join(root, 'public', 'admin', 'assets', 'files', 'print');
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (/\.(pdf|zip)$/.test(f)) rmSync(join(out, f));

const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addCookies([{ name: 'cy_session', value: token, url: base }]);
const page = await ctx.newPage();
const files = {};
for (const mode of ['trim', 'bleed']) {
  await page.goto(`${base}/admin/assets/postcards${mode === 'bleed' ? '?bleed=1' : ''}`, { waitUntil: 'networkidle' });
  const cards = await page.$$eval('.qcw', (els) => els.map((e) => e.dataset.file));
  if (!cards.length || cards.includes(undefined)) throw new Error('No cards on /admin/assets/postcards (is the server running, and signed in?)');
  for (const name of cards) {
    await page.goto(`${base}/admin/assets/postcards${mode === 'bleed' ? '?bleed=1' : ''}`, { waitUntil: 'networkidle' });
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
await sql`delete from users where id = ${renderer.id}`;
await sql.end();

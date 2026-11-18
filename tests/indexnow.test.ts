/** IndexNow sends only new, changed or removed pages, and nothing outside production. Needs TEST_DATABASE_URL. */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

const url = process.env.TEST_DATABASE_URL || '';
const skip = !url && 'set TEST_DATABASE_URL to run the database tests';
process.env.DATABASE_URL = url;

let ix: typeof import('../lib/indexnow');
let store: typeof import('../lib/store');
const realFetch = globalThis.fetch;
const pages = new Map<string, string>();
const sent: string[][] = [];
let reads = 0;

before(async () => {
  if (skip) return;
  store = await import('../lib/store');
  await store.migrate();
  await store.sql!`delete from indexnow_pages`;
  ix = await import('../lib/indexnow');
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const u = String(input);
    if (u.startsWith('https://api.indexnow.org/')) {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.key, ix.INDEXNOW_KEY);
      assert.match(body.keyLocation, /\/indexnow\.txt$/);
      sent.push(body.urlList);
      return new Response('', { status: 200 });
    }
    reads++;
    return new Response(`<html><head><script>build ${Math.random()}</script></head><body><main><h1>${pages.get(u) ?? u}</h1></main><footer>${Math.random()}</footer></body></html>`, { status: 200 });
  }) as typeof fetch;
});

after(async () => {
  globalThis.fetch = realFetch;
  delete process.env.VERCEL_ENV;
  if (!skip) await store.sql!.end();
});

test('the fingerprint is the words in <main>, not the build around them', { skip }, () => {
  const a = ix.mainText('<script>x1</script><main class="a"><p>Hello <b>there</b></p><script>y</script></main><footer>1</footer>');
  const b = ix.mainText('<script>x2</script><main class="b"><p>Hello   <i>there</i></p></main><footer>2</footer>');
  assert.equal(a, 'Hello there');
  assert.equal(a, b);
});

test('outside production nothing is read or sent', { skip }, async () => {
  delete process.env.VERCEL_ENV;
  const r = await ix.runIndexNow();
  assert.deepEqual(r.result, { skipped: 'not production' });
  assert.equal(reads, 0);
  assert.equal(sent.length, 0);
});

test('first run sends every page; an unchanged run sends nothing; a change sends just that page', { skip }, async () => {
  process.env.VERCEL_ENV = 'production';
  const first = await ix.runIndexNow();
  assert.equal(first.failed.length, 0);
  assert.ok(first.sent.length >= 40, `sent ${first.sent.length}`);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].length, first.sent.length);

  const second = await ix.runIndexNow();
  assert.equal(second.sent.length, 0);
  assert.deepEqual(second.result, { skipped: 'nothing to send' });
  assert.equal(sent.length, 1);

  const proof = first.sent.find((u) => u.endsWith('/security'))!;
  pages.set(proof, 'New words on the security page');
  const third = await ix.runIndexNow();
  assert.deepEqual(third.sent, [proof]);
  assert.deepEqual(sent[1], [proof]);
});

test('a page that leaves the sitemap is sent once, then forgotten', { skip }, async () => {
  process.env.VERCEL_ENV = 'production';
  const gone = 'https://www.ignoranceisbliss.ai/an-old-page';
  await store.sql!`insert into indexnow_pages (url, hash) values (${gone}, 'x')`;
  const r = await ix.runIndexNow();
  assert.deepEqual(r.removed, [gone]);
  const [{ n }] = await store.sql!<{ n: string }[]>`select count(*)::text as n from indexnow_pages where url = ${gone}`;
  assert.equal(n, '0');
});

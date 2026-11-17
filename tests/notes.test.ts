/** Playbook notes: web addresses, the checks before publishing, and how a body becomes paragraphs and lists. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bodyBlocks, problems, slugify } from '../lib/notes';

test('a web address is made from the title', () => {
  assert.equal(slugify('Insert options belong on the template’s Standard Values!'), 'insert-options-belong-on-the-templates-standard-values');
  assert.equal(slugify('  Café — A/B tests  '), 'cafe-a-b-tests');
});

test('a note must be long enough to answer, and short enough to read', () => {
  const ok = { title: 'Insert options go on Standard Values', summary: 'x'.repeat(150), body: 'y'.repeat(300), slug: 'insert-options' };
  assert.equal(problems(ok), null);
  assert.match(problems({ ...ok, summary: 'Too short.' })!, /summary needs 120 to 420/);
  assert.match(problems({ ...ok, body: 'short' })!, /note needs 200 to 8000/);
  assert.match(problems({ ...ok, slug: 'Bad Slug' })!, /lower-case letters/);
});

test('blank lines make paragraphs; lines starting "- " make a list', () => {
  const b = bodyBlocks('First line\nsame paragraph.\n\n- one\n- two\n\nLast.');
  assert.deepEqual(b, [
    { kind: 'p', text: 'First line same paragraph.' },
    { kind: 'list', items: ['one', 'two'] },
    { kind: 'p', text: 'Last.' },
  ]);
});

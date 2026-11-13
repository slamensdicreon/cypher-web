import assert from 'node:assert/strict';
import { test } from 'node:test';
import { areaFor, can } from '../lib/auth/roles';

test('owners can do everything', () => {
  for (const a of ['people', 'settings', 'platform', 'crm', 'email', 'site'] as const) assert.ok(can(['owner'], a, 'write'));
});

test('each role reaches only its areas', () => {
  assert.ok(can(['sales'], 'crm', 'write'));
  assert.ok(!can(['sales'], 'email', 'write'));
  assert.ok(can(['sales'], 'email', 'read'));
  assert.ok(!can(['sales'], 'people'));
  assert.ok(can(['marketing'], 'site', 'write'));
  assert.ok(!can(['marketing'], 'platform'));
  assert.ok(can(['platform'], 'platform', 'write'));
  assert.ok(!can(['platform'], 'crm'));
  assert.ok(can(['viewer'], 'crm'));
  assert.ok(!can(['viewer'], 'crm', 'write'));
  assert.ok(!can(['viewer'], 'settings'));
});

test('roles combine, and unknown roles grant nothing', () => {
  assert.ok(can(['sales', 'marketing'], 'site', 'write'));
  assert.ok(!can(['admin', 'root'], 'crm'));
  assert.ok(!can([], 'analytics'));
});

test('admin paths map to areas; unknown ones need Owner', () => {
  assert.equal(areaFor('/admin'), 'analytics');
  assert.equal(areaFor('/admin/drip/contacts'), 'email');
  assert.equal(areaFor('/admin/people'), 'people');
  assert.equal(areaFor('/admin/platform/organizations'), 'platform');
  assert.equal(areaFor('/postcards/print/x.pdf'), 'assets');
  assert.equal(areaFor('/admin/something-new'), 'settings');
});

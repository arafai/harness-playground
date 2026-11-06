import test from 'node:test';
import assert from 'node:assert/strict';

const baseUrl = process.env.HARNESS_TARGET_API_URL;
const headers = { 'Content-Type': 'application/json', 'X-Acceptance-Criterion': 'EAC-1' };

async function post(title) {
  const res = await fetch(new URL('/items', baseUrl), { method: 'POST', headers, body: JSON.stringify({ title }) });
  return { res, body: await res.json() };
}

test('EAC-1: duplicate titles get -2 slug and are retrievable by slug', async () => {
  assert.ok(baseUrl, 'HARNESS_TARGET_API_URL must be set');
  const execId = process.env.HARNESS_EXECUTION_ID;
  assert.ok(execId, 'HARNESS_EXECUTION_ID must be set');
  const title = `Launch Plan ${execId}`;
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const first = await post(title);
  assert.equal(first.res.status, 201);
  assert.equal(first.body.slug, base);

  const second = await post(title);
  assert.equal(second.res.status, 201);
  assert.equal(second.body.slug, `${base}-2`);
  assert.notEqual(second.body.id, first.body.id);

  const got = await fetch(new URL(`/items/${base}-2`, baseUrl), { headers: { 'X-Acceptance-Criterion': 'EAC-1' } });
  assert.equal(got.status, 200);
  const item = await got.json();
  assert.equal(item.id, second.body.id);
  assert.equal(item.slug, `${base}-2`);
  assert.equal(item.title, title);
});

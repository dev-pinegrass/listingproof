import test from 'node:test';
import assert from 'node:assert/strict';
import { sample } from '../lib/review.ts';
const url = process.env.TEST_URL || 'http://localhost:3102';
async function post(body) {
  const r = await fetch(url + '/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: r.status, body: await r.json() };
}
test('sample fixture passes through actual report endpoint', async () => {
  const r = await post({ ...sample, mode: 'fixture' });
  assert.equal(r.status, 200);
  assert.equal(r.body.mode, 'fixture');
  assert.equal(r.body.findings.length, 4);
  assert.ok(r.body.id);
});
test('custom input cannot masquerade as a fixture analysis', async () =>
  assert.equal(
    (await post({ ...sample, listing: 'Different claims', mode: 'fixture' }))
      .status,
    400,
  ));
test('oversized input rejected', async () =>
  assert.equal(
    (await post({ listing: 'x'.repeat(8001), source: '', mode: 'bedrock' }))
      .status,
    400,
  ));
test('blank listing rejected', async () =>
  assert.equal(
    (await post({ listing: ' ', source: '', mode: 'bedrock' })).status,
    400,
  ));

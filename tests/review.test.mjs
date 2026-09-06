import test from 'node:test';
import assert from 'node:assert/strict';
import {
  splitLines,
  validateFindings,
  numericCheck,
  sample,
  fixture,
} from '../lib/review.ts';
test('source IDs retain exact offsets including decimals', () => {
  const text = '  Capacity: 0.5 L.\nPack of 6.';
  for (const s of splitLines(text, 'S'))
    assert.equal(text.slice(s.start, s.end), s.text);
  assert.equal(splitLines(text, 'S').length, 2);
});
test('fixture flags material, certification and pack errors', () =>
  assert.deepEqual(
    validateFindings(
      fixture,
      splitLines(sample.listing, 'C'),
      splitLines(sample.source, 'S'),
    ).map((x) => x.status),
    ['contradicted', 'unsupported', 'supported', 'contradicted'],
  ));
test('equivalent volumes normalize', () =>
  assert.equal(numericCheck('500 ml', '0.5 L').equal, true));
test('different pack sizes override model support', () => {
  const x = validateFindings(
    [
      {
        claimId: 'C1',
        status: 'supported',
        sourceId: 'S1',
        quote: 'Pack of 6',
      },
    ],
    splitLines('Pack of 12', 'C'),
    splitLines('Pack of 6', 'S'),
  );
  assert.equal(x[0].status, 'contradicted');
});
test('invented source ID rejected', () =>
  assert.equal(
    validateFindings(
      [
        {
          claimId: 'C1',
          status: 'supported',
          sourceId: 'S99',
          quote: 'organic',
        },
      ],
      splitLines('organic', 'C'),
      splitLines('organic', 'S'),
    )[0].sourceId,
    null,
  ));
test('invented quote rejected', () =>
  assert.equal(
    validateFindings(
      [
        {
          claimId: 'C1',
          status: 'supported',
          sourceId: 'S1',
          quote: 'certified organic',
        },
      ],
      splitLines('certified organic', 'C'),
      splitLines('cotton', 'S'),
    )[0].status,
    'unsupported',
  ));
test('no evidence cannot support claim', () =>
  assert.equal(
    validateFindings(
      [{ claimId: 'C1', status: 'supported' }],
      splitLines('certified organic', 'C'),
      [],
    )[0].status,
    'unsupported',
  ));
test('missing model findings preserve claim coverage', () =>
  assert.equal(
    validateFindings([], splitLines('first\nsecond', 'C'), []).length,
    2,
  ));
test('duplicate finding becomes unsupported', () =>
  assert.equal(
    validateFindings(
      [{ claimId: 'C1' }, { claimId: 'C1' }],
      splitLines('claim', 'C'),
      [],
    )[0].status,
    'unsupported',
  ));
test('replacement is source wording, never model-generated text', () => {
  const f = validateFindings(
    [
      {
        claimId: 'C1',
        status: 'contradicted',
        sourceId: 'S1',
        quote: 'Pack of 6',
        replacement: 'certified safe',
      },
    ],
    splitLines('Pack of 12', 'C'),
    splitLines('Pack of 6', 'S'),
  )[0];
  assert.equal(f.replacement, 'Pack of 6');
});
test('unrelated quantity types are not compared', () =>
  assert.equal(numericCheck('500 ml', 'Pack of 6'), null));
test('unsupported claim contributes no revision', () =>
  assert.equal(
    validateFindings(
      [
        {
          claimId: 'C1',
          status: 'unsupported',
          sourceId: 'S1',
          quote: 'cotton',
        },
      ],
      splitLines('organic cotton', 'C'),
      splitLines('cotton', 'S'),
    )[0].replacement,
    '',
  ));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateText } from '../utils/validateText.js';

test('rejects non-string input', () => {
  assert.equal(validateText(42).valid, false);
});

test('rejects empty / whitespace-only text', () => {
  assert.equal(validateText('   ').valid, false);
});

test('rejects text over 5000 characters', () => {
  assert.equal(validateText('a'.repeat(5001)).valid, false);
});

test('trims and accepts valid text', () => {
  const result = validateText('  I dreamt of the sea  ');
  assert.equal(result.valid, true);
  assert.equal(result.value, 'I dreamt of the sea');
});

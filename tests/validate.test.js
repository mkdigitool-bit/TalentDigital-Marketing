import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContactPayload } from '../api/_validate.js';

const basePayload = {
  website: '',
  prenom: 'Yassine',
  nom: 'Benali',
  email: 'yassine@example.com',
  service: 'tunnel',
  message: 'Bonjour, je veux un tunnel de vente.',
};

test('rejects a payload with the honeypot field filled', () => {
  const result = validateContactPayload({ ...basePayload, website: 'http://spam.example' });
  assert.equal(result.valid, false);
  assert.equal(result.honeypot, true);
});

test('rejects a payload missing a required field', () => {
  const result = validateContactPayload({ ...basePayload, prenom: '' });
  assert.equal(result.valid, false);
  assert.equal(result.honeypot, false);
  assert.match(result.error, /prenom/);
});

test('rejects a payload with an invalid email', () => {
  const result = validateContactPayload({ ...basePayload, email: 'not-an-email' });
  assert.equal(result.valid, false);
  assert.equal(result.honeypot, false);
  assert.match(result.error, /email/i);
});

test('accepts a fully valid payload', () => {
  const result = validateContactPayload(basePayload);
  assert.equal(result.valid, true);
  assert.equal(result.honeypot, false);
  assert.equal(result.error, undefined);
});

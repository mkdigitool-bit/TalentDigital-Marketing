import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact-general.js';

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('rejects non-POST requests with 405', async () => {
  const res = createMockRes();
  await handler({ method: 'GET', body: {} }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.body.ok, false);
});

test('returns a fake success for honeypot-filled submissions without touching external services', async () => {
  const res = createMockRes();
  await handler(
    {
      method: 'POST',
      body: {
        website: 'http://spam.example',
        prenom: 'Yassine',
        email: 'yassine@example.com',
        message: 'Bonjour',
      },
    },
    res
  );
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
});

test('rejects a payload missing required fields with 400', async () => {
  const res = createMockRes();
  await handler({ method: 'POST', body: { website: '' } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.ok, false);
  assert.ok(res.body.error);
});

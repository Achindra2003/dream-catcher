import { test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';

test('GET /health returns ok', async () => {
  const server = app.listen(0);
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).status, 'ok');
  } finally {
    server.close();
  }
});

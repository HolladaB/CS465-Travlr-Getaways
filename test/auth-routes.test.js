const { test, after } = require('node:test');
const assert = require('node:assert/strict');
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters';
const app = require('../app');
const server = app.listen(0);
after(() => server.close());
const endpoint = path => `http://127.0.0.1:${server.address().port}${path}`;

test('unauthenticated trip changes are rejected', async () => {
  for (const [method, path] of [
    ['POST', '/api/trips'],
    ['PUT', '/api/trips/TEST'],
    ['DELETE', '/api/trips/TEST']
  ]) {
    const response = await fetch(endpoint(path), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'TEST' })
    });
    assert.equal(response.status, 401, `${method} ${path}`);
  }
});

test('public registration cannot create an administrator', async () => {
  const response = await fetch(endpoint('/api/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'test@example.test', password: 'example' })
  });
  assert.equal(response.status, 404);
});


test('authenticated deletion removes the selected trip and reports missing trips', async () => {
  const mongoose = require('mongoose');
  const jwt = require('jsonwebtoken');
  const User = mongoose.model('users');
  const Trip = mongoose.model('trips');
  const originalFindUser = User.findOne;
  const originalDelete = Trip.findOneAndDelete;
  const deleted = [];
  User.findOne = async () => ({ name: 'Portfolio Admin' });
  Trip.findOneAndDelete = async filter => {
    deleted.push(filter);
    return filter.code === 'FOUND' ? { code: 'FOUND' } : null;
  };
  const token = jwt.sign({ email: 'admin@example.test' }, process.env.JWT_SECRET);
  try {
    const found = await fetch(endpoint('/api/trips/FOUND'), {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(found.status, 204);
    assert.deepEqual(deleted[0], { code: 'FOUND' });
    const missing = await fetch(endpoint('/api/trips/MISSING'), {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(missing.status, 404);
  } finally {
    User.findOne = originalFindUser;
    Trip.findOneAndDelete = originalDelete;
  }
});

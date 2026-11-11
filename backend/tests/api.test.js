import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { PassThrough } from 'node:stream';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'shopnest-test-jwt-secret';

const { default: app } = await import('../src/app.js');
const { default: User } = await import('../src/models/User.js');
const { default: Vendor } = await import('../src/models/Vendor.js');
const { default: Product } = await import('../src/models/Product.js');
const { default: Order } = await import('../src/models/Order.js');
const { createRateLimiter } = await import('../src/middlewares/rateLimiter.js');

const makeQuery = (resolvedValue) => ({
  populate() {
    return this;
  },
  select() {
    return this;
  },
  sort() {
    return this;
  },
  skip() {
    return this;
  },
  limit() {
    return this;
  },
  then(onFulfilled, onRejected) {
    return Promise.resolve(resolvedValue).then(onFulfilled, onRejected);
  },
});

const withStubs = async (stubs, fn) => {
  const originals = stubs.map(([obj, key, impl]) => {
    const original = obj[key];
    obj[key] = impl;
    return [obj, key, original];
  });
  try {
    return await fn();
  } finally {
    for (const [obj, key, original] of originals.reverse()) {
      obj[key] = original;
    }
  }
};

const request = (path, options = {}) =>
  new Promise((resolve, reject) => {
    const socket = new PassThrough();
    socket.remoteAddress = '127.0.0.1';
    socket.writable = true;

    const req = new http.IncomingMessage(socket);
    req.method = (options.method || 'GET').toUpperCase();
    req.url = path;
    req.headers = {
      host: 'localhost:5000',
      'content-type': 'application/json',
      ...Object.fromEntries(
        Object.entries(options.headers || {}).map(([k, v]) => [k.toLowerCase(), v])
      ),
    };

    const rawBody = options.body !== undefined ? String(options.body) : '';
    if (rawBody) {
      req.headers['content-length'] = String(Buffer.byteLength(rawBody));
    }

    const res = new http.ServerResponse(req);
    const chunks = [];

    res.assignSocket(socket);
    res.write = (chunk, encoding, cb) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
      }
      if (typeof cb === 'function') cb();
      return true;
    };

    const origEnd = res.end.bind(res);
    res.end = (chunk, encoding, cb) => {
      if (chunk && typeof chunk !== 'function') {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
      }
      const rawText = Buffer.concat(chunks).toString('utf8');
      let parsedBody = rawText;
      try {
        parsedBody = JSON.parse(rawText);
      } catch {
        // Keep plain text when response is not JSON
      }
      const result = {
        status: res.statusCode,
        headers: res.getHeaders(),
        body: parsedBody,
      };
      if (typeof chunk === 'function') chunk();
      else if (typeof encoding === 'function') encoding();
      else if (typeof cb === 'function') cb();
      resolve(result);
      return origEnd();
    };

    res.on('error', reject);

    if (rawBody) {
      req.push(rawBody);
    }
    req.push(null);

    app(req, res);
  });

describe('ShopNest API Critical Integration Tests', () => {
  it('GET /api/health returns 200 ok and unknown route returns 404 JSON', async () => {
    const health = await request('/api/health');
    assert.equal(health.status, 200);
    assert.deepEqual(health.body, { ok: true });

    const missing = await request('/api/does-not-exist');
    assert.equal(missing.status, 404);
    assert.equal(missing.body.success, false);
  });

  it('Auth register validation rejects bad payloads with 400 and registers valid customer with JWT', async () => {
    const badRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'A', email: 'not-an-email', password: '123' }),
    });
    assert.equal(badRes.status, 400);
    assert.equal(badRes.body.success, false);

    const userId = new mongoose.Types.ObjectId();
    await withStubs(
      [
        [User, 'findOne', () => makeQuery(null)],
        [
          User,
          'create',
          async (data) => ({
            _id: userId,
            name: data.name,
            email: data.email,
            role: 'customer',
          }),
        ],
      ],
      async () => {
        const res = await request('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Priya Sharma',
            email: 'priya@example.com',
            password: 'Password123',
          }),
        });
        assert.equal(res.status, 201);
        assert.equal(res.body.success, true);
        assert.equal(res.body.user.role, 'customer');
        assert.ok(typeof res.body.token === 'string' && res.body.token.length > 20);
      }
    );
  });

  it('Auth login rejects blocked users (403) and /auth/me authenticates valid JWT (200)', async () => {
    const passwordHash = await bcrypt.hash('Secret@123', 6);
    const activeUserId = new mongoose.Types.ObjectId();

    const makeMockUser = (isActive) => ({
      _id: activeUserId,
      name: 'Customer One',
      email: 'one@example.com',
      role: 'customer',
      isActive,
      comparePassword: (candidate) => bcrypt.compare(candidate, passwordHash),
    });

    await withStubs(
      [[User, 'findOne', () => makeQuery(makeMockUser(false))]],
      async () => {
        const blockedRes = await request('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'one@example.com', password: 'Secret@123' }),
        });
        assert.equal(blockedRes.status, 403);
      }
    );

    await withStubs(
      [
        [User, 'findOne', () => makeQuery(makeMockUser(true))],
        [User, 'findById', () => makeQuery(makeMockUser(true))],
      ],
      async () => {
        const loginRes = await request('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'one@example.com', password: 'Secret@123' }),
        });
        assert.equal(loginRes.status, 200);
        assert.ok(loginRes.body.token);

        const meRes = await request('/api/auth/me', {
          headers: { Authorization: `Bearer ${loginRes.body.token}` },
        });
        assert.equal(meRes.status, 200);
        assert.equal(meRes.body.user.email, 'one@example.com');
      }
    );
  });

  it('RBAC and ObjectId validation protect admin endpoints', async () => {
    const customerId = new mongoose.Types.ObjectId();
    const adminId = new mongoose.Types.ObjectId();
    const customerToken = jwt.sign({ id: customerId, role: 'customer' }, process.env.JWT_SECRET);
    const adminToken = jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET);

    await withStubs(
      [
        [
          User,
          'findById',
          (id) =>
            makeQuery(
              String(id) === String(adminId)
                ? { _id: adminId, role: 'admin', isActive: true }
                : { _id: customerId, role: 'customer', isActive: true }
            ),
        ],
      ],
      async () => {
        const forbiddenRes = await request('/api/admin/stats', {
          headers: { Authorization: `Bearer ${customerToken}` },
        });
        assert.equal(forbiddenRes.status, 403);

        const badIdRes = await request('/api/admin/vendors/bad-object-id/approve', {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(badIdRes.status, 400);
      }
    );
  });

  it('Checkout calculates server-side prices, decrements stock atomically, and rolls back on stock race', async () => {
    const customerId = new mongoose.Types.ObjectId();
    const vendorId = new mongoose.Types.ObjectId();
    const prodAId = new mongoose.Types.ObjectId();
    const prodBId = new mongoose.Types.ObjectId();
    const orderId = new mongoose.Types.ObjectId();
    const customerToken = jwt.sign({ id: customerId, role: 'customer' }, process.env.JWT_SECRET);

    const productMap = {
      [String(prodAId)]: {
        _id: prodAId,
        title: 'Ceramic Mug',
        price: 1000,
        discount: 20, // Server price = 800
        stock: 5,
        isActive: true,
        category: { isActive: true },
        vendor: vendorId,
        images: ['https://example.com/mug.jpg'],
      },
      [String(prodBId)]: {
        _id: prodBId,
        title: 'Linen Tote',
        price: 500,
        discount: 0,
        stock: 2,
        isActive: true,
        category: { isActive: true },
        vendor: vendorId,
        images: ['https://example.com/tote.jpg'],
      },
    };

    const unauth = await request('/api/orders', { method: 'POST', body: JSON.stringify({}) });
    assert.equal(unauth.status, 401);

    await withStubs(
      [[User, 'findById', () => makeQuery({ _id: customerId, role: 'customer', isActive: true })]],
      async () => {
        const invalidOrder = await request('/api/orders', {
          method: 'POST',
          headers: { Authorization: `Bearer ${customerToken}` },
          body: JSON.stringify({ items: [], paymentMethod: 'crypto' }),
        });
        assert.equal(invalidOrder.status, 400);
      }
    );

    let capturedOrderPayload = null;
    await withStubs(
      [
        [User, 'findById', () => makeQuery({ _id: customerId, role: 'customer', isActive: true })],
        [Product, 'findById', (id) => makeQuery(productMap[String(id)] || null)],
        [Vendor, 'findOne', () => makeQuery({ _id: vendorId, shopName: 'Clay Studio', status: 'approved' })],
        [Product, 'findOneAndUpdate', (filter) => makeQuery(productMap[String(filter._id)])],
        [
          Order,
          'create',
          async (data) => {
            capturedOrderPayload = data;
            return { _id: orderId, ...data };
          },
        ],
        [Order, 'findById', () => makeQuery({ _id: orderId, ...capturedOrderPayload })],
      ],
      async () => {
        const res = await request('/api/orders', {
          method: 'POST',
          headers: { Authorization: `Bearer ${customerToken}` },
          body: JSON.stringify({
            items: [{ productId: String(prodAId), quantity: 2 }],
            shippingAddress: {
              fullName: 'Aarav Patel',
              street: '42 Main Road',
              city: 'Ahmedabad',
              postalCode: '380009',
            },
            paymentMethod: 'cod',
          }),
        });
        assert.equal(res.status, 201);
        assert.equal(res.body.order.totalAmount, 1600);
        assert.equal(res.body.order.paymentStatus, 'pending');
      }
    );

    const rollbackCalls = [];
    await withStubs(
      [
        [User, 'findById', () => makeQuery({ _id: customerId, role: 'customer', isActive: true })],
        [Product, 'findById', (id) => makeQuery(productMap[String(id)] || null)],
        [Vendor, 'findOne', () => makeQuery({ _id: vendorId, shopName: 'Clay Studio', status: 'approved' })],
        [
          Product,
          'findOneAndUpdate',
          (filter) =>
            makeQuery(String(filter._id) === String(prodAId) ? productMap[String(prodAId)] : null),
        ],
        [
          Product,
          'findByIdAndUpdate',
          (id, update) => {
            rollbackCalls.push({ id: String(id), update });
            return makeQuery(productMap[String(id)]);
          },
        ],
      ],
      async () => {
        const raceRes = await request('/api/orders', {
          method: 'POST',
          headers: { Authorization: `Bearer ${customerToken}` },
          body: JSON.stringify({
            items: [
              { productId: String(prodAId), quantity: 1 },
              { productId: String(prodBId), quantity: 1 },
            ],
            shippingAddress: {
              fullName: 'Aarav Patel',
              street: '42 Main Road',
              city: 'Ahmedabad',
              postalCode: '380009',
            },
            paymentMethod: 'card',
          }),
        });
        assert.equal(raceRes.status, 400);
        assert.equal(rollbackCalls.length, 1);
        assert.equal(rollbackCalls[0].id, String(prodAId));
        assert.deepEqual(rollbackCalls[0].update, { $inc: { stock: 1 } });
      }
    );
  });

  it('Rate limiter blocks excessive requests with 429 and Retry-After header', () => {
    const limiter = createRateLimiter({ windowMs: 60000, max: 2, message: 'Slow down' });
    const headers = {};
    const res = {
      setHeader(name, val) {
        headers[name] = val;
      },
    };
    const outcomes = [];
    for (let i = 0; i < 3; i += 1) {
      limiter({ ip: '10.0.0.1' }, res, (err) => outcomes.push(err || 'ok'));
    }
    assert.equal(outcomes[0], 'ok');
    assert.equal(outcomes[1], 'ok');
    assert.equal(outcomes[2].statusCode, 429);
    assert.ok(headers['Retry-After']);
  });
});

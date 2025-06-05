// tests/order.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Item = require('../models/itemModel');
const Order = require('../models/orderModel');

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
    serverSelectionTimeoutMS: 5000,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Item.deleteMany({});
  await Order.deleteMany({});
});

describe('Order API', () => {
  let buyer;
  let seller;
  let item;

  beforeEach(async () => {
    buyer = await User.create({
      username: 'buyer',
      email: `buyer+${Date.now()}@test.com`,
      password: 'password123',
      role: 'user',
    });
    seller = await User.create({
      username: 'seller',
      email: `seller+${Date.now()}@test.com`,
      password: 'password123',
      role: 'user',
    });
    item = await Item.create({
      name: 'Game Item',
      price: 100,
      seller: seller._id,
      game: 'CS2',
      imageUrls: ['image_url'],
    });
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('x-test-user', buyer._id.toString())
      .send({
        buyer: buyer._id.toString(),
        seller: seller._id.toString(),
        item: item._id.toString(),
        price: 100,
      })
      .expect(201);

    const createdOrder = res.body.order;
    expect(createdOrder.buyer).toBe(buyer._id.toString());
    expect(createdOrder.status).toBe('Requested');
    expect(Array.isArray(createdOrder.logs)).toBe(true);
    expect(createdOrder.logs.length).toBe(1);
    expect(createdOrder.logs[0].to).toBe('Requested');
  });

  it('should get all orders', async () => {
    await Order.create({ buyer: buyer._id, seller: seller._id, item: item._id, price: 100 });

    const res = await request(app)
      .get('/api/orders')
      .set('x-test-user', buyer._id.toString())
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('should get a single order by id', async () => {
    const order = await Order.create({ buyer: buyer._id, seller: seller._id, item: item._id, price: 100 });

    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set('x-test-user', buyer._id.toString())
      .expect(200);

    const fetched = res.body;
    expect(fetched._id).toBe(order._id.toString());
    // buyer populated
    expect(fetched.buyer._id).toBe(buyer._id.toString());
  });

  it('should update the order status', async () => {
    const order = await Order.create({ buyer: buyer._id, seller: seller._id, item: item._id, price: 100 });

    const res = await request(app)
      .put(`/api/orders/${order._id}/status`)
      .set('x-test-user', seller._id.toString())
      .send({ status: 'Approved' })
      .expect(200);

    const updated = res.body.order;
    expect(updated.status).toBe('Approved');
    expect(updated.logs.some(log => log.to === 'Approved')).toBe(true);
  });

  it('should confirm the order', async () => {
    const order = await Order.create({ buyer: buyer._id, seller: seller._id, item: item._id, price: 100 });

    const res = await request(app)
      .put(`/api/orders/${order._id}/confirm`)
      .set('x-test-user', buyer._id.toString())
      .expect(200);

    const confirmed = res.body.order;
    expect(confirmed.status).toBe('Verified');
    expect(confirmed.logs.some(log => log.to === 'Verified')).toBe(true);
  });
});

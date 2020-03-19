const database = require('../../connection/connect_db');

const {
  createOrder,
  getOrderId,
  getOrders,
  updateOrders,
  deleteOrders,
} = require('../orders');

describe('createOrder', () => {
  let productsIds;
  beforeAll(async () => {
    await database();
    const collectionProducts = (await database()).collection('products');
    productsIds = (await collectionProducts.insertMany([
      {
        name: 'products-01',
        price: 10,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
      {
        name: 'products-02',
        price: 12,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    ])).insertedIds;
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('orders');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 400 if not send userId and products', (done) => {
    const req = {
      body: {
        userId: undefined,
        products: undefined,
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    createOrder(req, {}, next);
  });
  it('should create a new order', (done) => {
    const req = {
      body: {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
        dateProcessed: new Date(),
      },
    };
    const next = (code) => code;
    const resp = {
      send: (response) => {
        expect(response.products[0].product._id).toStrictEqual(productsIds['0']);
        done();
      },
    };
    createOrder(req, resp, next);
  });
});

describe('updateOrder', () => {
  let productsIds;
  let orderId;
  beforeAll(async () => {
    await database();
    const collectionProducts = (await database()).collection('products');
    productsIds = (await collectionProducts.insertMany([
      {
        name: 'products-01',
        price: 10,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
      {
        name: 'products-02',
        price: 12,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    ])).insertedIds;
    const collectionOrders = (await database()).collection('orders');
    orderId = (await collectionOrders.insertOne(
      {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
      },
    )).insertedId;
  });

  afterAll(async () => {
    const collectionUsers = (await database()).collection('orders');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 404 if req.params.orderId', (done) => {
    const req = {
      params: {
        orderId: 'noTengoFormatoUid',
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateOrders(req, {}, next);
  });
  it('should show an error 400 when status does not valid', (done) => {
    const req = {
      params: {
        orderId,
      },
      body: {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'apurate',
        dateEntry: new Date(),
        dateProcessed: new Date(),
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    updateOrders(req, {}, next);
  });
  it('should show an error 404 if order does not exists', (done) => {
    const req = {
      params: {
        orderId: '5e7260ccdd15b55308508767',
      },
      body: {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
        dateProcessed: new Date(),
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateOrders(req, {}, next);
  });
  it('should update a new order', (done) => {
    const req = {
      params: {
        orderId,
      },
      body: {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
        dateProcessed: new Date(),
      },
    };
    const next = (code) => code;
    const resp = {
      send: (response) => {
        expect(response.products[0].product._id).toStrictEqual(productsIds['0']);
        done();
      },
    };
    updateOrders(req, resp, next);
  });
});

describe('deleteOrder', () => {
  let productsIds;
  let orderId;
  beforeAll(async () => {
    await database();
    const collectionProducts = (await database()).collection('products');
    productsIds = (await collectionProducts.insertMany([
      {
        name: 'products-01',
        price: 10,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
      {
        name: 'products-02',
        price: 12,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    ])).insertedIds;
    const collectionOrders = (await database()).collection('orders');
    orderId = (await collectionOrders.insertOne(
      {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
      },
    )).insertedId;
  });

  afterAll(async () => {
    const collectionUsers = (await database()).collection('orders');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 404 if req.params.orderId is not valid', (done) => {
    const req = {
      params: {
        orderId: 'noTengoFormatoUid',
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    deleteOrders(req, {}, next);
  });
  it('should show an error 404 if order does not exists', (done) => {
    const req = {
      params: {
        orderId: '5e7260ccdd15b55308508767',
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    deleteOrders(req, {}, next);
  });
  it('should delete a new order', (done) => {
    const req = {
      params: {
        orderId,
      },
    };
    const resp = {
      send: (response) => {
        expect(response.message).toBe('orden eliminada exitosamente');
        done();
      },
    };
    deleteOrders(req, resp);
  });
});

describe('getOrderId', () => {
  let productsIds;
  let orderId;
  beforeAll(async () => {
    await database();
    const collectionProducts = (await database()).collection('products');
    productsIds = (await collectionProducts.insertMany([
      {
        name: 'products-01',
        price: 10,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
      {
        name: 'products-02',
        price: 12,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    ])).insertedIds;
    const collectionOrders = (await database()).collection('orders');
    orderId = (await collectionOrders.insertOne(
      {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
      },
    )).insertedId;
  });

  afterAll(async () => {
    const collectionUsers = (await database()).collection('orders');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 404 if req.params.orderId is not valid', (done) => {
    const req = {
      params: {
        orderId: 'noTengoFormatoUid',
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    getOrderId(req, {}, next);
  });
  it('should show an error 404 if order does not exists', (done) => {
    const req = {
      params: {
        orderId: '5e7260ccdd15b55308508767',
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    getOrderId(req, {}, next);
  });
  it('should get a order', (done) => {
    const req = {
      params: {
        orderId,
      },
    };
    const resp = {
      send: (response) => {
        expect(response._id).toStrictEqual(orderId);
        done();
      },
    };
    getOrderId(req, resp);
  });
});


describe('getOrders', () => {
  let productsIds;
  let orderIds;
  beforeAll(async () => {
    await database();
    const collectionProducts = (await database()).collection('products');
    productsIds = (await collectionProducts.insertMany([
      {
        name: 'products-01',
        price: 10,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
      {
        name: 'products-02',
        price: 12,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    ])).insertedIds;
    const collectionOrders = (await database()).collection('orders');
    orderIds = (await collectionOrders.insertMany([
      {
        userId: '01234567',
        client: 'client1',
        products: [
          {
            qty: 2,
            productId: productsIds['0'],
          },
          {
            qty: 1,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
      },
      {
        userId: '7654321',
        client: 'client2',
        products: [
          {
            qty: 3,
            productId: productsIds['0'],
          },
          {
            qty: 2,
            productId: productsIds['1'],
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
      },
    ])).insertedIds;
  });

  afterAll(async () => {
    const collectionUsers = (await database()).collection('orders');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should get 2 order', (done) => {
    const req = {
      query: {},
      protocol: 'http',
      path: '/orders',
      get: () => 'localhost:8080',
    };
    const resp = {
      send: (response) => {
        expect(response.length).toBe(2);
        expect(response[0]._id).toStrictEqual(orderIds['0']);
        done();
      },
      set: (nameHeader, header) => {
        expect(nameHeader).toBe('link');
        expect(header).toBe('<http://localhost:8080/orders?limit=10&page=1>; rel="first", <http://localhost:8080/orders?limit=10&page=0>; rel="prev", <http://localhost:8080/orders?limit=10&page=2>; rel="next", <http://localhost:8080/orders?limit=10&page=1>; rel="last"');
      },
    };
    getOrders(req, resp);
  });
});

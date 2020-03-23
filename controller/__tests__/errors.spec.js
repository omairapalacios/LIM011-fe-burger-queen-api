jest.mock('../../connection/connect_db');
const database = require('../../connection/connect_db');

const {
  createUser,
  getUserId,
  getUsers,
  updateUserId,
  deleteUserId,
} = require('../users');

const {
  getProducts,
  createProduct,
  getProductId,
  updateProductId,
  deleteProductId,
} = require('../products');

const {
  getOrders,
  getOrderId,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../orders');

describe('users errors', () => {
  beforeAll(async () => {
    await database();
  });
  afterAll(async () => {
    await database().close();
  });
  it('should show an error 500 when exist an error with database: createUser', (done) => {
    const req = {
      body: {
        email: 'test1@test.com',
        password: '1234567',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    createUser(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: getUserId', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    getUserId(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: updateUser', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
      },
      headers: {
        user: {
          roles: {
            admin: true,
          },
        },
      },
      body: {
        email: 'test1@test.com',
        password: '12345',
        roles: {
          admin: false,
        },
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    updateUserId(req, {}, next);
  });

  it('should show an error 500 when exist an error with database: deleteUser', (done) => {
    const req = {
      params: {
        uid: 'test1@test.com',
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    deleteUserId(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: getUsers', (done) => {
    const req = {
      query: {},
      protocol: 'http',
      path: '/users',
      get: () => 'localhost:8080',
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    getUsers(req, {}, next);
  });
});

describe('products errors', () => {
  beforeAll(async () => {
    await database();
  });
  afterAll(async () => {
    await database().close();
  });
  it('should show an error 500 when exist an error with database: createProduct', (done) => {
    const req = {
      body: {
        name: 'products-01',
        price: 10,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    createProduct(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: getProductId', (done) => {
    const req = {
      params: {
        productId: '5e7260ccdd15b55308508754',
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    getProductId(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: updateProductUid', (done) => {
    const req = {
      params: {
        productId: '5e7260ccdd15b55308508754',
      },
      body: {
        name: 'products-01',
        price: 11,
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    updateProductId(req, {}, next);
  });

  it('should show an error 500 when exist an error with database: deleteProductUid', (done) => {
    const req = {
      params: {
        uid: '5e7260ccdd15b55308508754',
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    deleteProductId(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: getProducts', (done) => {
    const req = {
      query: {},
      protocol: 'http',
      path: '/products',
      get: () => 'localhost:8080',
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    getProducts(req, {}, next);
  });
});


describe('orders errors', () => {
  beforeAll(async () => {
    await database();
  });
  afterAll(async () => {
    await database().close();
  });
  it('should show an error 500 when exist an error with database: createOrder', (done) => {
    const req = {
      body: {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: '5e7260ccdd15b55308508754',
          },
          {
            qty: 1,
            productId: '5e7260ccdd15b55128508754',
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
        dateProcessed: new Date(),
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    createOrder(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: getOrder', (done) => {
    const req = {
      params: {
        orderId: '5e7260ccdd15b55308508123',
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    getOrderId(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: updateOrder', (done) => {
    const req = {
      params: {
        orderId: '5e7260ccdd15b55308508123',
      },
      body: {
        userId: '01234567',
        client: 'client',
        products: [
          {
            qty: 2,
            productId: '5e7260ccdd15b55308508456',
          },
          {
            qty: 1,
            productId: '5e7260ccdd15b55308508456',
          },
        ],
        status: 'pending',
        dateEntry: new Date(),
        dateProcessed: new Date(),
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    updateOrder(req, {}, next);
  });

  it('should show an error 500 when exist an error with database: deleteOrder', (done) => {
    const req = {
      params: {
        orderId: '5e7260ccdd15b55308508123',
      },
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    deleteOrder(req, {}, next);
  });
  it('should show an error 500 when exist an error with database: getOrders', (done) => {
    const req = {
      query: {},
      protocol: 'http',
      path: '/orders',
      get: () => 'localhost:8080',
    };
    const next = (code) => {
      expect(code).toBe(500);
      done();
    };
    getOrders(req, {}, next);
  });
});

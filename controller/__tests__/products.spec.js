const database = require('../../connection/connect_db');

const {
  createProduct,
  getProductId,
  getProducts,
  updateProductId,
  deleteProductId,
} = require('../products');

describe('createProduct', () => {
  beforeAll(async () => {
    await database();
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('products');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 400 if not send name and price', (done) => {
    const req = {
      body: {
        name: undefined,
        price: undefined,
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    createProduct(req, {}, next);
  });
  it('should create a new product', (done) => {
    const req = {
      body: {
        name: 'products-01',
        price: 10,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    };
    const resp = {
      send: (response) => {
        expect(response.name).toBe('products-01');
        expect(response.price).toBe(10);
        done();
      },
    };
    createProduct(req, resp);
  });
});
describe('updateProductId', () => {
  let products;

  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('products');
    products = (await collectionUsers.insertMany([
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
    const collectionUsers = (await database()).collection('products');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 404 if ProductID have a format invalid', (done) => {
    const req = {
      params: {
        productId: 'noTengoFormatoUid',
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateProductId(req, {}, next);
  });
  it('should show an error 404 if ProductID does not exist', (done) => {
    const req = {
      params: {
        productId: '5a7260ccdd15b55308508755',
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateProductId(req, {}, next);
  });
  it('should show an error 400 if propertie price is wrong', (done) => {
    const productId = products['0'];
    const req = {
      params: {
        productId,
      },
      body: {
        price: 'cien',
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    updateProductId(req, {}, next);
  });
  it('should show an error 400 if properties are empty', (done) => {
    const productId = products['0'];
    const req = {
      params: {
        productId,
      },
      body: {
      },
    };
    const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    updateProductId(req, {}, next);
  });
  it('should update a product', (done) => {
    const productId = products['0'];

    const req = {
      params: {
        productId,
      },
      body: {
        name: 'burger1',
        price: 11,
        image: 'imageburger.jpg',
        type: 'food',
      },
    };
    const resp = {
      send: (response) => {
        expect(response.name).toBe('burger1');
        expect(response.price).toBe(11);
        expect(response.image).toBe('imageburger.jpg');
        expect(response.type).toBe('food');
        done();
      },
    };
    updateProductId(req, resp);
  });
  it('should update a product data de bd', (done) => {
    const productId = products['1'];
    const req = {
      params: {
        productId,
      },
      body: {
        price: 10,
      },
    };
    const resp = {
      send: (response) => {
        expect(response.name).toBe('products-02');
        expect(response.price).toBe(10);
        expect(response.image).toBe('imagen.jpg');
        expect(response.type).toBe('burger');
        done();
      },
    };
    updateProductId(req, resp);
  });
});

describe('deleteProductId', () => {
  let products;
  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('products');
    products = await collectionUsers.insertMany([
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
    ]);
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('products');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 404 if ProductID have a format invalid', (done) => {
    const req = {
      params: {
        productId: 'xxxyyz', // noTengoFormatoUid
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    deleteProductId(req, {}, next);
  });
  it('should show an error 404 if product not exists', (done) => {
    const req = {
      params: {
        productId: '5e7260ccdd15b55308508767', // noTengoFormatoUid
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    deleteProductId(req, {}, next);
  });
  it('should get a product', (done) => {
    const productId = products.insertedIds[0];
    const req = {
      params: {
        productId,
      },
    };
    const resp = {
      send: (response) => {
        expect(response.message).toBe('producto eliminado exitosamente');
        done();
      },
    };
    deleteProductId(req, resp);
  });
});

describe('getProductId', () => {
  let products;
  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('products');
    products = await collectionUsers.insertMany([
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
    ]);
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('products');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should show an error 404 if ProductID have a format invalid', (done) => {
    const req = {
      params: {
        productId: 'xxxyyz', // noTengoFormatoUid
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    getProductId(req, {}, next);
  });
  it('should show an error 404 if product not exists', (done) => {
    const req = {
      params: {
        productId: '5e7260ccdd15b55308508767', // noTengoFormatoUid
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    getProductId(req, {}, next);
  });
  it('should delete a product', (done) => {
    const productId = products.insertedIds[0];
    const req = {
      params: {
        productId,
      },
    };
    const resp = {
      send: (response) => {
        expect(response.name).toBe('products-01');
        done();
      },
    };
    getProductId(req, resp);
  });
});

describe('getProducts', () => {
  beforeAll(async () => {
    await database();
    const collectionUsers = (await database()).collection('products');
    await collectionUsers.insertMany([
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
    ]);
  });
  afterAll(async () => {
    const collectionUsers = (await database()).collection('products');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should get 2 products', (done) => {
    const req = {
      query: {},
      protocol: 'http',
      path: '/products',
      get: () => 'localhost:8080',
    };
    const resp = {
      send: (response) => {
        expect(response.length).toBe(2);
        expect(response[0].name).toBe('products-01');
        done();
      },
      set: (nameHeader, header) => {
        expect(nameHeader).toBe('link');
        expect(header).toBe('<http://localhost:8080/products?limit=10&page=1>; rel="first", <http://localhost:8080/products?limit=10&page=0>; rel="prev", <http://localhost:8080/products?limit=10&page=2>; rel="next", <http://localhost:8080/products?limit=10&page=1>; rel="last"');
      },
    };
    getProducts(req, resp);
  });
});

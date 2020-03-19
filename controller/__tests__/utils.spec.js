const { ObjectId } = require('mongodb');
const database = require('../../connection/connect_db');

const {
  validateEmail,
  getIdOrEmail,
  getPagination,
  getProducts,
} = require('../../utils/utils');

describe('validateEmail', () => {
  it('should return true if email is valid', () => {
    expect(validateEmail('test1@test.com')).toBe(true);
  });
  it('should return false if email is invalid', () => {
    expect(validateEmail('test1@test')).toBe(false);
  });
});

describe('getIdOrEmail', () => {
  it('should return an object with a properties email', () => {
    expect(getIdOrEmail('test1@test.com')).toStrictEqual({ email: 'test1@test.com' });
  });
  it('should return an object with a properties id', () => {
    expect(getIdOrEmail('5e7260ccdd15b55123456789')).toStrictEqual({ _id: new ObjectId('5e7260ccdd15b55123456789') });
  });
});

describe('getPagination', () => {
  it('should return a string of urls with links to: firstPage, prevPage, nextPage, lastPage', () => {
    expect(getPagination('http://localhost/users', 1, 10, 10)).toBe('<http://localhost/users?limit=10&page=1>; rel="first", <http://localhost/users?limit=10&page=0>; rel="prev", <http://localhost/users?limit=10&page=2>; rel="next", <http://localhost/users?limit=10&page=10>; rel="last"');
  });
  it('should return a string of urls with links to: firstPage, prevPage, nextPage, lastPage', () => {
    expect(getPagination('http://localhost/products', 2, 10, 3)).toBe('<http://localhost/products?limit=10&page=1>; rel="first", <http://localhost/products?limit=10&page=1>; rel="prev", <http://localhost/products?limit=10&page=3>; rel="next", <http://localhost/products?limit=10&page=3>; rel="last"');
  });
});

describe('getProducts', () => {
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
    const collectionUsers = (await database()).collection('products');
    await collectionUsers.deleteMany({});
    await database().close();
  });
  it('should get products', (done) => {
    const arrayIds = [productsIds['0'], productsIds['1']];
    const resp = {
      send: (response) => {
        expect(response.products[0].product._id).toStrictEqual(productsIds['0']);
        done();
      },
    };
    const next = (code) => code;
    getProducts(arrayIds, orderId, resp, next);
  });
  it('it should show an error 404  if the order does not exist', (done) => {
    const arrayIds = [productsIds['0'], productsIds['1']];
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    getProducts(arrayIds, '5e7260ccdd15b55308508767', {}, next);
  });
});

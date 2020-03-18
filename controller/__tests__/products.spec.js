const database = require('../../connection/__mocks__/globalSetup');

const { createProduct, updateProductUid } = require('../products');

let db;

beforeAll(async () => {
  db = await database();
  const collectionProducts = await db.collection('products');
  await collectionProducts.deleteMany({});
});

describe('createProduct', () => {
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
        price: 100,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    };
    const resp = {
      send: (response) => {
        expect(response.name).toBe('products-01');
        expect(response.price).toBe(100);
      },
    };
    const next = (code) => code;
    done();
    createProduct(req, resp, next);
  });
});
describe('updateProductUid', () => {
  it('should show an error 404 if ProductID is not format', (done) => {
    const req = {
      params: {
        productId: 'noTengoFormatoUid', // noTengoFormatoUid
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateProductUid(req, {}, next);
  });
  it('should show an error 404 if ProductID is not exist', (done) => {
    const req = {
      params: {
        productId: undefined, // noTengoFormatoUid
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateProductUid(req, {}, next);
  });
  /* it('should show an error 400 if propeties is not exist', () => {
    const req = {
      body: {
        name: '',
        price: '',
        image: '',
        type: '',
      },
    };
  }); */
  /* it('', () => {});
  it('', () => {}); */
});

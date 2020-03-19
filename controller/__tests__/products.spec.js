/* const database = require('../../connection/__mocks__/globalSetup');

const { createProduct, updateProductUid, deleteProductUid } = require('../products');

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
describe.only('updateProductUid', () => {
  beforeAll(async () => {
    const collectionProducts = await db.collection('products');
    await collectionProducts.insertMany([
      {
        name: 'products-02',
        price: 90,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
      {
        name: 'products-03',
        price: 70,
        image: 'imagen.jpg',
        type: 'burger',
        dateEntry: new Date(),
      },
    ]);
  });
  it('should show an error 404 if ProductID have a format invalid', (done) => {
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
        productId: '5a7260ccdd15b55308508755', // id modificado
      },
    };
    const next = (code) => {
      expect(code).toBe(404);
      done();
    };
    updateProductUid(req, {}, next);
  });
  it('should show an error 400 if properties are wrong', (done) => {
    const req = {
      params: {
        productId: '5e7260ccdd15b55308508754',
      },
      body: {
        name: 1,
        price: 'cien',
      },
    }; */

    console.log(typeof (req.body.name));
    console.log(typeof (req.body.price));
/*     const next = (code) => {
      expect(code).toBe(400);
      done();
    };
    updateProductUid(req, {}, next);
  }); */
it('should update a product', (done) => {
    const req = {
      params: {
        productId: '5e7260ccdd15b55308508754',
      },
      body: {
        name: 'products-01',
        price: 80,
        image: 'imagen.jpg',
        type: 'burger',
      },
    };
    const resp = {
      send: (response) => {
        expect(response.name).toBe('products-01');
        expect(response.price).toBe(80);
      },
    };
    const next = (code) => code;
    done();
    updateProductUid(req, resp, next);
  });
});
describe('deleteProduct', () => {
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
    deleteProductUid(req, {}, next);
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
    deleteProductUid(req, {}, next);
  });
  it('should delete a product', (done) => {
    const req = {
      params: {
        productId: '5e7260ccdd15b55308508754',
      },
    };
    const resp = {
      send: (response) => {
        expect(response.message).toBe('usuario eliminado exitosamente');
      },
    };
    const next = (code) => code;
    done();
    deleteProductUid(req, resp, next);
  });
});
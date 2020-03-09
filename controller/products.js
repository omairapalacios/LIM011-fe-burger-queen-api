const { ObjectID } = require('mongodb');
const collection = require('../connection/collectionProducts');
const { paginacion } = require('../utils/utils');

module.exports = {
  getProducts: (req, resp, next) => {
    const protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    const limit = parseInt(req.query.limit, 10) || 10;
    // console.log('limit: ', limit);
    const page = parseInt(req.query.page, 10) || 1;
    // console.log('paginas: ', page);
    // Calcular Saltos.
    return collection()
      .then((collectionProduct) => collectionProduct.count())
      .then((count) => {
        // console.log('count: ', count);
        // Calcular nùmero de paginas.
        const numbersPages = Math.ceil(count / limit);
        // console.log('numbersPages: ', numbersPages);
        // Calcular los saltos.
        const skip = (limit * page) - limit;
        // console.log('skip', skip);
        return collection()
          .then((collectionProduct) => collectionProduct.find().skip(skip).limit(limit).toArray())
          .then((product) => {
            // console.log('product...', product);
            // Paginacion.
            resp.set('link', paginacion(protocolo, page, limit, numbersPages));
            // console.log('SOLO resp: ', resp.link);
            // Los Productos.
            resp.send(product);
          });
      });
  },
  createProduct: (req, resp, next) => {
    // Datos que recibo del Navegador.
    if (!req.body.name && !req.body.price) {
      return next(400);
    }
    const newProduct = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.imagen,
      type: req.body.type,
      dateEntry: new Date(),
    };
    return collection()
      .then((collectionProduct) => collectionProduct.insertOne(newProduct))
      .then((product) => {
        resp.send({
          _id: product.ops[0]._id,
          name: product.ops[0].name,
          price: product.ops[0].price,
          image: product.ops[0].image,
          type: product.ops[0].type,
          dateEntry: product.ops[0].dateEntry,
        });
      });
  },
  getProductUid: (req, resp, next) => {
    let query;
    try {
      query = new ObjectID(req.params.productId);
    } catch (error) {
      return next(404);
    }
    return collection()
      .then((collectionProduct) => collectionProduct.findOne({ _id: query }))
      .then((product) => {
        if (!product) {
          return next(404);
        }
        // console.log(product);
        return resp.send({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          type: product.type,
          dateEntry: product.dateEntry,
        });
      });
  },
  updateProductUid: (req, resp, next) => {
    let query;
    try {
      query = new ObjectID(req.params.productId);
    } catch (error) {
      return next(404);
    }
    return collection()
      .then((collectionProduct) => collectionProduct.findOne({ _id: query }))
      .then((product) => {
        if (!product) {
          return next(404);
        }
        console.log('PUT: product id', req.body.name);
        if (typeof (req.body.name) !== 'string'
            && typeof (req.body.price) !== 'number'
            && typeof (req.body.image) !== 'string'
            && typeof (req.body.type) !== 'string') {
          return next(400);
        }
        return collection()
          .then((collectionProduct) => collectionProduct.updateOne({ _id: query }, {
            $set: {
              name: req.body.name || product.name,
              price: req.body.price || product.price,
              image: req.body.image || product.image,
              type: req.body.type || product.type,
            },
          }))
          .then(() => collection()
            .then((collectionProduct) => collectionProduct.findOne({ _id: query }))
            .then((product) => resp.send(product)));
      })
      .catch(() => next(404));
  },
  deleteProductUid: (req, resp, next) => {
    let query;
    try {
      query = new ObjectID(req.params.productId);
    } catch (error) {
      return next(404);
    }
    return collection()
      .then((collectionProduct) => collectionProduct.findOne({ _id: query }))
      .then((product) => {
        if (!product) {
          return next(404);
        }
        return collection()
          .then((collectionProduct) => collectionProduct.deleteOne({ _id: query }))
          .then(() => resp.send({ message: 'producto eliminado exitosamente' }));
      })
      .catch(() => next(404));
  },
};

const { ObjectId } = require('mongodb');
const { getProducts } = require('../utils/utils');
const collection = require('../connection/collection');

module.exports = {
  getOrderId: (req, resp, next) => {
    console.log('soy request params', req.params);
  },
  getOrders: (req, resp, next) => {
    console.log('soy request', req.query);
  },
  createOrder: (req, resp, next) => {
    // console.log('soy req.body', req.body);
    if (!req.body.userId || !(req.body.products).length) {
      return next(400);
    }
    const newOrder = {
      userId: req.body.userId,
      client: '',
      products: req.body.products.map((product) => ({
        productId: new ObjectId(product.productId),
        qty: product.qty,
      })),
      status: 'pending',
      dateEntry: new Date(),
    };
    return collection('orders')
      .then((collectionOrders) => collectionOrders.insertOne(newOrder))
      .then((order) => {
        // console.log('order.insertedId', order.insertedId);
        // products[ {productId, qty},{productId, qty}]); 
        const arrayIds = order.ops[0].products.map((elem) => elem.productId);
        getProducts(arrayIds, order.insertedId, resp, next);
      });
  },
};

const { ObjectId } = require('mongodb');
const { getProducts } = require('../utils/utils');
const collection = require('../connection/collection');

module.exports = {
  getOrders: (req, resp, next) => {
    console.log('soy request', req.query);
  },
  getOrderId: (req, resp, next) => {
    let query;
    try {
      query = new ObjectId(req.params.orderId);
    } catch (error) {
      return next(404);
    }
    return collection('orders')
      .then((collectionOrders) => collectionOrders.findOne({ _id: query }))
      .then((order) => {
        if (!order) {
          return next(404);
        }
        const arrayIds = order.products.map((elem) => elem.productId);
        getProducts(arrayIds, order._id, resp, next);
      });
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
      dateProcessed: new Date(),
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

  updateOrders: (req, resp, next) => {
    let query;
    const arrayStatus = ['pending', 'preparing', 'canceled', 'delivering', 'delivered'];
    try {
      query = new ObjectId(req.params.orderId);
    } catch (error) {
      return next(404);
    }
    if (arrayStatus.indexOf(req.body.status) === -1) {
      /* const demo = (arrayStatus.indexOf(req.body.status)) === -1;
      console.log('SOY DEMO...', demo); */
      return next(400);
    }
    return collection('orders')
      .then((collectionOrders) => collectionOrders.findOne({ _id: query }))
      .then((order) => {
        if (!order) {
          return next(404);
        }
        return collection('orders')
          .then((collectionOrders) => collectionOrders.updateOne({ _id: query }, {
            $set: {
              userId: req.body.userId || order.userId,
              client: req.body.client || order.client,
              product: req.body.product || order.products,
              status: req.body.status || order.status,
              dateEntry: req.body.dateEntry || order.dataEntry,
              dateProcessed: req.body.dateProcessed || new Date(),
            },
          })
            .then(() => collection('orders')
              .then((collectionOrders) => collectionOrders.findOne({ _id: query }))
              .then((order) => {
                if (!order) {
                  return next(404);
                }
                const arrayIds = order.products.map((elem) => elem.productId);
                getProducts(arrayIds, order._id, resp, next);
              })));
      });
  },
  deleteOrders: (req, resp, next) => {
    let query;
    try {
      query = new ObjectId(req.params.orderId);
    } catch (error) {
      return next(404);
    }
    return collection('orders')
      .then((collectionOrders) => collectionOrders.deleteOne({ _id: query }))
      .then((order) => {
        if (!order) {
          return next(404);
        }
        resp.send({ message: 'Orden eliminada con exito !' });
      });
  },
};

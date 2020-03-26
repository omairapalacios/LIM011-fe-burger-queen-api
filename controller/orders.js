const { ObjectId } = require('mongodb');
const { getProducts, getPagination } = require('../utils/utils');
const collection = require('../connection/collection');

module.exports = {
  getOrders: (req, resp, next) => {
    const url = `${req.protocol}://${req.get('host')}${req.path}`;
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    return collection('orders')
      .then((collectionOrders) => collectionOrders.countDocuments())
      .then((count) => {
        const numbersPages = Math.ceil(count / limit);
        const skip = (limit * page) - limit;
        return collection('orders')
          .then((collectionOrders) => collectionOrders.find().skip(skip).limit(limit).toArray())
          .then((orders) => {
            resp.set('link', getPagination(url, page, limit, numbersPages));
            const allOrders = orders.map((order) => {
              const arrayIds = order.products.map((elem) => elem.productId);
              return collection('products')
                .then((collectionProducts) => collectionProducts.find({ _id: { $in: arrayIds } })
                  .toArray()
                  .then((arrayProducts) => {
                    order.products = order.products.map((elemProduct) => ({
                      qty: elemProduct.qty,
                      product: arrayProducts.find((p) => p._id.equals(elemProduct.productId)),
                    }));
                    return order;
                  }));
            });
            Promise.all(allOrders)
              .then((values) => {
                resp.send(values);
              });
          });
      })
      .catch(() => next(500));
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
        return getProducts(arrayIds, order._id, resp, next);
      })
      .catch(() => next(500));
  },
  createOrder: (req, resp, next) => {
    // console.log('soy req.body', req.body);
    if (!req.body.userId || !(req.body.products).length) {
      return next(400);
    }
    const newOrder = {
      userId: req.body.userId,
      client: req.body.client || '',
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
        return getProducts(arrayIds, order.insertedId, resp, next);
      })
      .catch(() => next(500));
  },

  updateOrder: (req, resp, next) => {
    let query;
    try {
      query = new ObjectId(req.params.orderId);
    } catch (error) {
      return next(404);
    }
    const arrayStatus = ['pending', 'preparing', 'canceled', 'delivering', 'delivered'];
    if (arrayStatus.indexOf(req.body.status) === -1) {
      return next(400);
    }
    return collection('orders')
      .then((collectionOrders) => collectionOrders.findOne({ _id: query }))
      .then((order) => {
        if (!order) {
          return next(404);
        }
        collection('orders')
          .then((collectionOrders) => collectionOrders.updateOne({ _id: query }, {
            $set: {
              userId: req.body.userId || order.userId,
              client: req.body.client || order.client,
              product: req.body.product || order.products,
              status: req.body.status || order.status,
              dateEntry: req.body.dateEntry || order.dataEntry,
              dateProcessed: req.body.dateProcessed || new Date(),
            },
          }));
        const arrayIds = order.products.map((elem) => elem.productId);
        return getProducts(arrayIds, order._id, resp, next);
      })
      .catch(() => next(500));
  },
  deleteOrder: (req, resp, next) => {
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
        return collection('orders')
          .then((collectionOrders) => collectionOrders.deleteOne({ _id: query }))
          .then(() => resp.send({ message: 'orden eliminada exitosamente' }));
      })
      .catch(() => next(500));
  },
};

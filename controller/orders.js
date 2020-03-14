const { ObjectId } = require('mongodb');
const collection = require('../connection/collection');

module.exports = {
  createOrder: (req, resp, next) => {|
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
        const arrayIds = order.ops[0].products.map((elem) => elem.productId);
        return collection('products')
          .then((collectionProducts) => collectionProducts.find({ $in: arrayIds })
        // products[ {productId, qty},{productId, qty}]);
      });
  },
};



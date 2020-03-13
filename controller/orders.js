const { ObjectId } = require('mongodb');
const collection = require('../connection/collection');

module.exports = {
  createOrder: (req, resp, next) => {
    if (!req.body.userId || !(req.body.products).length) {
      return next(400);
    }
    const newOrder = {
      userId: req.body.userId,
      client: req.body.client,
      products: req.body.products.map((product) => ({
        productId: new ObjectId(product.productId),
        qty: product.qty,
      })),
      status: 'pending',
      dateEntry: new Date(),
    };
    return collection()
      .then((collectionOrders) => collectionOrders.insertOne(newOrder))
      .then((order) => collection()
        .then((collectionOrders) => collectionOrders.findOne(order.insertedId[0])
          .then(() => collection()
            .then((collectionOrders) => collectionOrders.aggregate([{
              $lookup:
                {
                  from: 'products',
                  localField: 'products.productId',
                  foreignField: '_id',
                  as: 'query-products',
                },
            }]).toArray((err, result) => {
              if (err) throw err;
              console.log(result);
            })))));
  },
};


/*   $lookup:
          {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'query-products',
          }, */
/* .toArray((err, result) => {
            if (err) throw err;
            return result.forEach((order) => {
              return order.products.forEach((product) => {
                console.log('soy product', product);
              });
            });
          })); */

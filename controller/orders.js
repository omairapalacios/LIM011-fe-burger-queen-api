const { ObjectID } = require('mongodb');
const collection = require('../connection/collectionOrders');
const collectionProd = require('../connection/collectionProducts');


module.exports = {
  createOrder: (req, resp, next) => {
    /* console.log(req.body.products); */
    // Datos que recibo del Navegador.
    if (!req.body.userId || !(req.body.products).length) {
      return next(400);
    }
    const newOrder = {
      userId: req.body.userId,
      client: req.body.client,
      products: req.body.products.map((product) => ({
        productId: new ObjectID(product.productId),
        qty: product.qty,
      })),
      status: 'pending',
      dateEntry: new Date(),
    };
    return collection()
      .then((collectionOrders) => collectionOrders.insertOne(newOrder))
      .then((order) => {
        console.log(order);
        resp.send(order.ops[0]);
        // return collectionProd()
        //   .then((collectionProducts) => {
        //     collectionProducts.find({ _id: order.products.productId })
        //       .then((products) => {
        //         console.log(products);
        //       });
        //   });
      });
  },
};

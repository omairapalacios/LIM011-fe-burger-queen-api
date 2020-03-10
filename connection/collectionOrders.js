const getDatabase = require('./connectDB');

const collectionProducts = () => getDatabase()
  .then((dataBase) => dataBase.collection('orders'));

module.exports = collectionProducts;

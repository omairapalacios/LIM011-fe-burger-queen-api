const getDatabase = require('./connectDB');

const collectionProducts = () => getDatabase()
  .then((dataBase) => dataBase.collection('products'));

module.exports = collectionProducts;

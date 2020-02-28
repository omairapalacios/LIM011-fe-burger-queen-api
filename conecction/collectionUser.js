const getDatabase = require('./connectDB');

const collectionUser = () => getDatabase()
  .then((dataBase) => dataBase.collection('user'));

module.exports = collectionUser;

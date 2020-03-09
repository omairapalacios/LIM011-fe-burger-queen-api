const getDatabase = require('./connectDB');

const collectionUser = () => getDatabase()
  .then((dataBase) => dataBase.collection('users'));

module.exports = collectionUser;

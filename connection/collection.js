const getDatabase = require('./connect_db');
// crear y obtener colecciones : users, products, orders
module.exports = (nameCollection) => getDatabase()
  .then((db) => db.collection(nameCollection));

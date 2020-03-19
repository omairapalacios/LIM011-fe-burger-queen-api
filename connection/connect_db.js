const { MongoClient } = require('mongodb');
const config = require('../config');

let database;
// conección a la mongodb de forma nativa
module.exports = () => {
  if (!database) {
    return MongoClient.connect(config.dbUrl, { useUnifiedTopology: true })
      .then((client) => {
        database = client.db('burger-queen'); // 'burger-queen'
        return database;
      });
  }
  return Promise.resolve(database);
};

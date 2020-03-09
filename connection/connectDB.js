const { MongoClient } = require('mongodb');
const config = require('../config');

let database;

const getDatabase = () => {
  if (!database) {
    return MongoClient.connect(config.dbUrl, { useUnifiedTopology: true })
      .then((dBase) => {
        database = dBase.db();
        return database;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return Promise.resolve(database);
};

module.exports = getDatabase;

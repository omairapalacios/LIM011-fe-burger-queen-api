const { MongoClient } = require('mongodb');

let database;

const getDatabase = (dbUrl) => {
  if (!database) {
    return MongoClient.connect(dbUrl, { useUnifiedTopology: true })
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

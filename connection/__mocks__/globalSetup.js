/* eslint-disable import/no-extraneous-dependencies */
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
/* Argumentos:
url ( cadena ): url de conexión para MongoDB. */

let database;
module.exports = () => {
  const mongod = new MongoMemoryServer();
  return mongod.getConnectionString().then((urlConnection) => {
    // process.env.DB_URL = url;
    if (!database) {
      return MongoClient.connect(urlConnection, { useUnifiedTopology: true })
        .then((client) => {
          database = client.db();
          return database;
        });
    }
    return database;
  });
};

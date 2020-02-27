const { MongoClient } = require('mongodb');
const config = require('../config');

let database;

// module.exports =
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

// module.exports = getDatabase;

getDatabase(config.dbUrl).then((r) => {
  console.log(r);
  const adminUser = {
    email: 'admin@laboratoria.com',
    password: 'abcd',
    roles: { admin: true },
  };
  r.collection('user').insertOne(adminUser, (err, result) => {
    if (err) throw err;
    console.log('Datos: ', result);
  });
});

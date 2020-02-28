const config = require('../config');
const getDatabase = require('./connectDB');

const collectionUser = (dbUrl) => getDatabase(dbUrl)
  .then((dataBase) => dataBase.collection('user'));

module.exports = collectionUser;

collectionUser(config.dbUrl);

/**
 * getDatabase(config.dbUrl).then((r) => {
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
 */

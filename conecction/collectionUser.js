const connectDB = require('./connectDB');
const config = require('../config');

// const collectionUser = () => connectDB.getDatabase(config.dbUrl).collection('users');

const collectionUser = () => {
  const db = connectDB(config.dbUrl);
  console.log('la bd es: ', db);
  const coleccion = db.collection('users');
  // console.log('Soy la coleccion: ', coleccion);
  // return coleccion;
};

module.exports = collectionUser;

collectionUser();

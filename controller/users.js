const collection = require('../conecction/collectionUser');
const config = require('../config');

module.exports = {
  getUsers: (req, resp, next) => {
  },

  createUser: (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email || !password) {
      return next(400);
    }
    // No utilizado
    collection()
      .then((collectionUser) => collectionUser.createIndex({ email: 1 }, { unique: true }))
      .then((index) => {
        console.log('indice creado', index);
        return collection(config.dbUrl);
      })
      .then((collectionUser) => collectionUser.insertOne({ email, password, roles }))
      .then((doc) => {
        console.log('Usuario creado exitosamente', doc);
        resp.status(200).json(doc);
      })
      .catch((err) => console.log(err));
  },
};

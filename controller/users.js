const collection = require('../conecction/collectionUser');
const config = require('../config');

module.exports = {
  getUsers: (req, resp, next) => {
  },
  createUser: (req) => {
    console.log(req);
    // const { email, password, roles } = req.body;
    collection(config.dbUrl)
      .then((collectionUser) => {
        collectionUser.insertOne(req.body)
          .then((resolve) => {
            console.log('Data Insertada:', resolve);
          });
      })
      .catch((err) => console.log(err));
  },
};

/* const createUser = (req) => {
  // const { email, password, roles } = req.body;
  collection(config.dbUrl)
    .then((collectionUser) => {
      console.log('aqui...', collectionUser);
      collectionUser.insertOne(req, (err, resolve) => {
        if (err) throw err;
        console.log('Data Insertada:', resolve);
      });
    });
};

const adminUser = {
  email: 'adminEmail@hola',
  password: 'dfgkkjhv',
  roles: { admin: true },
};

createUser(adminUser); */

const collection = require('../conecction/collectionUser');
const config = require('../config');

module.exports = {
  getUsers: (req, resp, next) => {
  },
  // getUsersAdmin: () => {},
  createUser: (req, resp) => {
    // console.log(req);
    const { email, password, roles = { admin: false } } = req.body;
    collection(config.dbUrl)
      .then((collectionUser) => {
      // console.log(collectionUser);
        collectionUser.createIndex({ email: 1 }, { unique: true })
          .then((e) => {
            console.log('eeeeeeee!!!', e);
            collection(config.dbUrl)
              .then((collectionUser) => {
                collectionUser.insertOne({ email, password, roles })
                  .then((resolve) => {
                    console.log('Data Insertada:', resolve);
                  });
              });
          });
      })
      .catch((err) => console.log(err));
  },

  createUser: (req) => {
    console.log(req);//  const { email, password } = req.bod;
    db.users().collection('users').insertOne(req, (error, resp) => {
      if (error) throw error;
      resp.send('usuario admin insertado');
      db.users().close();
    });
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

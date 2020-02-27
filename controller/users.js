const collection = require('../conecction/collectionUser');

module.exports = {
  /* getUsers: (req, resp, next) => {
  }, */
  createUser: (req, resp, next) => {
    const { email, password, roles } = req.body;
    collection.collectionUser().insertOne({ email, password, roles }, (err, result) => {
      if (err) throw err;
      resp.send(result);
    });
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

/**
 * createUser: (req) => {
    console.log(req);//  const { email, password } = req.bod;
    db.users().collection('users').insertOne(req, (error, resp) => {
      if (error) throw error;
      resp.send('usuario admin insertado');
      db.users().close();
    });
  },
 */

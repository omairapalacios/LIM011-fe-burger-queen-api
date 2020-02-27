const db = require('../db-data/users');

module.exports = {
  getUsers: (req, resp, next) => {
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

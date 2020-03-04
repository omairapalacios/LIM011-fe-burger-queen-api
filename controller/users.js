const { ObjectID } = require('mongodb');
const collection = require('../conecction/collectionUser');

module.exports = {
  getUsers: (req, resp, next) => {
  //   console.log('get user req', req);
  },

  createUser: (req, resp, next) => {
    // console.log('create user req', req);
    const { email, password, roles = { admin: false } } = req.body;
    if (!email || !password) {
      return next(400);
    } if (email.indexOf('@') === -1) {
      return next(400);
    } if (password.length <= 3) {
      return next(400);
    }

    return collection()
      .then((collectionUser) => collectionUser.findOne({ email }))
      .then((doc) => {
        if (doc === null) {
          return collection()
            .then((collectionUser) => collectionUser.createIndex({ email: 1 }, { unique: true }))
            .then(() => collection())
            .then((collectionUser) => collectionUser.insertOne({ email, password, roles }))
            .then((doc) => {
              // console.log('Usuario creado exitosamente', doc);
              resp.status(200).send({
                _id: doc.ops[0]._id,
                email: doc.ops[0].email,
                roles: doc.ops[0].roles,
              });
            });
        }
        next(403);
      })
      .catch(() => next(400));
  },

  deleteUser: (req, resp, next) => {
    const { uid } = req.params;
    return collection()
      .then((collectionUser) => collectionUser.findOne({ email: uid } || { _id: uid }))
      .then((doc) => {
        //  console.log(doc);
        if (doc !== null) {
          return collection()
            .then((collectionUser) => collectionUser.remove({ _id: doc._id }))
            .then((doc) => {
              console.log('Usuario eliminado exitosamente', doc);
              resp.status(200).send(doc);
            });
        }
        next(404);
      })
      .catch(() => next(404));
  },

};

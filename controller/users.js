const bcrypt = require('bcrypt');
const { getIdOrEmail, getPagination, validateEmail } = require('../utils/utils');
const collection = require('../connection/collection');

module.exports = {
  getUsers: (req, resp, next) => {
    // crear url
    const url = `${req.protocol}://${req.get('host')}${req.path}`;

    // límite de documentos
    const limit = parseInt(req.query.limit, 10) || 10;

    // número de páginas
    const page = parseInt(req.query.page, 10) || 1;

    // calcular saltos
    return collection('users')
      .then((collectionUser) => collectionUser.count())
      .then((count) => {
        const numberPages = Math.ceil(count / limit);
        const skip = (limit * page) - limit;

        return collection('users')
          .then((collectionUser) => collectionUser.find().skip(skip).limit(limit).toArray())
          .then((users) => {
            resp.set('link', getPagination(url, page, limit, numberPages));
            resp.send(users);
          });
      });
  },
  createUser: (req, resp, next) => {
    if (!req.body.email || !req.body.password) {
      return next(400);
    } if (!(validateEmail(req.body.email))) {
      return next(400);
    } if (req.body.password.length <= 3) {
      return next(400);
    }
    const { email, roles = { admin: false } } = req.body;
    let { password } = req.body;

    // encriptar password
    password = bcrypt.hashSync(password, 10);

    return collection('users')
      .then((collectionUser) => collectionUser.findOne({ email }))
      .then((user) => {
        if (user === null) {
          return collection('users')
            .then((collectionUser) => collectionUser.createIndex({ email: 1 }, { unique: true }))
            .then(() => collection('users'))
            .then((collectionUser) => collectionUser.insertOne({ email, password, roles }))
            .then((newUser) => {
              resp.status(200).send({
                _id: newUser.ops[0]._id,
                email: newUser.ops[0].email,
                roles: newUser.ops[0].roles,
              });
            });
        }
        return next(403);
      })
      .catch(() => next(400));
  },
  getUserUid: (req, resp, next) => {
    const uid = getIdOrEmail(req.params.uid);
    return collection('users')
      .then((collectionUser) => collectionUser.findOne(uid))
      .then((user) => {
        if (user !== null) {
          resp.status(200).send({
            _id: user._id,
            email: user.email,
            roles: user.roles,
          });
        }
        return next(404);
      })
      .catch(() => next(400));
  },
  updateUserUid: (req, resp, next) => {
    const uid = getIdOrEmail(req.params.uid);
    const { email, password, roles } = req.body;

    return collection('users')
      .then((collectionUser) => collectionUser.findOne(uid))
      .then((user) => {
        if (!user) {
          return next(404);
        }
        if (!req.headers.user.roles.admin && req.body.roles) {
          return next(403);
        }
        if (!req.body.email && !req.body.password) {
          return next(400);
        }

        return collection('users')
          .then((collectionUser) => collectionUser.updateOne(uid,
            {
              $set: {
                email: email || user.email,
                password: password ? bcrypt.hashSync(password, 10) : user.password,
                roles: roles || user.roles,
              },
            }))
          .then(() => collection('users')
            .then((collectionProduct) => collectionProduct.findOne(uid))
            .then((user) => resp.send(user)));
      });
  },

  deleteUser: (req, resp, next) => {
    const uid = getIdOrEmail(req.params.uid);
    return collection('users')
      .then((collectionUser) => collectionUser.findOne(uid))
      .then((user) => {
        if (!user) {
          return next(404);
        }
        return collection('users')
          .then((collectionUser) => collectionUser.deleteOne(uid))
          .then(() => {
            resp.status(200).send({ message: 'usuario eliminado exitosamente' });
          });
      })
      .catch(() => next(404));
  },
};

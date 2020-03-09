const bcrypt = require('bcrypt');
const { getIdOrEmail, paginacion } = require('../utils/utils');
const collection = require('../connection/collectionUsers');

module.exports = {
  getUsers: (req, resp, next) => {
    const protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    // Limite de documentos.
    const limit = parseInt(req.query.limit, 10) || 10;
    // Numero de paginas.
    const page = parseInt(req.query.page, 10) || 1;
    // Calcular saltos.
    return collection()
      .then((collectionUser) => collectionUser.count())
      .then((count) => {
      //  console.log('count...', count);
        const numbersPages = Math.ceil(count / limit);
        // console.log('numbersPages...', numbersPages);
        const skip = (limit * page) - limit;
        //  console.log('skip...', skip);
        // Compaginaciòn.

        return collection()
          .then((collectionUser) => collectionUser.find().skip(skip).limit(limit).toArray())
          .then((users) => {
            resp.set('link', paginacion(protocolo, page, limit, numbersPages));
            console.log('soy quee', resp.link);
            resp.send(users);
          });
      });
  },
  createUser: (req, resp, next) => { // NOTA: Consultar si tambien se crearàn user admin.
    if (!req.body.email || !req.body.password) {
      return next(400);
    } if (req.body.email.indexOf('@') === -1) {
      return next(400);
    } if (req.body.password.length <= 3) {
      return next(400);
    }
    const { email, roles = { admin: false } } = req.body;
    let { password } = req.body;
    password = bcrypt.hashSync(password, 10);

    return collection()
      .then((collectionUser) => collectionUser.findOne({ email }))
      .then((user) => {
        if (user === null) {
          return collection()
            .then((collectionUser) => collectionUser.createIndex({ email: 1 }, { unique: true }))
            .then(() => collection())
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
    const condition = getIdOrEmail(req.params.uid);

    return collection()
      .then((collectionUser) => collectionUser.findOne(condition))
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
    const condition = getIdOrEmail(req.params.uid);
    const { email, password, roles } = req.body;

    return collection()
      .then((collectionUser) => collectionUser.findOne(condition))
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

        return collection()
          .then((collectionUser) => collectionUser.updateOne(condition,
            {
              $set: {
                email: email || user.email,
                password: password ? bcrypt.hashSync(password, 10) : user.password,
                roles: roles || user.roles,
              },
            }))
          .then(() => collection()
            .then((collectionProduct) => collectionProduct.findOne(condition))
            .then((user) => resp.send(user)));
      });
  },

  deleteUser: (req, resp, next) => {
    const condition = getIdOrEmail(req.params.uid);
    return collection()
      .then((collectionUser) => collectionUser.findOne(condition))
      .then((user) => {
        if (!user) {
          return next(404);
        }
        return collection()
          .then((collectionUser) => collectionUser.deleteOne(condition))
          .then(() => {
            resp.status(200).send({ message: 'usuario eliminado exitosamente' });
          });
      })
      .catch(() => next(404));
  },
};

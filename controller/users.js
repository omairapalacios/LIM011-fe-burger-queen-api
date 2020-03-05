const { getIdOrEmail, passwordBcrypt } = require('../utils/utils');
const collection = require('../conecction/collectionUser');
const { isAdmin, isAuthenticated } = require('../middleware/auth');


/* console.log('Obtener Email o ID:', uidOrEmail('5e5e7cc847807540c6529f1b'));
console.log('Obtener Email o ID:', uidOrEmail('test@test.test')); */

module.exports = {
  getUsers: (req, resp, next) => {
    collection()
      .then((collectionUser) => {
        collectionUser.find().toArray((err, users) => {
          if (err) throw err;
          // console.log('RESULT...!!!', users);
          /* resp.send({
            _id: users.ops[0]._id,
            email: users.ops[0].email,
            roles: users.ops[0].roles,
          }); */
        });
      });
  },

  createUser: (req, resp, next) => { // NOTA: Consultar si tambien se crearàn user admin.
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
  getUserUid: (req, resp, next) => {
    // const UserEmail = req.params.uid;
    const condition = getIdOrEmail(req.params.uid);
    // console.log('req.params.uid', UserEmail);
    return collection()
      .then((collectionUser) => collectionUser.findOne(condition))
      .then((doc) => {
        if (doc !== null) {
          // console.log('Prueba...', doc);
          resp.status(200).send({
            _id: doc._id,
            email: doc.email,
            roles: doc.roles,
          });
        }
        next(404);
      });
  },
  updateUserUid: (req, resp, next) => {
    // User actual de la URL.
    // console.log('UpdateUserUid', req.params.uid);
    const condition = getIdOrEmail(req.params.uid);
    /* console.log('UpdateUserUid despues: ', condition);
    // Datos ingresados.
    console.log('req.body - Sin nada: ', req.body);
    const { email, password, roles } = req.body;
    console.log('req.body.email: ', email); // * Preguntar DUDA.
    console.log('req.body.password: ', password); // * Puede cambiar
    console.log('req.body.roles: ', roles); // * NO puede camiarse a Admin. */

    collection()
      .then((collectionUser) => collectionUser.findOne(condition))
      .then((doc) => {
        if (doc === null) next(404);
        if (!isAdmin(req) && req.body.roles) next(403);
        if (!req.body.email && !req.body.password) next(400);
        // Actualizar.
        collection()
          .then((collectionUser) => collectionUser.updateOne(condition, {
            $set: {
              email: req.body.email || doc.email,
              // password: passwordBcrypt(req.body.password),
              password: req.body.password || doc.password,
              // password: (!req.body.password) ? doc.password : passwordBcrypt(req.body.password),
              roles: req.body.roles || doc.roles,
            },
          }))
          .then((doc) => {
            // console.log('Datos Actualizados', doc);
            // resp.status(200).send({ message: 'Usuario actualizado exitosamente' });
            // Si jalamos doc, tiene que ser sin el password.
            resp.status(200).send({
              _id: doc.email,
              email: doc.email,
              roles: doc.roles, // No se si se pone .admin (Para ver si es o no admin).
            });
          });
      });
  },

  deleteUser: (req, resp, next) => {
    const condition = getIdOrEmail(req.params.uid);
    // console.log('Es condition: ', condition);
    /* if (!isAdmin(req) && !(req.headers.user._id.toString() === req.params.uid
      || req.headers.user.email === req.params.uid)) {
      next(403);
    } */
    collection()
      .then((collectionUser) => collectionUser.findOne(condition))
      .then((doc) => {
        if (doc === null) next(404);
        collection()
          .then((collectionUser) => collectionUser.deleteOne({ _id: doc._id }))
          .then(() => {
            resp.send({ message: 'Usuario eliminado exitosamente' });
          });
      });
  },
};

const { getIdOrEmail } = require('../utils/utils');
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
    // console.log('que trae body:', req.body.roles.admin);

    // Datos User actual del URL.
    const condition = getIdOrEmail(req.params.uid);
    // console.log('condition', condition);

    // Datos ingresado por consola.
    // const { email, password, roles = { admin: false } } = req.body;
    // const { email, password, roles } = req.body;

    // Datos seteados.
    // const newValues = { $set: { email, password, roles } };

    // Si no se proveen `email` o `password` o ninguno de los dos. (400)

    if (!isAdmin(req) && req.body.roles.admin === true) {
      next(403);
    }

    // una usuaria no admin intenta de modificar sus `roles` (403)
    /* if (!isAdmin(req) && req.body.roles.admin === true) {
      next(403);
    } */
    collection()
      .then((collectionUser) => collectionUser.findOne(condition))
      .then((user) => {
        console.log(condition);
        console.log('user.........', user);
        if (!req.body.email && !req.body.password) {
          console.log('400 ... ', req.body);
          next(400);
        }
        if (!user) {
          next(404);
        } else {
          return collection()
            .then((collectionUser) => collectionUser.updateOne(condition,
              {
                $set: {
                  email: req.body.email || user.email,
                  password: req.body.password || user.password,
                  roles: { admin: false },
                },
              }))
            .then((doc) => {
              // console.log('updateOne: ', doc);
              resp.status(200).json(doc);
            }).catch(() => next(404));
        }
        // next(404);
      });
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

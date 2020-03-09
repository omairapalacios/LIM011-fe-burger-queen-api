/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const collection = require('../connection/collectionUsers');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }
  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }
  jwt.verify(token, secret, (err, decodedToken) => {
    // console.log('decoded token', decodedToken : { uid, secret, exp ...});
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    return collection()
      .then((collectionUser) => collectionUser.findOne({ _id: ObjectID(decodedToken.uid) })
        .then((doc) => {
          // console.log('req.header user', req.headers.user);
          req.headers.user = doc;
          // console.log('req.header user despues de agregar doc', req.headers.user);
          return next();
        })
        .catch(() => next(404)));
  });
};

// Verifica si un usuario normal o admin esta autenticado. {Propiedad:Valor}. true/false
module.exports.isAuthenticated = (req) => (req.headers.user);

// Indica si usuario es Administrador o no. True/False.
module.exports.isAdmin = (req) => (req.headers.user.roles.admin);

module.exports.isUser = (req) => (
  req.headers.user._id.toString() === req.params.uid
  || req.headers.user.email === req.params.uid
);

module.exports.requireAdminOrUser = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : module.exports.isAdmin(req) || module.exports.isUser(req)
      ? next()
      : next(403)
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => {
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next();
};

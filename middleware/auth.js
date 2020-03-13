/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const collection = require('../connection/collection');

module.exports = (secret) => (req, resp, next) => {

  // obtiene cabecera de autenticación
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  // separa el tipo de autentificación : 'bearer' del token generado
  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  // decodifica token { uid, secret, exp ...}
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // verifica la identidad del usuario usando decodeToken.uid
    return collection('users')
      .then((collectionUser) => collectionUser.findOne({ _id: ObjectId(decodedToken.uid) })
        .then((user) => {
          // asignamos usuario autenticado a la cabecera
          req.headers.user = user;
          return next();
        })
        .catch(() => next(404)));
  });
};

module.exports.isAuthenticated = (req) => (req.headers.user);

module.exports.isAdmin = (req) => (req.headers.user.roles.admin);

module.exports.isUser = (req) => (
  req.headers.user._id.toString() === req.params.uid
  || req.headers.user.email === req.params.uid
);

// middlewares
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

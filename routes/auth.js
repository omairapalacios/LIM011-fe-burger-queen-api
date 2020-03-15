const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const collection = require('../connection/collection');

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */

  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    return collection('users')
      .then((collectionUser) => collectionUser.findOne({ email })
        .then((user) => {
          if (user === null) {
            return next(404);
          }
          // desencripta y compara password.
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const payload = {
              uid: user._id,
              iss: 'burger-queen-api',
              expiresIn: 60 * 60 * 24,
            };
            // genera token de autenticación
            const token = jwt.sign(payload, secret);
            resp.status(200).send({ token });
          }
        }));
  });
  return nextMain();
};

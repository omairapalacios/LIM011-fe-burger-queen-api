const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const collection = require('../conecction/collectionUser');

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
  // Valida el ingreso de email y password
  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    // Valida el ingreso de email y password de cada usuario y genera token
    return collection()
      .then((collectionUser) => collectionUser.findOne({ email })
        .then((doc) => {
          if (doc === null) {
            return next(400);
          }
          if (doc.email === email && bcrypt.compareSync(password, doc.password)) {
            const payload = {
              uid: doc._id,
              iss: 'burger-queen-api',
              expiresIn: 60 * 60 * 24,
            };
            const token = jwt.sign(payload, secret);
            // console.log('token: ', token);
            return resp.status(200).json({ token });
          }
        }));
  });
  return nextMain();
};

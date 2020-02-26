const jwt = require('jsonwebtoken');
const config = require('../config');

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
    if (email === config.adminEmail && password === config.adminPassword) {
      console.log(resp.status(200).json());
      // return resp.status(200).json({});
      const payload = {
        check: true,
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: 1440,
      });
      resp.json({
        mensaje: 'Autenticación correcta',
        token,
      });
    } else {
      resp.json({ mensaje: 'Usuario o contraseña incorrectos' });
    }
    // TODO: autenticar a la usuarix
    next();
  });

  return nextMain();
};

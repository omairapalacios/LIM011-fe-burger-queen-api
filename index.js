const express = require('express');
const config = require('./config');
const connectMongodb = require('./connection/connect_db');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, secret } = config;
const app = express();

connectMongodb()
  .then(() => {
    app.set('config', config);
    app.set('pkg', pkg);

    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(authMiddleware(secret));

    // registrar rutas

    routes(app, (err) => {
      if (err) throw err;
      app.use(errorHandler);
      app.listen(port, () => {
        console.info(`App listening on port ${port}`);
      });
    });
  })
  .catch((e) => console.log(e));

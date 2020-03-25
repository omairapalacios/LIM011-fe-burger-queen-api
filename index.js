const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const connectMongodb = require('./connection/connect_db');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, secret } = config;
const app = express();
/* BUENAS PRACTICAS EN PRODUCCIÓN


-Eliminar hardcoded keys (secrets o shh keys)
-Encapsular codigo espagguetti
-Revisar la estructura del proyecto
-Minificar codigo (build scripts)
-Agregar soporte de cache
-Agregar HTTPS y CORS (definir dominios /subdominios que pueden consumir el API)
-Revisar practicas de seguridad (helmet) OWASP (Lista las 10 vulnerabilidades mas criticas de app web)
 */
connectMongodb()
  .then(() => {
    app.set('config', config);
    app.set('pkg', pkg);
    app.use(cors());
    // habilita el intercambio de contenido para ese dominio: consumo del api
    /*   app.use(cors({
      origin: 'http://localhost:4200/',
    })); */
    // añade reglas de seguridad
    app.use(helmet());
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
  });

const express = require('express');
const { MongoClient } = require('mongodb');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, dbUrl, secret } = config;
const app = express();
app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) throw err;
  app.use(errorHandler);
  app.listen(port, () => {
    console.info(`App listening on port ${port}`);

    // Connect to the db native form
    MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      console.log('Connection sucessful');
      db.close();
    });
  });
});

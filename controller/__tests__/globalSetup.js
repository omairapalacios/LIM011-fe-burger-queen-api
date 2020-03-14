/* eslint-disable import/no-extraneous-dependencies */
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();
mongod.getConnectionString().then((mongoUrl) => {
  process.env.DB_URL = mongoUrl;
  console.info('Mongo memory server run ', mongoUrl);
});

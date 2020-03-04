const { ObjectID } = require('mongodb');

// Funcion que se encarga de obtener el Email o ID.
module.exports.getIdOrEmail = (reqParam) => {
  const objQuery = {};
  if (reqParam.indexOf('@') === -1) {
    // query = { _id: new ObjectID(reqParam) };
    objQuery._id = new ObjectID(reqParam);
  } else {
    // query = { email: reqParam };
    objQuery.email = reqParam;
  }
  return objQuery;
};

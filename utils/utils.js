const { ObjectID } = require('mongodb');
const { bcrypt } = require('bcrypt');

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

// Funcion para Encriptar Password.
module.exports.passwordBcrypt = (oldPassword) => {
  const newPassword = bcrypt.hashSync(oldPassword, 10);
  return newPassword;
};

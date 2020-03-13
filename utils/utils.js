const { ObjectID } = require('mongodb');
const { bcrypt } = require('bcrypt');

// Funcion que se encarga de obtener el Email o ID.
module.exports.getIdOrEmail = (reqParam) => {
  const objQuery = {};
  if (reqParam.indexOf('@') === -1) {
    objQuery._id = new ObjectID(reqParam);
  } else {
    objQuery.email = reqParam;
  }
  return objQuery;
};

module.exports.getPagination = (url, page, limit, numbersPages) => {
  const firstPage = `<${url}?limit=${limit}&page=${1}>; rel="first"`;
  // console.log('firstPage', firstPage);
  const prevPage = `<${url}?limit=${limit}&page=${page - 1}>; rel="prev"`;
  // console.log('prevPage', prevPage);
  const nextPage = `<${url}?limit=${limit}&page=${page + 1}>; rel="next"`;
  // console.log('nextPage', nextPage);
  const lastPage = `<${url}?limit=${limit}&page=${numbersPages}>; rel="last"`;
  // console.log('lastPage', lastPage);
  return `${firstPage}, ${prevPage}, ${nextPage}, ${lastPage}`;
};

// Funcion para Encriptar Password.
module.exports.passwordBcrypt = (oldPassword) => {
  const newPassword = bcrypt.hashSync(oldPassword, 10);
  return newPassword;
};

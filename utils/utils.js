const { ObjectId } = require('mongodb');
const { bcrypt } = require('bcrypt');

// función para obtener uid : email ó Id
module.exports.getIdOrEmail = (uid) => {
  const queryUid = {};
  if (uid.indexOf('@') === -1) {
    queryUid._id = new ObjectId(uid);
  } else {
    queryUid.email = uid;
  }
  return queryUid;
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

// función para encriptar password
module.exports.passwordBcrypt = (oldPassword) => {
  const newPassword = bcrypt.hashSync(oldPassword, 10);
  return newPassword;
};

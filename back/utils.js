const jwt = require('jsonwebtoken');

const decryptToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) reject(err);

      resolve(decoded);
    });
  });
}

module.exports = {
  decryptToken
};

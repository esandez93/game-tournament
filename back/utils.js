const jwt = require('jsonwebtoken');

const UserController = require('./db/controllers/user.ctrl');
const WorldController = require('./db/controllers/world.ctrl');

function decryptToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) reject(err);

      resolve(decoded);
    });
  });
}

function isAdmin (token, world) {
  return new Promise((resolve, reject) => {
    decryptToken(token)
      .then(({ id }) => {
        return Promise.all([
          UserController.findById(id),
          WorldController.findById(world, token, {})
        ]);
      })
      .then(([ user, world ]) => {
        resolve(world.admins.includes(user.id));
      })
      .catch(reject);
  });
}

module.exports = {
  decryptToken,
  isAdmin
};

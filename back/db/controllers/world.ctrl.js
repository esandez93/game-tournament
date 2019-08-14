const debug = require('debug')('world.ctrl');
const moment = require('moment');

const UserController = require('./user.ctrl');
const World = require('../models/World');
const Game = require('../models/Game');
const dbUtils = require('../utils');
const utils = require('../../utils');
const config = require('../../config');

const populate = [ 'users', 'admins', 'games', 'enabledGames' ];

function isAdmin(token, admins) {
  return new Promise((resolve, reject) => {
    utils.decryptToken(token)
      .then(({ id }) => {
        return UserController.findById(id);
      })
      .then(user => {
        resolve(admins.find(admin => admin.id === user.id) !== undefined);
      })
      .catch(reject);
  });
}

function find (options = {}, token) {
  return new Promise((resolve, reject) => {
    options.populate = populate;

    let worlds = [];

    dbUtils.prepareMongooseReq(World.model, 'find', options)
      .then(wrlds => {
        worlds = wrlds;

        return Promise.all(worlds.map(world => isAdmin(token, world.admins)));
      })
      .then((isAdmin) => {
        resolve(worlds.map((world, index) => {
          return {
            ...world.toJSON(),
            games: isAdmin[index] ? world.games : world.enabledGames,
            enabledGames: isAdmin[index] ? world.enabledGames : undefined
          };
        }));
      })
      .catch(reject);
  });
}

function findById (id, token, options = { populate }) {
  const _options = {
    id,
    ...options
  };

  return new Promise((resolve, reject) => {
    let world = null
    dbUtils.prepareMongooseReq(World.model, 'findById', _options)
      .then(wrld => {
        if (!token) {
          resolve(wrld);
        } else {
          world = wrld;
          return isAdmin(token, world.admins);
        }
      })
      .then(isAdmin => {
        if (isAdmin) {
          resolve(world.toJSON());
        } else {
          resolve({
            ...world.toJSON(),
            games: world.enabledGames,
            enabledGames: undefined
          });
        }
      })
      .catch(reject);
  });
}

function create (body) {
  // TODO: Check that every admin is also a user
  return new Promise((resolve, reject) => {
    body.creationDate = moment().utc();
    body.lastUpdate = body.creationDate;

    let world = null;

    Game.model.find()
      .then(games => {
        body.games = games.map(game => game.id);
        body.enabledGames = config.autoEnableGames ? [ ...body.games ] : [];

        world = World.populate(body);

        return world.save();
      })
      .then((newWorld) => findById(newWorld._id, token))
      .then((newWorld) => {
        world = newWorld;
        updateUsers(newWorld);
      })
      .then(() => resolve(world))
      .catch((error) => {
        // TODO: Create Mongoose Error handling (ValidationError)
        if (error && error.name === 'ValidationError') {
          // reject(new ValidationError(''));
        }

        debug.extend('error')(error);
        reject(error);
      });
  });
}

function update (id, body, token) {
  // TODO: Check that every admin is also a user
  return new Promise((resolve, reject) => {
    findById(id, token)
      .then(world => {
        body.lastUpdate = moment().utc();

        return world.updateOne(body);
      })
      .then(world => {
        return updateUsers(world);
      })
      .then(() => findById(id, token))
      .then(world => {
        resolve(world);
      })
      .catch(reject);
  });
}

// TODO: Delete all the Games and their Characters ? And the matches ?
function remove (id) {
  return new Promise((resolve, reject) => {
    findById(id)
      .then(world => {
        return world.deleteOne();
      })
      .then(() => {
        return UserController.findByWorld(id)
      })
      .then((users) => {
        let promises = [];

        users.forEach((user) => {
          let worlds = [];

          user.worlds.forEach((world) => {
            if (world.id !== id) {
              worlds.push(world.id);
            }
          });

          promises.push(UserController.update(user.id, { worlds }));
        });

        return Promise.all(promises);
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

function updateUsers (world) {
  return new Promise((resolve, reject) => {
    let users = [];
    let people = {};

    world.users.forEach((user) => {
      if (!people[user.id])
        people[user.id] = user;
    });
    world.admins.forEach((admin) => {
      if (!people[admin.id])
        people[admin.id] = admin;
    });

    Object.keys(people).forEach((userId) => {
      let worlds = [ ...people[userId].worlds ];
      if (!worlds.includes(world.id)) {
        worlds.push(world.id);
      }

      UserController.update(userId, { worlds })
        .then((user) => {
          users.push(user);
        })
        .catch(reject);
    });

    resolve(users);
  });
}

function getGames (id, token) {
  return new Promise((resolve, reject) => {
    findById(id, token, { populate: [ 'games', 'enabledGames' ] })
      .then(world => {
        games = {
          all: world.games,
          enabled: world.enabledGames
        };

        return utils.isAdmin(token, id);
      })
      .then(isAdmin => {
        if (isAdmin) {
          resolve(games);
        } else {
          resolve(games.enabled);
        }
      })
      .catch(reject);
  });
}

function enableGame (id, game, token) {
  return new Promise((resolve, reject) => {
    findById(id, token)
      .then(world => {

      })
      .catch(reject);
  });
}

function updateGames (id, reqGames, token) {
  return new Promise((resolve, reject) => {
    let games = [];

    if (array.isArray(reqGames)) {
      games = [ ...reqGames ];
    } else {
      games = [ reqGames ];
    }

    update(id, { games })
      .then(world => {
        return getGames(id, token)
      })
      .then((games) => {
        resolve(Array.isArray(games) ? games : games.all);
      })
      .catch(reject);
  });
}

module.exports = {
  find,
  findById,
  create,
  update,
  remove,

  updateUsers,

  getGames,
  updateGames
};

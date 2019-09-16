const debug = require('debug')('world.ctrl');
const moment = require('moment');

const UserController = require('./user.ctrl');
const World = require('../models/World');
const Game = require('../models/Game');
const dbUtils = require('../utils');
const utils = require('../../utils');
const config = require('../../config');

const populate = [ 'users', 'admins', 'games', 'enabledGames' ];

function find (options = {}, token) {
  return new Promise((resolve, reject) => {
    options.populate = populate;

    let worlds = [];

    dbUtils.prepareMongooseReq(World.model, 'find', options)
      .then(wrlds => {
        worlds = wrlds;

        return Promise.all(worlds.map(world => isAdmin(token, world.id)));
      })
      .then((admin) => {
        resolve(worlds.map((world, index) => {
          return {
            ...world.toJSON(),
            games: admin[index] ? world.games : world.enabledGames,
            enabledGames: admin[index] ? world.enabledGames : undefined
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
          return isAdmin(token, world.id);
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
      .then(() => findById(id, token))
      .then((world) => updateUsers(world))
      .then(() => findById(id, token))
      .then(resolve)
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

    world.users.forEach(user => {
      if (!people[user.id])
        people[user.id] = user;
    });
    world.admins.forEach(admin => {
      if (!people[admin.id])
        people[admin.id] = admin;
    });

    Object.keys(people).forEach(userId => {
      let worlds = [ ...people[userId].worlds ];
      let found = false;

      worlds.forEach(prevWorld => {
        if (prevWorld._id == world.id) {
          found = true;
        }
      });

      if (!found) {
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

        return isAdmin(token, id);
      })
      .then(admin => {
        if (admin) {
          resolve(games);
        } else {
          resolve(games.enabled);
        }
      })
      .catch(reject);
  });
}

function createGame (id, body) {
  return new Promise((resolve, reject) => {
    body.creationDate = moment().utc();
    body.lastUpdate = body.creationDate;

    let game = Game.populate({
      world: id,
      logos: {},
      ...body
    });

    game.save()
      .then(newGame => dbUtils.prepareMongooseReq(Game.model, 'findById', { id: newGame._id }))
      .then(newGame => {
        return Promise.all([
          updateGames(id, newGame),
          enableGame(id, newGame.id)
        ]);
      })
      .then(([ updated, world ]) => resolve(world))
      .catch(e => {
        //debug(e)
        reject(e);
      });
  });
}

function enableGame (id, gameId) {
  return new Promise((resolve, reject) => {
    findById(id, null, {})
      .then(world => {
        return update(id, {
          enabledGames: [ ...world.enabledGames, gameId ]
        }, null);
      })
      .then(resolve)
      .catch(reject);
  });
}

function disableGame (id, gameId) {
  return new Promise((resolve, reject) => {
    findById(id, null, {})
      .then(world => {
        return update(id, {
          enabledGames: world.enabledGames.filter(game => game != gameId)
        }, null);
      })
      .then(resolve)
      .catch(reject);
  });
}

function updateGames (id, reqGames, token) {
  return new Promise((resolve, reject) => {
    findById(id, token)
      .then(world => {
        let games = [ ...world.games ];

        if (Array.isArray(reqGames)) {
          games = [ ...games, ...reqGames ];
        } else {
          games = [ ...games, reqGames ];
        }

        return update(id, { games })
      })
      .then(() => getGames(id, token))
      .then((games) => {
        resolve(Array.isArray(games) ? games : games.all);
      })
      .catch(reject);
  });
}

function isAdmin (token, worldId) {
  return new Promise((resolve, reject) => {
    if (!token || !worldId) {
      debug('no token or world id');
      resolve(false);
    }

    utils.decryptToken(token)
      .then(({ id }) => {
        return Promise.all([
          UserController.findById(id),
          findById(worldId, null, {})
        ]);
      })
      .then(([ user, world ]) => {
        resolve(world.admins.includes(user.id));
      })
      .catch((e) => {
        reject(e)
      });
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
  createGame,
  updateGames,
  enableGame,
  disableGame,

  isAdmin
};

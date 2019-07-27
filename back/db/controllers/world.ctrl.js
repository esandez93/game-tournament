const debug = require('debug')('world.ctrl');
const moment = require('moment');

const UserController = require('./user.ctrl');
const World = require('../models/World');
const utils = require('../utils');

const populate = [ 'users', 'admins' ];

function find (options = {}) {
  options.populate = populate;

  return utils.prepareMongooseReq(World.model, 'find', options);
}

function findById (id) {
  const options = {
    id,
    populate
  };

  return utils.prepareMongooseReq(World.model, 'findById', options);
}

function create (body) {
  // TODO: Check that every admin is also a user
  return new Promise((resolve, reject) => {
    let world = World.populate(body);
    world.creationDate = moment.now().utc();
    world.lastUpdate = world.creationDate;
    world.save()
      .then(newWorld => {
        findById(newWorld._id)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

function update (id, body) {
  // TODO: Check that every admin is also a user
  return new Promise((resolve, reject) => {
    findById(id)
      .then(world => {
        body.lastUpdate = moment.now().utc();
        world.update(body)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
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
      if (!worlds.includes(world.id))
        worlds.push(world.id);

      debug('updating user', userId);
      UserController.update(userId, {})
        .then((user) => {
          users.push(user);
          debug('updated user');
          debug(user)
        })
        .catch(reject);
    });

    debug('end')
    resolve(users);
  });
}

function updateGames (id, reqGames) {
  return new Promise((resolve, reject) => {
    let games = [];

    if (array.isArray(reqGames)) {
      games = [ ...reqGames ];
    } else {
      games = [ reqGames ];
    }

    update(id, { games })
      .then(world => {
        resolve(world.games);
      })
      .catch(reject);
  });
}

module.exports = {
  find,
  findById,
  create,
  update,

  updateUsers,

  updateGames
};

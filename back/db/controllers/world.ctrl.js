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
    body.creationDate = moment().utc();
    body.lastUpdate = body.creationDate;

    let world = World.populate(body);

    world.save()
      .then((newWorld) => findById(newWorld._id))
      .then((newWorld) => {
        updateUsers(newWorld)
          .then(() => resolve(newWorld));
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
        // TODO: Create Mongoose Error handling (ValidationError)
        if (error && error.name === 'ValidationError') {
          // reject(new ValidationError(''));
        }

        debug.extend('error')(error);
        reject(error);
      });
  });
}

function update (id, body) {
  // TODO: Check that every admin is also a user
  return new Promise((resolve, reject) => {
    debug(id)
    debug(body)
    findById(id)
      .then(world => {
        body.lastUpdate = moment().utc();
        world.updateOne(body)
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

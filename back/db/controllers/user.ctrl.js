const debug = require('debug')('user.ctrl');
const moment = require('moment');

const User = require('../models/User');
const dbUtils = require('../utils');

const populate = [ 'worlds' ];

function find (options = {}) {
  options.populate = populate;

  return dbUtils.prepareMongooseReq(User.model, 'find', options);
}

function findById (id) {
  const options = {
    id,
    populate
  };

  return dbUtils.prepareMongooseReq(User.model, 'findById', options);
}

function create (body) {
  return new Promise((resolve, reject) => {
    let user = User.populate(body);
    user.creationDate = moment().utc();
    user.lastUpdate = user.creationDate;

    if (!user.worlds) {
      user.worlds = [];
    }

    user.save()
      .then(newUser => {
        findById(newUser._id)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

function update (id, body) {
  return new Promise((resolve, reject) => {
    findById(id)
      .then(user => {
        body.lastUpdate = moment().utc();
        user.updateOne(body)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

function findByWorld (world, options = {}) {
  return new Promise((resolve, reject) => {
    find({ ...options, worlds: world })
      .then(resolve)
      .catch(reject);
  });
}

module.exports = {
  find,
  findById,
  create,
  update,

  findByWorld
};

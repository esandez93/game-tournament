const moment = require('moment');

const Match = require('../models/Match');
const User = require('../models/User');
const utils = require('../utils');

const populatePlayer = (num) => ({
  path: `player${num}.user`,
  populate: { path: 'world' }
});

function find (options = {}) {
  options.populate = [ populatePlayer(1), populatePlayer(2) ];

  return utils.prepareMongooseReq(Match.model, 'find', options);
}

function findById (id, world, game) {
  return Match.model.find({ id, world, game })
    .populate(populatePlayer(1))
    .populate(populatePlayer(2));
}

function create (body) {
  return new Promise((resolve, reject) => {
    let match = Match.populate(body);
    match.creationDate = moment().utc();
    match.lastUpdate = match.creationDate;
    match.save()
      .then(newMatch => {
        findById(newMatch.id)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

module.exports = {
  find,
  findById,
  create
}
